<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PhoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Phone::query();

        // Se pedir paginação, pagina. Senão retorna todos
        if ($request->has('paginate') && $request->paginate === 'true') {
            $perPage = $request->get('per_page', 15);
            $phones = $query->ordered()->paginate($perPage);

            return response()->json($phones);
        }

        // Retorna todos os registros sem paginação
        $phones = $query->ordered()->get();

        return response()->json([
            'data' => $phones,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'number' => 'required|string|max:20',
            'type' => 'nullable|string|in:fixo,celular,whatsapp,fax,ramal',
            'label' => 'nullable|string|max:255',
            'is_whatsapp' => 'nullable|boolean',
            'is_primary' => 'nullable|boolean',
            'phoneable_type' => 'required|string|in:App\Models\Location,App\Models\Sector,App\Models\Service',
            'phoneable_id' => 'required|integer',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verificar se a entidade existe
        $phoneableClass = $request->phoneable_type;
        if (! class_exists($phoneableClass)) {
            return response()->json([
                'message' => 'Tipo de entidade inválido',
            ], 400);
        }

        $phoneable = $phoneableClass::find($request->phoneable_id);
        if (! $phoneable) {
            return response()->json([
                'message' => 'Entidade não encontrada',
            ], 404);
        }

        // Se marcar como principal, desmarcar outros
        if ($request->is_primary) {
            Phone::where('phoneable_type', $request->phoneable_type)
                ->where('phoneable_id', $request->phoneable_id)
                ->update(['is_primary' => false]);
        }

        $phone = Phone::create($request->all());

        return response()->json([
            'message' => 'Telefone criado com sucesso',
            'data' => $phone->load('phoneable'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Phone $phone): JsonResponse
    {
        return response()->json([
            'data' => $phone->load('phoneable'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Phone $phone): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'number' => 'sometimes|required|string|max:20',
            'type' => 'nullable|string|in:fixo,celular,whatsapp,fax,ramal',
            'label' => 'nullable|string|max:255',
            'is_whatsapp' => 'nullable|boolean',
            'is_primary' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Se marcar como principal, desmarcar outros da mesma entidade
        if ($request->has('is_primary') && $request->is_primary) {
            Phone::where('phoneable_type', $phone->phoneable_type)
                ->where('phoneable_id', $phone->phoneable_id)
                ->where('id', '!=', $phone->id)
                ->update(['is_primary' => false]);
        }

        $phone->update($request->all());

        return response()->json([
            'message' => 'Telefone atualizado com sucesso',
            'data' => $phone->load('phoneable'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Phone $phone): JsonResponse
    {
        $phone->delete();

        return response()->json([
            'message' => 'Telefone excluído com sucesso',
        ], 204);
    }
}
