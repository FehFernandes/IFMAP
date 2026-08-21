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
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->string('path'); // Caminho ou URL da imagem
            $table->string('filename')->nullable(); // Nome original do arquivo
            $table->string('mime_type')->nullable(); // Tipo MIME (image/jpeg, image/png, etc.)
            $table->unsignedInteger('size')->nullable(); // Tamanho em bytes
            $table->morphs('imageable'); // Cria imageable_id e imageable_type (com índice automático)
            $table->string('alt_text')->nullable(); // Texto alternativo para acessibilidade
            $table->unsignedInteger('order')->default(0); // Ordem de exibição
            $table->timestamps();

            // Índice adicional para ordenação
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};
