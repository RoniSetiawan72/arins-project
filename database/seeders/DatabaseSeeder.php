<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Owner / Ibu Kos
        $owner = User::firstOrCreate(
            ['email' => 'owner@simkos.test'],
            [
                'name' => 'Ibu Kos Hj. Maryam',
                'phone' => '081234567890',
                'role' => 'owner',
                'id_card_number' => '3273010101700001',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Create Tenants
        $tenant1 = User::firstOrCreate(
            ['email' => 'tenant@simkos.test'],
            [
                'name' => 'Ahmad Fauzi',
                'phone' => '089876543210',
                'role' => 'tenant',
                'id_card_number' => '3273012345670001',
                'emergency_contact_name' => 'Bapak Fauzi',
                'emergency_contact_phone' => '081112223334',
                'password' => Hash::make('password'),
            ]
        );

        $tenant2 = User::firstOrCreate(
            ['email' => 'budi@simkos.test'],
            [
                'name' => 'Budi Santoso',
                'phone' => '085678901234',
                'role' => 'tenant',
                'id_card_number' => '3273012345670002',
                'emergency_contact_name' => 'Ibu Santoso',
                'emergency_contact_phone' => '085556667778',
                'password' => Hash::make('password'),
            ]
        );

        // 3. Create Sample Rooms
        $room101 = Room::firstOrCreate(
            ['room_number' => '101'],
            [
                'room_type' => 'Deluxe',
                'price' => 1500000,
                'status' => 'occupied',
                'description' => 'Kamar lantai 1 dengan AC, Kasur King Size, Kamar Mandi Dalam & Water Heater.',
                'facilities' => ['AC', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater', 'Kasur Springbed', 'Lemari 2 Pintu', 'Meja Belajar'],
                'inventory_photos' => ['/images/rooms/room-101-1.jpg', '/images/rooms/room-101-2.jpg'],
            ]
        );

        $room102 = Room::firstOrCreate(
            ['room_number' => '102'],
            [
                'room_type' => 'Standard',
                'price' => 1000000,
                'status' => 'occupied',
                'description' => 'Kamar nyaman lantai 1 dengan Kipas Angin, Kasur Single, Meja Belajar.',
                'facilities' => ['WiFi 100Mbps', 'Kamar Mandi Luar', 'Kipas Angin', 'Kasur Single', 'Lemari Pakaian', 'Meja Belajar'],
                'inventory_photos' => ['/images/rooms/room-102-1.jpg'],
            ]
        );

        $room201 = Room::firstOrCreate(
            ['room_number' => '201'],
            [
                'room_type' => 'VIP Suite',
                'price' => 2000000,
                'status' => 'available',
                'description' => 'Kamar luas lantai 2 dengan Balkon Pribadi, Smart TV, AC, Kulkas Mini & Kamar Mandi Dalam.',
                'facilities' => ['AC', 'Smart TV 43 inch', 'Kulkas Mini', 'Balkon Pribadi', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater'],
                'inventory_photos' => ['/images/rooms/room-201-1.jpg'],
            ]
        );

        $room202 = Room::firstOrCreate(
            ['room_number' => '202'],
            [
                'room_type' => 'Standard',
                'price' => 1000000,
                'status' => 'maintenance',
                'description' => 'Sedang dilakukan pengecatan ulang dinding dan perbaikan shower.',
                'facilities' => ['WiFi 100Mbps', 'Kamar Mandi Luar', 'Kipas Angin'],
                'inventory_photos' => [],
            ]
        );

        // 4. Create Active Leases
        $lease1 = Lease::firstOrCreate(
            ['user_id' => $tenant1->id, 'room_id' => $room101->id, 'status' => 'active'],
            [
                'start_date' => now()->subMonths(2)->format('Y-m-d'),
                'end_date' => now()->addMonths(10)->format('Y-m-d'),
                'billing_cycle' => 'monthly',
                'rent_amount' => 1500000,
                'deposit_amount' => 500000,
                'notes' => 'Penyewa membayar deposit Rp 500.000 saat awal masuk.',
            ]
        );

        $lease2 = Lease::firstOrCreate(
            ['user_id' => $tenant2->id, 'room_id' => $room102->id, 'status' => 'active'],
            [
                'start_date' => now()->subMonth()->format('Y-m-d'),
                'end_date' => now()->addMonths(5)->format('Y-m-d'),
                'billing_cycle' => 'monthly',
                'rent_amount' => 1000000,
                'deposit_amount' => 300000,
                'notes' => 'Penyewa mahasiswa tingkat akhir.',
            ]
        );

        // 5. Create Sample Invoices & Payments
        $inv1 = Invoice::firstOrCreate(
            ['invoice_number' => 'INV-2026-0001'],
            [
                'lease_id' => $lease1->id,
                'period_start' => now()->startOfMonth()->format('Y-m-d'),
                'period_end' => now()->endOfMonth()->format('Y-m-d'),
                'amount' => 1500000,
                'due_date' => now()->addDays(5)->format('Y-m-d'),
                'payment_link' => 'https://checkout.xendit.co/web/mock_invoice_1',
                'status' => 'pending',
            ]
        );

        $inv2 = Invoice::firstOrCreate(
            ['invoice_number' => 'INV-2026-0002'],
            [
                'lease_id' => $lease2->id,
                'period_start' => now()->subMonth()->startOfMonth()->format('Y-m-d'),
                'period_end' => now()->subMonth()->endOfMonth()->format('Y-m-d'),
                'amount' => 1000000,
                'due_date' => now()->subMonth()->addDays(5)->format('Y-m-d'),
                'payment_link' => 'https://checkout.xendit.co/web/mock_invoice_2',
                'status' => 'paid',
            ]
        );

        Payment::firstOrCreate(
            ['invoice_id' => $inv2->id],
            [
                'transaction_ref' => 'TRX-XND-9847291',
                'payment_channel' => 'QRIS',
                'paid_amount' => 1000000,
                'raw_callback' => ['status' => 'PAID', 'payment_method' => 'QRIS', 'payer_email' => 'budi@simkos.test'],
                'paid_at' => now()->subMonth()->addDays(2),
            ]
        );

        // 6. Create Sample Complaints
        Complaint::firstOrCreate(
            ['title' => 'Kran Kamar Mandi Bocor Menetes Terus'],
            [
                'lease_id' => $lease1->id,
                'user_id' => $tenant1->id,
                'description' => 'Kran wastafel di kamar 101 tidak bisa ditutup rapat dan terus menetes airnya sejak kemarin malam.',
                'photo_url' => null,
                'priority' => 'medium',
                'status' => 'open',
                'admin_notes' => null,
            ]
        );

        // 7. Create Operational Expenses
        Expense::firstOrCreate(
            ['description' => 'Tagihan Listrik PLN Kos Bulan Ini'],
            [
                'category' => 'listrik',
                'amount' => 850000,
                'expense_date' => now()->subDays(3)->format('Y-m-d'),
                'receipt_photo' => null,
            ]
        );

        Expense::firstOrCreate(
            ['description' => 'Langganan WiFi Indihome 100 Mbps'],
            [
                'category' => 'internet',
                'amount' => 450000,
                'expense_date' => now()->subDays(5)->format('Y-m-d'),
                'receipt_photo' => null,
            ]
        );
    }
}
