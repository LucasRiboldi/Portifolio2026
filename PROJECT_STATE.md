# PROJECT_STATE — memória de curto prazo

> Resumo executivo do estado real do projeto. Atualize a cada marco.
> Para o conhecimento estável e detalhado, veja `docs/project-knowledge/`.
>
> **Última atualização:** 2026-08-01 (login em produção completado; CRUD e cupom
> validados; upload de áudio/vídeo implementado)

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

### 3.1 `auth/unauthorized-domain` — o obstáculo seguinte ao 500

Resolvido o 500, o `/login` de produção passou a renderizar mas o popup do
GitHub recusava com `Firebase: Error (auth/unauthorized-domain)`.

**Correção:** Console → Authentication → Settings → Authorized domains →
adicionar `portifolio2026-two.vercel.app`. Efeito imediato, sem redeploy, sem
código.

**Consequência que fica:** login **não funciona em preview** e não há como
pré-autorizar — cada preview ganha URL com hash único. Validação de `/admin`
acontece em produção ou em `localhost`.

> Explicação completa (por que a lista não é acessível por API, o que decorre
> disso e qual a saída se incomodar): **`docs/project-knowledge/auth.md` §6.1**.

---

## 4. Estado da infraestrutura

| Item | Estado |
|---|---|
| Firestore | ✅ Provisionado, 19 coleções povoadas, 20 índices publicados |
| Firebase Auth | ✅ Habilitado. **Login verificado em produção** (01/08/2026) — fluxo OAuth completo, não só a rota respondendo |
| Domínios autorizados (Auth) | ✅ `portifolio2026-two.vercel.app` acrescentado em 01/08. Ver seção 3.1 — previews continuam de fora, por construção |
| Firebase Storage | ❌ Não usado — exige plano Blaze. Mídia vai para o Vercel Blob |
| Vercel Blob | ✅ Store `portfolio-midia` criado e vinculado. Autentica por **OIDC** (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`) por padrão; o token estático é fallback e só ele serve para upload direto de vídeo |
| Env vars (Production) | ✅ Completas, incluindo `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` |
| Env vars (Preview) | ✅ 10 variáveis definidas em 31/07 (Firebase cliente + Admin SDK + `ADMIN_GITHUB_LOGIN`). Falta só `BLOB_READ_WRITE_TOKEN` |
| CI (GitHub Actions) | ✅ Dois jobs em paralelo: `build` (`tokens:check`, lint, unitários, build) e `integration` (emulador do Firestore, 21 casos). O de integração entrou em 01/08 e passou no primeiro run |
| Protection Bypass | ✅ Ligado em 31/07 para permitir testar previews por `curl` |
| Projeto Supabase antigo | ⚠️ No ar como rede de segurança, mas **conferido em 01/08: seguro apagar** — 0 URLs do Supabase em 170 documentos do Firestore, nenhuma dependência instalada |

---

## 5. Verificado x não verificado

**✅ Login completo em produção** (01/08/2026), depois de autorizar o domínio
(seção 3.1). Valida a cadeia inteira — popup → ID token → `verifyIdToken` → id
numérico do provider → API do GitHub → allowlist → custom claim → session
cookie.

**✅ CRUD pelo painel** (01/08). Edição em `/admin` apareceu no site público e
persistiu. Prova três coisas de uma vez: a escrita chega ao Firestore, o
`revalidateTag` da Server Action funciona, e **o site lê do banco, não do seed**
— era a dúvida em aberto do item 6, insolúvel por observação porque banco e
`src/data` têm conteúdo idêntico. Só uma escrita cria o discriminador.

**✅ Cupom público do jornal** (01/08). Formulário de `/anfitriao` chega em
`/admin/messages`.

**Ainda não exercido:**

- **Upload de mídia.** O de imagem nunca foi executado. Áudio, vídeo e PDF
  eram impossíveis até 01/08 (ver seção 9) e o caminho novo **não foi testado
  no ar** — build e testes passam, o que não é a mesma coisa.
- **Gatilho do Prophet Wire em produção** — `CRON_SECRET` está vazio. A lógica
  já foi exercitada contra Firestore real em 01/08 (persistência, dedup pelo
  hash no banco, histórico e o portão fechado): falta só a variável de ambiente
  e um disparo verdadeiro.
- **Login em preview** — impossível por construção, ver seção 3.1.

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
npm run test:unit      # 580 testes
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

1. **Chave de conta de serviço do Firebase não rotacionada** e token da Vercel
   ainda válido nesta máquina. Higiene de credencial pendente.
2. Projeto Supabase antigo ainda ativo (rede de segurança).
3. `BLOB_READ_WRITE_TOKEN` ausente no ambiente **Preview** — falta marcar o
   ambiente na conexão do store, não caçar o token. Sem ele, só o upload de
   **vídeo** cai (token de cliente não sai por OIDC); imagem, áudio e PDF
   sobem. Impacto baixo: sem login em preview, não há painel de onde subir.
4. Actions do CI declaram Node 20 (forçado para 24 pelo runner). Aviso hoje,
   falha quando o suporte cair.
5. CSP com `unsafe-inline` em `script-src`.

Os débitos 1 a 3 e o 5 da lista anterior foram fechados em 31/07 e 01/08
(`/login` 500, env do preview, warning de lint, coleções vazias do arcano).

---

## 9. Upload de mídia — áudio e vídeo (01/08/2026)

Commit `dcf22af`. Eram **dois bugs distintos** sob o mesmo sintoma aparente.

**Áudio:** `type: "media"` era genérico — os 11 campos (capa, pôster, imagem,
áudio, vídeo) usavam o mesmo picker só-imagem, e o validador só conhecia os
cinco formatos de imagem. `FieldConfig` ganhou `accept: MediaClass[]`, e
`validateMedia` recusa espécie fora do declarado. Sem essa segunda metade, o
fix abriria outro buraco: salvar um mp3 no campo "Imagem de capa".

**Vídeo:** o erro `An unexpected response was received from the server` **não
vinha do validador** — é o `bodySizeLimit` do Next estourando, com o arquivo
nem chegando à Server Action. Liberar o formato mp4 não teria resolvido nada.
Vídeo agora sobe direto do navegador para o Blob via `api/admin/blob-upload`.

**Trade-off assumido, documentado na rota:** no caminho direto não há como
conferir magic bytes — o arquivo não passa pelo nosso servidor. Resta o
allowlist de content-type, declarado pelo cliente. Aceitável porque só quem
passa por `isAdmin()` recebe token, e o modelo de ameaça do upload é "arquivo
hostil de terceiro". **Imagem e áudio seguem pela Server Action justamente para
não abrir mão da validação por conteúdo** — não unifique os dois caminhos sem
entender o que se perde.

Tetos por espécie (`lib/admin/media-accept.ts`): imagem 5 MB, áudio 25 MB,
PDF 25 MB, vídeo 200 MB. A espécie `document` entrou em 01/08 (`a338a25`) para
o campo "Arquivo" dos materiais, que era o último `type: "media"` sem `accept`. O `bodySizeLimit` foi de 6mb para 26mb para caber o áudio —
**mexer no teto de áudio exige mexer nele junto**.
