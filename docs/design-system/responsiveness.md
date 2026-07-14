# Responsividade

Abordagem **mobile-first**: estilize o menor viewport primeiro e progrida com
`min-width` (prefixos Tailwind).

## Breakpoints

| Nome | min-width | Prefixo Tailwind | Uso típico |
|------|-----------|------------------|------------|
| Mobile | 375px | `mobile:` | smartphones |
| Large Mobile | 425px | `mobile-lg:` | phablets |
| Tablet | 768px | `tablet:` / `md:` | tablets retrato |
| Laptop | 1024px | `laptop:` / `lg:` | tablets paisagem / laptops |
| Desktop | 1440px | `desktop:` / `xl:` | telas grandes |
| Landscape | — | `@media (orientation: landscape)` | orientação |

> Os breakpoints padrão do Tailwind (`sm/md/lg/xl/2xl`) continuam disponíveis; os
> nomes acima (`mobile`, `tablet`, `laptop`, `desktop`) foram adicionados em
> `tailwind.config.ts` para casar com a linguagem do Design System.

## Grid & Container

- Container central: `max-w-container` (1200px) via token `--container-xl`.
- Grid fluido: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Espaçamento responsivo: use a escala `--space-*` (`px-4 lg:px-8`).

## Regras

1. **Toque:** alvos ≥ 44×44px em mobile (WCAG 2.5.5).
2. **Sem scroll horizontal** — teste em 320px de largura.
3. **Tipografia fluida:** suba a escala em breakpoints (`text-2xl lg:text-4xl`),
   não com `vw` sem limites.
4. **Imagens:** `max-w-full h-auto`, `sizes` adequado no `next/image`.
5. **Navegação:** `Navbar` desktop ↔ `MobileMenu` abaixo de `md`.
6. **Conteúdo, não dispositivo:** decida breakpoints pelo ponto em que o layout
   quebra, não por um device específico.
