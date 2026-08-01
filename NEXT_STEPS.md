# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-01

---

## Estado em uma linha

Site no ar, login funcionando em produção e **o CMS provado ponta a ponta**:
editar no painel altera o site público. O que resta é uma verificação de
upload, higiene de credencial e melhorias.

---

# 🔴 Fazer primeiro

## 1. Verificar o upload de mídia no ar

O único caminho crítico que nunca foi executado de verdade. O código de áudio e
vídeo é **novo** (commit `dcf22af`, 01/08) — build e 575 testes passam, o que
não prova que sobe arquivo.

Em `/admin`, três testes distintos, porque são **três caminhos diferentes**:

| O que | Onde | Caminho no código |
|---|---|---|
| Imagem | Biblioteca (`/admin/media`) ou qualquer campo de capa | Server Action + magic bytes |
| Áudio | Raio → campo "Áudio" | Server Action + magic bytes |
| Vídeo | Videoteca → "Editar vídeo" → campo "Vídeo" | Direto para o Blob, via `api/admin/blob-upload` |

**Pronto quando:** os três sobem, aparecem no preview do formulário, salvam, e a
mídia toca/aparece no site público.

**Se o vídeo falhar**, o erro agora deve ser legível. Os suspeitos, em ordem:
o handshake em `/api/admin/blob-upload` devolvendo 401 (sessão), ou o
`allowedContentTypes` recusando o container real do arquivo. `An unexpected
response was received from the server` **não deve mais aparecer** — se aparecer,
algo ainda está passando pela Server Action que não deveria.

**Se a imagem falhar** com "Armazenamento de mídia não configurado", o store
`portfolio-midia` não está vinculado (criar não basta).

---

# 🔑 Credenciais — higiene pendente

Anotado em 31/07, ainda por fazer. **Ordem importa**: gerar a nova credencial e
atualizá-la em todos os ambientes ANTES de invalidar a antiga — inverter a ordem
derruba o backend de produção no intervalo.

## 2. Rotacionar a chave de conta de serviço do Firebase

Console do Google Cloud → IAM → Contas de serviço → `firebase-adminsdk-fbsvc`
→ Chaves → criar nova. Depois:
- substituir o `serviceAccountKey.json` da raiz;
- atualizar `FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL` na Vercel em
  **Production E Preview** (as duas — o preview foi preenchido em 31/07 e
  apontaria para chave morta);
- redeploy e conferir `/login` → 200;
- só então apagar a chave antiga.

<details>
<summary>Como reenviar as variáveis com segurança (armadilhas do processo)</summary>

**Não dá para copiar de produção:** a Vercel marca essas variáveis como
*sensitive*. `vercel env pull` devolve o literal `[SENSITIVE]` no lugar do
valor, e o painel também não os exibe. Os valores têm de vir de fora.

**Armadilha:** `vercel link` e `vercel env pull` **sobrescrevem o `.env.local`**
sem avisar. Faça cópia antes.

**Nota sobre o script:** o `parseEnv` de `scripts/sync-vercel-env.mjs` lê linha a
linha, então só aceita a `FIREBASE_PRIVATE_KEY` em uma única linha com `\n`
escapados — há uma guarda que aborta se vier truncada. Um `.env.local` gerado
por `vercel env pull` **não** serve como entrada. Em 31/07 a chave foi enviada
direto do `serviceAccountKey.json`, escapada em memória e passada por stdin ao
CLI, sem nunca tocar o `.env.local` — que é como refazer isto com segurança.

</details>

## 3. Revogar o token de acesso da Vercel

