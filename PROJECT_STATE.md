# PROJECT_STATE — memória de curto prazo

> Resumo executivo do estado real do projeto. Atualize a cada marco.
> Para o conhecimento estável e detalhado, veja `docs/project-knowledge/`.
>
> **Última atualização:** 2026-08-14, no fecho do `P9`. O bloqueio do upload de
> mídia **caiu**: verificado fim a fim em 05/08 (seção 5).
>
> **Nenhum bug de código aberto.** O `P9` fechou em 14/08 e o diagnóstico
> anterior estava errado nos dois pontos: o `IntersectionObserver` de
> `home-motor.tsx` **funciona** (0 → 18 alvos revelados ao rolar, medido em
> navegador que compõe quadros), e o culpado **era** o CSS. Ver `PLAN.md` `P9`.
>
> O que falta é conteúdo e higiene de credencial. O `PLAN.md` guarda
> o que foi medido na empreitada, inclusive as suspeitas que **não** viraram
> defeito — leia antes de reabrir investigação.

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
`src/data/dev/*` são **conteúdo editorial** (devlogs narrando a construção,
lista de habilidades) — preservadas de propósito. O `STACK` que a home do
`/desenvolvedor` exibia em chips saiu na reescrita da abertura (05/08/2026):
o hero virou apresentação pessoal + manifesto, sem linha de tecnologias.

Detalhes completos: `docs/project-knowledge/migrations/supabase-to-firebase.md`.

---

## 2.1 Home do `/desenvolvedor` — reescrita em 05/08/2026

De índice de acervo para apresentação pessoal. O hero virou "Olá, eu sou Lucas
Riboldi" + manifesto (§01 `readme.md`) e quatro princípios (§02).

**Saíram da home a pedido:** Estudando agora (Java), Snippets, Certificações,
Lendo agora, Devlog, Stack em movimento (demo GSAP) e Explorar. Seis dos sete
continuam alcançáveis nas rotas próprias (`/java`, `/codigo`, `/estante`) e
pelo dock.

**Duas consequências registradas, não escondidas:**

1. **`devlogs` ficou órfão por algumas horas e já foi resolvido.**
   `tests/admin-integridade.test.ts` acusou; a saída foi dar rota própria —
   `/desenvolvedor/devlog` (linha do tempo) e `/devlog/[slug]` (texto inteiro
   em markdown, com navegação anterior/próxima). O leitor `getDevlogs` passou
   a cair no seed de `src/data/dev/devlogs.ts` quando não há nada publicado:
   faixa vazia some, PÁGINA vazia quebra a promessa de funcionar sem backend.
   `ORFAOS_CONHECIDOS` voltou a ficar vazia.
2. **A demo do GSAP foi removida.** `gsap-demo.tsx` saiu, e com ele as barras
   de proporção que só ela usava (`.dv-bars` e irmãs, em `dev-hud.css`). Os
   catálogos do guia de design system (`realm-motion.ts`, `realms.ts`) que a
   listavam passaram a descrever o motor de movimento da home no lugar dela.
   `@/design-system/gsap` **fica**: sete outros componentes (comic, criativo,
   scroll suave) dependem dele.

**Zonas novas:** Bancada (projetos + experimentos + ferramentas intercalados),
Radar reformulado (3 manchetes, prioridade a fontes em português — TabNews e
`braziliandevs` do Dev.to, com Hacker News só de reserva), Pulso do
repositório (commits e atividade lidos da API do GitHub) e Console (terminal
navegável). Selo de versão no hero, alimentado por release → tag →
`package.json`.

**Movimento:** `MotorDeMovimento` (`components/dev/home-motor.tsx`) é um único
componente de cliente que enriquece o HTML do servidor — entrada por rolagem,
contadores e holofote do cursor. O repouso é o estado VISÍVEL: sem JS ou com
`prefers-reduced-motion`, a página aparece inteira e parada.

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
| Vercel Blob | ✅ **Grava e serve** — verificado fim a fim em 05/08 (seção 5). O 404 registrado em 01/08 era referência pendurada no Firestore, não falha de escrita. Autentica por **OIDC** (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`) por padrão; o token estático é fallback e só ele serve para upload direto do navegador |
| Env vars (Production) | ✅ Completas, incluindo `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` |
| Env vars (Preview) | ✅ 10 variáveis definidas em 31/07 (Firebase cliente + Admin SDK + `ADMIN_GITHUB_LOGIN`). Falta só `BLOB_READ_WRITE_TOKEN` |
| CI (GitHub Actions) | ✅ Dois jobs em paralelo: `build` (`tokens:check`, lint, **667 unitários**, build, **13 de fumaça**) e `integration` (emulador do Firestore, 21 casos). Integração e fumaça entraram em 01/08 |
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

**✅ Upload de mídia, fim a fim** (05/08). Um mp4 de **9,19 MB** sobe pelo
painel e toca na videoteca (45 s, 720×1280), sem erro de CSP no console.
Imagem, áudio e PDF também. Eram **três** defeitos independentes, os três
fechados em 04–05/08:

1. `/admin/media` apagava arquivo em uso sem avisar — o 404 de 01/08 era
   referência pendurada, não falha de escrita. Guardado por
   `lib/admin/media-refs.ts`.
2. A plataforma corta o corpo do request em ~4,5 MB e `SERVER_ACTION_LIMIT`
   valia 25 MB. Arquivo acima de 4 MB agora sobe direto ao Blob.
3. **O CSP bloqueava o upload direto** — `connect-src` não listava o Vercel
   Blob, então o navegador recusava o PUT (barra travada em 0%, sem erro na
   tela). `media-src` também faltava, e teria bloqueado a reprodução.

**A lição:** os testes unitários não pegaram nenhum dos três, porque todos
param na borda do nosso código. E o sintoma ("o arquivo não chega") apontava
para o armazenamento, enquanto o culpado estava no `next.config.ts` — quando um
upload trava sem erro na tela, **o console do navegador é o primeiro lugar a
olhar**.

**Ainda não exercido:**

- **Gatilho do Prophet Wire em produção.** O caminho feliz foi provado em 05/08,
  mas contra o **build local** com um `CRON_SECRET` de teste: portão fechado
  (401 sem segredo), pipeline rodando, persistência, histórico e **dedup
  conferido por hash** (46 documentos, 46 hashes distintos). Falta o disparo
  contra o deploy — comando em `NEXT_STEPS.md` item 6.
- **Cobertura das fontes do Prophet Wire.** A auditoria de 05/08 levou o
  relatório a `errors: 0`, ao preço da cobertura: a maior parte das 24 fontes
  segue desligada, cada uma com motivo e data em `lib/prophet-wire/sources.ts`.
  Ver `NEXT_STEPS.md` item 7.
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
npm run test:unit      # 667 testes (sem rede, sem credencial)
npm run test:smoke     # sobe o build e confere os portoes
npm run test:integration  # emulador do Firestore (precisa de JDK 21)
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
   ambiente na conexão do store, não caçar o token. Sem ele cai o upload
   **direto** (todo arquivo acima de 4 MB, não só vídeo — o token de cliente
   não sai por OIDC); abaixo disso passa pela Server Action e sobe. Impacto
   baixo: sem login em preview, não há painel de onde subir.
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
