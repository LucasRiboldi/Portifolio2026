# PROJECT_STATE — memória de curto prazo

> Resumo executivo do estado real do projeto. Atualize a cada marco.
> Para o conhecimento estável e detalhado, veja `docs/project-knowledge/`.
>
> **Última atualização:** 2026-07-31 (bug do /login fechado; itens 6, 7, 10 e 12)

---

## 1. O que é

Portfólio pessoal em Next.js 15 (App Router) com um CMS próprio em `/admin`.
O site funciona **com ou sem backend**: sem credenciais, os repositórios caem no
conteúdo versionado em `src/data/*.ts`. O CMS "liga" quando o Firebase é
configurado.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind 3 · Firebase
(Firestore + Auth) · Vercel Blob (mídia) · Vercel (hospedagem).

---

## 2. Status da migração Supabase → Firebase

**Concluída no código.** 10 commits, de `7f97a9e` a `12fcc5f`.

| Área | Antes | Agora |
|---|---|---|
| Banco | Postgres/Supabase | Firestore (29 coleções) |
| Auth | Supabase Auth (redirect) | Firebase Auth GitHub (popup + session cookie) |
| Mídia | Supabase Storage | Vercel Blob |
| Regras | 63 RLS policies | `firestore.rules` + `requireAdmin()` |

**Zero dependências do Supabase restantes.** As menções que sobram em
`src/data/dev/*` e no `STACK` de `/desenvolvedor` são **conteúdo editorial**
(devlogs narrando a construção, lista de habilidades) — preservadas de
propósito.

Detalhes completos: `docs/project-knowledge/migrations/supabase-to-firebase.md`.

---

## 3. ✅ RESOLVIDO — `/login` respondia 500 em produção

Corrigido e **verificado em produção** em 31/07/2026 (commit `634f3f5`).
`curl` em `/login` devolve 200 e a página renderiza o botão "Entrar com GitHub".

**Causa real:** `jwks-rsa@4.1.0`, dependência do `firebase-admin`, é
`type: commonjs` e faz `require('jose')` na linha 1 de `src/utils.js` — mas
declara `jose ^6.1.3`, e o jose 6 é ESM puro (o mapa de exports só tem
`default` → `dist/webapi/`, sem condição `require`). O pacote é internamente
inconsistente.

**Por que passava local e quebrava na Vercel:** não era diferença de código nem
de env — era de **carregador de módulos**. O Node 22+ suporta `require()` de ESM
nativamente; a função serverless da Vercel é empacotada e carregada por um shim
(`/opt/rust/nodejs.js` no stack trace) que não implementa esse suporte.

**Correção:** `overrides` no `package.json` prendendo o jose do jwks-rsa na v5,
a última com build CommonJS. `importJWK` e `exportSPKI` — as duas funções que o
jwks-rsa usa — existem nela.

**As duas hipóteses anteriores estavam erradas** e ficam registradas para não
serem repetidas: `serverExternalPackages: ["firebase-admin"]` (commit `19248cf`)
não resolveu — o deploy que o continha seguia dando 500; e o lazy-loading do SDK
web (commit `12fcc5f`) partiu de premissa falsa. `node-fetch` nunca foi o
culpado.

**Como foi provado:** dois previews com a mesma base, só o `overrides` variando
— sem ele `/login` → 500, com ele → 200. Uma correção sem esse controle é
suposição.

**Descoberta lateral:** o `node_modules` local estava defasado — nem
`firebase-admin` nem `jwks-rsa` estavam instalados. A migração veio por
`git pull` e ninguém rodou `npm install`. Foi isso que escondeu o bug do
ambiente local.

---

## 4. Estado da infraestrutura

