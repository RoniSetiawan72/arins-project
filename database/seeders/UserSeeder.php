<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Akun Ibu Kos (Owner / Admin)
        User::firstOrCreate(
            ['email' => 'owner@simkos.test'],
            [
                'name' => 'Ibu Kos Hj. Maryam',
                'phone' => '081234567890',
                'role' => 'owner',
                'id_card_number' => '3273010101700001',
                'password' => Hash::make('password'),
            ]
        );

        // Akun Anak Kos (Tenant)
        User::firstOrCreate(
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

        // Akun Tambahan Anak Kos
        User::firstOrCreate(
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
    }
}
