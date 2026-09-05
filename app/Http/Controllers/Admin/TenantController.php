<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Display a listing of tenants.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');

        $tenants = User::where('role', 'tenant')
            ->with(['leases.room'])
            ->when($search, function ($q) use ($search) {
                return $q->where(function ($sub) use ($search) {
                    $sub->where('name', 'ilike', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderBy('name', 'asc')
            ->get()
            ->map(function (User $tenant) {
                $activeLease = $tenant->leases->firstWhere('status', 'active');

                return [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'email' => $tenant->email,
                    'phone' => $tenant->phone,
                    'id_card_number' => $tenant->id_card_number,
                    'emergency_contact_name' => $tenant->emergency_contact_name,
                    'emergency_contact_phone' => $tenant->emergency_contact_phone,
                    'active_room' => $activeLease ? [
                        'room_number' => $activeLease->room->room_number,
                        'room_type' => $activeLease->room->room_type,
                        'start_date' => $activeLease->start_date->format('d M Y'),
                        'lease_id' => $activeLease->id,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Tenants/Index', [
            'tenants' => $tenants,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Store a new tenant user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'id_card_number' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
        ]);

        User::create([
            ...$validated,
            'role' => 'tenant',
            'password' => Hash::make('password123'),
        ]);

        return redirect()->route('admin.tenants.index')->with('success', "Penyewa {$validated['name']} berhasil ditambahkan.");
    }
}
