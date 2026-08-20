<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_com_credenciais_validas_retorna_token(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'name', 'email', 'role'],
                'token',
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_login_com_senha_incorreta_retorna_422(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'senha-errada',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_login_exige_email_e_senha(): void
    {
        $this->postJson('/api/login', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_me_sem_token_retorna_401(): void
    {
        $this->getJson('/api/me')
            ->assertStatus(401)
            ->assertJsonPath('success', false);
    }

    public function test_me_com_token_invalido_retorna_401(): void
    {
        $this->getJson('/api/me', ['Authorization' => 'Bearer token-invalido'])
            ->assertStatus(401)
            ->assertJsonPath('success', false);
    }

    public function test_me_com_token_valido_retorna_usuario(): void
    {
        $user = User::factory()->create();

        $token = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->json('token');

        $this->getJson('/api/me', ['Authorization' => "Bearer {$token}"])
            ->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_logout_responde_com_sucesso(): void
    {
        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}
