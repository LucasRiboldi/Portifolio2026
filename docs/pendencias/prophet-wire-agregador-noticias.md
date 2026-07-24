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

## Roadmap (um módulo por vez — cada um com teste + doc + exemplo)

Ordem sugerida do pipeline:

1. **Collector** — RSS/fetch das fontes (janela de 24h). Fontes prioritárias:
   BoardGameGeek (News/Hotness), Dice Tower, ICv2, Gamefound, Kickstarter (Tabletop),
   Stonemaier, CMON, Fantasy Flight, Leder, GMT, Plaid Hat, Portal, CGE, Ravensburger,
   Kosmos, Asmodee; comunidades r/boardgames, r/soloboardgaming, r/boardgamedeals;
   eventos Gen Con, Spiel Essen, UK Games Expo, Origins.
2. **Parser** — extrair conteúdo limpo de cada item.
3. **Normalizer** — mapear para `NewsItem` bruto.
4. **Dedup** — hash de conteúdo + similaridade de título/link/jogo/campanha.
5. **Analyzer (Claude)** — identificar título, resumo, categoria, subcategoria,
   designer, editora, mecânicas, jogadores, tempo, complexidade, ano, idioma.
6. **Generator** — texto original PT-BR (nunca copiar), SEO (slug, meta description,
   keywords, hashtags, título SEO), no estilo editorial do Daily Prophet.
7. **Publisher** — grava via `repository.ts` conforme `config.publishMode`.
8. **Repository (Supabase)** — tabelas: `news`, `sources`, `runs`, `logs`
   (histórico de pesquisadas/descartadas/publicadas, hash, data de coleta).
9. **Logger** — início, fim, tempo, nº pesquisado/descartado/publicado, erros.
10. **Scheduler** — cron diário (`scripts/prophet-wire-run.mjs`), horário em `config.cron`.
11. **Painel admin** — última/próxima execução, fila, logs, erros, aguardando publicação.

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
