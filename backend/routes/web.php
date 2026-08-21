<?php

use Illuminate\Support\Facades\Route;

// API-only backend - sem rotas web
Route::get('/', function () {
    return response()->json([
        'name' => 'IFMAP API',
        'version' => '1.0.0',
        'status' => 'online',
    ]);
});
