# PROJECT_STATE — memória de curto prazo

> Resumo executivo do estado real do projeto. Atualize a cada marco.
> Para o conhecimento estável e detalhado, veja `docs/project-knowledge/`.
>
> **Última atualização:** 2026-07-31

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

## 3. 🔴 BUG ABERTO — `/login` responde 500 em produção

**Estado:** não resolvido. É o único bloqueio conhecido.

- **Sintoma:** `GET /login` → 500. Todas as demais rotas respondem 200.
- **Erro (logs de runtime da Vercel):**
  `Error: require() of ES Module /var/task/node_modules/…` (o CLI trunca o nome
  do módulo; não consegui a mensagem completa).
- **Causa provável:** `firebase-admin` arrasta dependências ESM-only. O trace do
  lambda (`.next/server/app/login/page.js.nft.json`) confirma a presença de
  `node-fetch` v3 e família (`fetch-blob`, `formdata-polyfill`,
  `data-uri-to-buffer`, `web-streams-polyfill`) e `jose`.
- **Por que só o `/login`:** é a primeira rota **dinâmica** que toca o Admin SDK
  em runtime. As demais são pré-renderizadas no build.
- **Por que não aparece localmente:** `next dev`, `next build` e `next start`
  resolvem ESM e CJS sem ajuda. Reproduzi com `next start` → 200. O erro só
  existe no empacotamento serverless da Vercel.

**Tentativas já feitas:**

1. `serverExternalPackages: ["firebase-admin"]` em `next.config.ts` (commit
   `19248cf`) — ataca o alvo certo, mas **não confirmei** se o deploy que
   testei já continha esta mudança.
2. Lazy-loading do SDK web em `lib/firebase/client.ts` (commit `12fcc5f`) —
   partiu de uma hipótese **errada**: o pacote `firebase` não aparece no trace
   do lambda. Fica como boa prática (sai do bundle inicial), não como correção.

**Próximos passos sugeridos, em ordem:**

1. Confirmar qual commit está no deploy de produção (`vercel inspect` não
   mostrou o SHA; olhar no dashboard da Vercel).
2. Se o `serverExternalPackages` já estiver no ar e o erro persistir, obter a
   mensagem **completa** pelo dashboard (Observability → Runtime Logs) para
   saber o módulo exato.
3. Correções alternativas: adicionar os pacotes ESM ao `serverExternalPackages`,
   ou forçar `runtime = "nodejs"` explícito na rota, ou fixar `node-fetch` em
   v2 via `overrides` no `package.json`.

---

## 4. Estado da infraestrutura

| Item | Estado |
|---|---|
| Firestore | ✅ Provisionado, 19 coleções povoadas, 20 índices publicados |
| Firebase Auth | ✅ Habilitado. **Login verificado**: 1 usuário com claim `admin:true` e `githubLogin:lucasriboldi` |
| Firebase Storage | ❌ Não usado — exige plano Blaze. Mídia vai para o Vercel Blob |
| Vercel Blob | ✅ Store `portfolio-midia` criado e vinculado |
| Env vars (Production) | ✅ Completas, incluindo `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` |
| Env vars (Preview) | ⚠️ Sync falhou — só afeta deploys de branch |
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
- **Login em produção** — bloqueado pelo 500 do `/login`.

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
