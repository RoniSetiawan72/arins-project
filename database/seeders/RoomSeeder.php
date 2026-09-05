<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => '101',
                'room_type' => 'Deluxe',
                'price' => 1500000,
                'status' => 'occupied',
                'description' => 'Kamar lantai 1 dengan AC, Kasur King Size, Kamar Mandi Dalam & Water Heater.',
                'facilities' => ['AC', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater', 'Kasur Springbed', 'Lemari 2 Pintu', 'Meja Belajar'],
                'inventory_photos' => ['/images/rooms/room-101-1.jpg', '/images/rooms/room-101-2.jpg'],
            ],
            [
                'room_number' => '102',
                'room_type' => 'Standard',
                'price' => 1000000,
                'status' => 'occupied',
                'description' => 'Kamar nyaman lantai 1 dengan Kipas Angin, Kasur Single, Meja Belajar.',
                'facilities' => ['WiFi 100Mbps', 'Kamar Mandi Luar', 'Kipas Angin', 'Kasur Single', 'Lemari Pakaian', 'Meja Belajar'],
                'inventory_photos' => ['/images/rooms/room-102-1.jpg'],
            ],
            [
                'room_number' => '201',
                'room_type' => 'VIP Suite',
                'price' => 2000000,
                'status' => 'available',
                'description' => 'Kamar luas lantai 2 dengan Balkon Pribadi, Smart TV, AC, Kulkas Mini & Kamar Mandi Dalam.',
                'facilities' => ['AC', 'Smart TV 43 inch', 'Kulkas Mini', 'Balkon Pribadi', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater'],
                'inventory_photos' => ['/images/rooms/room-201-1.jpg'],
            ],
            [
                'room_number' => '202',
                'room_type' => 'Standard',
                'price' => 1000000,
                'status' => 'available',
                'description' => 'Kamar lantai 2 dengan pencahayaan alami yang baik, kasur single, dan meja belajar.',
                'facilities' => ['WiFi 100Mbps', 'Kamar Mandi Luar', 'Kipas Angin', 'Kasur Single', 'Lemari Pakaian'],
                'inventory_photos' => [],
            ],
            [
                'room_number' => '203',
                'room_type' => 'Deluxe',
                'price' => 1500000,
                'status' => 'maintenance',
                'description' => 'Sedang dilakukan pengecatan ulang dinding dan perbaikan shower kamar mandi.',
                'facilities' => ['AC', 'WiFi 100Mbps', 'Kamar Mandi Dalam', 'Water Heater'],
                'inventory_photos' => [],
            ],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(
                ['room_number' => $room['room_number']],
                $room
            );
        }
    }
}
