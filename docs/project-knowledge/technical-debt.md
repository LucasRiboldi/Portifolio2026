# Débito técnico

> Ordenado por prioridade. Ao resolver um item, remova-o daqui e registre a
> mudança no commit — lista que só cresce vira ruído.

---

## 🔴 Crítico

### 1. `/login` responde 500 em produção

**Estado:** aberto em 2026-07-31. Único bloqueio conhecido.

Erro nos logs de runtime: `require() of ES Module /var/task/node_modules/…` (o
CLI trunca o nome do módulo).

Causa provável: `firebase-admin` arrasta dependências ESM-only. O trace do
lambda (`.next/server/app/login/page.js.nft.json`) confirma `node-fetch` v3 e
família (`fetch-blob`, `formdata-polyfill`, `data-uri-to-buffer`,
`web-streams-polyfill`) e `jose`.

Só o `/login` quebra por ser a primeira rota **dinâmica** que toca o Admin SDK
em runtime. **Não reproduz localmente:** `next start` responde 200.

Tentativas:
1. `serverExternalPackages: ["firebase-admin"]` — alvo certo, efeito não
   confirmado (não se verificou qual commit estava no deploy testado).
2. Lazy-loading do SDK web — **hipótese errada**: `firebase` não aparece no
   trace do lambda. Ficou como boa prática, não como correção.

Próximo passo: obter a mensagem **completa** no dashboard da Vercel
(Observability → Runtime Logs) e agir sobre o módulo exato. Alternativas:
incluir os pacotes ESM em `serverExternalPackages`, ou fixar `node-fetch` em v2
via `overrides`.

---

## 🟠 Importante

### 2. Nenhum fluxo de escrita foi exercido de verdade

Login completo, CRUD pelo painel, upload no Blob e o cupom público **nunca
foram executados**. O código está tipado, testado em unidade e compila — mas
zero usuários existem no Firebase Auth.

### 3. Sem CI

Não há pipeline. `tsc`, `lint`, testes e build dependem de disciplina local. Um
workflow do GitHub Actions rodando os quatro em PR resolveria.

### 4. Sem teste de integração da camada de dados

Os 535 testes mockam `lib/firebase/query`. Nada exercita `collection.ts` contra
um Firestore real. O emulador do Firebase cobriria isso sem custo.

### 5. Variáveis do ambiente Preview não sincronizadas

`sync:vercel-env` falhou para *preview*. Deploys de branch sobem sem backend.

---

## 🟡 Melhorias

### 6. `image-resolver` hotlinka imagens da fonte

O navegador do leitor revela o IP ao domínio de origem da notícia. Reservir as
imagens (agora há Vercel Blob) resolveria — está anotado no próprio arquivo.

### 7. `admin_allowlist` é coleção órfã

Existe no schema e não é usada: a allowlist virou `ADMIN_GITHUB_LOGIN` + custom
claim. Remover da declaração e do banco.

### 8. Coleções do realm arcane permanentemente vazias

`prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes` e
`prophet_resources` nunca tiveram conteúdo — nem no Postgres. Ou criar seed, ou
remover do catálogo do painel: telas que nunca mostram nada confundem.

### 9. `verifySession` consulta o Admin SDK a cada request autenticado

Necessário para ler claims sempre atualizadas. Aceitável num painel de um
usuário; se o volume crescer, cachear por curta janela.

### 10. Warning de lint pré-existente

`src/hooks/use-mouse-parallax.ts:56` — dependência `ref` faltando no
`useEffect`.

### 11. CSP com `unsafe-inline` em `script-src`

Compromisso de um CSP por header, sem nonce por request. Um CSP estrito exigiria
middleware em todas as rotas. Registrado no próprio `next.config.ts`.

---

## 🔵 Higiene

### 12. Projeto Supabase antigo ainda no ar

Mantido de propósito como rede de segurança. Desligar quando o Firebase estiver
validado ponta a ponta.

### 13. Convenção de idioma mista na camada de dados

Funções novas em português (`buscarLinhas`), antigas em inglês
(`listContactMessages`). Não vale refatorar só por isso; padronize ao tocar em
cada módulo.
