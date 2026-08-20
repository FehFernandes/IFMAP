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
        // Popular dados
        $this->call([
            AdminUserSeeder::class,
            LocationsCompleteSeeder::class,
            SectorsAndServicesSeeder::class,
            PhotoAutoSeeder::class,
            PhoneSeeder::class,
        ]);
    }
}
