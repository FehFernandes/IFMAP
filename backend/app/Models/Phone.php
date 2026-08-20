<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Phone extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'contact_name',
        'contact_position',
        'contact_email',
        'number',
        'label',
        'order',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Scope para ordenar telefones.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Formatar número para exibição.
     */
    public function getFormattedNumberAttribute(): string
    {
        // Remove caracteres não numéricos
        $clean = preg_replace('/[^0-9]/', '', $this->number);

        // Formata conforme o tamanho
        if (strlen($clean) === 10) {
            // (XX) XXXX-XXXX
            return '('.substr($clean, 0, 2).') '.
                   substr($clean, 2, 4).'-'.
                   substr($clean, 6);
        } elseif (strlen($clean) === 11) {
            // (XX) XXXXX-XXXX
            return '('.substr($clean, 0, 2).') '.
                   substr($clean, 2, 5).'-'.
                   substr($clean, 7);
        }

        return $this->number;
    }
}
