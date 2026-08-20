<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PhoneController;
use App\Http\Controllers\Api\PhotoController;
use App\Http\Controllers\Api\SectorController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Rotas de autenticação
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);

// Rotas da API para usuários
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::patch('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});

// Rotas da API para Locations, Sectors e Services
Route::apiResource('locations', LocationController::class);
Route::apiResource('sectors', SectorController::class);
Route::apiResource('services', ServiceController::class);

// Rotas da API para Photos (com upload)
Route::apiResource('photos', PhotoController::class);
Route::post('photos', [PhotoController::class, 'store']); // Upload de fotos

// Rotas da API para Phones (telefones)
Route::apiResource('phones', PhoneController::class);

// Rotas aninhadas opcionais (para filtrar setores por local e serviços por setor)
Route::get('locations/{location}/sectors', [SectorController::class, 'index']);
Route::get('sectors/{sector}/services', [ServiceController::class, 'index']);

// Rotas aninhadas para fotos
Route::get('locations/{location}/photos', [PhotoController::class, 'index']);
Route::get('sectors/{sector}/photos', [PhotoController::class, 'index']);
Route::get('services/{service}/photos', [PhotoController::class, 'index']);

// Rotas aninhadas para telefones
Route::get('locations/{location}/phones', [PhoneController::class, 'index']);
Route::get('sectors/{sector}/phones', [PhoneController::class, 'index']);
Route::get('services/{service}/phones', [PhoneController::class, 'index']);

// Rotas da API para News (notícias)
Route::apiResource('news', NewsController::class);
Route::post('news/scrape', [NewsController::class, 'scrapePortal']); // Web scraping do portal
