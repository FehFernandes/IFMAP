# IFMap — Backend (API REST)

API desenvolvida em Laravel 12 para o IFMap, sistema de orientação espacial do
campus do Instituto Federal de Minas Gerais (IFMG). Expõe os endpoints
de locais, setores, serviços, telefones, fotos e notícias do campus, e concentra
as regras de negócio e a persistência dos dados.

---

## Requisitos

| Item | Versão |
|------|--------|
| PHP | 8.2 ou superior |
| Composer | 2.x |
| SQLite | 3 |

Extensões PHP necessárias: `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`.

---

## Instalação

```bash
composer install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed     # cria o banco e popula os dados do campus
php artisan storage:link       # publica as fotos armazenadas

php artisan serve
```

A API passa a responder em `http://localhost:8000/api`.

---

## Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/login` | Autentica o usuário e devolve um token |
| `POST` | `/api/logout` | Encerra a sessão |
| `GET` | `/api/me` | Retorna os dados do usuário autenticado |

### Locais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/locations` | Lista os locais |
| `GET` | `/api/locations/{id}` | Detalha um local |
| `POST` | `/api/locations` | Cria um local |
| `PUT` | `/api/locations/{id}` | Atualiza um local |
| `DELETE` | `/api/locations/{id}` | Remove um local |

Parâmetros aceitos na listagem: `search`, `type`, `paginate=true` e `per_page`.

### Setores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/sectors` | Lista os setores |
| `GET` | `/api/locations/{id}/sectors` | Lista os setores de um local |
| `POST` | `/api/sectors` | Cria um setor |
| `PUT` | `/api/sectors/{id}` | Atualiza um setor |
| `DELETE` | `/api/sectors/{id}` | Remove um setor |

### Serviços

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/services` | Lista os serviços |
| `GET` | `/api/sectors/{id}/services` | Lista os serviços de um setor |
| `POST` | `/api/services` | Cria um serviço |
| `PUT` | `/api/services/{id}` | Atualiza um serviço |
| `DELETE` | `/api/services/{id}` | Remove um serviço |

### Telefones

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/phones` | Lista os telefones |
| `POST` | `/api/phones` | Cria um telefone |
| `PUT` | `/api/phones/{id}` | Atualiza um telefone |
| `DELETE` | `/api/phones/{id}` | Remove um telefone |

### Fotos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/photos` | Lista as fotos |
| `GET` | `/api/locations/{id}/photos` | Lista as fotos de um local |
| `POST` | `/api/photos` | Envia uma foto (multipart/form-data) |
| `DELETE` | `/api/photos/{id}` | Remove uma foto |

### Notícias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/news` | Lista as notícias |
| `GET` | `/api/news/{id}` | Detalha uma notícia |
| `POST` | `/api/news` | Cria uma notícia |
| `PUT` | `/api/news/{id}` | Atualiza uma notícia |
| `DELETE` | `/api/news/{id}` | Remove uma notícia |
| `POST` | `/api/news/scrape` | Sincroniza as notícias do portal institucional |

Exemplos de requisição e resposta em [`../docs/api.md`](../docs/api.md).

---

## Modelo de dados

```
locations                     sectors                    services
---------                     -------                    --------
id                            id                         id
name                          name                       name
description              ---> location_id           ---> sector_id
latitude                      floor                      description
longitude                     description                timestamps
type                          opening_time
opening_time                  closing_time
closing_time                  timestamps
timestamps

photos                        phones                     news
------                        ------                     ----
id                            id                         id
path                          contact_name               title
filename                      contact_position           url (único)
mime_type                     contact_email              description
size                          number                     published_at
imageable_id    (polimórfico) label                      category
imageable_type                order                      order
alt_text                      timestamps                 timestamps
order
timestamps
```

Relacionamentos declarados nos modelos Eloquent:

- `Location` tem muitos `Sector`.
- `Sector` tem muitos `Service`.
- `Location`, `Sector` e `Service` têm muitas `Photo` (relação polimórfica
  `imageable`).

> **Observação.** Os modelos também declaram uma relação polimórfica `phoneable`
> para `Phone`, mas a tabela `phones` não possui as colunas `phoneable_id` e
> `phoneable_type`. Consultar `$location->phones` resulta em erro de SQL, e os
> telefones funcionam apenas como uma lista global (`GET /api/phones`). Veja as
> [limitações conhecidas](../docs/api.md#limitações-conhecidas).

---

## Testes

A suíte usa PHPUnit, com banco SQLite em memória configurado em `phpunit.xml`.

```bash
composer test                        # equivale a php artisan test
php artisan test --filter=AuthTest   # executa um caso específico
php artisan test --coverage          # requer Xdebug ou PCOV
```

Cobertura atual:

| Arquivo | Escopo |
|---------|--------|
| `tests/Feature/AuthTest.php` | Login, token inválido, `/api/me` e logout |
| `tests/Feature/LocationApiTest.php` | CRUD de locais, filtros, paginação e validações |
| `tests/Feature/HealthCheckTest.php` | Rota de health check e resposta 404 |
| `tests/Unit/UserTest.php` | Papel de administrador e atributos ocultos |

---

## Estilo de código

O projeto segue o preset Laravel do [Pint](https://laravel.com/docs/pint).

```bash
composer lint       # verifica sem alterar arquivos
composer lint:fix   # aplica as correções
```

---

## Comandos úteis

```bash
php artisan migrate:fresh --seed   # recria o banco e popula novamente
php artisan optimize:clear         # limpa os caches da aplicação
php artisan route:list             # lista as rotas registradas
```

---

## Licença

Distribuído sob a Licença MIT. O texto completo está em [LICENSE](../LICENSE).
