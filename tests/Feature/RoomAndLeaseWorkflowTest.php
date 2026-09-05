<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Lease;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomAndLeaseWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_create_update_and_delete_rooms(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        // 1. Create Room
        $response = $this->actingAs($owner)->post('/admin/rooms', [
            'room_number' => '401',
            'room_type' => 'Deluxe',
            'price' => 1600000,
            'status' => 'available',
            'facilities' => ['AC', 'WiFi', 'Kamar Mandi Dalam'],
            'description' => 'Kamar lantai 4 pemandangan kota.',
        ]);

        $response->assertRedirect(route('admin.rooms.index'));
        $this->assertDatabaseHas('rooms', ['room_number' => '401', 'status' => 'available']);

        $room = Room::where('room_number', '401')->first();

        // 2. Update Room
        $response = $this->actingAs($owner)->put("/admin/rooms/{$room->id}", [
            'room_number' => '401',
            'room_type' => 'VIP Suite',
            'price' => 1800000,
            'status' => 'available',
            'facilities' => ['AC', 'WiFi', 'Smart TV'],
        ]);

        $response->assertRedirect(route('admin.rooms.index'));
        $this->assertDatabaseHas('rooms', ['room_number' => '401', 'room_type' => 'VIP Suite', 'price' => 1800000]);

        // 3. Delete Room
        $response = $this->actingAs($owner)->delete("/admin/rooms/{$room->id}");
        $response->assertRedirect(route('admin.rooms.index'));
        $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
    }

    public function test_owner_cannot_delete_occupied_room(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $tenant = User::factory()->create(['role' => 'tenant']);
        $room = Room::create([
            'room_number' => '402',
            'room_type' => 'Standard',
            'price' => 1000000,
            'status' => 'occupied',
        ]);

        $response = $this->actingAs($owner)->delete("/admin/rooms/{$room->id}");
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('rooms', ['id' => $room->id]);
    }

    public function test_owner_can_create_lease_and_room_becomes_occupied(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $room = Room::create([
            'room_number' => '403',
            'room_type' => 'Standard',
            'price' => 1200000,
            'status' => 'available',
        ]);

        $response = $this->actingAs($owner)->post('/admin/leases', [
            'room_id' => $room->id,
            'is_new_tenant' => true,
            'tenant_name' => 'Randi Pratama',
            'tenant_email' => 'randi@example.com',
            'tenant_phone' => '081234567899',
            'tenant_id_card' => '3273019999990001',
            'start_date' => now()->format('Y-m-d'),
            'billing_cycle' => 'monthly',
            'rent_amount' => 1200000,
            'deposit_amount' => 500000,
            'generate_initial_invoice' => true,
        ]);

        $response->assertRedirect(route('admin.leases.index'));

        // Pastikan user baru dibuat
        $this->assertDatabaseHas('users', ['email' => 'randi@example.com', 'role' => 'tenant']);
        $tenant = User::where('email', 'randi@example.com')->first();

        // Pastikan lease terbuat dan kamar menjadi occupied
        $this->assertDatabaseHas('leases', [
            'user_id' => $tenant->id,
            'room_id' => $room->id,
            'status' => 'active',
            'rent_amount' => 1200000,
            'deposit_amount' => 500000,
        ]);

        $this->assertEquals('occupied', $room->fresh()->status);

        // Pastikan invoice pertama dibuat otomatis
        $lease = Lease::where('user_id', $tenant->id)->first();
        $this->assertDatabaseHas('invoices', [
            'lease_id' => $lease->id,
            'amount' => 1200000,
            'status' => 'pending',
        ]);
    }

    public function test_tenant_checkout_workflow_calculates_deposit_and_frees_room(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $tenant = User::factory()->create(['role' => 'tenant']);
        $room = Room::create([
            'room_number' => '404',
            'room_type' => 'Deluxe',
            'price' => 1500000,
            'status' => 'occupied',
        ]);

        $lease = Lease::create([
            'user_id' => $tenant->id,
            'room_id' => $room->id,
            'start_date' => now()->subMonths(6)->format('Y-m-d'),
            'billing_cycle' => 'monthly',
            'rent_amount' => 1500000,
            'deposit_amount' => 500000,
            'status' => 'active',
        ]);

        // Proses Checkout dengan potongan denda/kerusakan
        $response = $this->actingAs($owner)->post("/admin/leases/{$lease->id}/checkout", [
            'checkout_date' => now()->format('Y-m-d'),
            'deductions' => [
                ['reason' => 'Kunci kamar hilang', 'amount' => 50000],
                ['reason' => 'Kebersihan kamar', 'amount' => 100000],
            ],
            'notes' => 'Kunci duplikat dikembalikan.',
        ]);

        $response->assertRedirect(route('admin.leases.index'));

        $lease->refresh();
        $this->assertEquals('completed', $lease->status);
        $this->assertEquals(now()->format('Y-m-d'), $lease->checkout_date->format('Y-m-d'));
        $this->assertEquals('350000.00', $lease->refund_amount); // 500.000 - 150.000 = 350.000
        $this->assertCount(2, $lease->checkout_deductions);

        // Pastikan status kamar kembali menjadi available
        $this->assertEquals('available', $room->fresh()->status);
    }
}
