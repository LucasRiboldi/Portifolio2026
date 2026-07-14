# Design Tokens

Tokens são os valores atômicos do sistema. São a **única fonte de verdade** de cor,
tipografia, espaçamento, forma e movimento.

## Camadas (3 níveis)

1. **Primitivo** — valor cru, sem semântica: `--c-primary-500: #ff2d95`
2. **Semântico** — intenção: `--color-primary`, `--text-muted`, `--shadow-md`
3. **Componente** — aplicado no CSS/Tailwind do componente (`bg-primary rounded-lg`)

Componentes consomem **semânticos** (ou escalas via Tailwind), nunca hexadecimais
soltos.

## Fontes de verdade

| Arquivo | Papel |
|---------|-------|
| `src/styles/tokens.css` | **runtime** — CSS custom properties (light/dark) |
| `src/design-system/tokens.ts` | **tipado** — espelho para código e export |
| `tailwind.config.ts` | mapeia tokens → utilitários (`bg-primary-500`, `z-modal`) |
| `public/design-tokens.json` | export **W3C DTCG** (`$value`/`$type`) |
| `public/design-tokens.figma.json` | export **Figma Tokens Studio** |

## Categorias

Colors · Typography · Spacing · Radius · Shadow/Elevation · Border · Motion
(duration + easing) · Opacity · Blur · Z-index · Breakpoints · Gradients.

## Export para Figma & código

```bash
npm run tokens:export
```

Gera os dois JSONs em `/public`. No Figma, importe `design-tokens.figma.json` com o
plugin **Tokens Studio**. Para outras ferramentas (Style Dictionary etc.), use o
`design-tokens.json` no formato W3C DTCG.

## Sincronização (regra crítica)

`tokens.css` (runtime) e `tokens.ts` (export) precisam ter os **mesmos valores**. Ao
alterar:

1. Edite o valor em **ambos**.
2. Rode `npm run tokens:export`.
3. Commit dos dois arquivos + os JSONs gerados.

> Melhoria futura (Fase 2): gerar `tokens.css` a partir de `tokens.ts` no build para
> eliminar a duplicação manual.

## Compatibilidade

A camada de tokens também **define os nomes que o `tailwind.config.ts` já
esperava** (`--primary-500`, `--radius-md`, `--shadow-md`, `--text-muted`,
`--surface`, `--font-mono`…), que antes não existiam. Isso corrige utilitários como
`bg-primary`, `shadow-md`, `rounded-md` e `text-muted`, que resolviam para
`undefined`.
