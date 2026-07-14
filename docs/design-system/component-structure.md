# Estrutura de Componentes

Todo componente UI segue a mesma anatomia para ser previsível e reutilizável.

## Anatomia de um arquivo

```tsx
// src/components/ui/icon-button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Variantes com CVA — mapeiam props → classes de token
const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all outline-none " +
  "focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-disabled disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-600",
        ghost: "hover:bg-surface-hover text-foreground",
      },
      size: { sm: "size-7", md: "size-9", lg: "size-11" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

// 2. Props = props nativas + VariantProps
type IconButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & { isLoading?: boolean }

// 3. Componente — data-slot + estados via aria/data
export function IconButton({ className, variant, size, isLoading, ...props }: IconButtonProps) {
  return (
    <button
      data-slot="icon-button"
      aria-busy={isLoading}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

## Princípios

1. **CVA para variantes** — nunca `if/else` de className espalhado.
2. **`cn()`** (clsx + tailwind-merge) sempre no `className` final, permitindo override.
3. **Props nativas** via `React.ComponentProps<'el'>` — não reinvente `onClick` etc.
4. **`data-slot`** em cada raiz — facilita seletores e testes.
5. **Estados acessíveis** por `aria-*`/`data-*`, estilizados com variantes Tailwind.
6. **defaultVariants** sempre definidos.
7. **Sem lógica de negócio** dentro de componentes de UI.

## Organização de pastas

```
src/components/
  ui/            # primitivos reutilizáveis (button, input, card, badge…)
  layout/        # navbar, footer, sidebar, container
  sections/      # blocos de página (hero, cta, faq…)
  forms/         # composições de formulário
  <feature>/     # componentes específicos de feature
```

Regra: se é reutilizável e sem contexto de negócio → `ui/`. Se combina vários `ui/`
para um fluzo → `sections/` ou `<feature>/`.

## Composição > configuração

Prefira subcomponentes compostos a props booleanas infinitas:

```tsx
<Card>
  <Card.Header>…</Card.Header>
  <Card.Body>…</Card.Body>
</Card>
```

Ver a matriz de estados em [states-and-variants.md](./states-and-variants.md).
