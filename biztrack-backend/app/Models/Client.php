<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company',
        'phone',
        'email',
        'address'
    ];

    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
