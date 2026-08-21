<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Sector extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location_id',
        'floor',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    /**
     * Relacionamento: Um setor pertence a um local
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Relacionamento: Um setor tem vários serviços
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    /**
     * Scope para buscar por local
     */
    public function scopeByLocation($query, $locationId)
    {
        return $query->where('location_id', $locationId);
    }

    /**
     * Scope para buscar por nome
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%");
    }

    /**
     * Get all photos for the sector.
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Photo::class, 'imageable')->ordered();
    }

    /**
     * Get all phones for the sector.
     */
    public function phones(): MorphMany
    {
        return $this->morphMany(Phone::class, 'phoneable')->ordered();
    }
}
