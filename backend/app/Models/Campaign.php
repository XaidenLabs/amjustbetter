<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'organizer_id',
        'beneficiary_id',
        'title',
        'slug',
        'description',
        'goal_amount',
        'total_raised',
        'status',
        'audit_status',
        'image_path',
        'category',
    ];

    protected $casts = [
        'goal_amount' => 'decimal:2',
        'total_raised' => 'decimal:2',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function beneficiary()
    {
        return $this->belongsTo(User::class, 'beneficiary_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
