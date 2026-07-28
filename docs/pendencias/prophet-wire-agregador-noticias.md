# Pendência — Prophet Wire: agregador automático de notícias de Board Games

> Registrado em 2026-07-24. Página-alvo: **o anfitrião** (`src/app/anfitriao/page.tsx`,
> o *Daily Prophet*). Objetivo: pipeline 100% automático que pesquisa, analisa com IA,
> deduplica e preenche os campos de notícia do jornal, diariamente, sem intervenção humana.

## ⇒ PRÓXIMA NECESSIDADE: Parte 10 — persistência no Supabase

> Registrado em 2026-07-28, a pedido do Lucas. Tudo o mais do roadmap está feito
> (Partes 0–9, 11–14 + o redesenho sobre o layout original e a equalização visual).
> **Esta é a única peça que falta — e é a que destrava as outras cinco pendências.**

O pipeline inteiro funciona hoje, mas escreve num repositório **em memória**: ele vive
enquanto a instância serverless existir. Um cold start zera o acervo, e duas instâncias
não compartilham nada. Na prática isso significa que **o agregador não tem memória entre
execuções** — a deduplicação entre dias não funciona de verdade, e nada do que ele coleta
sobrevive.

O que a Parte 10 exige:

- chaves do Supabase no ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`);
- migração criando `news`, `sources`, `runs`, `logs`;
- uma segunda implementação de `NewsRepository` e de `RunStore` — as interfaces já existem
  e todo o pipeline fala com elas, então **nenhum outro módulo muda**.

O que está bloqueado esperando por ela:

| Bloqueado | Onde | Por quê |
|---|---|---|
| Deduplicação entre execuções | `dedup.ts` | sem acervo persistente, todo dia é o primeiro dia |
| Botões publicar/descartar | painel `/admin/prophet-wire` | a ação sumiria no próximo cold start |
| Histórico de execuções | `run-store.ts` | o painel só mostra o que rodou naquela instância |
| `revalidate`/ISR em `/anfitriao` | `page.tsx` | a página é prerenderizada estática (`○` no build); notícia nova só apareceria no próximo build |
| Rate limiting do gatilho | `api/prophet-wire/run` | a trava atual é de processo e não coordena instâncias (apontado pelo eco-security) |
| Reservir imagens em vez de hotlinkar | `image-resolver.ts` | hoje o navegador do leitor revela o IP ao domínio da fonte |

## Armadilhas de operação (descobertas na prática)

- **Nunca rodar `npm run build` com o dev server no ar.** Os dois escrevem em `.next` e o
  cache corrompe: as rotas passam a devolver 500 com erros enganosos (`Cannot find module
  './vendor-chunks/...'`, ou um símbolo importado "não definido" num arquivo onde o import
  existe). Aconteceu duas vezes nesta sessão e custou depuração à toa. Cura: parar o dev,
  `rm -rf .next`, subir de novo.
- **`node_modules` local pode estar defasado** em relação ao `package.json`: `three` e
  `@react-three/fiber` estavam declarados mas não instalados, e o build local falhava
  enquanto o CI (que roda `npm ci`) passava. Cura: `npm install`.
- **Crases em mensagem de commit pelo Bash** são interpretadas pelo shell e comem o trecho.
  Usar heredoc com aspas simples (`<<'EOF'`) ou evitar crases.

## Estado atual (Fase 0 — feita)

- [x] Contratos `NewsItem` / `NewsCategory` — `src/lib/prophet-wire/types.ts`
- [x] Config central (modo rascunho/automático, 6 campos, janela 24h, cron) — `src/lib/prophet-wire/config.ts`
- [x] Semente estática de **6 notícias reais** de board games na voz do Daily Prophet — `src/data/prophet-wire.ts`
- [x] Landing renderizando os **6 campos** (título, subtítulo, categoria, resumo, imagem+ALT+legenda, fonte+link)
- [x] Teste do seletor `getFrontNews()` — `tests/prophet-wire/seed-news.test.ts`

## Passo a passo — partes pequenas, cada uma com commit+push ao final

> Regra de execução: cada PARTE é autossuficiente (compila, testes verdes, build ok)
> e termina com **commit + push**. Nunca deixar o repo quebrado entre partes, porque
> o projeto é longo e pode ser retomado a qualquer momento.
> Checklist do ciclo de cada parte: implementar → `test:unit` → `tsc --noEmit` →
> (se visível) preview → **commit + push** → marcar `[x]` aqui.

### Bloco A — Fundação de dados (sem IA, sem rede)

- [x] **Parte 0 — Semente + landing (FEITO).** 6 campos no ar. Commit `feat(anfitriao): 6 campos…`.
- [x] **Parte 1 — Registry de fontes (FEITO).** `src/lib/prophet-wire/sources.ts`: 24 fontes
      tipadas (id, nome, url, kind rss|html|api, categoria-padrão, enabled) + `activeSources()`
      e `findSource()`. Contrato `Source` em `types.ts`. Teste em `sources.test.ts`. → commit+push.
- [x] **Parte 2 — Logger (FEITO).** `logger.ts`: interface `Logger` + `RunLogger` (entradas
      estruturadas, contadores fetched/discarded/published/errors, `RunReport` com
      início/fim/durationMs, `minLevel`, `echo`, `Clock` injetável) + `silentLogger`.
      Teste com relógio fixo. → commit+push.
- [x] **Parte 3 — Repository (FEITO).** `repository.ts`: interface `NewsRepository`
      (save, findByHash, findBySlug, listPublished, listDrafts, count) + `InMemoryNewsRepository`
      (semeável, devolve cópias). `data/prophet-wire.ts` expõe `defaultRepository()`/
      `setDefaultRepository()`; `getFrontNews()` agora async lê via repo; landing virou
      async server component. Ainda SEM Supabase. → commit+push.

### Bloco B — Coleta e limpeza (rede real, sem IA)

- [x] **Parte 4 — Collector (FEITO).** `http-client.ts` (interface `HttpClient` + `FetchHttpClient`
      com timeout via AbortController, User-Agent, `HttpError`) e `collector.ts` (`collect()`
      percorre fontes ativas, payload bruto por fonte, erro isolado, status não-2xx tratado,
      contadores no RunReport). Teste com fixture RSS e HttpClient fake. → commit+push.
      NOTA: filtro da janela de 24h fica no Parser (Parte 5), que lê as datas dos itens.
- [x] **Parte 5 — Parser (FEITO).** `parser.ts`: `parsePayload()` extrai título/link/data ISO/
      resumo/imagem de feeds RSS (`<item>`) e Atom (`<entry>`), dependency-free (CDATA +
      entidades). `withinWindow()` aplica a janela de 24h e descarta item sem data (conta
      discarded). Fontes html/api sem feed ficam para extractors próprios (futuro). Teste
      com fixtures RSS + Atom. → commit+push.
- [x] **Parte 6 — Normalizer (FEITO).** `normalizer.ts`: `slugify()` (remove acentos → kebab),
      `contentHash()` (sha-256 do link|título — chave do Dedup), `normalize()` mapeia
      ParsedItem+Source → NewsItem bruto (categoria-palpite da fonte, status via config,
      campos de IA vazios), `normalizeBatch()` garante slugs únicos no lote. Teste do
      mapeamento. → commit+push.
- [x] **Parte 7 — Dedup (FEITO).** `dedup.ts`: `dedup()` separa inéditos de repetidos em 3
      frentes — hash exato (findByHash), mesmo link canônico, e título similar
      (Sørensen–Dice sobre bigramas, `titleSimilarity`, limiar 0.82) — comparando contra o
      acervo E contra os já aceitos no lote. Conta discarded. Teste das 3 frentes + corte
      no lote. → commit+push.

### Bloco C — Inteligência (exige chave da API Claude)

> A partir daqui é preciso `ANTHROPIC_API_KEY` no `.env` do servidor (nunca commitada).
> Cada módulo tem interface + impl real Claude + fallback honesto (passa o item adiante
> sem enriquecer) para o pipeline nunca travar por falta de chave.

- [x] **Parte 8 — Analyzer (FEITO).** `ai-client.ts` (interface `AIClient` + `FallbackAIClient`
      que devolve null quando IA indisponível + `extractJson`) e `analyzer.ts` (`analyze()`
      enriquece categoria/subcategoria/designer/editora/mecânicas/jogadores/tempo/
      complexidade/ano; valida categoria contra `NEWS_CATEGORIES`; degrada mantendo item
      bruto se IA null/ilegível; não sobrescreve com vazio). `NEWS_CATEGORIES` agora existe
      em runtime em types.ts. Teste com AIClient fake. → commit+push.
      PENDENTE: cliente real do SDK Anthropic (plugar quando houver ANTHROPIC_API_KEY).
- [x] **Parte 9 — Generator (FEITO).** `generator.ts`: `generate()` reescreve título/subtítulo/
      resumo em PT-BR na voz do Daily Prophet + SEO (slug, seoTitle, metaDescription,
      keywords, hashtags) via IA; fallback determinístico deriva SEO do conteúdo bruto
      (sem inventar fatos) quando IA null/ilegível. `clamp` respeita limites de SEO;
      keywords descartam stopwords. Teste com AIClient fake. → commit+push. Fecha Bloco C.
      PENDENTE: mesmo cliente real do SDK da Parte 8.

### Bloco D — Persistência e automação (exige chaves do Supabase)

- [ ] **Parte 10 — Repository Supabase (ADIADA por escolha do Lucas; É A ÚNICA QUE FALTA).**
      impl real de `NewsRepository` e de `RunStore` + migração das tabelas `news`, `sources`,
      `runs`, `logs`. Publica conforme `config.publishMode`. Exige chaves do Supabase.
      **Ver a seção "PRÓXIMA NECESSIDADE" no topo deste arquivo** — lista as seis coisas que
      só passam a funcionar de verdade quando esta parte entrar. → commit+push.
- [x] **Parte 11 — Publisher + orquestrador (FEITO).** `publisher.ts` (grava via repo
      respeitando publicado/rascunho, erro isolado por item, conta published) e `pipeline.ts`
      (`runPipeline()` costura collect→parse+janela→normalize→dedup→analyze→generate→publish
      com um RunLogger; nunca lança; devolve RunReport). Teste de integração end-to-end com
      fakes (fixture RSS, IA fallback, repo in-memory), incl. dedup entre execuções e fonte
      caída. → commit+push.
- [x] **Parte 12 — Scheduler (FEITO, com desvio justificado).** O plano previa
      `scripts/prophet-wire-run.mjs`, mas Node ESM exige extensão explícita e o script `.mjs`
      não consegue importar os módulos `.ts` (`ERR_MODULE_NOT_FOUND`) — e o site roda na
      Vercel, onde cron é HTTP. Implementado como endpoint:
      `src/app/api/prophet-wire/run/route.ts` (GET p/ Vercel Cron + POST p/ disparo manual;
      monta FetchHttpClient + FallbackAIClient + defaultRepository e chama `runPipeline`;
      devolve o resumo do RunReport), `vercel.json` com `crons` em `0 6 * * *` (espelho de
      `config.cron`) e `cron-auth.ts` validando `Authorization: Bearer $CRON_SECRET`.
      Segurança: falha fechada sem segredo, comparação em tempo constante (SHA-256 +
      timingSafeEqual), segredo nunca logado/devolvido, resposta 401 genérica, trava de
      execução concorrente (409). Revisado por eco-security: sem bypass/vazamento/timing.
      9 testes de auth. → commit+push.
      **AÇÃO MANUAL NECESSÁRIA:** definir `CRON_SECRET` nas env vars da Vercel (`openssl rand
      -hex 32`). Sem isso o endpoint recusa tudo — de propósito.

## Redesenho sobre o layout original (28/07/2026)

O Lucas colocou o site original do Daily Prophet em `public/dporiginal` e pediu que
`/anfitriao` ficasse igual a ele, acrescentando as zonas de notícia automática.
Decisões dele: **substituir** o estilo em /anfitriao (preservando todo o conteúdo),
**logo/brasão do original com textos em PT-BR**, e **favicon só nas rotas /anfitriao**.

Como ficou:

- `src/styles/dp-original.css` — cópia do CSS original, intacta salvo os `url()` que
  passaram de relativos (`../fonts/`) para absolutos (`/dporiginal/fonts/`), porque o
  bundler move o CSS para `/_next/static/css/` e os relativos apontariam para o vazio.
  Importado só no layout de /anfitriao: ele traz seletores globais (`html`, `body`, `h1`,
  `p`, `a`, `img`, `hr`) que quebrariam o resto do site.
- `src/styles/dp-original-extras.css` — camada aditiva `dpx-*` (linha de data, cadernos,
  faixa do Wire, colunas de notícia) na linguagem visual do original.
- Layout com o cabeçalho do original (brasão + logo SVG + tagline PT-BR) e favicon por rota.
- Página remapeada nas zonas do original: EXCLUSIVO = manchete, top article = matéria de
  capa, aside "Rita Skeeter" = Editorial, matérias inferiores = 2 notícias automáticas,
  faixa `dpx-wire` = as outras 4, weather = Clima das Mesas, teaser = últimas, footer = índice.
- **Nada do conteúdo anterior foi descartado**: cupom, quadro de playtests, gravura de
  tiragem, grimório, anúncios e o expediente (que abriga o PressMark, o acesso ao admin)
  vivem no "caderno da oficina" ao pé da folha, sob `.prophet.dp` — o kit antigo é todo
  escopado por classe, sem regras globais, então convive sem conflito.

Três armadilhas resolvidas, todas silenciosas:

1. **Fundo de madeira sumia** — `[data-realm="arcane"] body` (0,1,1) vencia o `body` (0,0,1)
   do original. Corrigido com um seletor de especificidade maior, válido só nesta rota.
2. **Fonte caía em Georgia** — as variáveis do `next/font` ficam na div `.newspaper`, que é
   DESCENDENTE do `body`; variável não sobe na árvore. A família passou a ser declarada na
   própria `.newspaper`.
3. **FitText → `clamp()`** — o original dimensionava as manchetes em jQuery. Substituído por
   unidades de container query, mas com teto: o FitText servia strings curtas e fixas, e
   nossos títulos vêm do agregador (longos), o que criava rolagem horizontal no site inteiro.

Pendente deste redesenho: as fontes `kind: html`/`api` continuam sem extractor, e a faixa
do Wire mostra 4 notícias porque 2 vão para as matérias inferiores — total de 6, como pedido.

### Pendências técnicas anotadas ao longo do caminho

- **Rate limiting do gatilho** (apontado pelo eco-security): a trava atual é de processo e
  não coordena instâncias serverless distintas. Um limite real exige store compartilhado
  (Vercel KV/Upstash). Avaliar junto com a Parte 10.
- **`/anfitriao` é prerenderizada estática** (`○` no build): quando o repositório Supabase
  entrar (Parte 10), a página precisará de `revalidate`/ISR ou rota dinâmica, senão as
  notícias novas só aparecem no próximo build.
- **Cliente real de IA**: `FallbackAIClient` mantém tudo rodando; plugar o SDK Anthropic
  quando houver `ANTHROPIC_API_KEY` (Partes 8 e 9 já falam só com a interface `AIClient`).

### Bloco E — Operação

- [x] **Parte 13 — Painel admin (FEITO).** `/admin/prophet-wire` (protegido pelo
      `requireAdmin()` do layout): números do acervo/fila/fontes, última execução com
      contadores e duração, próxima execução calculada do cron, problemas (warn/error) da
      última execução, tabela da fila de rascunhos e lista das fontes. Suporte novo:
      `run-store.ts` (interface `RunStore` + `InMemoryRunStore`, guarda os últimos
      RunReports — o endpoint agora registra cada execução) e `schedule.ts`
      (`parseDailyCron`/`nextRunAt`, suporta só `M H * * *` e devolve null no resto, para o
      painel admitir que não sabe). Entrada na sidebar. 17 testes novos (98 no total).
      → commit+push.
      NÃO FEITO ainda: botões publicar/descartar (Server Actions) — dependem de persistência
      real, senão a ação some no próximo cold start. Fazer junto da Parte 10.
      NÃO VERIFICADO no browser: `/admin` exige Supabase configurado, ausente no ambiente
      local (`requireAdmin` redireciona para `/login?e=config`). Validado por build + testes.
- [x] **Parte 14 — Imagens (FEITO).** `image-resolver.ts` implementa a cascata do spec em
      quatro degraus, com proveniência registrada: **fonte** → **busca** → **categoria** →
      **gravura**. `isUsableImageUrl` exige https e caminho com cara de imagem (recusa
      `http`, `data:`, `javascript:` e páginas HTML). `ImageSearcher` é interface com
      `NullImageSearcher` — mesmo padrão do `AIClient`, sem fingir serviço que não existe.
      Integrado ao pipeline entre generate e publish, e também em `getFrontNews()` (a
      semente não passa pelo pipeline). As imagens chumbadas no JSX da página saíram.
      → commit+push.

      **Acessibilidade — dois defeitos achados na verificação, não no código:** o ALT herdado
      do item descrevia a arte imaginada ("pavilhões de feira") enquanto a foto padrão é um
      céu tempestuoso, e a legenda afirmava retratar o fato. Agora o mapa de categorias
      carrega `{src, alt}` com a descrição da FOTO, e a legenda de foto de arquivo é sempre
      "Imagem ilustrativa." — a legenda autoral só vale no degrau da gravura, onde descreve
      o que de fato se vê.

      **Limite honesto:** o acervo local tem só 3 fotografias (`mics`, `tornado`, `potions`),
      herdadas do layout original, cobrindo 9 das 16 categorias por leitura temática. As
      outras 7 caem na gravura vazia — que no impresso é recurso legítimo, não buraco.
      Substituir por arte própria é acrescentar entradas em `CATEGORY_IMAGES`.

      **Pendente:** plugar um `ImageSearcher` real (passo 2 da cascata) e, quando houver
      armazenamento (Parte 10), baixar e reservir as imagens remotas em vez de hotlinkar —
      hoje o navegador do leitor revela o IP para o domínio da fonte.

## Imagens (regra do spec)

Capturar imagem oficial quando permitido → senão pesquisar oficial → senão imagem
padrão da categoria. Hoje: moldura `.img-empty` com ALT + legenda reais (sem placeholder falso).

## Como estender

- **Nova fonte**: adicionar entrada em `sources.ts` (fase 1).
- **Nova categoria**: acrescentar em `NewsCategory` (`types.ts`).
- **Mudar horário**: editar `config.cron`.
- **Rascunho vs. automático**: editar `config.publishMode`.

## Princípios

SOLID · Clean Architecture · Repository Pattern · Dependency Injection · baixo
acoplamento. Sem placeholders quando a implementação real for possível.

## Regra inviolável

Preservar todo o conteúdo atual do site — ver memória [[three-realms-preserve-content]].
Produção lê do Supabase — ver [[conteudo-vem-do-supabase]].
