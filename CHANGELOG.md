# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado

- Suíte de testes do backend (PHPUnit): `phpunit.xml`, `tests/Unit`, `tests/Feature`
  cobrindo autenticação, health check e CRUD de localizações (24 testes)
- `LocationFactory` para geração de dados de teste
- `.github/dependabot.yml` (Composer, npm do frontend e do mobile, GitHub Actions)
- `.gitattributes` (normalização de fim de linha e estatísticas do GitHub) e `.nvmrc`
- Índice da documentação em `docs/README.md` e guia de capturas em `docs/screenshots/README.md`
- Scripts `composer test`, `composer lint`, `npm run typecheck` e `npm run lint:fix`

### Corrigido

- `.gitignore` ignorava os arquivos `.gitignore` internos do Laravel, o que deixaria
  `bootstrap/cache` e `storage/framework` ausentes após o clone
- `storage/app/public/.gitignore` ignorava as fotos do campus usadas pelo `PhotoAutoSeeder`
- Rota `/api/user` usava o middleware `auth:sanctum` sem o Laravel Sanctum instalado
- Documentação descrevia autenticação via Laravel Sanctum, que não é o mecanismo real
- Paginação documentada sem mencionar o parâmetro obrigatório `paginate=true`
- README referenciava capturas de tela inexistentes (imagens quebradas)
- README do painel administrativo também exibia capturas de tela inexistentes

### Documentação

- Revisão editorial de toda a documentação: remoção de emojis e padronização do
  tom técnico
- Registro do vínculo ausente entre telefones e locais/setores/serviços nas
  limitações conhecidas (a tabela `phones` não possui as colunas `phoneable_id`
  e `phoneable_type` exigidas pela relação declarada nos modelos)

### Alterado

- Preparação do projeto para open source
- Remoção de credenciais e dados sensíveis do código-fonte
- Centralização da configuração de API keys em arquivos de ambiente
- Remoção do IP local (`192.168.1.6`) de `frontend/.env.example`
- Padronização dos metadados dos pacotes: `ifmap/backend`, `ifmap-admin`, `ifmap-mobile`
- Formatação de todo o backend com Laravel Pint
- `services/api.ts` do painel admin tipado (sem `any`), com helpers de erro e normalização
- Contexts do painel divididos em contexto, provider e hook (`useAuth`, `useToast`)
- CI: validação do Composer, verificação de tipos do frontend e Node definido pelo `.nvmrc`
- Documentadas as limitações conhecidas de autenticação em `docs/api.md` e
  `docs/architecture.md`
- Atualização do docker-compose.yml e Makefile


## [1.0.0] - 2025-02-11

### Adicionado

- **Backend (Laravel 12 + SQLite)**
  - API RESTful completa para gerenciamento de localizações, setores e serviços
  - Sistema de autenticação baseado em tokens
  - CRUD de usuários com controle de acesso
  - Upload e gerenciamento de fotos para locais, setores e serviços
  - Gerenciamento de telefones vinculados a locais, setores e serviços
  - Sistema de notícias com web scraping do portal institucional
  - Banco de dados SQLite para simplicidade de deploy
  - Seeders para dados iniciais do campus

- **Frontend Administrativo (React + TypeScript + Vite)**
  - Painel administrativo para gerenciamento completo do mapa
  - Interface responsiva com Tailwind CSS
  - Gerenciamento de localizações, setores e serviços
  - Upload de imagens com preview
  - Sistema de autenticação integrado com a API
  - Contextos React para gerenciamento de estado

- **Aplicativo Mobile (React Native + Expo)**
  - Mapa interativo do campus com marcadores
  - Navegação entre localizações e setores
  - Visualização de serviços disponíveis
  - Busca de locais e serviços
  - Interface nativa para iOS e Android
  - Integração com API backend

- **Infraestrutura**
  - Monorepo organizado com backend, frontend e mobile
  - Configuração de CORS para comunicação entre serviços
  - Estrutura de migrations para versionamento do banco de dados

[Unreleased]: https://github.com/FehFernandes/IFMAP/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/FehFernandes/IFMAP/releases/tag/v1.0.0
