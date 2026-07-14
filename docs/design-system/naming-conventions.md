# Convenção de Nomenclatura

Uma nomenclatura previsível é o que torna um Design System manutenível. Adotamos
**Tailwind (utility-first) como camada primária**, **tokens CSS** como fonte de
verdade e **BEM** apenas quando escrevemos CSS custom (ex.: camada spiderverse).

## 1. Design Tokens (CSS custom properties)

Padrão: `--<categoria>-<nome>-<escala>`

```
--c-primary-500       /* cor primitiva */
--font-size-lg        /* tipografia */
--space-4             /* espaçamento */
--radius-md           /* raio */
--shadow-md           /* sombra */
--elevation-3         /* sombra comic */
--z-modal             /* z-index */
--duration-normal     /* motion */
--ease-spring         /* easing */
```

Três níveis:
- **Primitivo** — `--c-primary-500` (valor cru)
- **Semântico** — `--color-primary`, `--text-muted` (intenção)
- **Componente** — aplicado via Tailwind/CSS do componente

## 2. Tailwind (classes utilitárias)

Consuma tokens pelas escalas mapeadas em `tailwind.config.ts`:

```tsx
<button className="bg-primary-500 text-primary-foreground shadow-md rounded-lg">
<div className="text-muted border-border bg-surface">
<div className="z-modal shadow-elevation-3 font-display">
```

Ordem recomendada das classes: **layout → box → tipografia → cor → estado**.
Ex.: `flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary rounded-lg hover:bg-primary-600`.

## 3. Componentes React

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Arquivo | `kebab-case.tsx` | `icon-button.tsx` |
| Componente | `PascalCase` | `IconButton` |
| Variantes (CVA) | `camelCase` | `variant`, `size` |
| Valores de variante | `kebab` ou palavra | `primary`, `icon-sm` |
| Props booleanas | prefixo `is/has` | `isLoading`, `hasError` |
| Hooks | `useAlgo` | `useDisclosure` |

## 4. BEM (apenas em CSS custom)

Quando não há utilitário Tailwind (ex.: efeitos comic complexos):

```css
.sv-panel {}              /* Bloco */
.sv-panel__title {}       /* Elemento */
.sv-panel--highlight {}   /* Modificador */
```

Prefixo `sv-` reservado para a camada Aranhaverso.

## 5. data-attributes para estado

Preferir `data-*` a classes para estados controlados por lógica/ARIA:

```tsx
<button data-slot="button" data-loading={isLoading} aria-busy={isLoading}>
```

Isso mantém a estilização declarativa (`data-[loading=true]:opacity-70`).
