# IFMap — Painel administrativo

Interface web para manutenção do conteúdo do IFMap, sistema de orientação
espacial do campus do Instituto Federal de Minas Gerais (IFMG). Permite
que servidores mantenham locais, setores, serviços, telefones, fotos e notícias
atualizados sem intervenção técnica.

Desenvolvido em React 19 com TypeScript, Vite e Tailwind CSS 4.

---

## Requisitos

| Item | Versão |
|------|--------|
| Node.js | 20.x ou superior |
| npm | 10.x ou superior |

---

## Instalação

```bash
npm install
cp .env.example .env

npm run dev
```

O painel passa a responder em `http://localhost:5173`. É necessário que a API
esteja em execução (consulte [`../backend/README.md`](../backend/README.md)).

---

## Configuração

A URL da API é definida em `.env`:

```env
# Desenvolvimento
VITE_API_URL=http://localhost:8000/api

# Produção
# VITE_API_URL=https://api.exemplo.edu.br/api
```

---

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| Dashboard | Visão geral com as estatísticas do conteúdo cadastrado |
| Locais | CRUD dos prédios e áreas do campus, incluindo coordenadas |
| Setores | Setores vinculados a cada local |
| Serviços | Serviços prestados por cada setor |
| Telefones | Lista telefônica com contatos, cargos e e-mails |
| Fotos | Envio e organização das fotos dos locais |
| Notícias | Cadastro manual e sincronização com o portal institucional |
| Autenticação | Login por token, com rotas protegidas no painel |

---

## Tecnologias

| Biblioteca | Uso |
|------------|-----|
| React 19 e TypeScript 5 | Interface e tipagem |
| Vite 7 | Servidor de desenvolvimento e build |
| Tailwind CSS 4 | Estilização |
| React Router 7 | Roteamento |
| Axios | Requisições HTTP |

---

## Estrutura

```
frontend/
├── public/                 Arquivos estáticos
├── src/
│   ├── assets/             Imagens e recursos
│   ├── components/         Componentes (CRUDs, dashboard, layout)
│   ├── contexts/           Contextos e respectivos providers
│   ├── hooks/              Hooks de consumo dos contextos
│   ├── services/           Integração com a API (Axios)
│   ├── types/              Tipagens TypeScript
│   ├── App.tsx             Componente raiz e rotas
│   └── main.tsx            Ponto de entrada
├── .env.example
├── vite.config.ts
└── tailwind.config.js
```

Os contextos seguem a divisão em três arquivos para preservar o hot reload do
Vite: o contexto (`contexts/AuthContext.ts`), o provider
(`contexts/AuthProvider.tsx`) e o hook de consumo (`hooks/useAuth.ts`).

---

## Verificações

```bash
npm run lint        # ESLint
npm run lint:fix    # ESLint aplicando correções
npm run typecheck   # verificação de tipos sem gerar arquivos
npm run build       # verificação de tipos e build de produção
```

O build é gerado em `dist/`. Use `npm run preview` para inspecioná-lo localmente.

---

## Licença

Distribuído sob a Licença MIT. O texto completo está em [LICENSE](../LICENSE).
