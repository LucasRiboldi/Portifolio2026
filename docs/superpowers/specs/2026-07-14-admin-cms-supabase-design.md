# Painel Admin + CMS (Supabase) — Design

**Data:** 2026-07-14 · **Autor:** Lucas Riboldi (via Claude Code)
**Status:** Aprovado para implementação

## Objetivo

Transformar o portfólio "3 realms" (creative / developer / arcane) — hoje com
conteúdo 100% estático em `src/data/*.ts` — num site controlável por um **painel
admin** protegido por **GitHub OAuth**, com backend **Supabase** (Postgres + Auth
+ Storage) e atualização instantânea via **ISR on-demand**.

Os *realms* permanecem intactos: o admin controla dados e configuração, não a
engine de metamorfose.

## Decisões (do brainstorming)

| Tema | Decisão |
|---|---|
| Escopo | Conteúdo + Realms/aparência + Config/contato + Mídia (CMS completo) |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| Login | GitHub OAuth, **admin único** via allowlist |
| Frescor | ISR estático + `revalidateTag` on-demand ao salvar |

## Princípio de resiliência

Os dados estáticos atuais continuam no repo como **seed + fallback**. Cada repo
(`getProjects()`, etc.) tenta o Supabase; se `NEXT_PUBLIC_SUPABASE_URL` não estiver
definido, retorna o fallback estático. Consequência: o build permanece verde e o
site funciona em cada fase, mesmo antes de o Supabase ser conectado.

## Arquitetura de dados

### Tabelas (espelham os tipos existentes)

- **projects** — `id uuid`, `title`, `description`, `category` (`design|code|art|image`),
  `tags text[]`, `cover_image`, `href`, `featured bool`, `published bool`, `sort int`,
  `created_at`, `updated_at`.
- **posts** — `id uuid`, `slug unique`, `title`, `excerpt`, `date`, `reading_minutes`,
  `tags text[]`, `accent` (`magenta|cyan|lime|violet`), `body md`, `published bool`,
  timestamps.
- **skills** — `id uuid`, `name`, `command`, `description`, `category`
  (7 valores do enum atual), `sort`.
- **tools** — `id uuid`, `name`, `description`, `type`
  (`webapp|cli|extension|bot|script|plugin`), `stack text[]`, `emoji`, `demo_url`,
  `github_url`, `sort`.
- **site_config** — linha única (`id = 'default'`): `name`, `title`, `description`,
  `github`, `linkedin`, `email`, `location`, `og_*` (SEO).
- **realms** — `id` (`creative|developer|arcane`), `label`, `glyph`, `enabled bool`,
  `is_default bool`, `morph_label`, `aria`, `arcane_content jsonb` (masthead/artigos
  do Arcane, quando `id='arcane'`).
- **contact_messages** — `id uuid`, `name`, `email`, `message`, `read bool`,
  `created_at`.

Enums de rótulo/cor que são pura apresentação (`SKILL_CATEGORY_META`, `TOOL_COLORS`,
`TOOL_LABELS`, `REALM_ORDER`) permanecem no código — não vão pro banco.

### RLS (Row Level Security)

- **Leitura pública (anon):** apenas linhas `published = true` de projects/posts;
  skills/tools/site_config/realms lidas livremente (não são sensíveis).
- **Escrita:** somente `role = authenticated` **e** `auth.jwt()->>'user_name'`
  (ou email) na allowlist do admin. `contact_messages`: `insert` anônimo permitido
  (formulário público), `select/update` só admin.
- **service_role** (server-only) ignora RLS para operações administrativas do seed.

## Clientes Supabase (`src/lib/supabase/`)

- `client.ts` — browser client (`@supabase/supabase-js`, anon key).
- `server.ts` — server client com cookies (SSR/Server Actions/Route Handlers).
- `admin.ts` — service-role client (**nunca** importado em código client).
- `types.ts` — tipos gerados/curados das tabelas.

## Camada de repositórios (`src/lib/repos/`)

Funções tipadas que o site público e o admin consomem — fonte única:
`projects.ts`, `posts.ts`, `skills.ts`, `tools.ts`, `site-config.ts`, `realms.ts`,
`messages.ts`. Cada leitura pública usa `unstable_cache` com `tags: ['projects']`
etc. Fallback para o seed estático quando o Supabase não está configurado.

