/**
 * Configuração de variáveis de ambiente do IFMap Mobile.
 *
 * IMPORTANTE: não faça commit de chaves reais neste arquivo.
 *     Copie este arquivo e substitua os valores placeholder
 *     pelas suas credenciais locais.
 *
 * Para obter uma Google Maps API key:
 * 1. Acesse https://console.cloud.google.com/
 * 2. Crie um projeto ou selecione um existente
 * 3. Ative a "Maps SDK for Android" e "Maps SDK for iOS"
 * 4. Crie uma API key em "Credenciais"
 * 5. Substitua o valor abaixo pela sua chave
 */

// Substitua pela sua Google Maps API key
export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

/**
 * IP local da máquina de desenvolvimento.
 * Necessário porque dispositivos móveis não conseguem acessar
 * o backend via "localhost" — precisam do IP da rede local.
 *
 * Para encontrar seu IP:
 * - Linux: hostname -I | awk '{print $1}'
 * - macOS: ipconfig getifaddr en0
 * - Windows: ipconfig (procure por "IPv4 Address")
 */
export const LOCAL_DEV_IP = "localhost";
