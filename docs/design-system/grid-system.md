# Grid System

O grid dá ritmo e alinhamento a todas as telas. É construído sobre os mesmos
Design Tokens (spacing, container, breakpoints) — nada de números mágicos.

## Fundamentos

| Propriedade | Valor | Token |
|---|---|---|
| Colunas | 12 (desktop) · 8 (tablet) · 4 (mobile) | — |
| Gutter (espaço entre colunas) | 24px desktop · 16px mobile | `--space-6` / `--space-4` |
| Container máx. | 1200px | `--container-xl` |
| Margem lateral | 16–32px responsiva | `--space-4`…`--space-8` |
| Baseline de spacing | múltiplos de 4px | escala `--space-*` |

## Breakpoints (mobile-first)

| Nome | min-width | Colunas sugeridas |
|---|---|---|
| Mobile | 375px | 4 |
| Large Mobile | 425px | 4 |
| Tablet | 768px | 8 |
| Laptop | 1024px | 12 |
| Desktop | 1440px | 12 |

Ver [responsiveness.md](./responsiveness.md) para os prefixos Tailwind.

## Uso com Tailwind

```tsx
{/* container central */}
<div className="mx-auto max-w-container px-4 lg:px-8">…</div>

{/* grid 12 col fluido → responsivo */}
<div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-6">
  <div className="col-span-4 lg:col-span-8">principal</div>
  <div className="col-span-4">lateral</div>
</div>
```

O componente [`Container`](../../src/components/layout/container.tsx) já aplica
`max-w-container` + margens.

## Regras

1. **Baseline 4px** — todo espaçamento é múltiplo de 4 (use `--space-*`).
2. **Gutter consistente** — não misture gaps arbitrários; use `gap-4`/`gap-6`.
3. **Grid-breaking com propósito** — a direção de arte permite quebrar o grid
   (diagonais, sobreposição), mas a base ortogonal existe para ser rompida com
   intenção, não por acidente.
4. **Conteúdo, não dispositivo** — decida colunas pelo ponto em que o layout
   quebra, não por um device específico.

## Demonstração

Visualização interativa (overlay de colunas, container, baseline) em
`/design-system/grid`.
