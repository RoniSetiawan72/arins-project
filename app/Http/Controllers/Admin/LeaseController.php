<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Lease;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    /**
     * Display a listing of leases.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'active');

        $leases = Lease::query()
            ->with(['user', 'room', 'invoices'])
            ->when($status !== 'all', function ($q) use ($status) {
                return $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (Lease $lease) {
                $unpaidInvoicesCount = $lease->invoices->where('status', 'pending')->count();
                $totalUnpaidAmount = $lease->invoices->where('status', 'pending')->sum('amount');

                return [
                    'id' => $lease->id,
                    'tenant' => [
                        'id' => $lease->user->id,
                        'name' => $lease->user->name,
                        'phone' => $lease->user->phone,
                        'email' => $lease->user->email,
                        'id_card_number' => $lease->user->id_card_number,
                        'emergency_contact_name' => $lease->user->emergency_contact_name,
                        'emergency_contact_phone' => $lease->user->emergency_contact_phone,
                    ],
                    'room' => [
                        'id' => $lease->room->id,
                        'room_number' => $lease->room->room_number,
                        'room_type' => $lease->room->room_type,
                        'price' => (float) $lease->room->price,
                    ],
                    'start_date' => $lease->start_date->format('Y-m-d'),
                    'start_date_formatted' => $lease->start_date->format('d M Y'),
                    'end_date' => $lease->end_date ? $lease->end_date->format('Y-m-d') : null,
                    'end_date_formatted' => $lease->end_date ? $lease->end_date->format('d M Y') : 'Fleksibel',
                    'billing_cycle' => $lease->billing_cycle,
                    'rent_amount' => (float) $lease->rent_amount,
                    'deposit_amount' => (float) $lease->deposit_amount,
                    'status' => $lease->status,
                    'notes' => $lease->notes,
                    'checkout_date' => $lease->checkout_date ? $lease->checkout_date->format('d M Y') : null,
                    'checkout_deductions' => $lease->checkout_deductions ?? [],
                    'refund_amount' => (float) $lease->refund_amount,
                    'unpaid_invoices_count' => $unpaidInvoicesCount,
                    'total_unpaid_amount' => (float) $totalUnpaidAmount,
                ];
            });

        $counts = [
            'all' => Lease::count(),
            'active' => Lease::where('status', 'active')->count(),
            'completed' => Lease::where('status', 'completed')->count(),
        ];

        return Inertia::render('Admin/Leases/Index', [
            'leases' => $leases,
            'counts' => $counts,
            'status' => $status,
        ]);
    }

    /**
     * Show the form for creating a new lease.
     */
    public function create(Request $request): Response
    {
        $preselectedRoomId = $request->query('room_id');

        $availableRooms = Room::where('status', 'available')
            ->orderBy('room_number', 'asc')
            ->get(['id', 'room_number', 'room_type', 'price', 'facilities']);

        $tenants = User::where('role', 'tenant')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'phone', 'email', 'id_card_number']);

        return Inertia::render('Admin/Leases/Create', [
            'availableRooms' => $availableRooms,
            'tenants' => $tenants,
            'preselectedRoomId' => $preselectedRoomId ? (int) $preselectedRoomId : null,
        ]);
    }

    /**
     * Store a newly created lease contract with transactional logic.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'is_new_tenant' => 'required|boolean',
            'user_id' => 'required_if:is_new_tenant,false|nullable|exists:users,id',
            // Data penyewa baru jika is_new_tenant = true
            'tenant_name' => 'required_if:is_new_tenant,true|nullable|string|max:255',
            'tenant_email' => 'required_if:is_new_tenant,true|nullable|email|unique:users,email',
            'tenant_phone' => 'required_if:is_new_tenant,true|nullable|string|max:20',
            'tenant_id_card' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            // Data kontrak sewa
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'billing_cycle' => 'required|in:monthly,yearly',
            'rent_amount' => 'required|numeric|min:0',
            'deposit_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'generate_initial_invoice' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated, &$lease) {
            // 1. Dapatkan atau Buat Penyewa
            if ($validated['is_new_tenant']) {
                $tenant = User::create([
                    'name' => $validated['tenant_name'],
                    'email' => $validated['tenant_email'],
                    'phone' => $validated['tenant_phone'],
                    'role' => 'tenant',
                    'id_card_number' => $validated['tenant_id_card'] ?? null,
                    'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                    'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                    'password' => Hash::make('password123'), // Default password awal
                ]);
                $userId = $tenant->id;
            } else {
                $userId = $validated['user_id'];
            }

            // 2. Ambil Kamar dan Pastikan Tersedia
            $room = Room::lockForUpdate()->findOrFail($validated['room_id']);
            if ($room->status !== 'available') {
                throw new \Exception("Kamar {$room->room_number} saat ini tidak tersedia.");
            }

            // 3. Buat Data Kontrak Sewa
            $lease = Lease::create([
                'user_id' => $userId,
                'room_id' => $room->id,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'] ?? null,
                'billing_cycle' => $validated['billing_cycle'],
                'rent_amount' => $validated['rent_amount'],
                'deposit_amount' => $validated['deposit_amount'],
                'status' => 'active',
                'notes' => $validated['notes'] ?? null,
            ]);

            // 4. Update Status Kamar Menjadi Occupied
            $room->update(['status' => 'occupied']);

            // 5. Buat Invoice Tagihan Pertama (Sewa Bulan Pertama)
            if ($validated['generate_initial_invoice'] ?? true) {
                $startDate = Carbon::parse($validated['start_date']);
                $endDate = $validated['billing_cycle'] === 'yearly'
                    ? $startDate->copy()->addYear()->subDay()
                    : $startDate->copy()->addMonth()->subDay();

                $invoiceNumber = 'INV-'.now()->format('Ymd').'-'.strtoupper(Str::random(4));

                Invoice::create([
                    'lease_id' => $lease->id,
                    'invoice_number' => $invoiceNumber,
                    'period_start' => $startDate->format('Y-m-d'),
                    'period_end' => $endDate->format('Y-m-d'),
                    'amount' => $validated['rent_amount'],
                    'due_date' => $startDate->format('Y-m-d'),
                    'status' => 'pending',
                ]);
            }
        });

        return redirect()->route('admin.leases.index')->with('success', 'Kontrak sewa baru berhasil dibuat & kamar telah ditempati.');
    }

    /**
     * Process tenant checkout settlement (Akhir Sewa & Refund Deposit).
     */
    public function checkout(Request $request, Lease $lease): RedirectResponse
    {
        $validated = $request->validate([
            'checkout_date' => 'required|date',
            'deductions' => 'nullable|array',
            'deductions.*.reason' => 'required|string|max:255',
            'deductions.*.amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::transaction(function () use ($validated, $lease) {
            $deductions = $validated['deductions'] ?? [];
            $totalDeductions = collect($deductions)->sum('amount');

            // Hitung sisa pengembalian deposit (tidak boleh negatif)
            $refundAmount = max(0, (float) $lease->deposit_amount - $totalDeductions);

            // 1. Update status kontrak sewa
            $lease->update([
                'status' => 'completed',
                'checkout_date' => $validated['checkout_date'],
                'checkout_deductions' => $deductions,
                'refund_amount' => $refundAmount,
                'notes' => $validated['notes'] ?? $lease->notes,
            ]);

            // 2. Kembalikan status kamar menjadi available
            $room = Room::lockForUpdate()->find($lease->room_id);
            if ($room) {
                $room->update(['status' => 'available']);
            }
        });

        return redirect()->route('admin.leases.index')->with(
            'success',
            "Checkout penyewa {$lease->user->name} berhasil. Sisa deposit yang dikembalikan: Rp ".number_format($lease->fresh()->refund_amount, 0, ',', '.')
        );
    }
}
