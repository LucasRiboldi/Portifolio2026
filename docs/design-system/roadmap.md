# Roadmap do Design System

Implementação faseada. A Fase 1 (fundação) está entregue; as seguintes consomem o
índice em `src/design-system/registry.ts`.

## ✅ Fase 1 — Fundação (entregue)

- Arquitetura de rotas `/design-system` (layout + sidebar + 8 páginas)
- Camada completa de **Design Tokens** (`tokens.css` + `tokens.ts`)
- Extensão do `tailwind.config.ts` (escalas, z-index, blur, elevation, screens…)
- Export **Figma + W3C DTCG** (`npm run tokens:export`)
- `registry.ts` — taxonomia completa (áreas, componentes, variantes, estados)
- Documentação de convenções, estrutura, estados, responsividade, a11y e tokens

## 🔜 Fase 2 — Componentes base (UI Components)

Implementar + documentar com todos os estados, um grupo por vez:

1. **Botões** — Primary/Secondary/Ghost/Outlined/Link/FAB/Icon × 6 estados
2. **Inputs & Forms** — 12 tipos + Checkbox/Radio/Switch/Slider/Rating/Toggle
3. **Data Display** — Chips/Tags/Badges/Pagination/Breadcrumb/Tabs/Accordion/Cards
4. **Overlays** — Modal/Drawer/Popover/Tooltip/Dropdown/Context Menu
5. **Feedback** — Alert/Toast/Snackbar/Progress/Skeleton/Empty/404/500/Offline

Cada componente: arquivo em `ui/`, página de demonstração "live" no `/design-system`,
checklist de acessibilidade, exemplos de código.

## 🔜 Fase 3 — Seções & Navegação

Hero, CTA, Pricing, FAQ, Testimonials, Timeline, Statistics, Logos Grid, Partners,
Team, Blog Cards, Newsletter, Contact Form — como blocos reutilizáveis em `sections/`.

## 🔜 Fase 4 — Patterns & Templates

Login/Auth, busca & filtros, formulários multi-step; templates de Landing, Blog,
Dashboard, páginas de erro.

## 🔜 Fase 5 — Motion & Refino

Biblioteca de motion (pop/tilt, dimension swap, glitch), documentação de uso,
auditoria de acessibilidade completa e (opcional) Storybook.

## Backlog / melhorias técnicas

- Gerar `tokens.css` a partir de `tokens.ts` no build (fim da duplicação manual)
- Teste de sincronização tokens.css ↔ tokens.ts no CI
- Snapshot visual dos componentes (Playwright)
- Storybook como catálogo alternativo (avaliado; hoje o `/design-system` in-app cobre)
