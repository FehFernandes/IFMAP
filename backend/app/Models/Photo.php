<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Photo extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'path',
        'filename',
        'mime_type',
        'size',
        'imageable_id',
        'imageable_type',
        'alt_text',
        'order',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'size' => 'integer',
        'order' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['url'];

    /**
     * Get the parent imageable model (Location, Sector, or Service).
     */
    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope para ordenar fotos.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL of the photo.
     */
    public function getUrlAttribute(): string
    {
        if (filter_var($this->path, FILTER_VALIDATE_URL)) {
            return $this->path;
        }

        return asset('storage/'.$this->path);
    }
}
