<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->string('floor')->nullable(); // 'Térreo', '1º Andar', etc
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('name');
            $table->index('location_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sectors');
    }
};
