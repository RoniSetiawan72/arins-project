<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'room_type',
        'price',
        'status', // available, occupied, maintenance
        'description',
        'facilities',
        'inventory_photos',
    ];

    protected function casts(): array
    {
        return [
            'facilities' => 'array',
            'inventory_photos' => 'array',
            'price' => 'decimal:2',
        ];
    }

    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }

    public function currentLease(): HasOne
    {
        return $this->hasOne(Lease::class)->where('status', 'active');
    }
}
