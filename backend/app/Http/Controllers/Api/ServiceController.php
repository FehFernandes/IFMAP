<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Service::with(['sector.location']);

        // Filtro por sector_id
        if ($request->has('sector_id')) {
            $query->bySector($request->sector_id);
        }

        // Busca por nome ou descrição
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Se pedir paginação, pagina. Senão retorna todos
        if ($request->has('paginate') && $request->paginate === 'true') {
            $perPage = $request->get('per_page', 15);
            $services = $query->paginate($perPage);

            return response()->json($services);
        }

        // Retorna todos os registros sem paginação
        $services = $query->get();

        return response()->json([
            'data' => $services,
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
            'sector_id' => 'required|exists:sectors,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $service = Service::create($request->all());

        return response()->json([
            'message' => 'Serviço criado com sucesso',
            'data' => $service->load(['sector.location']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service): JsonResponse
    {
        return response()->json([
            'data' => $service->load(['sector.location']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sector_id' => 'sometimes|required|exists:sectors,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $service->update($request->all());

        return response()->json([
            'message' => 'Serviço atualizado com sucesso',
            'data' => $service->load(['sector.location']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json([
            'message' => 'Serviço excluído com sucesso',
        ], 204);
    }
}
