<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'transaction_ref',
        'payment_channel',
        'paid_amount',
        'raw_callback',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'raw_callback' => 'array',
            'paid_at' => 'datetime',
            'paid_amount' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
