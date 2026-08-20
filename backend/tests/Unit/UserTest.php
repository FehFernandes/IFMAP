<?php

namespace Tests\Unit;

use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_is_admin_retorna_true_para_papel_admin(): void
    {
        $user = new User(['role' => 'admin']);

        $this->assertTrue($user->isAdmin());
    }

    public function test_is_admin_retorna_false_para_outros_papeis(): void
    {
        $user = new User(['role' => 'user']);

        $this->assertFalse($user->isAdmin());
    }

    public function test_senha_e_token_nao_sao_serializados(): void
    {
        $user = new User([
            'name' => 'Fulano',
            'email' => 'fulano@example.com',
            'password' => 'segredo',
        ]);

        $serialized = $user->toArray();

        $this->assertArrayNotHasKey('password', $serialized);
        $this->assertArrayNotHasKey('remember_token', $serialized);
    }
}
