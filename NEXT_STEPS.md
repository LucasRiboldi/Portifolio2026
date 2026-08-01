# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-01 (itens 6 e 12 fechados)

---

## Estado em uma linha

Site no ar, login funcionando em produção e **o CMS provado ponta a ponta**:
editar no painel altera o site público. O que resta é uma verificação de
upload, higiene de credencial e melhorias.

---

# 🔴 Fazer primeiro

## 1. Verificar o upload de mídia no ar

O único caminho crítico que nunca foi executado de verdade. O código de áudio e
vídeo é **novo** (commit `dcf22af`, 01/08), e o de PDF também (`a338a25`) —
build e 580 testes passam, o que não prova que sobe arquivo.

Em `/admin`, quatro testes, mas só **dois caminhos diferentes** no código:

| O que | Onde | Caminho no código |
|---|---|---|
| Imagem | Biblioteca (`/admin/media`) ou qualquer campo de capa | Server Action + magic bytes |
| Áudio | Raio → campo "Áudio" | idem |
| PDF | Imprensa (Recursos) → campo "Arquivo" | idem |
| Vídeo | Videoteca → "Editar vídeo" → campo "Vídeo" | Direto para o Blob, via `api/admin/blob-upload` |

**Pronto quando:** os quatro sobem, aparecem no preview do formulário, salvam, e a
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

**Metade já está feita.** Conferido em 01/08: a variável de usuário
`VERCEL_TOKEN` **não existe mais** nesta máquina — o CLI autentica por
credencial própria, guardada por ele. Nada a limpar aqui.

**Falta:** revogar o token antigo em https://vercel.com/account/tokens, se
ainda estiver listado. Ele não está em uso, mas continua válido até ser
revogado.

---

# 🟠 Validação restante

## 4. Gatilho do Prophet Wire

**Quase fechado.** O que já está provado, em 01/08:

| O quê | Como |
|---|---|
| Persistência e dedup entre execuções | `tests-integration/prophet-wire-persistencia.test.ts`, 5 casos contra Firestore real |
| `CRON_SECRET` definido | Preview e Production, e há deployment posterior à variável |
| Endpoint vivo e **falha fechada** | `curl` em produção: sem header → 401; segredo errado → 401 com erro genérico |

**Falta só o caminho feliz — e só você pode rodar.** O segredo está marcado
como *sensitive* na Vercel: `vercel env pull` devolve `[SENSITIVE]`, então nem
o CLI o lê de volta. Quem tem o valor é quem o gerou.

```bash
curl -i -X POST https://portifolio2026-two.vercel.app/api/prophet-wire/run -H "Authorization: Bearer SEU_SEGREDO"
```

Rode **duas vezes** e confira `/admin/prophet-wire`.

**Pronto quando:** as duas execuções aparecem no histórico e a segunda não
duplica o acervo.

**Ao ler o relatório, não se assuste:** `counters.published` conta **só** itens
com status `publicado`. Como `config.publishMode` é `"rascunho"`, uma execução
perfeita reporta `published: 0` — e é esse número que o painel mostra. O sinal
de sucesso é `errors: 0` e o acervo crescendo. Pelo mesmo motivo, disparar é
seguro: **nada vai ao ar**, tudo entra como rascunho.

**409** = execução concorrente; a trava é por processo, não coordena
instâncias.

**Expectativa a calibrar:** a IA ainda é o `FallbackAIClient`. Sem
`ANTHROPIC_API_KEY` o pipeline roda com o conteúdo bruto, sem resumir nem
reescrever.

---

# 🟡 Melhorias

## 5. `BLOB_READ_WRITE_TOKEN` ausente no ambiente Preview

**A premissa antiga estava errada** (corrigido em 01/08, commit `803420b`). O
token *é* criado automaticamente ao vincular o store — não é preciso caçá-lo.
O que faltava era o **ambiente marcado na conexão**.

