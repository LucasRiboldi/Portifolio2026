# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-04, depois de rediagnosticar a lista contra o código
> e contra produção, e de limpar as duas pendências de conteúdo morto
> (faixas fantasma e `designPatterns`).

---

## Estado em uma linha

Site no ar, login e CRUD funcionando, **611 testes passando**. O upload de mídia
continua quebrado — mas o diagnóstico de 01/08 estava fragmentado demais: o que
o doc chamava de dois bugs pode ser um só, e o conserto proposto para o item 2
não funcionaria como estava escrito.

<details>
<summary>O que o rediagnóstico de 04/08 corrigiu na lista anterior</summary>

- **`/login` não está mais 500.** Produção responde 200 em `/login` e na home.
  O bloqueio registrado no `CLAUDE.md` não existe mais.
- **A contagem de testes estava velha.** O doc dizia 580; eram 615 na hora do
  rediagnóstico, e 611 depois da limpeza do item 15 (as asserções de
  `designPatterns` saíram junto com os dados).
- **O item 1 não é indiagnosticável por falta de token.** A URL do Blob é
  pública — `curl` basta. O que impediu a checagem foi o doc ter elidido o nome
  do arquivo (`eec0125e-….mp3`). **Ao registrar uma URL quebrada, registre-a
  inteira.**
- **O conserto proposto para o item 2 estava incompleto** — ver item 2, achado A.
- **`/admin/media` tem uma segunda lógica de upload**, que nenhum conserto no
  `media-picker` alcança — ver item 2, achado B.

</details>

---

# 🔴 Quebrado — consertar primeiro

## 1. Upload de mídia: o arquivo não chega ao Blob

**O sintoma que decide tudo:** um mp3 enviado pelo painel gravou a URL no
Firestore, e essa URL responde **404**. O arquivo não está no store.

**Primeiro passo, e é barato:** subir dois arquivos pelo painel — um **pequeno
(< 1 MB)** e um de **~6 MB**.

| Resultado | Leitura |
|---|---|
| Os dois falham | **É um bug só.** O item 2 desaparece: não é tamanho, é escrita no store. |
| Só o de 6 MB falha | São dois bugs mesmo. Siga para o item 2. |

Depois, em `/admin/media`: os arquivos enviados aparecem na lista?

- **Aparecem** → estão gravados; o problema é de *entrega* (store privado,
  `content-disposition`, domínio público errado).
- **Lista vazia** → nunca foram gravados; o `put()` devolve URL sem persistir,
  e o suspeito é o caminho OIDC — `temBlob()` deixa passar com `BLOB_STORE_ID`,
  mas a escrita pode não estar autenticada de fato.

**Guarde a URL inteira** de qualquer arquivo que falhar. Com ela, um `curl -I`
fecha o diagnóstico sem credencial nenhuma.

## 2. Arquivos entre 4,5 MB e 25 MB morrem na Server Action

**Confirmado no código** (não só no teste manual): `SERVER_ACTION_LIMIT` vale
**25 MB** em `lib/admin/media-accept.ts`, e `media-picker.tsx:98` só desvia para
o upload direto quando `file.size > SERVER_ACTION_LIMIT`. Toda a faixa entre o
corte real da plataforma e 25 MB entra na Server Action — é onde o PDF de
4,52 MB morreu, com `An unexpected response was received from the server`.

Os tetos que a interface anuncia (áudio 25 MB, PDF 25 MB) são, portanto, **falsos**.

**Antes de consertar, confirme que o corte ainda existe.** O limite de 4,5 MB
para corpo de request das Vercel Functions **subiu para 100 MB**. Se este deploy
já pegou a mudança, um PDF de 4,52 MB falhando não é limite de tamanho — é o
item 1 com outra roupa, e este item inteiro é ruído. O teste dos dois arquivos
no item 1 responde isso.

### Se o corte existir mesmo, baixar a constante NÃO basta

**Achado A — o caminho direto é video-only, fixado em três lugares.** Mandar
áudio e PDF por ele exige mexer nos três:

| Onde | O que trava |
|---|---|
| `api/admin/blob-upload/route.ts` | `allowedContentTypes` só lista os três tipos de vídeo — áudio e PDF são **rejeitados pelo próprio token** |
| idem | `maximumSizeInBytes: MAX_BYTES.video`, fixo |
| `media-picker.tsx` → `uploadGrande()` | resolve a extensão por `EXT_POR_TIPO[file.type]`, que só mapeia vídeo |

Efeito colateral que **já existe hoje**: áudio ou PDF acima de 25 MB cai em
`uploadGrande` e recebe a mensagem errada — *"Formato de vídeo não aceito"*.

**Achado B — `/admin/media` não tem caminho direto nenhum.**
`components/admin/media-manager.tsx` chama `uploadMedia` sempre, sem o desvio que
o `media-picker` tem. São duas lógicas de upload paralelas; conserto em uma não
alcança a outra. Ou o desvio vira código compartilhado, ou o bug sobrevive
metade consertado.

**Depende do item 1:** se o store não está guardando, trocar o caminho não
resolve nada.

## 3. Upload sem indicador de progresso

"Enviando…" é indistinguível de travado — foi exatamente o que aconteceu no
vídeo, que ficou enviando e nunca terminou.

O `upload()` do `@vercel/blob/client` aceita `onUploadProgress`; o caminho por
Server Action não tem como reportar progresso (o corpo sobe de uma vez). Mais uma
razão para o item 2: pelo caminho direto, todo upload ganha barra.

**Faça antes de investigar o vídeo travado.** Sem progresso não dá para saber se
ele para no token, no envio ou na conclusão.

## 4. Vídeo trava em "Enviando…" e nunca termina

Sem erro, sem progresso, sem fim. Diagnóstico bloqueado pelo item 3.

Suspeitos, em ordem: o handshake de `/api/admin/blob-upload`; o webhook de
conclusão não conseguindo voltar (Deployment Protection barra chamada
servidor-a-servidor); ou o mesmo problema de store do item 1.

## 5. A zona Rádio do `/criativo` está sem música

**Não é mais bug** — é conteúdo faltando. As seis faixas fantasma saíram do seed
em 04/08, e `public/musica/` só tem o `README.md`, então a zona Rádio
simplesmente não aparece na página em vez de listar títulos que não tocam.

Para publicar, dois caminhos, e **nenhum passa por editar o seed**:

1. jogar o mp3 em `public/musica/` e commitar — o `README.md` de lá explica a
   convenção `Artista - Título.mp3`;
2. cadastrar em `/admin → Rádio`, que aceita capa e comentário.

O caminho 2 depende dos itens 1–4: sem upload funcionando, não há como subir o
arquivo pelo painel. **O caminho 1 funciona hoje.**

---

# 🔑 Credenciais — higiene pendente

**Ordem importa**: gerar a nova credencial e atualizá-la em todos os ambientes
ANTES de invalidar a antiga — inverter derruba o backend no intervalo.

## 6. Rotacionar a chave de conta de serviço do Firebase

Console do Google Cloud → IAM → Contas de serviço → `firebase-adminsdk-fbsvc`
→ Chaves → criar nova. Depois: substituir `serviceAccountKey.json`; atualizar
`FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL` na Vercel em **Production E
Preview**; redeploy; conferir `/login` → 200; só então apagar a antiga.

<details>
<summary>Armadilhas do processo</summary>

**Não dá para copiar de produção:** as variáveis são *sensitive*;
`vercel env pull` devolve `[SENSITIVE]`. Os valores vêm de fora.

**`vercel link` e `vercel env pull` sobrescrevem o `.env.local`** sem avisar.
Faça cópia antes.

**O `parseEnv` de `scripts/sync-vercel-env.mjs`** lê linha a linha, então só
aceita a `FIREBASE_PRIVATE_KEY` em uma única linha com `\n` escapados. Em 31/07
a chave foi enviada direto do `serviceAccountKey.json`, escapada em memória e
passada por stdin ao CLI, sem tocar o `.env.local` — é como refazer com
segurança.

</details>

## 7. Revogar o token antigo da Vercel