| Item | Estado |
|---|---|
| Firestore | ✅ Provisionado, 19 coleções povoadas, 20 índices publicados |
| Firebase Auth | ✅ Habilitado. **Login verificado**: 1 usuário com claim `admin:true` e `githubLogin:lucasriboldi` |
| Firebase Storage | ❌ Não usado — exige plano Blaze. Mídia vai para o Vercel Blob |
| Vercel Blob | ✅ Store `portfolio-midia` criado e vinculado |
| Env vars (Production) | ✅ Completas, incluindo `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` |
| Env vars (Preview) | ✅ 10 variáveis definidas em 31/07 (Firebase cliente + Admin SDK + `ADMIN_GITHUB_LOGIN`). Falta só `BLOB_READ_WRITE_TOKEN` |
| CI (GitHub Actions) | ✅ `tokens:check`, lint, **testes** e build em push/PR para `main`. O passo de testes entrou em 31/07 |
| Protection Bypass | ✅ Ligado em 31/07 para permitir testar previews por `curl` |
| Projeto Supabase antigo | ⚠️ Continua no ar como rede de segurança. Desligar quando o Firebase estiver validado |

---

## 5. Verificado x não verificado

**✅ Login funciona (local).** Em 2026-07-31 o fluxo completou: usuário criado
com `customClaims: {"admin":true,"githubLogin":"lucasriboldi"}`. Isso valida a
cadeia inteira — popup → ID token → `verifyIdToken` → id numérico do provider →
API do GitHub → allowlist → custom claim → session cookie.

**Ainda não exercido** (ver `NEXT_STEPS.md` itens 2–5):

- **CRUD pelo painel.** Nenhuma edição real foi feita pelo `/admin`.
- **Upload de mídia no Vercel Blob.** Código escrito e tipado, nunca executado.
- **Cupom público do jornal** (`/anfitriao` → `contact_messages`).
- **Gatilho do Prophet Wire** — `CRON_SECRET` está vazio.
- **Login em produção.** A página `/login` agora responde 200 e renderiza o
  botão, mas **ninguém completou o fluxo de OAuth em produção** — rota
  desbloqueada não é login verificado.

---

## 6. Decisões recentes que valem lembrar

- **Todo acesso a dados é server-side** (Admin SDK). Nenhum documento é lido
  pelo browser. Por isso `firestore.rules` nega escrita de cliente em tudo — é
  mais restritivo que a RLS anterior, e a autorização real é o `requireAdmin()`.
- **O middleware não valida sessão**, só a presença do cookie: o Admin SDK não
  roda no Edge. A verificação real está no `requireAdmin()` de cada action.
- **Campos em `snake_case` no Firestore**, iguais às colunas antigas — manteve
  intactos os mapeadores `daLinha()` de cada repo.
- **Array dentro de array não existe no Firestore.** `lib/firebase/nested.ts`
  envelopa na gravação e desenvelopa na leitura (caso real:
  `prophet_materias.boxes[].rows`).
- **`lib/firebase/schema.ts`** declara os campos de cada coleção. Substitui o
  que as migrations SQL davam ao teste de integridade do painel. **Ao
  acrescentar campo a um recurso, acrescente ali também.**

---

## 7. Comandos frequentes

```bash
npm run dev            # servidor local (porta 3000)
npm run build          # build de produção — NÃO rode com o dev server no ar
npm run test:unit      # 535 testes
npm run lint
npm run db:seed        # popula coleções vazias a partir de src/data
npm run db:sync        # insere o que falta em coleções já povoadas
npm run sync:vercel-env
npx firebase-tools deploy --only firestore --project portifolio-ac32a
```

> ⚠️ Rodar `npm run build` com o `next dev` ativo sobrescreve o `.next/` e
> quebra o dev server (404 nos chunks). Se acontecer: pare o dev,
> `rm -rf .next`, e suba de novo.

---

## 8. Débitos técnicos conhecidos

> Backlog acionável, com passo a passo: **`NEXT_STEPS.md`**.

1. **`/login` 500 em produção** — ver seção 3. Prioridade máxima.
2. Env vars do ambiente **Preview** não sincronizadas.
3. `use-mouse-parallax.ts:56` — warning de lint pré-existente (dependência
   `ref` faltando no `useEffect`).
4. Projeto Supabase antigo ainda ativo e pagando (se for plano pago).
5. `prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes` e
   `prophet_resources` estão **vazias** — sempre estiveram, inclusive no
   Postgres. Não há seed para elas.
