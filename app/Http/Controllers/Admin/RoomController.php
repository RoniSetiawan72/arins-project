<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms with filters and statistics.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'all');
        $search = $request->query('search', '');

        $query = Room::query()
            ->with(['currentLease.user'])
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($sub) use ($search) {
                    $sub->where('room_number', 'ilike', "%{$search}%")
                        ->orWhere('room_number', 'like', "%{$search}%")
                        ->orWhere('room_type', 'ilike', "%{$search}%")
                        ->orWhere('room_type', 'like', "%{$search}%");
                });
            })
            ->orderBy('room_number', 'asc');

        $rooms = $query->get()->map(function (Room $room) {
            return [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'room_type' => $room->room_type,
                'price' => (float) $room->price,
                'status' => $room->status,
                'description' => $room->description,
                'facilities' => $room->facilities ?? [],
                'inventory_photos' => $room->inventory_photos ?? [],
                'current_tenant' => $room->currentLease ? [
                    'id' => $room->currentLease->user->id,
                    'name' => $room->currentLease->user->name,
                    'phone' => $room->currentLease->user->phone,
                    'start_date' => $room->currentLease->start_date->format('d M Y'),
                    'billing_cycle' => $room->currentLease->billing_cycle,
                    'lease_id' => $room->currentLease->id,
                ] : null,
            ];
        });

        $counts = [
            'all' => Room::count(),
            'available' => Room::where('status', 'available')->count(),
            'occupied' => Room::where('status', 'occupied')->count(),
            'maintenance' => Room::where('status', 'maintenance')->count(),
        ];

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms,
            'counts' => $counts,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created room.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50|unique:rooms,room_number',
            'room_type' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
            'description' => 'nullable|string|max:1000',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:100',
            'inventory_photos' => 'nullable|array',
        ]);

        Room::create($validated);

        return redirect()->route('admin.rooms.index')->with('success', "Kamar {$validated['room_number']} berhasil ditambahkan.");
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'room_number' => "required|string|max:50|unique:rooms,room_number,{$room->id}",
            'room_type' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
            'description' => 'nullable|string|max:1000',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:100',
            'inventory_photos' => 'nullable|array',
        ]);

        $room->update($validated);

        return redirect()->route('admin.rooms.index')->with('success', "Data Kamar {$room->room_number} berhasil diperbarui.");
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room): RedirectResponse
    {
        if ($room->status === 'occupied') {
            return redirect()->route('admin.rooms.index')->with('error', "Kamar {$room->room_number} tidak dapat dihapus karena sedang terisi oleh penyewa.");
        }

        $roomNumber = $room->room_number;
        $room->delete();

        return redirect()->route('admin.rooms.index')->with('success', "Kamar {$roomNumber} berhasil dihapus.");
    }
}
