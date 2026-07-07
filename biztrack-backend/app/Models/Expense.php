<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'category',
        'amount',
        'payment_mode',
        'expense_date',
        'notes'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
