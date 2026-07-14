# Design System — Aranhaverso

Design System corporativo do portfólio. Garante consistência visual, acelera o
desenvolvimento e facilita a colaboração entre design e código.

> **Estética:** estende a identidade **Aranhaverso** (paleta hiper-saturada,
> halftone, painéis comic) já presente no portfólio.

## Hierarquia (8 camadas)

| # | Camada | Onde vive |
|---|--------|-----------|
| 01 | **Brand Foundation** — logo, cores, tipografia, ícones | `src/styles/`, `/design-system/foundations` |
| 02 | **Design Tokens** — cores, spacing, sombras, bordas, motion | `src/styles/tokens.css`, `src/design-system/tokens.ts` |
| 03 | **Style Guide** — regras visuais/identidade | `/design-system/foundations` |
| 04 | **UI Components** — botões, forms, cards, menus | `src/components/ui/`, `/design-system/components` |
| 05 | **Patterns** — login, navegação, FAQ, contato | `/design-system/patterns` |
| 06 | **Templates** — layouts de página reutilizáveis | `src/app/(site)/**`, `/design-system/templates` |
| 07 | **Acessibilidade** — WCAG 2.2 AA | `/design-system/accessibility` |
| 08 | **Documentação** — uso, boas práticas, exemplos | `docs/design-system/` |

## Arquitetura de arquivos

```
src/
  styles/
    tokens.css              # ① fonte runtime dos Design Tokens (CSS vars)
    globals.css             # importa tokens + spiderverse + tailwind
    spiderverse*.css        # camada de identidade comic
  design-system/
    tokens.ts               # ② fonte tipada (espelha tokens.css) → export
    registry.ts             # taxonomia completa (áreas/componentes/estados)
    ds-ui.tsx               # apresentacionais das páginas do DS
  components/
    ui/                     # componentes base (button, input, card…)
    design-system/          # componentes exclusivos das páginas do DS
  app/(site)/design-system/ # rota navegável do Design System
scripts/
  export-tokens.mjs         # gera public/design-tokens*.json (Figma + DTCG)
docs/design-system/         # esta documentação
```

## Fluxo de trabalho

1. **Mudou um token?** Edite `tokens.css` **e** `tokens.ts`, rode `npm run tokens:export`.
2. **Novo componente?** Crie em `src/components/ui/`, registre em `registry.ts`,
   siga [component-structure.md](./component-structure.md).
3. **Documente** o uso e a acessibilidade no guia correspondente.

## Guias

- [naming-conventions.md](./naming-conventions.md) — como nomear tudo
- [component-structure.md](./component-structure.md) — anatomia de um componente
- [states-and-variants.md](./states-and-variants.md) — matriz de estados
- [responsiveness.md](./responsiveness.md) — breakpoints e grid
- [accessibility-wcag.md](./accessibility-wcag.md) — checklist AA
- [tokens.md](./tokens.md) — camadas e export
- [roadmap.md](./roadmap.md) — fases de implementação

## Status atual — Fase 1 (Fundação) ✅

Entregue: arquitetura de rotas, camada completa de Design Tokens (CSS + Tailwind +
export Figma/JSON), documentação de convenções e índice navegável de todos os
componentes. As fases seguintes implementam cada componente a partir do índice —
ver [roadmap.md](./roadmap.md).