**Como resolver — só pelo painel.** Tentado por CLI em 01/08 e não dá: o token
é *sensitive*, então `vercel env pull` devolve `[SENSITIVE]` e não há de onde
copiar o valor para o Preview. O caminho é reconectar o store:
Storage → `portfolio-midia` → aba **Projects** → menu de contexto (⋯) ao lado
do projeto → **Update Project Connection** → marcar **Preview**.

**Estado conferido em 01/08** (`vercel env ls`): o Preview já tem
`BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY`; falta só o `BLOB_READ_WRITE_TOKEN`,
que existe em Development e Production.

**O achado maior, que já virou correção:** stores vinculados hoje autenticam
por **OIDC por padrão** — `BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`, credencial
curta e rotacionada sozinha — com o token estático só como *fallback*. Nosso
guarda checava apenas `BLOB_READ_WRITE_TOKEN` e por isso **recusava upload em
ambiente onde o SDK funcionaria**. Agora aceita os dois caminhos.

**Uma assimetria que fica, e é real:** gerar token de *cliente* (o upload
direto de vídeo) **não** funciona por OIDC — exige o token estático. Por isso a
rota `api/admin/blob-upload` responde 503 explicando, em vez de falhar opaco.
Ou seja: num ambiente só-OIDC, imagem, áudio e PDF sobem; vídeo não.

**Prioridade real: baixa.** Com `BLOB_STORE_ID` presente e a correção do OIDC,
imagem, áudio e PDF já deveriam subir no preview — mas **login não funciona em
preview** (item 6), então não há painel de onde subir. Resolver isto só passa a
importar se o item 6 for resolvido antes.

## 6. Login em preview é impossível

Cada preview da Vercel ganha URL com hash único, e o Firebase Auth exige domínio
na allowlist de *Authorized domains* — não há como pré-autorizar. Saída, se
incomodar: alias fixo de branch na Vercel, autorizado uma vez no console.
Detalhes em `PROJECT_STATE.md` seção 3.1.

## 7. Refatoração (Fase 5) — parcialmente feita

Alvos concretos que restam:
- `verifySession()` consulta o Admin SDK a cada request autenticado. Correto,
  mas cacheável por curta janela se o volume crescer.
- Convenção de idioma mista na camada de dados (`buscarLinhas` vs.
  `listContactMessages`). Padronizar ao tocar em cada módulo, não num varredão.

O primeiro alvo (blocos repetidos em `lib/admin/sync-content.ts`) saiu em
31/07 (commit `712beca`).

## 8. Reescrever o conteúdo do arcano

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

## 9. Desligar o projeto Supabase

**Conferido em 01/08 — é seguro apagar.** As checagens que importavam:

| Checagem | Resultado |
|---|---|
| Dependência no `package.json` | nenhuma |
| `@supabase/supabase-js` instalado | não |
| **URLs do Supabase no Firestore** | **0**, em 170 documentos varridos |

A última é a que evitaria o estrago: mídia migrou do Supabase Storage para o
Vercel Blob, e uma URL remanescente viraria imagem quebrada — irreversível
depois do delete. Varredura feita direto no banco de produção, só leitura.

As 18 menções a "supabase" que sobram no Firestore são **conteúdo editorial**
(snippets de código, ADRs, wiki, tags) — texto sobre a migração, não ligação
viva.

**Sobra um arquivo morto:** `scripts/fix-criativo-covers.mjs` importa
`@supabase/supabase-js`, que não está instalado — já não roda. Apagar depois
de desligar o projeto, para o repositório não guardar script que fala com
serviço inexistente.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

## 10. Actions do CI ainda em Node 20

O CI passa, mas anota: `actions/checkout@v4`, `setup-node@v4` e `setup-java@v4`
declaram Node 20, que o runner força para o 24. Só aviso hoje; vira falha
quando o suporte cair. Subir as três de versão maior — de uma vez, conferindo
o run seguinte.

## 11. CSP com `unsafe-inline` em `script-src`

Compromisso de um CSP por header, sem nonce por request. Um CSP estrito exigiria
middleware em todas as rotas. Registrado em `next.config.ts`.

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
