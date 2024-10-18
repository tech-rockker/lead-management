<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadStatus extends Model
{
    protected $fillable = ['name'];
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
