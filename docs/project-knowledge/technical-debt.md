# Débito técnico

> Ordenado por prioridade. Ao resolver um item, remova-o daqui e registre a
> mudança no commit — lista que só cresce vira ruído.
>
> Aqui fica o **débito estrutural** (o que o código carrega). O backlog
> acionável, com passo a passo, é o `NEXT_STEPS.md` — credenciais a rotacionar,
> conteúdo a repor e validações pendentes moram lá, não aqui.
>
> **Revisado em:** 2026-08-27 (segunda varredura do dia) — login em preview
> fechado e dois débitos do Prophet Wire resolvidos. Ver "Resolvidos".
>
> **Nenhum arquivo do `src/` passa de 500 linhas.** O `anfitriao/page.tsx`,
> que tinha 737, foi partido em três em 13/08 — extração pura, com o HTML
> servido conferido por hash antes e depois. `PLAN.md`, `P4`.
>
> Os contrastes "inconclusivos" do `/criativo` foram medidos por amostragem de
> pixel em 13/08 e **não eram defeito**: falso positivo do próprio medidor.
> `PLAN.md`, `P2`.

---

## 🟡 Melhorias

### 1. `image-resolver` hotlinka imagens da fonte

O navegador do leitor revela o IP ao domínio de origem da notícia. Reservir as
imagens (agora há Vercel Blob) resolveria — está anotado no próprio arquivo.

### 2. `verifySession` consulta o Admin SDK a cada request autenticado

São **duas** idas ao Admin SDK por request (`verifySessionCookie` e a leitura do
usuário), necessárias para ler claims sempre atualizadas. O `cache()` do React
deduplica dentro do mesmo request, não entre requests. Aceitável num painel de
um usuário; se o volume crescer, cachear por curta janela.

### 3. `mapearUsosDeMidia` relê o banco a cada exclusão

Lê todas as coleções declaradas para responder "este arquivo está em uso?".
São ~170 documentos e roda só no painel, então hoje não incomoda.

Se um dia incomodar, a saída **não é cachear** — é gravar o vínculo na hora em
que a URL entra no documento, em vez de descobri-lo depois. Não faça antes de
doer: o índice derivado é o que não pode dessincronizar.

### 4. CSP com `unsafe-inline` em `script-src`

Compromisso de um CSP por header, sem nonce por request. Um CSP estrito exigiria
middleware em todas as rotas. Registrado no próprio `next.config.ts`.

> **Lembrete que já custou caro:** o CSP faz parte do caminho do upload de
> mídia. Foi ele que bloqueou o PUT direto ao Blob em 04/08, sem erro na tela —
> só no console do navegador. Ao mexer em mídia, olhe o `next.config.ts`.

---

## 🔵 Higiene

### 5. Projeto Supabase antigo ainda no ar

Mantido como rede de segurança durante a migração. **Conferido em 01/08 e
reconferido em 04/08: seguro apagar** — zero dependências instaladas e 0 URLs do
Supabase em 170 documentos do Firestore; o que sobra é conteúdo editorial
(snippets, ADRs, tags).

O código morto que sobrava já saiu (12/08): `scripts/fix-criativo-covers.mjs`
foi apagado, e `scripts/setup-structure.mjs` deixou de recriar
`src/lib/supabase`. Falta só desligar o projeto lá.

### 6. Convenção de idioma mista na camada de dados

Funções novas em português (`buscarLinhas`), antigas em inglês
(`listContactMessages`). Não vale refatorar só por isso; padronize ao tocar em
cada módulo. Um varredão produz diff enorme, sem comportamento novo, que
atrapalha o `git blame` do resto.

---

## Resolvidos (2026-07-31 a 2026-08-05)

Registrados aqui só para que ninguém os reabra por engano. O relato completo de
cada um está no `PROJECT_STATE.md`.

