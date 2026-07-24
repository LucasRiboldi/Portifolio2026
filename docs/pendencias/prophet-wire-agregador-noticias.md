# Pendência — Prophet Wire: agregador automático de notícias de Board Games

> Registrado em 2026-07-24. Página-alvo: **o anfitrião** (`src/app/anfitriao/page.tsx`,
> o *Daily Prophet*). Objetivo: pipeline 100% automático que pesquisa, analisa com IA,
> deduplica e preenche os campos de notícia do jornal, diariamente, sem intervenção humana.

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

- [ ] **Parte 10 — Repository Supabase.** impl real de `NewsRepository` + migração das
      tabelas `news`, `sources`, `runs`, `logs`. Publica conforme `config.publishMode`.
      → commit+push.
- [ ] **Parte 11 — Publisher + orquestrador.** `publisher.ts` + `pipeline.ts` costurando
      collector→parser→normalizer→dedup→analyzer→generator→publisher com logging. Teste
      de integração end-to-end com fakes. → commit+push.
- [ ] **Parte 12 — Scheduler.** `scripts/prophet-wire-run.mjs` (entrypoint do cron) +
      registro de `run` a cada execução. Doc: como mudar horário (`config.cron`). → commit+push.

### Bloco E — Operação

- [ ] **Parte 13 — Painel admin.** Rota admin: última/próxima execução, fila, logs, erros,
      notícias aguardando publicação, botão publicar/descartar. → commit+push.
- [ ] **Parte 14 — Imagens.** Regra do spec: imagem oficial → pesquisa → padrão da categoria.
      Substitui a moldura `.img-empty` quando houver arte real. → commit+push.

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
