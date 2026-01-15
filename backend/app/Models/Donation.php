<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Donation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'campaign_id',
        'donor_id',
        'admin_uploaded_by',
        'donor_email',
        'donor_name',
        'amount_gross',
        'amount_net',
        'platform_tip',
        'processor_fee',
        'payment_status',
        'stripe_payment_intent_id',
        'source_type',
        'is_anonymous',
        'frequency',
        'comment',
    ];

    protected $casts = [
        'amount_gross' => 'decimal:2',
        'amount_net' => 'decimal:2',
        'platform_tip' => 'decimal:2',
        'processor_fee' => 'decimal:2',
        'is_anonymous' => 'boolean',

    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function donor()
    {
        return $this->belongsTo(User::class, 'donor_id');
    }
}
