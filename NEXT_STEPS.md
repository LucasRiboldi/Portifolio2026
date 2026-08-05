# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-05, depois de achar o CSP como causa raiz do upload.

---

## Estado em uma linha

Site no ar, login e CRUD funcionando, **640 testes passando**. O upload de mídia
tinha **três** defeitos independentes, os três fechados em 04–05/08:

1. `/admin/media` apagava arquivo em uso sem avisar — o 404 era referência
   pendurada, não falha de escrita;
2. tudo entre 4,5 e 25 MB morria na Server Action, porque `SERVER_ACTION_LIMIT`
   ignorava o corte real da plataforma;
3. o **CSP** não liberava o Vercel Blob em `connect-src`, então o upload direto
   era bloqueado pelo navegador — e `media-src` nem existia, o que bloquearia a
   reprodução também.

Falta só você confirmar o item 1 subindo um vídeo.

<details>
<summary>O que o rediagnóstico de 04/08 desmontou</summary>

O item 1 antigo dizia: *"o `put()` devolve URL sem persistir, e o suspeito é o
caminho OIDC"*. Falso, e custou três dias de suspeita no lugar errado.

- **`put()` persiste.** Reproduzido com `.mp3` e as opções exatas da action:
  `head()` e `list()` enxergam, e a URL pública devolve **200**.
- **Um `put()` que falha não produz o sintoma.** Pelo caminho OIDC ele **lança**;
  a action cai no `catch` e devolve erro — nenhuma URL é gravada. Logo, toda URL
  no Firestore veio de um `put()` que criou o objeto de verdade.
- **A causa era apagar, não gravar.** `/admin/media` listava o store cru e
  deixava excluir qualquer arquivo com um clique, sem saber o que estava em uso.
- **Outras correções:** `/login` responde 200 (o 500 registrado no `CLAUDE.md`
  não existia mais); eram 615 testes, não 580.

**Lição de método, e é a parte que vale guardar:** o doc afirmava que o
diagnóstico exigia o token do Blob e por isso era impossível. O token estava no
`.env.local` o tempo todo, e a URL do Blob é pública — um `curl` bastava. O que
de fato travou foi o doc ter **elidido o nome do arquivo** (`eec0125e-….mp3`).
Ao registrar uma URL quebrada, registre-a inteira.

</details>

---

# 🔴 Confirmar

## 1. O upload de vídeo — causa raiz achada e consertada, falta você confirmar

**Era o nosso próprio CSP.** `connect-src` não listava o Vercel Blob, então o
navegador recusava o PUT antes de ele sair da máquina. Corrigido em `a00d5ff`.

O navegador dizia, e ninguém tinha olhado o console:

```
Connecting to 'https://…blob.vercel-storage.com/…' violates the following
Content Security Policy directive: "connect-src 'self' …"
The action has been blocked.
```

<details>
<summary>Por que enganou por dias</summary>

- **O handshake passava.** `/api/admin/blob-upload` é mesma origem, coberta por
  `'self'`. O token saía, a barra aparecia — e só então nada acontecia. A fase
  "enviando 0%" era honesta: o PUT começava e era recusado.
- **Imagem e áudio pequenos sempre funcionaram**, porque sobem pela Server
  Action, que também é mesma origem. Isso fazia parecer que só vídeo era
  especial.
- **As capas do Blob apareciam**, porque `img-src` permite `https:` inteiro.
- **Falhava com `fetch` e com XHR**, o que descartava o transporte e empurrava
  a suspeita para o ambiente (extensão, Brave, rede) — tudo inocente.

Suspeitos eliminados por medição, todos falsos: `put()`, o store, o caminho
OIDC, o tamanho do arquivo, o SDK, o navegador. Um upload de 9,18 MB com token
de cliente sobe em 3,2 s por fora do browser.

</details>

**Segundo buraco, achado junto:** `media-src` não era declarado e caía no
`default-src 'self'` — `<audio>` e `<video>` do Blob seriam recusados do mesmo
jeito. Ou seja, mesmo com o upload consertado a **reprodução** continuaria
quebrada. Declarado agora.

**Verificado em produção, no navegador:** `fetch` ao Blob devolve 200 (antes
falhava em 1 ms), e um `<audio>` do Blob carrega metadados — o mp3 que você
subiu tem 45 s. Zero erros de CSP no console.

**Falta só você:** suba o vídeo de novo. Se subir, remova este item.

---

# 🟡 Conteúdo

## 2. A zona Rádio do `/criativo` está sem música

**Não é bug** — é conteúdo faltando. As faixas fantasma saíram do seed em 04/08,
e os dois `audio_url` que restavam apontavam para arquivos apagados; foram
zerados na mesma data. `public/musica/` só tem o `README.md`.

Para publicar, dois caminhos, e **nenhum passa por editar o seed**:

1. jogar o mp3 em `public/musica/` e commitar — o `README.md` de lá explica a
   convenção `Artista - Título.mp3`;
2. cadastrar em `/admin → Rádio`, que aceita capa e comentário.

