# Portal de Entrada — Os Três Multiversos

**Data:** 2026-07-15
**Status:** Aprovado (design) — pronto para plano de implementação

## Objetivo

Criar a **porta de entrada** do site: uma tela minimalista e profunda, exibida
**uma vez por navegador**, onde o visitante escolhe entre os três multiversos
(personas). Após escolher, é levado ao realm correspondente e navega entre as
três personas por dentro (mecanismo já existente). Como parte disso, as rotas de
cada persona passam a ter **nomes canônicos** (`/criativo`, `/desenvolvedor`,
`/anfitriao`).

## Convenção de nomes e rotas

| Chave interna (`RealmId`) | Rota nova | Rota antiga | Identificação visível |
|---|---|---|---|
| `creative` | `/criativo` | `/` | **O CRIATIVO** |
| `developer` | `/desenvolvedor` | `/dev` | **O DESENVOLVEDOR** |
| `arcane` | `/anfitriao` | `/prophet` | **O ANFITRIÃO** |

- **Chaves internas (`RealmId`) não mudam** (creative/developer/arcane) — evita
  refactor de tipos e do engine de realms.
- **Rotas mudam** (decisão do usuário: substituir de vez).
- **Subpáginas do CRIATIVO permanecem na raiz** (`/portfolio`, `/tools`,
  `/blog`, `/about`, `/skills`, `/dimensoes`, `/styleguide`, `/design-system`,
  `/contact`, `/gallery`, `/github`, `/sports-widget`). Só a **home** do criativo
  vai para `/criativo`.

## Escopo

**Inclui:** rota `/portal` (gate), renomeação `/dev`→`/desenvolvedor` e
`/prophet`→`/anfitriao`, home do criativo em `/criativo`, redirects 301 das
rotas antigas, `/` como redirecionador, os 3 logos animados, rerotulagem dos
realms, reúso da transição, a11y/reduced-motion.

**Não inclui:** redesenho da navegação interna entre personas (o
`UniverseProvider` é reaproveitado); mover as subpáginas do criativo para
`/criativo/*` (ficam na raiz).

## Decisões de design (travadas)

1. **Persistência:** uma vez por navegador, para sempre (`localStorage`).
2. **Anfitrião** = realm `arcane` existente, rerotulado e movido para `/anfitriao`.
3. **Rota dedicada** `/portal` para o gate.
4. **Nav interna:** mantém o `UniverseProvider` atual.
5. **Renomear rotas de vez**; `/criativo` é a home; subpáginas ficam na raiz.

## Arquitetura

### Rotas e layouts

- **Renomear pastas** no App Router:
  - `src/app/dev/` → `src/app/desenvolvedor/`
  - `src/app/prophet/` → `src/app/anfitriao/`
  - Ajustar `metadata`, layouts e **todos os links internos** dessas árvores.
- **Home do criativo:** criar `src/app/(site)/criativo/page.tsx` com o conteúdo
  atual de `(site)/page.tsx` (inclui o `MotionDemo` já adicionado).
- **`/portal`:** `src/app/portal/layout.tsx` (mínimo, sem chrome) +
  `src/app/portal/page.tsx` (monta `<PortalGate />`).
- **`/` (redirecionador):** `src/app/(site)/page.tsx` passa a renderizar uma
  página mínima cujo **script de gate** decide o destino (ver abaixo). Não faz
  `redirect()` server-side (senão o script inline não roda).

### Redirects das rotas antigas

- Em `next.config.ts`, `redirects()` com 301 permanente:
  - `/dev/:path*` → `/desenvolvedor/:path*`
  - `/prophet/:path*` → `/anfitriao/:path*`

### Gate "só uma vez" (localStorage)

- Chave: `lr.portal.v1`. Helper `src/lib/portal.ts`: `PORTAL_KEY`,
  `hasEntered()`, `markEntered()`.
- **Script inline no `<head>`** de `src/app/layout.tsx` (padrão anti-FOUC).
  Executa antes do primeiro paint **apenas quando `pathname === "/"`**:
  - Sem a chave → `location.replace("/portal")`.
  - Com a chave → `location.replace("/criativo")`.
- **Deep links respeitados:** `/criativo`, `/desenvolvedor`, `/anfitriao` e as
  subpáginas nunca passam pelo gate. Só `/` é roteado.

### Escolha → destino

- Clicar num painel do portal:
  1. `markEntered()` grava `lr.portal.v1`.
  2. Navega para a rota do realm (`/criativo`, `/desenvolvedor`, `/anfitriao`).
- **Reutiliza `UniverseTransitionProvider`** para a travessia dimensional
  existente. Fallback para navegação direta se o contexto não estiver disponível.

### Realms e derivação de rota

- `src/lib/realms.ts`: atualizar `route` (novas rotas), `label` e `aria`.
- `realmFromPath()` (em `realms.ts` e no `universe-provider.tsx`):
  - começa com `/desenvolvedor` → `developer`
  - começa com `/anfitriao` → `arcane`
  - senão (`/criativo`, `/`, subpáginas da raiz) → `creative`
