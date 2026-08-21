<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Symfony\Component\HttpFoundation\Response;

class RequireAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['success' => false, 'message' => 'Não autenticado.'], 401);
        }

        try {
            $payload = json_decode(Crypt::decryptString($token), true, 512, JSON_THROW_ON_ERROR);
        } catch (DecryptException|\JsonException) {
            return response()->json(['success' => false, 'message' => 'Token inválido.'], 401);
        }

        if (($payload['expires_at'] ?? 0) < now()->timestamp) {
            return response()->json(['success' => false, 'message' => 'Token expirado.'], 401);
        }

        $user = User::find($payload['user_id'] ?? null);

        if (! $user || ! $user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Não autorizado.'], 403);
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
