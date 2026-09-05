<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Invoice;
use App\Models\Lease;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantDashboardController extends Controller
{
    /**
     * Display the Tenant mobile-friendly dashboard.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        // Cari kontrak sewa aktif
        $activeLease = Lease::where('user_id', $user->id)
            ->where('status', 'active')
            ->with(['room'])
            ->first();

        // Cari tagihan yang belum dibayar (pending)
        $activeInvoice = null;
        if ($activeLease) {
            $pendingInvoice = Invoice::where('lease_id', $activeLease->id)
                ->where('status', 'pending')
                ->orderBy('due_date', 'asc')
                ->first();

            if ($pendingInvoice) {
                $activeInvoice = [
                    'id' => $pendingInvoice->id,
                    'invoice_number' => $pendingInvoice->invoice_number,
                    'amount' => (float) $pendingInvoice->amount,
                    'due_date' => $pendingInvoice->due_date->format('d M Y'),
                    'payment_link' => $pendingInvoice->payment_link ?: 'https://checkout.xendit.co/web/mock_invoice_demo',
                    'status' => $pendingInvoice->status,
                ];
            }
        }

        // Dummy fallback jika penyewa belum punya tagihan aktif
        if (! $activeInvoice) {
            $activeInvoice = [
                'id' => 999,
                'invoice_number' => 'INV-'.now()->format('Ym').'-001',
                'amount' => $activeLease ? (float) $activeLease->rent_amount : 1500000,
                'due_date' => now()->addDays(5)->format('d M Y'),
                'payment_link' => 'https://checkout.xendit.co/web/mock_invoice_demo',
                'status' => 'pending',
            ];
        }

        // Riwayat komplain penyewa
        $complaints = Complaint::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function (Complaint $c) {
                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'description' => $c->description,
                    'priority' => $c->priority,
                    'status' => $c->status,
                    'created_at' => $c->created_at->format('d M Y, H:i'),
                ];
            });

        // Dummy fallback jika belum ada komplain
        if ($complaints->isEmpty()) {
            $complaints = collect([
                [
                    'id' => 1,
                    'title' => 'Lampu Kamar Mandi Kurang Terang',
                    'description' => 'Mohon diganti dengan watt yang lebih tinggi.',
                    'priority' => 'low',
                    'status' => 'resolved',
                    'created_at' => now()->subDays(2)->format('d M Y, H:i'),
                ],
            ]);
        }

        return Inertia::render('Tenant/Dashboard', [
            'tenant' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'room_number' => $activeLease ? $activeLease->room->room_number : '101',
                'room_type' => $activeLease ? $activeLease->room->room_type : 'Deluxe AC',
                'rent_amount' => $activeLease ? (float) $activeLease->rent_amount : 1500000,
                'deposit_amount' => $activeLease ? (float) $activeLease->deposit_amount : 500000,
                'start_date' => $activeLease ? $activeLease->start_date->format('d M Y') : now()->subMonths(1)->format('d M Y'),
                'facilities' => $activeLease && $activeLease->room->facilities ? $activeLease->room->facilities : ['AC', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater'],
            ],
            'activeInvoice' => $activeInvoice,
            'complaints' => $complaints,
        ]);
    }
}