| Era | O que era | Como fechou |
|---|---|---|
| 🔴 Crítico | `/login` respondia 500 em produção | `jwks-rsa` fazia `require()` de ESM. `overrides` fixando `jose ^5.10.0` no `package.json`. `/login` responde 200 |
| 🟠 | Nenhum fluxo de escrita exercido | Login, CRUD, cupom público e upload de mídia verificados em produção (01/08 e 05/08) |
| 🟠 | Sem CI | `.github/workflows/ci.yml` — `build` (tokens, lint, 667 unitários, build, 13 de fumaça) e `integration` em paralelo |
| 🟠 | Sem teste de integração da camada de dados | `tests-integration/`, 21 casos contra o emulador do Firestore |
| 🟠 | Env do Preview não sincronizado | 10 variáveis definidas em 31/07. Falta só o token do Blob, que virou o item 1 |
| 🟡 | `admin_allowlist` era coleção órfã | Removida do `lib/firebase/schema.ts` em 31/07 |
| 🟡 | Coleções do arcane permanentemente vazias | As quatro páginas estão no ar com 12 documentos. O conteúdo é rascunho a reescrever — virou `NEXT_STEPS.md` item 3 |
| 🟡 | Warning de lint em `use-mouse-parallax.ts` | `ref` declarado nas dependências, com o porquê no comentário |

## Resolvidos (2026-08-27)

| Era | O que era | Como fechou |
|---|---|---|
| 🟡 | 4 dependências instaladas e nunca importadas: `@hookform/resolvers`, `ai`, `radix-ui`, `react-hook-form` (resíduo da migração para `@base-ui/react` + `FormData` nativa) | `npm uninstall` — 79 pacotes a menos na árvore (inclui as transitivas do `radix-ui`) |
| 🟠 | `postcss` (leitura de `.map` arbitrário) e `sharp` (CVEs do `libvips`, severidade alta) vulneráveis | `npm audit fix`, sem breaking change. `test:unit` (667) e `build` verdes depois |
| 🟢 | README citava `Radix / Base UI` e `React Hook Form` na Stack — desatualizado desde a migração para Base UI puro | Linha da Stack corrigida em `README.md` |
| 🟡 | `uuid < 11.1.1` (moderado) via `teeny-request` → `@google-cloud/storage` → `firebase-admin` | `overrides` no `package.json` (mesmo padrão do `jose`/`jwks-rsa`) força `uuid ^11.1.1` sem tocar a versão do `firebase-admin`. `npm audit` → 0 vulnerabilidades. `test:unit` e `build` verdes depois |
| 🟢 | "Actions do CI declaram Node 20" — item desatualizado; `ci.yml` já declara `node-version: 22` desde o commit `452cac4`, este documento não tinha sido atualizado | Item removido, sem mudança de código necessária |
| 🟠 | `BLOB_READ_WRITE_TOKEN` ausente no ambiente Preview do Vercel | `vercel env add` — token copiado do `.env.local`, adicionado ao ambiente Preview. `vercel env ls` confirma presença |
| 🟠 | Login em preview impossível por construção (cada preview tem URL com hash único, sem curinga na allowlist do Firebase) | Branch fixa `preview` + alias estável na Vercel, autorizado uma vez no Firebase Console. Login e upload de mídia validados fim a fim contra esse domínio. Detalhes em `PROJECT_STATE.md` §3.1 e §5, `docs/project-knowledge/auth.md` §6.1 |
| 🟡 | `gmt-games` e `plaid-hat` desligadas no Prophet Wire por "sem `<item>`/`<entry>`" | `gmt-games` tinha RSS de verdade atrás de um link não notado na home; `plaid-hat` ganhou extractor próprio. De quebra, corrigido bug real no parser: `<link>` relativo em feed nunca era resolvido contra a URL da fonte. `ravensburger` e `spiel-essen` reclassificadas para "quebrado na origem" (site reestruturado / sem data em lugar nenhum) — não é falta de extractor. `NEXT_STEPS.md` item 7 |
