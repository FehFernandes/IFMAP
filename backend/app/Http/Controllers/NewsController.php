<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = News::query();

        // Ordenar por data de publicação (mais recente primeiro)
        $query->orderBy('published_at', 'desc')->orderBy('order', 'asc');

        // Verificar se deve paginar
        if ($request->query('paginate') === 'true') {
            $news = $query->paginate(15);
        } else {
            $news = $query->get();
        }

        return response()->json([
            'message' => 'Notícias recuperadas com sucesso',
            'data' => $news,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|unique:news,url',
            'description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'category' => 'required|in:noticia,destaque,manchete',
            'order' => 'nullable|integer',
        ]);

        $news = News::create($validated);

        return response()->json([
            'message' => 'Notícia criada com sucesso',
            'data' => $news,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $news = News::findOrFail($id);

        return response()->json([
            'message' => 'Notícia recuperada com sucesso',
            'data' => $news,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|unique:news,url,'.$id,
            'description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'category' => 'sometimes|required|in:noticia,destaque,manchete',
            'order' => 'nullable|integer',
        ]);

        $news->update($validated);

        return response()->json([
            'message' => 'Notícia atualizada com sucesso',
            'data' => $news,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $news = News::findOrFail($id);
        $news->delete();

        return response()->noContent();
    }

    /**
     * Scrape news from IFMG portal
     */
    public function scrapePortal()
    {
        try {
            $url = 'https://www.sje.ifmg.edu.br/portal/';
            $response = Http::timeout(30)->get($url);

            if (! $response->successful()) {
                return response()->json([
                    'message' => 'Erro ao acessar o portal',
                    'error' => 'HTTP '.$response->status(),
                ], 500);
            }

            $html = $response->body();
            $newsData = $this->parseHtml($html);

            $created = 0;
            $updated = 0;
            $errors = [];

            foreach ($newsData as $item) {
                try {
                    $existing = News::where('url', $item['url'])->first();

                    if ($existing) {
                        $existing->update($item);
                        $updated++;
                    } else {
                        News::create($item);
                        $created++;
                    }
                } catch (\Exception $e) {
                    $errors[] = [
                        'url' => $item['url'],
                        'error' => $e->getMessage(),
                    ];
                    Log::error('Erro ao salvar notícia: '.$e->getMessage(), $item);
                }
            }

            return response()->json([
                'message' => 'Scraping concluído com sucesso',
                'data' => [
                    'created' => $created,
                    'updated' => $updated,
                    'errors' => count($errors),
                    'total' => count($newsData),
                    'error_details' => $errors,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Erro no scraping: '.$e->getMessage());

            return response()->json([
                'message' => 'Erro ao fazer scraping',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Parse HTML to extract news data
     */
    private function parseHtml(string $html): array
    {
        $newsData = [];
        $baseUrl = 'https://www.sje.ifmg.edu.br';

        // Parse manchete principal
        if (preg_match('/<div class="manchete-principal">(.*?)<\/div>\s*<\/div>/s', $html, $mancheteMatch)) {
            $mancheteHtml = $mancheteMatch[1];

            // Extrair título e URL
            if (preg_match('/<h2[^>]*>.*?<a href="([^"]+)"[^>]*>(.*?)<\/a>/s', $mancheteHtml, $titleMatch)) {
                $url = $baseUrl.$titleMatch[1];
                $title = strip_tags($titleMatch[2]);

                // Extrair descrição
                $description = null;
                if (preg_match('/<p class="description">(.*?)<\/p>/s', $mancheteHtml, $descMatch)) {
                    $description = strip_tags($descMatch[1]);
                }

                $newsData[] = [
                    'title' => trim($title),
                    'url' => $url,
                    'description' => $description ? trim($description) : null,
                    'published_at' => now()->format('Y-m-d'),
                    'category' => 'manchete',
                    'order' => 0,
                ];
            }
        }

        // Parse notícias secundárias
        preg_match_all('/<div class="row-fluid">.*?<div class="content-container">.*?<h3[^>]*>.*?<a href="([^"]+)"[^>]*>(.*?)<\/a>/s', $html, $noticiasMatches, PREG_SET_ORDER);

        $order = 1;
        foreach ($noticiasMatches as $match) {
            $url = $baseUrl.$match[1];
            $title = strip_tags($match[2]);

            // Evitar duplicatas
            $isDuplicate = false;
            foreach ($newsData as $existingNews) {
                if ($existingNews['url'] === $url) {
                    $isDuplicate = true;
                    break;
                }
            }

            if (! $isDuplicate && strlen(trim($title)) > 10) {
                $newsData[] = [
                    'title' => trim($title),
                    'url' => $url,
                    'description' => null,
                    'published_at' => now()->format('Y-m-d'),
                    'category' => 'noticia',
                    'order' => $order++,
                ];
            }
        }

        // Parse destaques
        preg_match_all('/<div class="module span4[^"]*">.*?<a href="([^"]+)"[^>]*>.*?<h3[^>]*>.*?<a href="[^"]+">([^<]+)/s', $html, $destaquesMatches, PREG_SET_ORDER);

        $destaqueOrder = 1;
        foreach ($destaquesMatches as $match) {
            $url = $baseUrl.$match[1];
            $title = strip_tags($match[2]);

            // Evitar duplicatas
            $isDuplicate = false;
            foreach ($newsData as $existingNews) {
                if ($existingNews['url'] === $url) {
                    $isDuplicate = true;
                    break;
                }
            }

            if (! $isDuplicate && strlen(trim($title)) > 10) {
                $newsData[] = [
                    'title' => trim($title),
                    'url' => $url,
                    'description' => null,
                    'published_at' => now()->format('Y-m-d'),
                    'category' => 'destaque',
                    'order' => $destaqueOrder++,
                ];
            }
        }

        return $newsData;
    }
}
