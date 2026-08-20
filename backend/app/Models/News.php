<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'url',
        'description',
        'published_at',
        'category',
        'order',
    ];

    protected $casts = [
        'published_at' => 'date',
    ];
}
