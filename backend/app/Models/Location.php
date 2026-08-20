<?php

namespace App\Models;

use Database\Factories\LocationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Location extends Model
{
    /** @use HasFactory<LocationFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'latitude',
        'longitude',
        'type',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
    ];

    /**
     * Relacionamento: Um local tem vários setores
     */
    public function sectors(): HasMany
    {
        return $this->hasMany(Sector::class);
    }

    /**
     * Scope para buscar por tipo
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
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
     * Get all photos for the location.
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Photo::class, 'imageable')->ordered();
    }

    /**
     * Get all phones for the location.
     */
    public function phones(): MorphMany
    {
        return $this->morphMany(Phone::class, 'phoneable')->ordered();
    }
}
