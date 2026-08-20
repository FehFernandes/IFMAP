<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle login request
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        // Gerar token simples (em produção, use Laravel Sanctum ou Passport)
        $token = base64_encode($user->id.'|'.time().'|'.$user->email);

        return response()->json([
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request): JsonResponse
    {
        // Em um cenário real, invalidaríamos o token aqui
        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        // Simular validação de token
        $authHeader = $request->header('Authorization');

        if (! $authHeader || ! str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Token não fornecido',
            ], 401);
        }

        $token = substr($authHeader, 7);

        try {
            $decoded = base64_decode($token);
            $parts = explode('|', $decoded);

            if (count($parts) !== 3) {
                throw new \Exception('Token inválido');
            }

            $userId = $parts[0];
            $user = User::find($userId);

            if (! $user) {
                throw new \Exception('Usuário não encontrado');
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido',
            ], 401);
        }
    }
}
