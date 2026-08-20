<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'sector_id',
    ];

    /**
     * Relacionamento: Um serviço pertence a um setor
     */
    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    /**
     * Relacionamento: Acessar o local através do setor
     */
    public function location()
    {
        return $this->sector->location;
    }

    /**
     * Scope para buscar por setor
     */
    public function scopeBySector($query, $sectorId)
    {
        return $query->where('sector_id', $sectorId);
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
     * Get all photos for the service.
     */
    public function photos(): MorphMany
    {
        return $this->morphMany(Photo::class, 'imageable')->ordered();
    }

    /**
     * Get all phones for the service.
     */
    public function phones(): MorphMany
    {
        return $this->morphMany(Phone::class, 'phoneable')->ordered();
    }
}
