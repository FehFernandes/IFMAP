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
        Schema::create('phones', function (Blueprint $table) {
            $table->id();
            $table->string('contact_name')->nullable();
            $table->string('contact_position')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('number');
            $table->string('label')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phones');
    }
};
