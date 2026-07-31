# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-07-31

---

## Estado em uma linha

Site no ar e funcionando. Login **verificado localmente** (usuário criado com
claim `admin`). **Um bloqueio:** `/login` responde 500 em produção.

---

# 🔴 BLOQUEIO — resolver primeiro

## 1. `/login` retorna 500 em produção

Todas as outras rotas respondem 200. Sem isto, não há painel em produção.

**Erro:** `require() of ES Module /var/task/node_modules/…` nos logs de runtime
(o CLI da Vercel trunca o nome do módulo).

**Causa provável:** `firebase-admin` arrasta dependências ESM-only. O trace do
lambda confirma `node-fetch` v3 e família (`fetch-blob`, `formdata-polyfill`,
`data-uri-to-buffer`, `web-streams-polyfill`) e `jose`.

**Por que só o `/login`:** é a primeira rota **dinâmica** que toca o Admin SDK
em runtime. As demais são pré-renderizadas no build.

**Por que não reproduz localmente:** `next dev`, `next build` e `next start`
resolvem ESM e CJS sem ajuda. Já testado: `next start` responde 200.

### Passo a passo

1. **Obtenha a mensagem completa.** Vercel → projeto → **Observability →
   Runtime Logs** → filtre por `/login`. É o passo que faltou: sem o nome do
   módulo, o resto é adivinhação.
2. **Confirme qual commit está no ar.** Vercel → Deployments → o de produção
   deve conter `serverExternalPackages` (commit `19248cf` ou posterior). Se for
   anterior, force um redeploy antes de mudar código.
3. **Corrija conforme o módulo apontado**, em ordem de preferência:
   - acrescente o pacote a `serverExternalPackages` em `next.config.ts`;
   - ou force `node-fetch` em v2 via `overrides` no `package.json`;
   - ou isole o Admin SDK atrás de uma Route Handler com
     `export const runtime = "nodejs"` explícito.
4. **Valide antes de ir para produção:** crie uma branch, deixe a Vercel gerar
   o preview e teste o `/login` **no preview**. Esta classe de erro não aparece
   local — validar em preview é a lição registrada em
   `docs/project-knowledge/migrations/supabase-to-firebase.md` §9.

**Pronto quando:** `curl -o /dev/null -w "%{http_code}" https://<site>/login`
devolver `200` e o login completar no browser em produção.

---

# 🟠 Validação — nunca foi exercido

Cada item é rápido e revela bug real. Ordem sugerida.

## 2. CRUD pelo painel

Entre em `/admin`, edite um projeto, salve. Depois confira no site público.

**Pronto quando:** a alteração aparece no site em segundos (revalidação por tag)
e persiste após recarregar.

**Se falhar:** provável índice composto ausente — a query é rejeitada inteira e
o repositório cai no seed silenciosamente. Veja `firestore.indexes.json`.

## 3. Upload de mídia no Vercel Blob

`/admin` → Mídia → subir uma imagem, copiar a URL, usá-la num recurso, apagar.

**Pronto quando:** upload, listagem, uso e remoção funcionam.

**Se falhar:** confirme que o store `portfolio-midia` está **vinculado** ao
projeto (criar não basta) — é o que injeta `BLOB_READ_WRITE_TOKEN`.

## 4. Cupom público do jornal

`/anfitriao`, envie o formulário. Confira em `/admin/messages`.

**Pronto quando:** a mensagem chega ao inbox com `read: false`.

## 5. Gatilho do Prophet Wire

```bash
curl -X POST https://<site>/api/prophet-wire/run -H "Authorization: Bearer $CRON_SECRET"
```

Requer `CRON_SECRET` definido (hoje está vazio — sem ele o endpoint **recusa
tudo**, por desenho).

**Pronto quando:** o acervo e o histórico persistem entre execuções e aparecem
em `/admin/prophet-wire`.

---

# 🟡 Correções e melhorias

## 6. Variáveis do ambiente Preview

`npm run sync:vercel-env` falhou para *preview*. Deploys de branch sobem sem
backend — o que atrapalha justamente a validação em preview do item 1.

**Como:** `node scripts/sync-vercel-env.mjs preview`, ou pelo painel da Vercel.

## 7. Sem CI

Nenhum pipeline. Hoje a validação depende de disciplina local.

**Como:** workflow do GitHub Actions em PR e push para `main`:

```bash
npx tsc --noEmit && npm run lint && npm run test:unit && npm run build
```

**Pronto quando:** o badge do workflow fica verde e um PR com erro de tipo é
barrado.

## 8. Sem teste de integração da camada de dados

Os 535 testes mockam `lib/firebase/query`. Nada exercita `collection.ts` contra
um Firestore real — `criarDoc`, `atualizarOnde`, `gravarLote` e o envelope de
arrays aninhados nunca foram testados de verdade.

**Como:** emulador do Firebase (`firebase emulators:start --only firestore`) e
uma suíte separada, fora da unitária.

## 9. `image-resolver` hotlinka imagens da fonte

O navegador do leitor revela o IP ao domínio de origem da notícia — questão de
privacidade, anotada no próprio arquivo.

**Como:** baixar e reservir pelo Vercel Blob, que agora existe.

## 10. `admin_allowlist` é coleção órfã

Está em `lib/firebase/schema.ts` e não é usada por ninguém: a allowlist virou
`ADMIN_GITHUB_LOGIN` + custom claim.

**Como:** remover da declaração e apagar a coleção.

## 11. Quatro coleções permanentemente vazias

`prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes` e
`prophet_resources` nunca tiveram conteúdo — nem no Postgres.

**Decisão a tomar:** criar seed, ou remover do catálogo do painel. Telas que
nunca mostram nada confundem quem usa.

## 12. Warning de lint pré-existente

`src/hooks/use-mouse-parallax.ts:56` — dependência `ref` faltando no
`useEffect`. Único warning do projeto.

## 13. Refatoração (Fase 5, não executada)

Adiada de propósito: com produção instável, refatorar arrisca confundir causa de
bug com efeito de refatoração. Retomar **depois do item 1**.

Alvos concretos, não genéricos:
- `lib/admin/sync-content.ts` — os blocos de `projects`, `tools` e `posts`
  repetem o ritual que `inserirFaltantes()` já abstrai. Três casos especiais que
  provavelmente cabem no helper.
- `verifySession()` consulta o Admin SDK a cada request autenticado. Correto,
  mas cacheável por curta janela se o volume crescer.
- Convenção de idioma mista na camada de dados (`buscarLinhas` vs.
  `listContactMessages`). Padronizar ao tocar em cada módulo, não num varredão.

---

# 🔵 Higiene

## 14. Desligar o projeto Supabase

Continua no ar como rede de segurança. Desligar quando os itens 1 a 4 estiverem
validados.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

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
