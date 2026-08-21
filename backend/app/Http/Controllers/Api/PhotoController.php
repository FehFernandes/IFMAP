<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PhotoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Photo::with('imageable');

        // Filtro por tipo de entidade
        if ($request->has('imageable_type')) {
            $query->where('imageable_type', $request->imageable_type);
        }

        // Filtro por ID da entidade
        if ($request->has('imageable_id')) {
            $query->where('imageable_id', $request->imageable_id);
        }

        // Se pedir paginação, pagina. Senão retorna todos
        if ($request->has('paginate') && $request->paginate === 'true') {
            $perPage = $request->get('per_page', 15);
            $photos = $query->ordered()->paginate($perPage);

            return response()->json($photos);
        }

        // Retorna todos os registros sem paginação
        $photos = $query->ordered()->get();

        return response()->json([
            'data' => $photos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            'imageable_type' => 'required|string|in:App\Models\Location,App\Models\Sector,App\Models\Service',
            'imageable_id' => 'required|integer',
            'alt_text' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Verificar se a entidade existe
        $imageableClass = $request->imageable_type;
        if (! class_exists($imageableClass)) {
            return response()->json([
                'message' => 'Tipo de entidade inválido',
            ], 400);
        }

        $imageable = $imageableClass::find($request->imageable_id);
        if (! $imageable) {
            return response()->json([
                'message' => 'Entidade não encontrada',
            ], 404);
        }

        // Upload do arquivo
        $file = $request->file('file');
        $filename = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs('photos', $filename, 'public');

        // Criar registro no banco
        $photo = Photo::create([
            'path' => $path,
            'filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'imageable_type' => $request->imageable_type,
            'imageable_id' => $request->imageable_id,
            'alt_text' => $request->alt_text,
            'order' => $request->order ?? 0,
        ]);

        return response()->json([
            'message' => 'Foto enviada com sucesso',
            'data' => $photo->load('imageable'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Photo $photo): JsonResponse
    {
        return response()->json([
            'data' => $photo->load('imageable'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Photo $photo): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'alt_text' => 'nullable|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors(),
            ], 422);
        }

        $photo->update($request->only(['alt_text', 'order']));

        return response()->json([
            'message' => 'Foto atualizada com sucesso',
            'data' => $photo->load('imageable'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Photo $photo): JsonResponse
    {
        // Deletar arquivo físico
        if (Storage::disk('public')->exists($photo->path)) {
            Storage::disk('public')->delete($photo->path);
        }

        $photo->delete();

        return response()->json([
            'message' => 'Foto excluída com sucesso',
        ], 204);
    }
}
