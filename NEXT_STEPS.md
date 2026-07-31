# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-07-31 (correção do /login em produção; itens 7, 10 e 12)

---

## Estado em uma linha

Site no ar e funcionando. **Sem bloqueios:** o 500 do `/login` foi corrigido e
verificado em produção (31/07/2026, commit `634f3f5`). O que resta é validação
de caminhos nunca exercitados e higiene.

---

<details>
<summary>✅ RESOLVIDO — 1. <code>/login</code> retornava 500 em produção</summary>

Corrigido em 31/07/2026. A causa não era `node-fetch`, como se supunha aqui:
`jwks-rsa@4.1.0` (dependência do Admin SDK) é `type: commonjs` e faz
`require('jose')`, mas declara `jose ^6.1.3` — que é ESM puro. Passava local
porque o Node 22+ suporta `require()` de ESM; quebrava na Vercel porque o shim
do bundler não. Correção: `overrides` prendendo o jose do jwks-rsa na v5.
Detalhes no comentário do `next.config.ts`.

**Lição que vale para o próximo:** o log completo veio de `vercel logs <url>`
streamando enquanto se bate na rota. E a correção só conta como provada com o
**controle** — deploy sem ela, confirmando que quebra.

</details>


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

## 6. Variáveis do ambiente Preview ✅ fechado (menos o Blob)

Em 31/07/2026 as 10 variáveis do Firebase e do admin foram definidas no ambiente
*preview*: as seis `NEXT_PUBLIC_*`, `ADMIN_GITHUB_LOGIN`, `FIREBASE_PROJECT_ID`,
`FIREBASE_CLIENT_EMAIL` e `FIREBASE_PRIVATE_KEY`.

**Provado por controle:** o `/login` do preview novo renderiza o botão do GitHub;
o do preview anterior, sem as variáveis, mostrava "Configure o Firebase". O
`page.tsx:38` só renderiza o botão quando `isFirebaseConfigured` é verdadeiro.

**Não provado:** que o preview *lê do Firestore* em vez de cair no seed. O banco
foi populado a partir de `src/data`, então conteúdo e ordem são idênticos — não
existe discriminador observável de fora. Só uma escrita pelo painel (item 2)
resolve isso.

**Falta:** `BLOB_READ_WRITE_TOKEN`. O fluxo novo da Vercel não o cria ao conectar
o store — o diálogo de conexão só oferece `BLOB_STORE_ID` e
`BLOB_WEBHOOK_PUBLIC_KEY`, **e nenhum dos dois é lido pelo código**. Sem o token,
só o upload de mídia recusa (`admin/media/actions.ts:40`). Alternativa: validar o
item 3 direto em produção, onde o token já existe.

<details>
<summary>Contexto de como isso foi feito (para repetir depois de rotacionar a chave)</summary>

O ambiente *preview* tem só `BLOB_STORE_ID` e `BLOB_WEBHOOK_PUBLIC_KEY`
(verificado 31/07/2026). Falta todo o Firebase, o `BLOB_READ_WRITE_TOKEN` e o
`ADMIN_GITHUB_LOGIN` — deploys de branch sobem sem backend.

**Por que não dá para automatizar copiando de produção:** a Vercel marca essas
variáveis como *sensitive*. `vercel env pull` devolve o literal `[SENSITIVE]` no
lugar do valor, e o painel também não os exibe. Não existe caminho de leitura —
os valores têm de vir de fora.

**Como:** preencha um `.env.local` com os valores reais (o console do Firebase
tem as `NEXT_PUBLIC_*` em Project settings; a `FIREBASE_PRIVATE_KEY` exige gerar
nova chave de conta de serviço) e rode `node scripts/sync-vercel-env.mjs
preview`.

**Armadilha:** `vercel link` e `vercel env pull` **sobrescrevem o
`.env.local`** sem avisar. Faça cópia antes.

**Nota sobre o script:** o `parseEnv` lê linha a linha, então só aceita a
`FIREBASE_PRIVATE_KEY` em uma única linha com `\n` escapados — há uma guarda que
aborta se vier truncada. Um `.env.local` gerado por `vercel env pull` **não**
serve como entrada. Em 31/07 a chave foi enviada direto do
`serviceAccountKey.json`, escapada em memória e passada por stdin ao CLI, sem
nunca tocar o `.env.local` — que é como refazer isto com segurança.

