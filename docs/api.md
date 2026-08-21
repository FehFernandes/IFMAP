# Documentação da API

## Visão Geral

A API do IFMap é RESTful e utiliza JSON para comunicação. O servidor roda por padrão na porta `8000`.

**Base URL:** `http://localhost:8000/api`

## Autenticação

> O `POST /api/login` devolve um token criptografado, válido por oito horas.
> Todos os endpoints de escrita exigem um token de administrador. Para um
> cenário com revogação individual de tokens, prefira Laravel Sanctum.

O token retornado deve ser enviado no header `Authorization` das requisições que
consultam o usuário logado.

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin",
    "created_at": "2025-02-11T22:23:00.000000Z",
    "updated_at": "2025-02-11T22:23:00.000000Z"
  },
  "token": "MXwxNzM5MzE..."
}
```

**Resposta (422) — credenciais inválidas:**
```json
{
  "message": "As credenciais fornecidas estão incorretas.",
  "errors": {
    "email": ["As credenciais fornecidas estão incorretas."]
  }
}
```

### Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

> O logout é apenas simbólico: como o token não é persistido no servidor, a
> invalidação acontece no cliente (que descarta o token do `localStorage`).

### Usuário Autenticado

```http
GET /api/me
Authorization: Bearer {token}
```

Retorna `401` quando o header `Authorization` está ausente ou o token é
inválido.

## Recursos

### Locations (Localizações)

Representa os locais/prédios do campus.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/locations` | Lista todas as localizações |
| POST | `/api/locations` | Cria uma nova localização |
| GET | `/api/locations/{id}` | Exibe uma localização |
| PUT | `/api/locations/{id}` | Atualiza uma localização |
| DELETE | `/api/locations/{id}` | Remove uma localização |

#### Rotas Aninhadas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/locations/{id}/sectors` | Lista setores de uma localização |
| GET | `/api/locations/{id}/photos` | Lista fotos de uma localização |
| GET | `/api/locations/{id}/phones` | Lista telefones de uma localização |

---

### Sectors (Setores)

Representa os setores/salas dentro de uma localização.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/sectors` | Lista todos os setores |
| POST | `/api/sectors` | Cria um novo setor |
| GET | `/api/sectors/{id}` | Exibe um setor |
| PUT | `/api/sectors/{id}` | Atualiza um setor |
| DELETE | `/api/sectors/{id}` | Remove um setor |

#### Rotas Aninhadas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/sectors/{id}/services` | Lista serviços de um setor |
| GET | `/api/sectors/{id}/photos` | Lista fotos de um setor |
| GET | `/api/sectors/{id}/phones` | Lista telefones de um setor |

---

### Services (Serviços)

Representa os serviços disponíveis em cada setor.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/services` | Lista todos os serviços |
| POST | `/api/services` | Cria um novo serviço |
| GET | `/api/services/{id}` | Exibe um serviço |
| PUT | `/api/services/{id}` | Atualiza um serviço |
| DELETE | `/api/services/{id}` | Remove um serviço |

#### Rotas Aninhadas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/services/{id}/photos` | Lista fotos de um serviço |
| GET | `/api/services/{id}/phones` | Lista telefones de um serviço |

---

### Photos (Fotos)

Gerencia fotos vinculadas a localizações, setores ou serviços.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/photos` | Lista todas as fotos |
| POST | `/api/photos` | Upload de uma nova foto |
| GET | `/api/photos/{id}` | Exibe uma foto |
| PUT | `/api/photos/{id}` | Atualiza uma foto |
| DELETE | `/api/photos/{id}` | Remove uma foto |

#### Upload de Foto

```http
POST /api/photos
Content-Type: multipart/form-data

photo: [arquivo]
location_id: 1  (ou sector_id, ou service_id)
```

---

### Phones (Telefones)

Gerencia telefones vinculados a localizações, setores ou serviços.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/phones` | Lista todos os telefones |
| POST | `/api/phones` | Cria um novo telefone |
| GET | `/api/phones/{id}` | Exibe um telefone |
| PUT | `/api/phones/{id}` | Atualiza um telefone |
| DELETE | `/api/phones/{id}` | Remove um telefone |

---

### Users (Usuários)

Gerenciamento de usuários do sistema.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários |
| POST | `/api/users` | Cria um novo usuário |
| GET | `/api/users/{id}` | Exibe um usuário |
| PUT | `/api/users/{id}` | Atualiza um usuário |
| PATCH | `/api/users/{id}` | Atualização parcial |
| DELETE | `/api/users/{id}` | Remove um usuário |

---

### News (Notícias)

Gerenciamento de notícias do campus.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/news` | Lista todas as notícias |
| POST | `/api/news` | Cria uma nova notícia |
| GET | `/api/news/{id}` | Exibe uma notícia |
| PUT | `/api/news/{id}` | Atualiza uma notícia |
| DELETE | `/api/news/{id}` | Remove uma notícia |
| POST | `/api/news/scrape` | Executa web scraping do portal |

---

## Códigos de Resposta

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Recurso criado com sucesso |
| 204 | Sucesso sem conteúdo (DELETE) |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Acesso negado |
| 404 | Recurso não encontrado |
| 422 | Erro de validação |
| 500 | Erro interno do servidor |

## Formato de Erro

```json
{
  "message": "Descrição do erro",
  "errors": {
    "campo": ["Mensagem de validação"]
  }
}
```

## Paginação

Por padrão, os endpoints de listagem retornam **todos** os registros dentro de
`data`. A paginação é opcional e ativada com `paginate=true`:

```http
GET /api/locations?paginate=true&per_page=15&page=1
```

**Resposta:**
```json
{
  "data": [],
  "current_page": 1,
  "last_page": 3,
  "per_page": 15,
  "total": 42
}
```

## Filtros

O endpoint de localizações aceita:

| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `search` | `?search=Biblioteca` | Busca por nome ou descrição |
| `type` | `?type=Prédio` | Filtra pelo tipo do local |
| `paginate` | `?paginate=true` | Ativa a paginação |
| `per_page` | `?per_page=20` | Itens por página (com `paginate=true`) |

## CORS

A API está configurada para aceitar requisições de origens locais em desenvolvimento. Em produção, configure as origens permitidas em `config/cors.php`.

## Limitações conhecidas

Pontos que precisam ser resolvidos antes de um deploy público:

| Limitação | Impacto | Encaminhamento sugerido |
|-----------|---------|-------------------------|
| Tokens não têm revogação individual | Um token válido permanece utilizável até expirar | Migrar para Laravel Sanctum quando houver necessidade de revogação por dispositivo |
| `POST /api/logout` não invalida o token no servidor | Token continua válido até o cliente descartá-lo | Persistir e revogar tokens (Sanctum) |
| Telefones não estão vinculados a locais, setores ou serviços | A tabela `phones` não possui as colunas `phoneable_id` e `phoneable_type`, embora os modelos declarem a relação `phoneable` e o `PhoneController` valide esses campos. Acessar `$location->phones` provoca erro de SQL, e as rotas aninhadas de telefones devolvem a lista completa | Criar uma migração adicionando as colunas polimórficas e passar a filtrar nas rotas aninhadas |
| Rotas aninhadas não filtram pelo recurso pai | `GET /api/locations/{id}/phones` ignora o `{id}` recebido | Aplicar o filtro nos controllers correspondentes |
| SQLite com arquivo local | Concorrência limitada e backup manual | Avaliar PostgreSQL/MySQL em produção |
