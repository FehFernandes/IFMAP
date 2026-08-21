<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sector;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Sector::with(['location', 'services']);

        // Filtro por location_id
        if ($request->has('location_id')) {
            $query->byLocation($request->location_id);
        }

        // Busca por nome ou descrição
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Se pedir paginação, pagina. Senão retorna todos
        if ($request->has('paginate') && $request->paginate === 'true') {
            $perPage = $request->get('per_page', 15);
            $sectors = $query->paginate($perPage);

            return response()->json($sectors);
        }

        // Retorna todos os registros sem paginação
        $sectors = $query->get();

        return response()->json([
            'data' => $sectors,
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
            'location_id' => 'required|exists:locations,id',
            'floor' => 'nullable|string|max:50',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $sector = Sector::create($request->all());

        return response()->json([
            'message' => 'Setor criado com sucesso',
            'data' => $sector->load(['location', 'services']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sector $sector): JsonResponse
    {
        return response()->json([
            'data' => $sector->load(['location', 'services']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sector $sector): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location_id' => 'sometimes|required|exists:locations,id',
            'floor' => 'nullable|string|max:50',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $sector->update($request->all());

        return response()->json([
            'message' => 'Setor atualizado com sucesso',
            'data' => $sector->load(['location', 'services']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sector $sector): JsonResponse
    {
        $sector->delete();

        return response()->json([
            'message' => 'Setor excluído com sucesso',
        ], 204);
    }
}
