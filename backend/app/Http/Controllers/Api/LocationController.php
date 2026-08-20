<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Location::with(['sectors.services', 'photos']);

        // Busca por nome ou descrição
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filtro por tipo
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        // Se pedir paginação, pagina. Senão retorna todos
        if ($request->has('paginate') && $request->paginate === 'true') {
            $perPage = $request->get('per_page', 15);
            $locations = $query->paginate($perPage);

            return response()->json($locations);
        }

        // Retorna todos os registros sem paginação
        $locations = $query->get();

        return response()->json([
            'data' => $locations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'type' => 'nullable|string|max:255',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $location = Location::create($request->all());

        return response()->json([
            'message' => 'Local criado com sucesso',
            'data' => $location->load('sectors'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location): JsonResponse
    {
        return response()->json([
            'data' => $location->load('sectors.services'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'type' => 'nullable|string|max:255',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $location->update($request->all());

        return response()->json([
            'message' => 'Local atualizado com sucesso',
            'data' => $location->load('sectors.services'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location): JsonResponse
    {
        $location->delete();

        return response()->json([
            'message' => 'Local excluído com sucesso',
        ], 204);
    }
}