A variável de usuário `VERCEL_TOKEN` **já não existe** nesta máquina (conferido
em 01/08); o CLI usa credencial própria. Falta revogar o token antigo em
https://vercel.com/account/tokens, se ainda estiver listado.

---

# 🟠 Validação restante

## 8. Disparar o gatilho do Prophet Wire

Já provado: persistência e dedup contra Firestore real
(`tests-integration/prophet-wire-persistencia.test.ts`), `CRON_SECRET` definido
em Preview e Production, e o endpoint recusando corretamente em produção (sem
header → 401; segredo errado → 401 genérico).

**Falta o caminho feliz, e só você pode rodar** — o segredo é *sensitive*.

```bash
curl -i -X POST https://portifolio2026-two.vercel.app/api/prophet-wire/run -H "Authorization: Bearer SEU_SEGREDO"
```

Rode **duas vezes**. **Pronto quando:** as duas aparecem no histórico e a segunda
não duplica o acervo. A fila do painel ganhou ações em 01/08 (`b63fc25`), então
já dá para despachar o resultado.

**Ao ler o relatório:** `counters.published` conta só status `publicado`. Com
`publishMode: "rascunho"`, uma execução perfeita reporta `published: 0`. O sinal
de sucesso é `errors: 0` e o acervo crescendo.

---

# 🟡 Melhorias

## 9. `BLOB_READ_WRITE_TOKEN` ausente no Preview

Não dá por CLI — o token é *sensitive*, não há de onde copiar. O caminho é
reconectar o store: Storage → `portfolio-midia` → aba **Projects** → ⋯ →
**Update Project Connection** → marcar **Preview**.

O Preview já tem `BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY`. **Prioridade
baixa:** sem login em preview (item 10) não há painel de onde subir mídia.

## 10. Login em preview é impossível

Cada preview ganha URL com hash único e o Firebase Auth exige domínio na
allowlist — não há curinga. Saída, se incomodar: alias fixo de branch na Vercel,
autorizado uma vez. Detalhes em `docs/project-knowledge/auth.md` §6.1.

## 11. Convenção de idioma mista na camada de dados

`buscarLinhas` vs. `listContactMessages`. Padronizar **ao tocar em cada módulo**,
não num varredão — renomear tudo de uma vez produz diff enorme, sem
comportamento novo, que atrapalha o `git blame` do resto.

## 12. Reescrever o conteúdo do arcano

As quatro páginas (`/anfitriao/oficina`, `/mecanicas`, `/laboratorio`,
`/imprensa`) estão no ar com 12 documentos **escritos pelo Claude, saindo com a
sua assinatura**. Nada afirma histórico pessoal e nenhum `file_url` aponta para
arquivo inexistente — mas é rascunho.

**Armadilha:** `db:sync` escreve no banco e **não revalida o cache**. Publicando
por linha de comando, as páginas servem cache antigo até um deploy novo. Pelo
botão do `/admin`, não.

---

# 🔵 Higiene

## 13. Desligar o projeto Supabase

**Conferido em 01/08, reconferido em 04/08 — seguro apagar:**

| Checagem | Resultado |
|---|---|
| Dependência no `package.json` | nenhuma |
| `@supabase/supabase-js` instalado | não |
| **URLs do Supabase no Firestore** | **0**, em 170 documentos |

As 18 menções que sobram são conteúdo editorial (snippets, ADRs, wiki, tags).

**Sobra um arquivo morto:** `scripts/fix-criativo-covers.mjs` importa o SDK do
Supabase, que não está instalado — já não roda. Apagar depois do desligamento.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

## 14. Actions do CI em runtime Node 20

`actions/checkout@v4`, `setup-node@v4` e `setup-java@v4` rodam sobre Node 20, que
o runner força para 24. Só aviso hoje; vira falha quando o suporte cair. Subir as
três para `@v5` de uma vez, conferindo o run seguinte.

Não confundir com o `node-version: 22` do workflow — esse é o Node **do
projeto**, e está correto.

## 15. CSP com `unsafe-inline` em `script-src`

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
