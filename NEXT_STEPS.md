# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-01, depois do primeiro teste manual do painel

---

## Estado em uma linha

Site no ar, login e CRUD funcionando. **O upload de mídia está quebrado** — três
bugs distintos, descobertos no teste manual de 01/08. Até então este arquivo
dizia "implementado, falta verificar": estava errado, e os 580 testes não
pegaram nenhum deles porque todos param na borda do nosso código.

---

# 🔴 Quebrado — consertar primeiro

## 1. Upload de mídia: o arquivo não chega ao Blob

**O sintoma que decide tudo:** um mp3 enviado pelo painel gravou a URL no
Firestore, e essa URL responde **404**. O arquivo não está no store.

```
https://g0beqyv00t1gw0xe.public.blob.vercel-storage.com/public-media/eec0125e-….mp3
→ HTTP 404
```

Não é problema de player, codec ou formato: não há o que tocar. É por isso que o
player do rádio aparece e não toca.

**Pergunta que discrimina, e precisa ser respondida antes de qualquer conserto:**

> Abra `/admin/media`. Os arquivos enviados aparecem na lista?
>
> - **Aparecem** → estão gravados; o problema é de *entrega* (store privado,
>   `content-disposition`, domínio público errado).
> - **Lista vazia** → nunca foram gravados; o `put()` devolve URL sem persistir,
>   e o suspeito é o caminho OIDC — `temBlob()` deixa passar com
>   `BLOB_STORE_ID`, mas a escrita pode não estar autenticada de fato.

Não dá para checar pelo CLI: `vercel blob list` exige o token, que é *sensitive*.

## 2. Teto real de upload é 4,5 MB, não 25

**Confirmado em 01/08:** um PDF de **4,52 MB** falhou com `An unexpected response
was received from the server`; um mp3 menor passou. O `bodySizeLimit: "26mb"` do
`next.config.ts` **não manda** — a plataforma corta antes, em 4,5 MB.

Ou seja, os tetos que a interface anuncia (áudio 25 MB, PDF 25 MB) são **falsos**.
Qualquer arquivo acima de 4,5 MB falha, com mensagem que nem menciona tamanho.

**Conserto certo:** não subir limite nenhum — mandar todo arquivo acima de ~4 MB
pelo caminho direto ao Blob, como o vídeo já faz, em vez de pela Server Action.
Vale para áudio, PDF e imagem.

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

## 5. Playlist do `/criativo` não toca

**Causa identificada, independente do Blob:** as faixas do seed em
`src/data/criativo-zones.ts` têm `audio_url: ""`. O player as lista e não tem
arquivo para tocar. O componente já trata o caso (`{!t.audio_url && …}`), o que
sugere que isso era conhecido e virou aviso visual em vez de conserto.

`lib/repos/playlist.ts` monta faixas a partir de `public/musica/` — essas tocam.
As duas fontes são somadas em `ZoneRadio`.

**Decidir:** preencher os `audio_url` do seed, remover as faixas fantasma, ou
deixar só as da pasta.

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
não duplica o acervo. Agora dá para despachar o resultado: a fila do painel
ganhou ações em 01/08 (`b63fc25`).

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

**Conferido em 01/08 — seguro apagar:**

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

## 14. Actions do CI ainda em Node 20

`actions/checkout@v4`, `setup-node@v4` e `setup-java@v4` declaram Node 20, que o
runner força para 24. Só aviso hoje; vira falha quando o suporte cair. Subir as
três de uma vez, conferindo o run seguinte.

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
