<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Photo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PhotoAutoSeeder extends Seeder
{
    /**
     * Mapeia automaticamente as fotos existentes em storage/app/public/photos
     * para as localizações correspondentes baseado no nome do arquivo.
     */
    public function run(): void
    {
        $photosPath = storage_path('app/public/photos');

        if (! File::exists($photosPath)) {
            $this->command->error("Pasta de fotos não encontrada: $photosPath");

            return;
        }

        // Limpa fotos antigas para evitar duplicatas
        $this->command->info('Limpando fotos antigas...');
        Photo::where('imageable_type', 'App\Models\Location')->delete();

        // Mapeamento: nome do arquivo (sem extensão, normalizado) => nome da localização
        $photoMapping = [
            'predioi' => 'Prédio I',
            'predioii' => 'Prédio II',
            'predioiii' => 'Prédio III',
            'predioiv' => 'Prédio IV',
            'casadehospedes' => 'Casa de Hóspedes',
            'museudezoologia' => 'Museu de Zoologia',
            'prediosilviculturai' => 'Prédio Silvicultura I',
            'prediosilviculturaii' => 'Prédio Silvicultura II',
            'teatro' => 'Teatro',
            'almoxarifado' => 'Almoxarifado',
            'predioadministracao' => 'Prédio Administração',
            'aviario' => 'Aviario',
            'aviarioi' => 'Aviario',
            'aviarioii' => 'Aviario',
            'capril' => 'Capril',
            'estabulo' => 'Estábulo',
            'horta' => 'Horta',
            'herbario' => 'Herbário',
            'pocilga' => 'Pocilga',
            'guarita' => 'Guarita',
            'refeitorio' => 'Refeitório',
            'transporte' => 'Transporte',
            'oficina' => 'Oficina',
            'alojamentomasculino' => 'Alojamento Masculino',
            'agroindustria' => 'Agroindústria',
            'lanchonetei' => 'Lanchonete I',
            'lanchoneteii' => 'Lanchonete II',
            'ambulatorio' => 'Ambulatório',
            'biblioteca' => 'Biblioteca',
            'viveirodemudas' => 'Viveiro de Mudas',
            'ginasiopoliesportivo' => 'Ginásio Poliesportivo',
            'topografia' => 'Topografia',
            'lojadeconveniencias' => 'Loja de Conveniências',
            'alojamentofeminino' => 'Alojamento Feminino',
            'quadradefutsal' => 'Quadra de Futsal',
            'quadradebasquete' => 'Quadra de Basquete',
            'campodefutebol' => 'Campo de Futebol',
            'esporteelazer' => 'Esporte e Lazer',
            'fabricaderacao' => 'Fábrica de Ração',
            'prediodaonebit' => 'Prédio da One-Bit',
            'prediodaonebitempresajunior' => 'Prédio da One-Bit',
            'prediodaone-bit' => 'Prédio da One-Bit',
            'centrodevivencia' => 'Centro de Vivência',
            'camposociety' => 'Campo Society',
        ];

        $files = File::files($photosPath);
        $matched = 0;
        $notMatched = [];

        $this->command->info('Processando '.count($files)." arquivos de imagem...\n");

        foreach ($files as $file) {
            $filename = $file->getFilename();
            $extension = strtolower($file->getExtension());

            // Ignora arquivos que não são imagens
            if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                continue;
            }

            // Normaliza o nome do arquivo para comparação
            $baseName = pathinfo($filename, PATHINFO_FILENAME);
            $normalizedName = $this->normalizeName($baseName);

            // Busca o mapeamento
            $locationName = $photoMapping[$normalizedName] ?? null;

            if (! $locationName) {
                $notMatched[] = $filename;

                continue;
            }

            // Busca a localização no banco
            $location = Location::where('name', $locationName)->first();

            if (! $location) {
                $this->command->warn("Localização não encontrada no banco: $locationName");

                continue;
            }

            // Obtém informações do arquivo
            $mimeType = mime_content_type($file->getPathname());
            $fileSize = $file->getSize();

            // Cria o registro da foto
            Photo::create([
                'path' => "photos/$filename",
                'filename' => $filename,
                'mime_type' => $mimeType,
                'size' => $fileSize,
                'imageable_type' => 'App\Models\Location',
                'imageable_id' => $location->id,
                'alt_text' => "Foto de {$location->name}",
                'order' => 1,
            ]);

            $this->command->info("{$filename} -> {$location->name}");
            $matched++;
        }

        $this->command->newLine();
        $this->command->info('═══════════════════════════════════════════════════');
        $this->command->info('Resumo:');
        $this->command->info("  Fotos mapeadas: $matched");
        $this->command->info('  Não mapeadas: '.count($notMatched));

        if (count($notMatched) > 0) {
            $this->command->newLine();
            $this->command->warn('Arquivos não mapeados (podem ser fotos extras ou mal nomeadas):');
            foreach ($notMatched as $file) {
                $this->command->warn("   - $file");
            }
        }

        $this->command->info('═══════════════════════════════════════════════════');
        $this->command->newLine();
    }

    /**
     * Normaliza o nome do arquivo para comparação
     */
    private function normalizeName(string $name): string
    {
        // Remove acentos usando transliterator ou regex
        $name = $this->removeAccents($name);
        // Remove caracteres especiais exceto letras e números
        $name = preg_replace('/[^a-zA-Z0-9]/', '', $name);

        // Converte para minúsculas
        return strtolower($name);
    }

    /**
     * Remove acentos de uma string
     */
    private function removeAccents(string $string): string
    {
        $unwanted = [
            'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c', 'ñ' => 'n',
            'Á' => 'A', 'À' => 'A', 'Ã' => 'A', 'Â' => 'A', 'Ä' => 'A',
            'É' => 'E', 'È' => 'E', 'Ê' => 'E', 'Ë' => 'E',
            'Í' => 'I', 'Ì' => 'I', 'Î' => 'I', 'Ï' => 'I',
            'Ó' => 'O', 'Ò' => 'O', 'Õ' => 'O', 'Ô' => 'O', 'Ö' => 'O',
            'Ú' => 'U', 'Ù' => 'U', 'Û' => 'U', 'Ü' => 'U',
            'Ç' => 'C', 'Ñ' => 'N',
        ];

        return strtr($string, $unwanted);
    }
}