- `REALMS.creative.route` = `/criativo`; `next`/ciclo inalterados.

## Componentes / arquivos

| Arquivo | Papel |
|---|---|
| `src/app/portal/layout.tsx` | Layout mínimo de tela cheia |
| `src/app/portal/page.tsx` | Monta o gate |
| `src/components/portal/portal-gate.tsx` | Os 3 painéis (client); hover/teclado; grava chave e navega |
| `src/components/portal/logos/logo-criativo.tsx` | Mundos paralelos + aberração cromática |
| `src/components/portal/logos/logo-desenvolvedor.tsx` | Prompt `❯_` com cursor piscando |
| `src/components/portal/logos/logo-anfitriao.tsx` | Selo dourado + d20 clássico (contra-rotação) |
| `src/styles/portal.css` | Estilos e keyframes do portal e logos |
| `src/lib/portal.ts` | Chave e helpers de persistência |
| `src/app/(site)/criativo/page.tsx` | Home do CRIATIVO (conteúdo movido de `(site)/page.tsx`) |
| `src/app/(site)/page.tsx` (edição) | Página `/` mínima (redirecionador do gate) |
| `src/app/desenvolvedor/**` | Renomeado de `src/app/dev/**` |
| `src/app/anfitriao/**` | Renomeado de `src/app/prophet/**` |
| `src/app/layout.tsx` (edição) | Script inline do gate |
| `src/lib/realms.ts` (edição) | Rotas novas + rerotulagem `label`/`aria` |
| `src/components/providers/universe-provider.tsx` (edição) | `realmFromPath` novo |
| `next.config.ts` (edição) | `redirects()` 301 das rotas antigas |

### Links internos a atualizar (categorias)

- `dev-realm-dock.tsx`, `dev-topbar.tsx` → `/desenvolvedor/*`
- `prophet-nav.tsx` → `/anfitriao/*`
- Qualquer `Link href="/dev"`/`"/prophet"` no app (busca global).
- `sober-dock.tsx` aponta para raiz/subpáginas — **inalterado** (não são rotas de persona).
- `sitemap.xml`, `robots`, metadados que citem as rotas.

## Conteúdo dos painéis

| Persona | Nome | Subtítulo | Logo |
|---|---|---|---|
| Criativo | **Criativo** | Design · Arte · Multiverso | Mundos paralelos (3 círculos sobrepostos) sob aberração cromática RGB |
| Desenvolvedor | **Desenvolvedor** | Aprendizado · Código · Ferramentas | Terminal `❯_` com cursor piscando (verde Dracula) |
| Anfitrião | **Anfitrião** | Boardgame · Magia · Nostalgia | Selo dourado (stroke que se desenha, giro lento) com d20 clássico em contra-rotação |

Topo: kicker "Escolha seu multiverso" + "Uma pessoa, três universos." Sem frase
de rodapé.

## Estética

- Fundo `#08080c` com vinheta radial (profundidade).
- Três painéis lado a lado; no hover, o focado expande (`flex 1.8`), os outros
  recuam (`flex .8`), e a cor-acento "floresce" (magenta / verde / dourado).
- Tipografia fina, muito espaço negativo; "Entrar →" aparece no hover.

## Acessibilidade

- Cada painel é `<button>` focável, com `aria-label` explícito.
- Teclado (Tab + Enter/Espaço) e foco visível.
- **`prefers-reduced-motion: reduce`**: congela glitch, giro do selo e cursor.
- Contraste AA sobre `#08080c`.

## CSP

- Logos em SVG/CSS via **classes** (`portal.css`), sem `style=` inline crítico.
  Compatível com o CSP atual; nenhuma origem externa nova.

## Verificação (critérios de aceite)

1. `next build` passa; sem erros de tipo.
2. **Primeiro acesso:** `/` sem a chave → `/portal` (sem flash).
3. **Escolha:** clicar grava `lr.portal.v1` e leva ao realm certo (`/criativo`,
   `/desenvolvedor`, `/anfitriao`).
4. **Segundo acesso:** `/` com a chave → `/criativo`, sem passar pelo portal.
5. **Deep link:** `/desenvolvedor` sem a chave → vai direto (não é sequestrado).
6. **Redirects:** `/dev` → `/desenvolvedor` e `/prophet` → `/anfitriao` (301).
7. **Rerotulagem:** rótulos exibem O CRIATIVO / O DESENVOLVEDOR / O ANFITRIÃO.
8. **A11y:** navegável por teclado; com reduced-motion, sem animações.
9. **CSP:** sem violações no console (Playwright em `/portal` e nas 3 personas).

## Riscos / notas

- O gate depende de `localStorage` (client-only) → redirect via script inline no
  `<head>`, não middleware.
- Renomear rotas é a maior fonte de risco: um `Link` esquecido gera 404 (mitigado
  pelos redirects 301 e por busca global de `href="/dev"`/`"/prophet"`).
- URLs públicas antigas (`/dev`, `/prophet`) seguem funcionando via 301 — bom
  para SEO e links já compartilhados.
