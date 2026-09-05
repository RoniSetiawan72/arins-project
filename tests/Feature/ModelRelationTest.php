<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ModelRelationTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_model_relations_and_casts(): void
    {
        $room = Room::create([
            'room_number' => '301',
            'room_type' => 'Deluxe',
            'price' => 1750000,
            'status' => 'available',
            'facilities' => ['AC', 'WiFi', 'Kamar Mandi Dalam'],
            'inventory_photos' => ['/images/room301.jpg'],
        ]);

        $this->assertIsArray($room->facilities);
        $this->assertContains('AC', $room->facilities);
        $this->assertIsArray($room->inventory_photos);
        $this->assertEquals('1750000.00', $room->price);
    }

    public function test_lease_relations_and_invoice_generation(): void
    {
        $user = User::factory()->create(['role' => 'tenant']);
        $room = Room::create([
            'room_number' => '302',
            'room_type' => 'Standard',
            'price' => 1200000,
            'status' => 'occupied',
        ]);

        $lease = Lease::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'start_date' => now()->format('Y-m-d'),
            'billing_cycle' => 'monthly',
            'rent_amount' => 1200000,
            'deposit_amount' => 300000,
            'status' => 'active',
            'checkout_deductions' => [['reason' => 'Kunci hilang', 'amount' => 50000]],
        ]);

        $this->assertInstanceOf(User::class, $lease->user);
        $this->assertInstanceOf(Room::class, $lease->room);
        $this->assertIsArray($lease->checkout_deductions);
        $this->assertEquals($room->id, $lease->room->id);

        $invoice = Invoice::create([
            'lease_id' => $lease->id,
            'invoice_number' => 'INV-TEST-001',
            'amount' => 1200000,
            'due_date' => now()->addDays(5)->format('Y-m-d'),
            'status' => 'pending',
        ]);

        $this->assertInstanceOf(Lease::class, $invoice->lease);
        $this->assertCount(1, $lease->invoices);

        $payment = Payment::create([
            'invoice_id' => $invoice->id,
            'transaction_ref' => 'XND-12345',
            'payment_channel' => 'QRIS',
            'paid_amount' => 1200000,
            'raw_callback' => ['status' => 'PAID', 'id' => 'xnd_123'],
            'paid_at' => now(),
        ]);

        $this->assertInstanceOf(Invoice::class, $payment->invoice);
        $this->assertInstanceOf(Payment::class, $invoice->payment);
        $this->assertIsArray($payment->raw_callback);
        $this->assertEquals('PAID', $payment->raw_callback['status']);
    }

    public function test_complaint_and_expense_models(): void
    {
        $user = User::factory()->create(['role' => 'tenant']);
        $room = Room::create([
            'room_number' => '303',
            'room_type' => 'Standard',
            'price' => 1000000,
        ]);

        $lease = Lease::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'start_date' => now()->format('Y-m-d'),
            'rent_amount' => 1000000,
        ]);

        $complaint = Complaint::create([
            'lease_id' => $lease->id,
            'user_id' => $user->id,
            'title' => 'Lampu Kamar Mati',
            'description' => 'Lampu kamar utama mati tadi siang.',
            'priority' => 'low',
            'status' => 'open',
        ]);

        $this->assertInstanceOf(Lease::class, $complaint->lease);
        $this->assertInstanceOf(User::class, $complaint->user);

        $expense = Expense::create([
            'category' => 'kebersihan',
            'amount' => 150000,
            'description' => 'Iuran Sampah & Kebersihan Lingkungan',
            'expense_date' => now()->format('Y-m-d'),
        ]);

        $this->assertEquals('150000.00', $expense->amount);
        $this->assertInstanceOf(Carbon::class, $expense->expense_date);
    }
}