</details>

## 7. CI não rodava os testes ✅ corrigido

O workflow existia (`.github/workflows/ci.yml`), mas rodava só `tokens:check`,
`lint` e `build`. Os 535 testes nunca eram executados — um PR podia quebrar a
suíte inteira com o CI verde. Passo de testes acrescentado em 31/07/2026.

Não há passo de `tsc --noEmit`: o `next build` já faz a checagem de tipos, já que
não existe `typescript.ignoreBuildErrors` no `next.config.ts`.

## 8. Teste de integração da camada de dados ✅ feito

```bash
npm run test:integration
```

Sobe o emulador do Firestore, roda `tests-integration/` e o derruba. 16 casos
sobre `collection.ts` e `query.ts` com o motor real: `criarDoc` preenchendo
`created_at`, idempotência e merge do `gravarLote`, alcance do `atualizarOnde`,
incremento atômico, projeção do `listarCampos` e o ciclo completo do envelope de
arrays aninhados.

Dois casos merecem nota, porque são os que um mock **nunca** pegaria:

- **O Firestore recusa array dentro de array.** Há um teste que escreve a forma
  crua e exige que ela falhe — guarda contra alguém "simplificar" o `nested.ts`
  achando que não faz nada.
- **Documento sem o campo ordenado some do `orderBy`.** A query não falha; o
  documento apenas não vem. É a razão de `criarDoc` sempre gravar `created_at`.

Fica **fora** da suíte unitária de propósito: `npm run test:unit` continua sem
rede e sem credencial. Exige Java (o emulador é um jar) e não roda no CI hoje.

**Ainda não coberto:** as Server Actions do `/admin` de ponta a ponta, e as
Security Rules — o emulador as carregaria, mas o app não passa por elas (todo
acesso é via Admin SDK, que as ignora).

## 9. `image-resolver` hotlinka imagens ✅ premissa errada, item encerrado

**A questão de privacidade não existe.** Verificado em produção em 31/07/2026: a
página `/anfitriao` trazia **43 URLs `/_next/image` e nenhuma** apontando para
host externo. As artes passam pelo `next/image` (o `Plate` em
`app/anfitriao/page.tsx:114`), e o otimizador busca a imagem no servidor e a
serve pelo nosso domínio — o navegador do leitor nunca fala com o site da fonte.

Construir a rota de proxy que este item pedia acrescentaria superfície de SSRF
para resolver um problema inexistente. O comentário obsoleto em
`lib/prophet-wire/image-resolver.ts` foi corrigido.

**O que sobra, e é outro assunto:** durabilidade. O dono da imagem pode trocar ou
remover o arquivo e a arte some. Reservir pelo Blob resolveria — quando houver
`BLOB_READ_WRITE_TOKEN`. Prioridade baixa.

## 10. `admin_allowlist` — declaração removida ✅ / coleção pendente

Saiu de `lib/firebase/schema.ts` em 31/07/2026 (não era lida por ninguém; a
allowlist virou `ADMIN_GITHUB_LOGIN` + custom claim).

**Nada mais a fazer:** a coleção **não existe** no Firestore. Listadas as 19
coleções reais em 31/07/2026, `admin_allowlist` não está entre elas — era
declaração órfã no schema, nunca chegou a existir como dado. Item encerrado.

## 11. Quatro coleções permanentemente vazias

`prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes` e
`prophet_resources` nunca tiveram conteúdo — nem no Postgres.

**Decisão a tomar:** criar seed, ou remover do catálogo do painel. Telas que
nunca mostram nada confundem quem usa.

## 12. Warning de lint ✅ corrigido

`src/hooks/use-mouse-parallax.ts` — `ref` acrescentado ao array de dependências
em 31/07/2026. O `ref` é estável (vem de `useRef` ou do chamador), então não
reexecuta o efeito à toa. `npm run lint` agora sai com zero avisos.

## 13. Refatoração (Fase 5, não executada) — desbloqueada

Estava adiada porque, com produção instável, refatorar arrisca confundir causa de
bug com efeito de refatoração. O item 1 saiu em 31/07/2026: **pode começar**.

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

Continua no ar como rede de segurança. Desligar quando os itens 2 a 4 estiverem
validados (o 1 já saiu).

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
