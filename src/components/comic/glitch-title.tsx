import { cn } from "@/lib/utils"

export type Treatment =
  | "glitch"
  | "rainbow"
  | "letter"
  | "3d"
  | "3d-deep"
  | "chrome"
  | "neon"
  | "offset"
  | "outline"

interface GlitchTitleProps {
  children: string
  /**
   * `glitch` = datamosh vermelho-ciano; `rainbow` = preenchimento arco-íris
   * animado; `letter` = letragem sólida com contorno e sombra dura;
   * `3d` / `3d-deep` = extrusão por camadas, na cor de acento da zona.
   */
  treatment?: Treatment
  as?: "h1" | "h2" | "h3" | "span"
  id?: string
  className?: string
}

/**
 * Manchete com tratamento de letragem de HQ.
 *
 * O texto é passado como `string` e não como `ReactNode` de propósito: o efeito
 * de glitch duplica o conteúdo em `::before`/`::after` via `attr(data-text)`, o
 * que só funciona com texto puro. Aceitar JSX aqui daria um componente que
 * silenciosamente perde o efeito conforme o que lhe entregam.
 *
 * As cópias do glitch são pseudo-elementos, logo invisíveis para o leitor de
 * ecrã — o título é anunciado uma vez só.
 */
export function GlitchTitle({
  children,
  treatment = "letter",
  as: Tag = "h2",
  id,
  className,
}: GlitchTitleProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "k-title",
        treatment === "glitch" && "k-glitch",
        treatment === "rainbow" && "k-letter-rainbow",
        treatment === "letter" && "k-letter",
        treatment === "3d" && "k-3d",
        treatment === "3d-deep" && "k-3d k-3d--deep",
        // Efeitos do catálogo Comic FX (comic-fx.css) — escolhidos por dimensão.
        treatment === "chrome" && "kfx-chrome",
        treatment === "neon" && "kfx-neon",
        treatment === "offset" && "kfx-offset",
        treatment === "outline" && "kfx-outline-double",
        className,
      )}
      data-text={treatment === "glitch" ? children : undefined}
    >
      {children}
    </Tag>
  )
}
