# Roadmap — melhorias planejadas

Backlog de enriquecimentos do portfólio "The Realms" (Creative · Developer ·
Daily Prophet). Itens não implementados ainda; ordenados por área. Marque com
`[x]` conforme concluir.

## Creative (multiverso / spiderverse)
- [ ] Galeria com **lightbox** (abrir imagem em overlay, navegação por teclado).
- [ ] **Filtros** por categoria na galeria/portfólio.
- [ ] Mais **efeitos comic**: onomatopeias reativas, parallax, halftone dinâmico.
- [ ] Home: seções editáveis (hero) via `page_content`.

## Developer (`/desenvolvedor`, Dracula)
- [x] Página de **DevLog individual** — no ar em `/desenvolvedor/devlog/[slug]`.
- [ ] Mais **ferramentas internas**: regex tester, diff de texto, JWT decoder,
      hash SHA-256, conversor de unidades, gerador de gradiente.
- [ ] **Syntax highlight** também nos blocos de código dos DevLogs.
- [ ] Filtros/busca combinados (tag + status) onde fizer sentido.

> A wiki do realm dev foi **removida** em `30adb8c`, junto com blog, ideias e
> padrões — o espaço passou a ser o módulo de estudos. Os itens de wiki que
> estavam aqui saíram: não são backlog, são passado.

## Daily Prophet (`/anfitriao`, jornal)
- [ ] **Imprensa**: cards de download reais (upload de PDF / print&play via
      **Vercel Blob**) com contador de downloads. O Firebase Storage não é
      usado neste projeto — exige plano Blaze.
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
- [ ] Página **home** e **"Primeira Página" do anfitrião** editáveis via
      `page_content`.

## Segurança / operação

> Estas não são ideias de produto, são pendências operacionais com passo a
> passo. **A lista de verdade é o `NEXT_STEPS.md`** — mantida aqui só como
> ponteiro, para não divergir em dois lugares.

- Rotacionar a chave de conta de serviço do Firebase → `NEXT_STEPS.md` item 4.
- Revogar o token antigo da Vercel → item 5.
- Desligar o projeto Supabase antigo (já conferido: seguro apagar) → item 12.
- [ ] **Limpar do histórico do git a antiga `service_role` do Supabase.** Já
      revogada, então não é chave viva — mas segue legível em commits antigos, e
      o repositório é público. Único item desta seção que **não** está no
      `NEXT_STEPS.md`.