**Os dois funcionam hoje** — o teto de 4,5 MB deixou de barrar o caminho 2 em
04/08. Um mp3 de até 25 MB sobe pelo painel.

## 3. Reparar as mídias que foram perdidas

A limpeza de 04/08 zerou campos, não recuperou arquivos. Seguem sem mídia:

| Documento | Campo perdido |
|---|---|
| `tracks` · "Samurai Blue" | `audio_url`, `cover_image` |
| `tracks` · "sirius" | `audio_url` |
| `videos` · "Samurai Blue" | `poster_image` |

Os arquivos originais não estão no Blob. Se você ainda tiver os locais, resubir
pelo painel refaz tudo — e agora a exclusão acidental não se repete.

## 4. Reescrever o conteúdo do arcano

As quatro páginas (`/anfitriao/oficina`, `/mecanicas`, `/laboratorio`,
`/imprensa`) estão no ar com 12 documentos **escritos pelo Claude, saindo com a
sua assinatura**. Nada afirma histórico pessoal e nenhum `file_url` aponta para
arquivo inexistente — mas é rascunho.

**Armadilha:** `db:sync` escreve no banco e **não revalida o cache**. Publicando
por linha de comando, as páginas servem cache antigo até um deploy novo. Pelo
botão do `/admin`, não.

---

# 🔑 Credenciais — higiene pendente

**Ordem importa**: gerar a nova credencial e atualizá-la em todos os ambientes
ANTES de invalidar a antiga — inverter derruba o backend no intervalo.

## 5. Rotacionar a chave de conta de serviço do Firebase

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

## 6. Revogar o token antigo da Vercel

A variável de usuário `VERCEL_TOKEN` **já não existe** nesta máquina (conferido
em 01/08); o CLI usa credencial própria. Falta revogar o token antigo em
https://vercel.com/account/tokens, se ainda estiver listado.

---

# 🟠 Validação restante

## 7. Disparar o gatilho do Prophet Wire

Já provado: persistência e dedup contra Firestore real
(`tests-integration/prophet-wire-persistencia.test.ts`), `CRON_SECRET` definido
em Preview e Production, e o endpoint recusando corretamente em produção (sem
header → 401; segredo errado → 401 genérico).

**Falta o caminho feliz, e só você pode rodar** — o segredo é *sensitive*.

```bash
curl -i -X POST https://portifolio2026-two.vercel.app/api/prophet-wire/run -H "Authorization: Bearer SEU_SEGREDO"
```

Rode **duas vezes**. **Pronto quando:** as duas aparecem no histórico e a segunda
não duplica o acervo.

**Ao ler o relatório:** `counters.published` conta só status `publicado`. Com
`publishMode: "rascunho"`, uma execução perfeita reporta `published: 0`. O sinal
de sucesso é `errors: 0` e o acervo crescendo.

---

# 🟢 Melhorias

## 8. `BLOB_READ_WRITE_TOKEN` ausente no Preview

Não dá por CLI — o token é *sensitive*, não há de onde copiar. O caminho é
reconectar o store: Storage → `portfolio-midia` → aba **Projects** → ⋯ →
**Update Project Connection** → marcar **Preview**.

O Preview já tem `BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY`. **Prioridade
baixa:** sem login em preview (item 9) não há painel de onde subir mídia.

## 9. Login em preview é impossível

Cada preview ganha URL com hash único e o Firebase Auth exige domínio na
allowlist — não há curinga. Saída, se incomodar: alias fixo de branch na Vercel,
autorizado uma vez. Detalhes em `docs/project-knowledge/auth.md` §6.1.

## 10. A varredura de usos relê o banco a cada exclusão

`mapearUsosDeMidia` lê todas as coleções declaradas para responder "este arquivo
está em uso?". São ~170 documentos e roda só no painel, então hoje não incomoda.

Se um dia incomodar, a saída não é cachear — é gravar o vínculo na hora em que a
URL entra no documento, em vez de descobri-lo depois. **Não faça antes de doer:**
o índice derivado é o que não pode dessincronizar.

## 11. Convenção de idioma mista na camada de dados

`buscarLinhas` vs. `listContactMessages`. Padronizar **ao tocar em cada módulo**,
não num varredão — renomear tudo de uma vez produz diff enorme, sem
comportamento novo, que atrapalha o `git blame` do resto.

---

# 🔵 Higiene

## 12. Desligar o projeto Supabase

**Conferido em 01/08, reconferido em 04/08 — seguro apagar:**

| Checagem | Resultado |
|---|---|
| Dependência no `package.json` | nenhuma |
| `@supabase/supabase-js` instalado | não |
| **URLs do Supabase no Firestore** | **0**, em 170 documentos |

As menções que sobram são conteúdo editorial (snippets, ADRs, tags).

**Sobra um arquivo morto:** `scripts/fix-criativo-covers.mjs` importa o SDK do
Supabase, que não está instalado — já não roda. Apagar depois do desligamento.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

## 13. CSP com `unsafe-inline` em `script-src`

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
