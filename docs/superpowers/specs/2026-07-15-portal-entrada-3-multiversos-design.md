# Portal de Entrada — Os Três Multiversos

**Data:** 2026-07-15
**Status:** Aprovado (design) — pronto para plano de implementação

## Objetivo

Criar a **porta de entrada** do site: uma tela minimalista e profunda, exibida
**uma vez por navegador**, onde o visitante escolhe entre os três multiversos
(personas). Após escolher, é levado ao realm correspondente e navega entre as
três personas por dentro (mecanismo já existente).

## Convenção de nomes (identificação visível)

| Chave interna (`RealmId`) | Rota | Identificação visível |
|---|---|---|
| `creative` | `/` | **O CRIATIVO** |
| `developer` | `/dev` | **O DESENVOLVEDOR** |
| `arcane` | `/prophet` | **O ANFITRIÃO** |

Chaves internas e rotas **não mudam** (evita quebrar código e links). Muda só a
identificação visível: `REALMS.label`, `REALMS.aria`, botão de troca de universo
e títulos.

## Escopo

**Inclui:** rota `/portal`, gate por `localStorage`, os 3 logos animados,
rerotulagem dos realms, reúso da transição existente, a11y/reduced-motion.

**Não inclui:** redesenho da navegação interna entre personas (o
`UniverseProvider` atual é reaproveitado como está); mudança de rotas/chaves.

## Decisões de design (travadas)

1. **Persistência:** uma vez por navegador, para sempre (`localStorage`).
2. **Anfitrião** = realm `arcane` existente (`/prophet`), apenas rerotulado.
3. **Rota dedicada** `/portal` (não overlay, não substitui `/`).
4. **Nav interna:** mantém o `UniverseProvider` atual.

## Arquitetura

### Rota e layout

- `src/app/portal/layout.tsx` — layout mínimo, **sem** navbar/footer/docks. Fora
  do grupo `(site)` para não herdar o chrome do CRIATIVO. Tela cheia, fundo
  `#08080c`.
- `src/app/portal/page.tsx` — renderiza `<PortalGate />`.

### Gate "só uma vez" (localStorage)

- Chave: `lr.portal.v1`.
- **Script inline no `<head>`** de `src/app/layout.tsx` (mesmo padrão do
  anti-FOUC já presente). Executa antes do primeiro paint:
  - Se `pathname === "/"` **e** a chave não existe → `location.replace("/portal")`
    antes de renderizar (sem flash).
  - **Deep links respeitados:** qualquer outra rota (`/dev`, `/prophet`,
    subpáginas) **não** é redirecionada, mesmo sem a chave. Só a porta da frente
    (`/`) faz o gate.
- Helper `src/lib/portal.ts`: `PORTAL_KEY`, `hasEntered()`, `markEntered()`.

### Escolha → destino

- Clicar num painel:
  1. `markEntered()` grava `lr.portal.v1`.
  2. Navega para a rota do realm (`/`, `/dev`, `/prophet`).
- **Reutiliza `UniverseTransitionProvider`** para a travessia dimensional
  existente, mantendo coerência com o resto do site. Se a transição não estiver
  disponível no contexto do `/portal`, faz fallback para navegação direta.

### Rerotulagem dos realms

- `src/lib/realms.ts`: atualizar `label` e `aria` das três entradas para a
  convenção acima. Nenhuma outra mudança no registro.

## Componentes / arquivos

| Arquivo | Papel |
|---|---|
| `src/app/portal/layout.tsx` | Layout mínimo de tela cheia |
| `src/app/portal/page.tsx` | Monta o gate |
| `src/components/portal/portal-gate.tsx` | Os 3 painéis (client); hover/teclado; grava chave e navega |
| `src/components/portal/logos/logo-criativo.tsx` | Mundos paralelos + aberração cromática |
| `src/components/portal/logos/logo-desenvolvedor.tsx` | Prompt `❯_` com cursor piscando |
| `src/components/portal/logos/logo-anfitriao.tsx` | Selo dourado que se desenha + d20 clássico (contra-rotação) |
| `src/styles/portal.css` | Estilos e keyframes do portal e logos |
| `src/lib/portal.ts` | Chave e helpers de persistência |
| `src/app/layout.tsx` (edição) | Script inline do gate |
| `src/lib/realms.ts` (edição) | Rerotulagem `label`/`aria` |

## Conteúdo dos painéis

| Persona | Nome | Subtítulo | Logo |
|---|---|---|---|
| Criativo | **Criativo** | Design · Arte · Multiverso | Mundos paralelos (3 círculos sobrepostos) sob aberração cromática RGB |
| Desenvolvedor | **Desenvolvedor** | Aprendizado · Código · Ferramentas | Terminal `❯_` com cursor piscando (verde Dracula) |
| Anfitrião | **Anfitrião** | Boardgame · Magia · Nostalgia | Selo dourado (stroke que se desenha, giro lento) com d20 clássico interno em contra-rotação |

Topo: kicker "Escolha seu multiverso" + "Uma pessoa, três universos."
Sem frase de rodapé.

## Estética

- Fundo `#08080c` com vinheta radial (profundidade).
- Três painéis lado a lado; no hover, o painel focado expande (`flex 1.8`), os
  outros recuam (`flex .8`), e a cor-acento da persona "floresce" via gradiente
  radial (magenta / verde / dourado).
- Tipografia fina, muito espaço negativo; "Entrar →" aparece no hover.

## Acessibilidade

- Cada painel é elemento interativo focável (`<button>`), com
  `aria-label` explícito (ex.: "Entrar no multiverso do Criativo").
- Navegação por teclado (Tab + Enter/Espaço) e foco visível.
- **`prefers-reduced-motion: reduce`**: congela glitch, giro do selo e cursor —
  mostra estado estático legível.
- Contraste do texto sobre `#08080c` validado (AA).

## CSP

- Logos são SVG/CSS via **classes** em `portal.css` (evitar `style=` inline
  crítico). Compatível com o CSP atual (`script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`). Nenhuma origem externa nova.

## Verificação (critérios de aceite)

1. `next build` passa; sem erros de tipo.
2. **Primeiro acesso:** abrir `/` sem a chave → redireciona a `/portal` (sem
   flash perceptível).
3. **Escolha:** clicar num painel grava `lr.portal.v1` e leva ao realm certo.
4. **Segundo acesso:** abrir `/` com a chave → renderiza o CRIATIVO, sem passar
   pelo portal.
5. **Deep link:** abrir `/dev` sem a chave → vai direto ao DESENVOLVEDOR (não é
   sequestrado).
6. **Rerotulagem:** os rótulos visíveis exibem O CRIATIVO / O DESENVOLVEDOR /
   O ANFITRIÃO.
7. **A11y:** navegável por teclado; com reduced-motion, sem animações.
8. **CSP:** sem violações no console (Playwright em `/portal`).

## Riscos / notas

- O gate depende de `localStorage` (client-only); por isso o redirect é via
  script inline no `<head>`, não middleware (middleware não lê `localStorage`).
- Em navegação SPA interna do Next, o script inline roda só no load inicial —
  aceitável, pois o gate só importa na entrada "fria" pela porta da frente.
