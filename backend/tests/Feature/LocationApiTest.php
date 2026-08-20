<?php

namespace Tests\Feature;

use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_locais(): void
    {
        Location::factory()->count(3)->create();

        $this->getJson('/api/locations')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    ['id', 'name', 'description', 'latitude', 'longitude', 'type', 'sectors', 'photos'],
                ],
            ]);
    }

    public function test_lista_locais_com_paginacao(): void
    {
        Location::factory()->count(3)->create();

        $this->getJson('/api/locations?paginate=true&per_page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('total', 3)
            ->assertJsonPath('per_page', 2);
    }

    public function test_filtra_locais_por_busca(): void
    {
        Location::factory()->create(['name' => 'Biblioteca Central']);
        Location::factory()->create(['name' => 'Ginásio Poliesportivo']);

        $this->getJson('/api/locations?search=Biblioteca')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Biblioteca Central');
    }

    public function test_filtra_locais_por_tipo(): void
    {
        Location::factory()->create(['type' => 'Prédio']);
        Location::factory()->create(['type' => 'Quadra esportiva']);

        $this->getJson('/api/locations?type=Quadra esportiva')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.type', 'Quadra esportiva');
    }

    public function test_exibe_um_local(): void
    {
        $location = Location::factory()->create(['name' => 'Bloco Pedagógico']);

        $this->getJson("/api/locations/{$location->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $location->id)
            ->assertJsonPath('data.name', 'Bloco Pedagógico');
    }

    public function test_local_inexistente_retorna_404(): void
    {
        $this->getJson('/api/locations/999')->assertNotFound();
    }

    public function test_cria_local(): void
    {
        $payload = [
            'name' => 'Laboratório de Informática',
            'description' => 'Laboratório com 30 computadores',
            'latitude' => -18.5501,
            'longitude' => -42.7601,
            'type' => 'Prédio',
            'opening_time' => '07:00',
            'closing_time' => '22:00',
        ];

        $this->postJson('/api/locations', $payload)
            ->assertCreated()
            ->assertJsonPath('data.name', 'Laboratório de Informática');

        $this->assertDatabaseHas('locations', [
            'name' => 'Laboratório de Informática',
            'type' => 'Prédio',
        ]);
    }

    public function test_criacao_valida_campos_obrigatorios(): void
    {
        $this->postJson('/api/locations', [])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Erro de validação')
            ->assertJsonStructure(['errors' => ['name']]);
    }

    public function test_criacao_rejeita_coordenadas_invalidas(): void
    {
        $this->postJson('/api/locations', [
            'name' => 'Local Inválido',
            'latitude' => 120,
            'longitude' => 200,
        ])
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['latitude', 'longitude']]);
    }

    public function test_atualiza_local(): void
    {
        $location = Location::factory()->create(['name' => 'Nome Antigo']);

        $this->putJson("/api/locations/{$location->id}", ['name' => 'Nome Novo'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Nome Novo');

        $this->assertDatabaseHas('locations', [
            'id' => $location->id,
            'name' => 'Nome Novo',
        ]);
    }

    public function test_remove_local(): void
    {
        $location = Location::factory()->create();

        $this->deleteJson("/api/locations/{$location->id}")->assertNoContent();

        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }

    public function test_lista_setores_de_um_local(): void
    {
        $location = Location::factory()->create();

        $this->getJson("/api/locations/{$location->id}/sectors")->assertOk();
    }
}
