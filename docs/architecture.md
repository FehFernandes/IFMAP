# Arquitetura do IFMap

## Visão Geral

O IFMap é uma aplicação monorepo composta por três módulos principais que se comunicam através de uma API RESTful centralizada.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          IFMap Monorepo                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │   Mobile App    │    │  Admin Frontend  │    │    Backend     │  │
│  │                 │    │                  │    │                │  │
│  │  React Native   │    │  React + Vite    │    │   Laravel 12   │  │
│  │  + Expo         │    │  + TypeScript    │    │   + PHP 8.2    │  │
│  │                 │    │  + Tailwind CSS  │    │                │  │
│  └────────┬────────┘    └────────┬─────────┘    └───────┬────────┘  │
│           │                      │                      │           │
│           │              HTTP/REST (JSON)                │           │
│           └──────────────────────┼──────────────────────┘           │
│                                  │                                   │
│                          ┌───────▼───────┐                          │
│                          │   API REST    │                          │
│                          │  /api/*       │                          │
│                          └───────┬───────┘                          │
│                                  │                                   │
│                          ┌───────▼───────┐                          │
│                          │    SQLite     │                          │
│                          │   Database   │                          │
│                          └───────────────┘                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Componentes

### Backend (`backend/`)

- **Framework:** Laravel 12 (PHP 8.2+)
- **Banco de dados:** SQLite
- **Autenticação:** token Bearer simplificado, gerado em `AuthController`
  (ver [Limitações conhecidas](#limitações-conhecidas))
- **Responsabilidades:**
  - API RESTful para todos os recursos
  - Autenticação e autorização
  - Upload e armazenamento de imagens
  - Web scraping de notícias do portal institucional
  - Validação de dados

#### Estrutura de Diretórios

```
backend/
├── app/
│   ├── Http/Controllers/    # Controllers da API
│   ├── Models/              # Eloquent Models
│   └── Providers/           # Service Providers
├── config/                  # Configurações
├── database/
│   ├── migrations/          # Migrations do banco
│   └── seeders/             # Seeders com dados iniciais
├── routes/
│   ├── api.php              # Rotas da API
│   └── web.php              # Rotas web
└── storage/                 # Arquivos e logs
```

### Frontend Administrativo (`frontend/`)

- **Framework:** React 19 com TypeScript
- **Build tool:** Vite
- **Estilização:** Tailwind CSS
- **Responsabilidades:**
  - Painel de gerenciamento (CRUD completo)
  - Upload de imagens
  - Gerenciamento de usuários
  - Visualização e edição de dados do mapa

#### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # React Contexts
│   ├── services/       # Serviços de API
│   ├── types/          # Definições TypeScript
│   ├── App.tsx         # Componente raiz
│   └── main.tsx        # Entry point
└── public/             # Assets estáticos
```

### Aplicativo Mobile (`mobile/`)

- **Framework:** React Native com Expo
- **Linguagem:** TypeScript
- **Responsabilidades:**
  - Mapa interativo do campus
  - Navegação e busca de locais
  - Visualização de serviços e setores
  - Experiência nativa iOS/Android

#### Estrutura de Diretórios

```
mobile/
├── screens/        # Telas do aplicativo
├── components/     # Componentes reutilizáveis
├── services/       # Integração com API
├── context/        # Contextos de estado
├── hooks/          # Custom hooks
├── config/         # Configurações
├── data/           # Dados estáticos
└── assets/         # Imagens e fontes
```

## Fluxo de Dados

1. **Usuário final** interage com o app mobile para visualizar o mapa
2. **Administrador** usa o frontend web para gerenciar dados
3. Ambos os clientes se comunicam com o **backend** via API REST
4. O backend persiste dados no **SQLite** e serve arquivos de mídia

## Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| Monorepo | Facilita o desenvolvimento e garante consistência entre os módulos |
| SQLite | Simplicidade de deploy e backup (arquivo único) |
| Token Bearer próprio | Solução simples para o estágio atual; a migração para Laravel Sanctum está prevista antes de um deploy público |
| Vite | Build rápido e HMR eficiente para desenvolvimento |
| Expo | Desenvolvimento mobile simplificado e cross-platform |
| REST | Padrão amplamente conhecido e suportado |

## Portas Padrão

| Serviço | Porta | URL |
|---------|-------|-----|
| Backend API | 8000 | http://localhost:8000/api |
| Frontend Admin | 5173 | http://localhost:5173 |
| Expo (Mobile) | 8081 | exp://localhost:8081 |

## Limitações conhecidas

Há pontos conscientemente simplificados no estágio atual do projeto:

- **Autenticação:** o token contém o identificador do usuário e a expiração,
  protegidos pela chave da aplicação; ele expira após oito horas.
- **Autorização:** o middleware `admin` protege as rotas de escrita e o
  gerenciamento de usuários.
- **Vínculo dos telefones:** os modelos declaram a relação polimórfica
  `phoneable`, porém a tabela `phones` não possui as colunas `phoneable_id` e
  `phoneable_type`. Na prática os telefones formam uma lista global e
  `$location->phones` resulta em erro de SQL.
- **Banco de dados:** o SQLite atende bem ao volume atual, porém não é ideal
  para escrita concorrente.
- **Testes:** a suíte cobre autenticação e o CRUD de localizações; os demais
  recursos (setores, serviços, telefones, fotos, notícias) ainda não têm
  cobertura automatizada.

Detalhes e encaminhamentos em [`api.md`](api.md#limitações-conhecidas).
