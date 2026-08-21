<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // A versão pública do projeto não inclui dados operacionais ou pessoais.
        // Crie usuários administrativos localmente, fora do controle de versão.
        $this->call([
            AdminUserSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