Usado nesta máquina (https://vercel.com/account/tokens). Limpar a variável de
usuário: `setx VERCEL_TOKEN ""`. Gerar outro só quando for preciso operar o CLI.

---

# 🟠 Validação restante

## 4. Gatilho do Prophet Wire

**O que já foi provado, e o que falta.** Em 01/08 a lógica foi exercitada
contra um Firestore real (`tests-integration/prophet-wire-persistencia.test.ts`,
5 casos): acervo e histórico persistem entre execuções, a dedup reencontra o
hash **no banco** — usando duas instâncias distintas de repositório, para imitar
o cron, onde cada execução é um processo novo — e o portão recusa sem segredo.

**Falta só o que exige credencial:** a variável de ambiente e um disparo real.

**1. Gerar o segredo**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

**2. Definir `CRON_SECRET` na Vercel** (Settings → Environment Variables →
Production) e **redeployar** — variável só vale para deployment novo.

**3. Disparar**

```bash
curl -i -X POST https://<site>/api/prophet-wire/run -H "Authorization: Bearer SEU_SEGREDO"
```

**Pronto quando:** duas execuções seguidas aparecem em `/admin/prophet-wire` e a
segunda não duplica o acervo.

**Ao ler o relatório, não se assuste:** `counters.published` conta **só** itens
com status `publicado`. Como `config.publishMode` é `"rascunho"`, uma execução
perfeita reporta `published: 0` — e é esse número que o painel mostra. O sinal
de sucesso é `errors: 0` e o acervo crescendo em `/admin`, não esse contador.

Códigos: **401** = segredo errado ou variável não chegou ao deployment (a
resposta é genérica de propósito; o motivo real vai para o log do projeto).
**409** = execução concorrente — a trava é por processo, não coordena
instâncias.

**Expectativa a calibrar:** a IA ainda é o `FallbackAIClient`. Sem
`ANTHROPIC_API_KEY` o pipeline roda com o conteúdo bruto, sem resumir nem
reescrever.

---

# 🟡 Melhorias

## 5. `BLOB_READ_WRITE_TOKEN` ausente no ambiente Preview

O fluxo novo da Vercel não o cria ao conectar o store — o diálogo de conexão só
oferece `BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY`, **e nenhum dos dois é lido
pelo código**. Sem o token, só o upload de mídia recusa
(`admin/media/actions.ts`); o resto do preview funciona.

Impacto baixo, porque **login não funciona em preview de qualquer forma** (ver
`PROJECT_STATE.md` seção 3.1) — sem `/admin`, não há de onde subir mídia.

## 6. Campo `file_url` (materiais) ainda declara só imagem

É campo de PDF / print-and-play, mas `type: "media"` sem `accept` cai no padrão
imagem. Hoje não incomoda porque os três materiais estão com `null` e são
preenchidos por URL. Para permitir upload de PDF, acrescentar uma espécie
`document` em `lib/admin/media-accept.ts` — o mecanismo de `accept` por campo já
existe desde o commit `dcf22af`.

## 7. Login em preview é impossível

Cada preview da Vercel ganha URL com hash único, e o Firebase Auth exige domínio
na allowlist de *Authorized domains* — não há como pré-autorizar. Saída, se
incomodar: alias fixo de branch na Vercel, autorizado uma vez no console.
Detalhes em `PROJECT_STATE.md` seção 3.1.

## 8. Refatoração (Fase 5) — parcialmente feita

Alvos concretos que restam:
- `verifySession()` consulta o Admin SDK a cada request autenticado. Correto,
  mas cacheável por curta janela se o volume crescer.
- Convenção de idioma mista na camada de dados (`buscarLinhas` vs.
  `listContactMessages`). Padronizar ao tocar em cada módulo, não num varredão.

O primeiro alvo (blocos repetidos em `lib/admin/sync-content.ts`) saiu em
31/07 (commit `712beca`).

## 9. Reescrever o conteúdo do arcano

As quatro páginas (`/anfitriao/oficina`, `/mecanicas`, `/laboratorio` e
`/imprensa`) estão no ar com 12 documentos **escritos pelo Claude, saindo com a
sua assinatura**. Duas regras foram seguidas para que nada ali seja falso:
nenhum texto afirma histórico pessoal (playtest, tiragem, parceria) e nenhum
`file_url` aponta para arquivo inexistente. Ainda assim é rascunho — reescreva
no `/admin`.

**A armadilha que vai reaparecer:** o `db:sync` escreve no banco e **não
revalida o cache**. Publicando por linha de comando, as páginas continuam
servindo o cache antigo até um deploy novo. Pelo botão do `/admin`, não: a
Server Action chama `revalidateTag`.

---

# 🔵 Higiene

## 10. Desligar o projeto Supabase

Continua no ar como rede de segurança. Os caminhos críticos já foram validados
(login, CRUD, cupom); só o upload falta (item 1). Desligar depois dele.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

## 11. CSP com `unsafe-inline` em `script-src`

Compromisso de um CSP por header, sem nonce por request. Um CSP estrito exigiria
middleware em todas as rotas. Registrado em `next.config.ts`.

## 12. Suíte de integração não roda no CI

`npm run test:integration` sobe o emulador do Firestore e roda 21 casos —
`collection.ts`/`query.ts` e a persistência do Prophet Wire — com o motor real.
Fora do CI porque exige Java. Só roda se alguém lembrar de rodar localmente.

**Nesta máquina exige uma variável antes.** O `firebase-tools` recusa Java
abaixo de 21 (`no longer supports Java version before 21`) e o Java do PATH é o
8. Não precisa instalar nada: o Android Studio traz uma JDK 21.

```bash
JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" PATH="$JAVA_HOME/bin:$PATH" npm run test:integration
```

No PowerShell: `$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"`
e prefixe o `PATH` antes de chamar o script.

---

## Como usar este arquivo

```
"o que falta?"        → leia daqui, de cima para baixo
"resolve o item N"    → o passo a passo está no item
"terminei o item N"   → remova-o, atualize PROJECT_STATE.md
```

Contexto de apoio: `CLAUDE.md` (arquitetura e restrições),
`PROJECT_STATE.md` (estado do momento),
`docs/project-knowledge/` (conhecimento estável).
