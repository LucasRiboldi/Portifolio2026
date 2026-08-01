# CLAUDE.md — contexto do projeto

> Leia este arquivo antes de explorar o repositório. Ele existe para você
> entender o projeto **sem reanalisar tudo**. Se algo aqui divergir do código, o
> código vence — e corrija este arquivo.
>
> Companheiros: `PROJECT_STATE.md` (estado atual, bugs abertos),
> `NEXT_STEPS.md` (backlog acionável — comece por ele se a pergunta for "o que
> falta?") e `docs/project-knowledge/` (conhecimento estável e detalhado).

---

## O que é

Portfólio pessoal de Lucas Riboldi com CMS próprio. Não é um site estático: o
conteúdo vem do Firestore e é editável em `/admin` sem redeploy.

**Princípio central:** o site funciona **com ou sem backend**. Sem credenciais,
cada repositório cai no conteúdo versionado em `src/data/*.ts`. É o que mantém o
build verde em qualquer ambiente — e o que você quebra se remover um fallback.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind 3 ·
Firebase (Firestore + Auth) · Vercel Blob (mídia) · Vitest · Vercel.

---

## Estrutura que importa

```
src/
├── app/
│   ├── (site)/        # site público (portfolio, design-system, criativo…)
│   ├── admin/         # painel — sempre dinâmico, sempre atrás de requireAdmin()
│   ├── anfitriao/     # realm "jornal" (Daily Prophet)
│   ├── desenvolvedor/ # realm dev (acervo técnico)
│   ├── auth/          # session (POST) e signout
│   └── api/prophet-wire/run/  # gatilho do agregador de notícias
├── lib/
│   ├── firebase/      # admin (Admin SDK) · client (SDK web, só auth) ·
│   │                  # query (leitura) · collection (escrita) ·
│   │                  # nested · schema · config · types
│   ├── auth/          # session (cookie) · is-admin · github · use-auth-state
│   ├── repos/         # leitores públicos, cacheados, com fallback no seed
│   ├── admin/         # CRUD genérico, seed, sync, stats, catálogo de recursos
│   └── prophet-wire/  # pipeline do agregador de notícias
├── data/              # SEED: fonte de verdade histórica do conteúdo
└── components/
```

---

## Decisões arquiteturais (não reverta sem motivo)

1. **Todo acesso a dados é server-side, via Admin SDK.** Nenhum documento é
   lido pelo browser. O SDK web serve *apenas* para o login.

2. **Por isso `firestore.rules` nega escrita de cliente em tudo.** As regras
   guardam uma porta que o app não usa. A autorização real é o `requireAdmin()`
   no topo de cada Server Action — o Admin SDK ignora Security Rules.

3. **O middleware NÃO valida sessão**, só checa a presença do cookie: o Admin
   SDK não roda no Edge Runtime. Quem decide é o `requireAdmin()`.

4. **Campos em `snake_case` no Firestore**, iguais às colunas do Postgres
   anterior. Os mapeadores `daLinha()`/`rowTo*()` de cada repo já traduziam para
   camelCase; preservar o formato os manteve intactos.

5. **Array dentro de array não existe no Firestore.** `lib/firebase/nested.ts`
   envelopa na gravação e desenvelopa na leitura. Caso real:
   `prophet_materias.boxes[].rows`.

6. **`lib/firebase/schema.ts` é a declaração de campos por coleção.** O
   Firestore é schemaless; este arquivo substitui o que as migrations SQL davam
   ao teste de integridade do painel.

---

## Restrições que causam bug se ignoradas

- **Ao adicionar campo a um recurso do `/admin`, adicione em
  `lib/firebase/schema.ts`.** `tests/admin-integridade.test.ts` falha se não.
- **Documento sem o campo ordenado some de queries com `orderBy`.** Por isso
  `criarDoc`/`gravarLote` sempre gravam `created_at`.
- **Query com filtro + ordenação exige índice composto** em
  `firestore.indexes.json`. Sem ele a query é rejeitada e o repo cai no seed
  silenciosamente — o site parece certo e o dado não aparece.
- **Nunca rode `npm run build` com o `next dev` ativo.** O build sobrescreve o
  `.next/` e o dev server passa a dar 404 nos chunks.
- **`serviceAccountKey.json` e `.env.local` nunca entram no git.**

---

## Fluxos críticos

**Leitura pública:** rota → `lib/repos/*` → `unstable_cache` (tag) →
`buscarLinhas` → Firestore. Erro ou ausência de credencial → seed de `src/data`.

**Escrita (admin):** Server Action → `requireAdmin()` → validação zod →
`lib/firebase/collection` → `revalidateTag`.

**Login:** popup GitHub (client) → ID token → `POST /auth/session` →
`verifyIdToken` → resolve o username pelo id numérico do provider (GitHub API) →
compara com `ADMIN_GITHUB_LOGIN` → custom claim + session cookie httpOnly.
**Só a conta da allowlist recebe cookie.**

---

## Comandos

```bash
npm run dev          # local, porta 3000
npm run build        # NÃO rode com o dev server no ar
npm run test:unit    # 580 testes (sem rede, sem credencial)
npm run test:smoke   # sobe o build e confere os portoes (precisa de build)
npm run test:integration  # emulador do Firestore (precisa de JDK 21)
npm run lint
npm run db:seed      # popula coleções vazias a partir de src/data
npm run db:sync      # insere o que falta em coleções já povoadas
npm run sync:vercel-env
npx firebase-tools deploy --only firestore --project portifolio-ac32a
```

---

## Como adicionar uma funcionalidade

**Novo tipo de conteúdo editável:**
1. Tipo e seed em `src/data/`.
2. Campos em `lib/firebase/schema.ts`.
3. Entrada em `lib/admin/resource-defs-*.ts` (dirige lista, formulário, zod e
   tag de cache de uma vez só).
4. Tag em `lib/repos/tags.ts`.
5. Leitor em `lib/repos/` — reaproveite `publishedReader`, não escreva query
   nova.
6. Índice composto em `firestore.indexes.json` se filtrar + ordenar.
7. Semear em `lib/admin/seed.ts` e/ou `sync-content.ts`.

**Antes de criar qualquer arquivo:** procure implementação semelhante. Os
leitores compartilham `publishedReader`; o CRUD é genérico e dirigido por
configuração. Quase nada precisa de código novo.

---

## Convenções

- Comentário explica **por que**, não o que. O código já diz o que.
- Português nos comentários e na documentação; inglês nos identificadores de
  domínio já existentes (`published`, `sort`, `slug`).
- Arquivos abaixo de 500 linhas.
- Validação em fronteira de sistema (zod nas Server Actions).
- Testes rodam sem rede e sem credencial. Se um teste depender de
  `serviceAccountKey.json`, ele está errado — injete o fake.

---

## Estado atual

Ver **`PROJECT_STATE.md`** (estado) e **`NEXT_STEPS.md`** (o que fazer).

Em 2026-07-31: login **verificado localmente** (usuário criado com claim
`admin`). **Um bloqueio aberto**: `/login` responde 500 em produção
(`require() of ES Module` no bundle serverless) — `NEXT_STEPS.md` item 1.
