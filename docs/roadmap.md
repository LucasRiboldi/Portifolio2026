# Roadmap — melhorias planejadas

Backlog de enriquecimentos do portfólio "The Realms" (Creative · Developer ·
Daily Prophet). Itens não implementados ainda; ordenados por área. Marque com
`[x]` conforme concluir.

## Creative (multiverso / spiderverse)
- [ ] Galeria com **lightbox** (abrir imagem em overlay, navegação por teclado).
- [ ] **Filtros** por categoria na galeria/portfólio.
- [ ] Mais **efeitos comic**: onomatopeias reativas, parallax, halftone dinâmico.
- [ ] Home: seções editáveis (hero) via `page_content`.

## Developer (`/dev`, Dracula)
- [ ] Página de **DevLog individual** (`/dev/devlogs/[slug]`) com markdown completo.
- [ ] Mais **ferramentas internas**: regex tester, diff de texto, JWT decoder,
      hash SHA-256, conversor de unidades, gerador de gradiente.
- [ ] **Syntax highlight** também nos blocos de código dos DevLogs/Wiki.
- [ ] Página de **Wiki individual** (`/dev/wiki/[slug]`) com markdown.
- [ ] Filtros/busca combinados (tag + status) onde fizer sentido.

## Daily Prophet (`/prophet`, jornal)
- [ ] **Imprensa**: cards de download reais (upload de PDF / print&play via
      Supabase Storage) com contador de downloads.
- [ ] **Índice** do Caderno das Mecânicas (âncoras / navegação lateral).
- [ ] "Primeira Página" com **manchete rotativa** e seção de últimas edições.
- [ ] Página de **protótipo individual** com galeria de playtests.

## Universe Transition Engine
- [ ] **Variações por par de realms** (transição específica creative→dev, etc.).
- [ ] **Som** opcional (whoosh/glitch) respeitando preferências do usuário.
- [ ] Refino de **durações** e curvas; modo "rápido".
- [ ] Pré-carregar a rota de destino durante a animação (prefetch).

## Plataforma / transversal
- [ ] **Busca global** entre os três realms (Cmd+K).
- [ ] **RSS/feed** dos DevLogs e do Daily Prophet.
- [ ] **OG images** dinâmicas por página (título + realm).
- [ ] **Analytics** de conteúdo no admin (itens mais vistos).
- [ ] **Rascunho/preview** no admin (ver antes de publicar).
- [ ] **i18n** (pt/en) do conteúdo público.

## Segurança / operação (pendências conhecidas)
- [ ] Rotacionar/limpar do histórico do git a antiga `service_role` (revogada).
- [ ] Revogar o Personal Access Token do Supabase quando não for mais necessário.
- [ ] Página **home** e **prophet "Primeira Página"** editáveis via `page_content`.
