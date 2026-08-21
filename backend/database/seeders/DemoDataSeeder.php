<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Sector;
use App\Models\Service;
use Illuminate\Database\Seeder;

/** Dados estritamente fictícios para demonstrar a aplicação após um clone. */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $location = Location::create([
            'name' => 'Local de demonstração',
            'description' => 'Registro fictício para desenvolvimento local.',
            'latitude' => -15.7801,
            'longitude' => -47.9292,
            'type' => 'demonstracao',
            'opening_time' => '08:00',
            'closing_time' => '18:00',
        ]);

        $sector = Sector::create([
            'location_id' => $location->id,
            'name' => 'Setor de demonstração',
            'description' => 'Conteúdo fictício.',
        ]);

        Service::create([
            'sector_id' => $sector->id,
            'name' => 'Serviço de demonstração',
            'description' => 'Conteúdo fictício.',
        ]);
    }
}