## Autenticação (GitHub OAuth)

- Provider GitHub no Supabase Auth.
- **`/login`** — tela reaproveitando o pattern `design-system/patterns/login`,
  botão "Entrar com GitHub".
- **`/auth/callback`** — Route Handler que troca o code por sessão (cookies).
- **Allowlist:** `ADMIN_GITHUB_LOGIN` (ex.: `LucasRiboldi`). `lib/auth/is-admin.ts`
  valida a sessão contra a allowlist. Quem loga fora da allowlist vê "sem acesso".
- **`middleware.ts`** protege `/admin/:path*` (redireciona a `/login`). Toda Server
  Action revalida `requireAdmin()` server-side (defesa em profundidade).

## Painel `/admin`

- `admin/layout.tsx` — sidebar + guard. Fora do grupo `(site)` (sem navbar/realms).
- **Seções:**
  - `admin/page.tsx` — dashboard (contadores, mensagens não lidas).
  - `admin/projects`, `admin/posts`, `admin/skills`, `admin/tools` — lista + form
    (create/edit/delete, toggle `published`/`featured`, reordenar por `sort`).
  - `admin/realms` — realm padrão, enable/disable, textos de morph, editor do
    conteúdo Arcane (masthead + artigos).
  - `admin/site` — identidade, socials, SEO/OG.
  - `admin/messages` — inbox do contato (marcar lido).
  - `admin/media` — upload pro Storage, galeria, copiar URL.
- **Forms:** `react-hook-form` + `zod` (schemas em `src/lib/validation/`),
  componentes `sv-input`/`sv-choice`/shadcn já existentes.
- **Mutações:** Server Actions em `src/app/admin/**/actions.ts`; cada uma faz
  `requireAdmin()` → escreve → `revalidateTag(...)`.

## Mídia (Supabase Storage)

Bucket `public-media`. Upload no admin devolve URL pública usada em `cover_image`
(projects) e capas de galeria. Validação de tipo/tamanho no server.

## Contato

`api/contact/route.ts` passa a **inserir em `contact_messages`** (além do e-mail via
Resend já existente). Falha no e-mail não impede a persistência.

## ISR / revalidação

Páginas públicas: `export const revalidate = false` + leitura via `unstable_cache`
com tags. Cada Server Action de escrita chama `revalidateTag('<entidade>')` →
propagação em segundos, sem redeploy.

## Segurança (checklist)

- Service-role key só no server (`admin.ts`), nunca em bundle client.
- Allowlist de admin obrigatória; middleware + guard por action.
- RLS ativa em todas as tabelas.
- Zod valida toda entrada no boundary (actions, route de contato, uploads).
- Sem segredos commitados; `.env.local` no gitignore; `.env.example` documentado.

## Variáveis de ambiente (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_GITHUB_LOGIN=LucasRiboldi
RESEND_API_KEY=            # já usado pelo contato
CONTACT_TO_EMAIL=
```

## Setup manual (só o dono pode fazer — fora do código)

1. Criar projeto no Supabase; copiar URL + anon key + service-role key.
2. Rodar as migrations SQL (`supabase/migrations/`) e o seed.
3. Criar GitHub OAuth App (callback `https://<supabase>/auth/v1/callback`);
   habilitar provider GitHub no Supabase com client id/secret.
4. Preencher `.env.local` (dev) e as env vars na Vercel (prod).

## Fases de implementação

1. **Fundação** — deps de auth SSR, clientes Supabase, `.env.example`, migrations
   + seed, tipos.
2. **Repos + fallback** — camada de repositório; site público lê dela (sem mudança
   visual).
3. **Auth** — `/login`, callback, allowlist, middleware, guard.
4. **Admin shell** — layout, sidebar, dashboard.
5. **CRUD conteúdo** — projects/posts/skills/tools + actions + revalidate.
6. **Realms / site / mídia / inbox** — seções restantes; contato grava mensagem.
7. **Verificação** — build, lint, smoke test das rotas, docs atualizadas.

## Fora de escopo (YAGNI)

Multiusuário/roles, rascunho com versionamento, editor WYSIWYG rico, i18n do admin,
analytics próprio (já há Vercel Analytics).
