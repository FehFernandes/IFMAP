<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    protected $model = Location::class;

    /**
     * Define o estado padrão do modelo.
     *
     * As coordenadas ficam próximas ao campus do IFMG.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Prédio '.fake()->unique()->numerify('###'),
            'description' => fake()->sentence(),
            'latitude' => fake()->latitude(-18.56, -18.54),
            'longitude' => fake()->longitude(-42.77, -42.75),
            'type' => fake()->randomElement(['Prédio', 'Área Agrícola', 'Quadra esportiva']),
            'opening_time' => '07:00',
            'closing_time' => '22:00',
        ];
    }
}
