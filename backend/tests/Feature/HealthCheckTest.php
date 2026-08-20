<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_endpoint_de_health_check_responde_com_sucesso(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_rota_inexistente_retorna_404(): void
    {
        $this->getJson('/api/rota-que-nao-existe')->assertNotFound();
    }
}
