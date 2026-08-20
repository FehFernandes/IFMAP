# Política de Segurança

## Versões Suportadas

| Versão | Suportada |
|--------|:---------:|
| 1.0.x  | Sim       |

## Reportando uma Vulnerabilidade

Se você descobrir uma vulnerabilidade de segurança no IFMap, **por favor, NÃO abra uma issue pública**.

### Como Reportar

1. Envie um e-mail para os mantenedores do projeto (ou use o recurso de [Security Advisories](https://docs.github.com/en/code-security/security-advisories) do GitHub)
2. Inclua o máximo de detalhes possível:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se houver)

### O Que Esperar

- **Confirmação** de recebimento em até **48 horas**
- **Avaliação inicial** em até **7 dias**
- **Correção** será priorizada conforme a severidade
- Você será **creditado** na correção (a menos que prefira anonimato)

### Práticas de Segurança do Projeto

- **Nunca faça commit de chaves de API, tokens ou credenciais** no repositório
- Variáveis sensíveis devem ser configuradas via arquivos `.env` (não versionados)
- O arquivo `.env.example` contém apenas placeholders, nunca valores reais
- Revise o `.gitignore` antes de fazer push para garantir que dados sensíveis não sejam incluídos

## Limitações Conhecidas

A autenticação atual do IFMap é uma implementação **simplificada**, adequada ao
ambiente de desenvolvimento. Antes de expor a API na internet, esteja ciente de que:

- O token devolvido pelo `POST /api/login` é um `base64(id|timestamp|email)`
  **sem assinatura e sem expiração** — ele pode ser forjado por quem conhecer o
  ID e o e-mail de um usuário.
- Os endpoints de escrita (`POST`, `PUT`, `DELETE`) **não exigem autenticação**.
- O `POST /api/logout` não invalida o token no servidor.

Recomendação: migrar para [Laravel Sanctum](https://laravel.com/docs/sanctum) e
proteger as rotas de escrita com o middleware `auth:sanctum`. O detalhamento
está em [`docs/api.md`](docs/api.md#limitações-conhecidas).

Essas limitações são conhecidas e documentadas — **não é necessário reportá-las
como vulnerabilidade**. Contribuições que as resolvam são muito bem-vindas.

## Escopo

Esta política se aplica a vulnerabilidades encontradas em:

- Backend (API Laravel)
- Frontend (Painel Admin React)
- App Mobile (Expo/React Native)
- Infraestrutura (Docker, CI/CD)

Agradecemos a colaboração para manter o IFMap seguro.
