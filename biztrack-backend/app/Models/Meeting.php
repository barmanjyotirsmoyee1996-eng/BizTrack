<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'meeting_date',
        'meeting_time',
        'meeting_type',
        'status',
        'notes'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
