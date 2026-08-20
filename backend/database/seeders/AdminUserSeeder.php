<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ifmap.edu.br'],
            [
                'name' => 'Administrador',
                'email' => 'admin@ifmap.edu.br',
                'password' => Hash::make('admin123'),
            ]
        );

        $this->command->info('Usuário admin criado: admin@ifmap.edu.br / admin123');
    }
}
