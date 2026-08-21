# IFMap — Aplicativo móvel

Aplicativo de orientação espacial no campus do Instituto Federal de Minas Gerais
(IFMG), parte do sistema IFMap. Construído com Expo SDK 54 e React Native, com
execução em Android e iOS.

---

## Requisitos

| Item | Versão |
|------|--------|
| Node.js | 20.x ou superior |
| npm | 10.x ou superior |
| Expo Go | aplicativo instalado no dispositivo, ou emulador Android/iOS |

---

## Instalação

```bash
npm install
npx expo start
```

Leia o QR code exibido no terminal com o aplicativo Expo Go, ou pressione `a`
para abrir no emulador Android.

---

## Configuração

### Chave do Google Maps e IP do backend

As credenciais e o endereço do backend ficam em `config/env.config.ts`. O
aplicativo não utiliza arquivos `.env`.

```typescript
// Chave do Google Maps (Maps SDK for Android e iOS)
export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// IP da máquina que executa o backend (o dispositivo não alcança "localhost")
export const LOCAL_DEV_IP = "192.168.0.10";
```

Para descobrir o IP da máquina de desenvolvimento:

| Sistema | Comando |
|---------|---------|
| Linux | `hostname -I \| awk '{print $1}'` |
| macOS | `ipconfig getifaddr en0` |
| Windows | `ipconfig` (procure por "IPv4 Address") |

A mesma chave do Google Maps precisa ser informada em `app.json`, nos campos
`ios.config.googleMapsApiKey` e `android.config.googleMaps.apiKey`, usados pelos
mapas nativos.

Não versione chaves reais: os arquivos do repositório contêm apenas valores
placeholder.

### URL da API

`config/api.config.ts` monta a URL a partir do IP configurado e normalmente não
precisa ser alterado:

```typescript
export const getApiUrl = (): string => {
  if (__DEV__) {
    return `http://${LOCAL_DEV_IP}:8000/api`;
  }
  return "https://api.ifmap.edu.br/api";
};
```

Em desenvolvimento, o dispositivo precisa alcançar o backend pelo IP da rede
local, e não por `localhost`.

---

## Telas

| Tela | Descrição |
|------|-----------|
| Mapa | Mapa interativo com os marcadores dos prédios e áreas do campus |
| Busca | Pesquisa de locais, setores e serviços |
| Contatos | Lista telefônica institucional com busca |
| Notícias | Feed com as notícias do portal institucional |
| Acessibilidade | Ajustes de acessibilidade da interface |
| Configurações | Tema e preferências do usuário |

---

## Tecnologias

| Biblioteca | Uso |
|------------|-----|
| Expo SDK 54 | Ambiente de desenvolvimento e execução |
| React Native 0.81 | Interface nativa |
| React Navigation 7 | Navegação por abas e pilha |
| React Native Maps | Mapas nativos do Google Maps |
| Axios | Requisições HTTP |
| TypeScript 5 | Tipagem estática |

---

## Estrutura

```
mobile/
├── assets/                 Ícones, splash screen e imagens
├── components/
│   └── map/                Componentes do mapa (marcadores, modais)
├── config/
│   ├── api.config.ts       Composição da URL da API
│   └── env.config.ts       Chave do Google Maps e IP de desenvolvimento
├── context/                Contextos de tema e acessibilidade
├── data/                   Dados estáticos usados na busca
├── hooks/                  Hooks personalizados
├── screens/                Telas do aplicativo
├── services/               Integração com a API
├── App.tsx                 Componente raiz e navegação
├── app.json                Configuração do Expo
└── package.json
```

---

## Scripts

```bash
npm start           # inicia o Expo
npm run android     # abre no emulador Android
npm run ios         # abre no simulador iOS
npm run web         # abre a versão web
npm run typecheck   # verificação de tipos TypeScript
```

---

## Geração de builds

Os builds são produzidos com o [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
npm install -g eas-cli

eas login
eas build:configure

eas build --platform android --profile preview      # APK para testes
eas build --platform android --profile production   # AAB para o Google Play
```

Builds para iOS exigem uma conta Apple Developer.

---

## Licença

Distribuído sob a Licença MIT. O texto completo está em [LICENSE](../LICENSE).
