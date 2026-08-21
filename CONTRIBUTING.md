# Guia de Contribuição

Obrigado pelo seu interesse em contribuir com o **IFMap**! Este documento descreve as diretrizes e processos para contribuir com o projeto.

## Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
- [Estilo de Código](#estilo-de-código)
- [Convenção de Commits](#convenção-de-commits)
- [Pull Requests](#pull-requests)

## Como Contribuir

### 1. Fork e Clone

1. Faça um **fork** do repositório no GitHub
2. Clone o seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/ifmap.git
   cd ifmap
   ```
3. Adicione o repositório original como remote upstream:
   ```bash
   git remote add upstream https://github.com/ifmap/ifmap.git
   ```

### 2. Crie uma Branch

Sempre crie uma nova branch a partir da `main` para suas alterações:

```bash
git checkout main
git pull upstream main
git checkout -b tipo/descricao-curta
```

Exemplos de nomes de branch:
- `feat/mapa-interativo`
- `fix/login-redirect`
- `docs/atualizar-readme`
- `refactor/service-layer`

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Adicione testes quando aplicável
- Verifique se os testes existentes continuam passando

### 4. Envie um Pull Request

1. Faça push da sua branch para o seu fork:
   ```bash
   git push origin tipo/descricao-curta
   ```
2. Abra um Pull Request no repositório original
3. Preencha o template do PR com todas as informações relevantes

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18
- **npm** >= 9
- **SQLite** 3

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ifmap.git
cd ifmap

# Setup completo (instala todas as dependências)
make setup

# Ou manualmente:

# Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
cd ..

# Frontend (React + Vite)
cd frontend
npm install
cp .env.example .env
cd ..

# Mobile (React Native / Expo)
cd mobile
npm install
cd ..
```

### Executando o Projeto

```bash
# Todos os serviços simultaneamente
make dev

# Ou individualmente:
make backend-dev      # API Laravel (porta 8000)
make frontend-dev     # Admin Frontend (porta 5173)
make mobile-dev       # App Mobile (Expo)
```

### Docker (Alternativa)

```bash
docker-compose up -d
```

## Estilo de Código

### PHP (Backend - Laravel)

- Siga as recomendações [PSR-12](https://www.php-fig.org/psr/psr-12/)
- Use **Laravel Pint** para formatação automática:
  ```bash
  cd backend
  ./vendor/bin/pint
  ```
- Nomes de classes em **PascalCase**
- Nomes de métodos e variáveis em **camelCase**
- Nomes de tabelas e colunas em **snake_case**
- Docblocks em métodos públicos

### TypeScript/React (Frontend)

- Use **ESLint** com a configuração do projeto
- Componentes em **PascalCase**
- Hooks e funções em **camelCase**
- Arquivos de componentes com extensão `.tsx`
- Use tipagem explícita (evite `any`)
- Prefira componentes funcionais com hooks

### TypeScript/React Native (Mobile)

- Mesmas convenções do frontend web
- Componentes em arquivos separados na pasta `screens/` ou `components/`
- Serviços na pasta `services/`

### Geral

- Indentação: **4 espaços** (PHP), **2 espaços** (TypeScript/JSON)
- Encoding: **UTF-8**
- Final de linha: **LF**
- Sempre incluir nova linha ao final do arquivo
- Remover espaços em branco no final das linhas

## Convenção de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/) para manter um histórico de commits claro e padronizado.

### Formato

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé(s) opcional(is)]
```

### Tipos Permitidos

| Tipo       | Descrição                                          |
|------------|---------------------------------------------------|
| `feat`     | Nova funcionalidade                                |
| `fix`      | Correção de bug                                    |
| `docs`     | Alterações na documentação                         |
| `style`    | Formatação (não afeta a lógica do código)          |
| `refactor` | Refatoração de código                              |
| `perf`     | Melhoria de performance                            |
| `test`     | Adição ou correção de testes                       |
| `build`    | Alterações no sistema de build ou dependências     |
| `ci`       | Alterações em configuração de CI/CD                |
| `chore`    | Tarefas diversas (não afetam o código de produção) |
| `revert`   | Reverte um commit anterior                         |

### Exemplos

```
feat(locations): adicionar filtro por setor no mapa

fix(auth): corrigir redirecionamento após login

docs: atualizar instruções de instalação no README

refactor(api): extrair lógica de validação para FormRequest

test(services): adicionar testes unitários para ServiceController
```

### Breaking Changes

Para mudanças que quebram compatibilidade, adicione `!` após o tipo ou `BREAKING CHANGE:` no rodapé:

```
feat(api)!: alterar formato de resposta da API de locations

BREAKING CHANGE: o campo `coordinates` agora retorna um objeto ao invés de string.
```

## Pull Requests

### Antes de Abrir um PR

- [ ] O código segue o estilo definido neste guia
- [ ] Os testes existentes passam (`php artisan test` / `npm test`)
- [ ] Novos testes foram adicionados (se aplicável)
- [ ] A documentação foi atualizada (se aplicável)
- [ ] Os commits seguem a convenção descrita acima
- [ ] A branch está atualizada com a `main`

### Estrutura do PR

**Título:** Use o mesmo formato dos commits convencionais.

**Descrição:**

```markdown
## Descrição
Breve descrição do que foi feito e por quê.

## Tipo de Alteração
- [ ] Nova funcionalidade (feat)
- [ ] Correção de bug (fix)
- [ ] Refatoração (refactor)
- [ ] Documentação (docs)
- [ ] Outro: ___

## Como Testar
Passos para testar as alterações:
1. ...
2. ...
3. ...

## Screenshots (se aplicável)

## Checklist
- [ ] Código revisado
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
```

### Revisão de Código

- Todo PR precisa de pelo menos **1 aprovação** antes do merge
- Responda aos comentários de revisão de forma construtiva
- Faça squash de commits de correção antes do merge

---

Agradecemos sua contribuição.
