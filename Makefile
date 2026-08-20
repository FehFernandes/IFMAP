.PHONY: install dev setup clean help \
	backend-install backend-setup backend-dev backend-test backend-lint \
	frontend-install frontend-dev frontend-build frontend-lint frontend-typecheck \
	mobile-install mobile-dev mobile-typecheck \
	lint test typecheck

# ============================================================================
# IFMap - Makefile
# ============================================================================

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
RESET  := \033[0m

# ============================================================================
# Targets Principais
# ============================================================================

## Instala todas as dependências do projeto
install: backend-install frontend-install mobile-install
	@printf '%b\n' "$(GREEN)Dependências instaladas.$(RESET)"

## Executa todos os serviços em paralelo
dev:
	@printf '%b\n' "$(GREEN)Iniciando todos os serviços...$(RESET)"
	@make -j3 backend-dev frontend-dev mobile-dev

## Setup completo para primeira execução
setup: install backend-setup
	@printf '%b\n' "$(GREEN)Configuração concluída. Execute 'make dev' para iniciar.$(RESET)"

## Executa lint em todos os módulos
lint: backend-lint frontend-lint
	@printf '%b\n' "$(GREEN)Análise estática concluída.$(RESET)"

## Verifica tipos TypeScript no frontend e no mobile
typecheck: frontend-typecheck mobile-typecheck
	@printf '%b\n' "$(GREEN)Verificação de tipos concluída.$(RESET)"

## Executa testes em todos os módulos
test: backend-test
	@printf '%b\n' "$(GREEN)Testes concluídos.$(RESET)"

# ============================================================================
# Backend (Laravel + PHP)
# ============================================================================

## Instala dependências do backend
backend-install:
	@printf '%b\n' "$(YELLOW)Instalando dependências do backend...$(RESET)"
	cd backend && composer install

## Configura o backend (env, key, migrations, storage)
backend-setup:
	@printf '%b\n' "$(YELLOW)Configurando backend...$(RESET)"
	cd backend && cp -n .env.example .env || true
	cd backend && php artisan key:generate --no-interaction || true
	cd backend && php artisan migrate --seed
	cd backend && php artisan storage:link || true
	@printf '%b\n' "$(GREEN)Backend configurado.$(RESET)"

## Executa o servidor de desenvolvimento do backend
backend-dev:
	@printf '%b\n' "$(GREEN)Backend rodando em http://localhost:8000$(RESET)"
	cd backend && php artisan serve

## Executa os testes do backend
backend-test:
	@printf '%b\n' "$(YELLOW)Executando testes do backend...$(RESET)"
	cd backend && php artisan test

## Executa o linter do backend (Laravel Pint)
backend-lint:
	@printf '%b\n' "$(YELLOW)Verificando estilo do backend...$(RESET)"
	cd backend && ./vendor/bin/pint --test

# ============================================================================
# Frontend (React + Vite)
# ============================================================================

## Instala dependências do frontend
frontend-install:
	@printf '%b\n' "$(YELLOW)Instalando dependências do frontend...$(RESET)"
	cd frontend && npm install

## Executa o servidor de desenvolvimento do frontend
frontend-dev:
	@printf '%b\n' "$(GREEN)Frontend rodando em http://localhost:5173$(RESET)"
	cd frontend && npm run dev

## Gera build de produção do frontend
frontend-build:
	@printf '%b\n' "$(YELLOW)Gerando build do frontend...$(RESET)"
	cd frontend && npm run build
	@printf '%b\n' "$(GREEN)Build do frontend gerado em frontend/dist/.$(RESET)"

## Executa o linter do frontend (ESLint)
frontend-lint:
	@printf '%b\n' "$(YELLOW)Verificando estilo do frontend...$(RESET)"
	cd frontend && npm run lint

## Verifica tipos TypeScript do frontend
frontend-typecheck:
	@printf '%b\n' "$(YELLOW)Verificando tipos do frontend...$(RESET)"
	cd frontend && npm run typecheck

# ============================================================================
# Mobile (React Native + Expo)
# ============================================================================

## Instala dependências do app mobile
mobile-install:
	@printf '%b\n' "$(YELLOW)Instalando dependências do mobile...$(RESET)"
	cd mobile && npm install

## Executa o app mobile com Expo
mobile-dev:
	@printf '%b\n' "$(GREEN)Mobile iniciando com Expo...$(RESET)"
	cd mobile && npx expo start

## Verifica tipos TypeScript do mobile
mobile-typecheck:
	@printf '%b\n' "$(YELLOW)Verificando tipos do mobile...$(RESET)"
	cd mobile && npm run typecheck

# ============================================================================
# Utilitários
# ============================================================================

## Remove dependências e arquivos gerados
clean:
	@printf '%b\n' "$(YELLOW)Limpando dependências e arquivos gerados...$(RESET)"
	rm -rf backend/vendor
	rm -rf frontend/node_modules frontend/dist
	rm -rf mobile/node_modules
	@printf '%b\n' "$(GREEN)Limpeza concluída.$(RESET)"

## Exibe ajuda com targets disponíveis
help:
	@printf '%b\n' "$(GREEN)IFMap - Targets disponíveis:$(RESET)"
	@printf '%b\n' ""
	@printf '%b\n' "  $(YELLOW)Principais:$(RESET)"
	@printf '%b\n' "  make install          - Instala todas as dependências"
	@printf '%b\n' "  make dev              - Executa todos os serviços"
	@printf '%b\n' "  make setup            - Setup completo (primeira execução)"
	@printf '%b\n' "  make lint             - Executa lint em todos os módulos"
	@printf '%b\n' "  make typecheck        - Verifica tipos (frontend e mobile)"
	@printf '%b\n' "  make test             - Executa testes em todos os módulos"
	@printf '%b\n' ""
	@printf '%b\n' "  $(YELLOW)Backend:$(RESET)"
	@printf '%b\n' "  make backend-install  - Instala dependências do backend"
	@printf '%b\n' "  make backend-setup    - Configura backend (env, migrations)"
	@printf '%b\n' "  make backend-dev      - Executa o backend (porta 8000)"
	@printf '%b\n' "  make backend-test     - Executa testes do backend"
	@printf '%b\n' "  make backend-lint     - Verifica estilo (Laravel Pint)"
	@printf '%b\n' ""
	@printf '%b\n' "  $(YELLOW)Frontend:$(RESET)"
	@printf '%b\n' "  make frontend-install - Instala dependências do frontend"
	@printf '%b\n' "  make frontend-dev     - Executa o frontend (porta 5173)"
	@printf '%b\n' "  make frontend-build   - Gera build de produção"
	@printf '%b\n' "  make frontend-lint    - Verifica estilo (ESLint)"
	@printf '%b\n' "  make frontend-typecheck - Verifica tipos TypeScript"
	@printf '%b\n' ""
	@printf '%b\n' "  $(YELLOW)Mobile:$(RESET)"
	@printf '%b\n' "  make mobile-install   - Instala dependências do mobile"
	@printf '%b\n' "  make mobile-dev       - Executa o app mobile (Expo)"
	@printf '%b\n' "  make mobile-typecheck - Verifica tipos TypeScript"
	@printf '%b\n' ""
	@printf '%b\n' "  $(YELLOW)Utilitários:$(RESET)"
	@printf '%b\n' "  make clean            - Remove dependências e arquivos gerados"
	@printf '%b\n' "  make help             - Exibe esta ajuda"
