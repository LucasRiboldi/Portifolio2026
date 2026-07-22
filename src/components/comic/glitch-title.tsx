import { cn } from "@/lib/utils"

type Treatment = "glitch" | "rainbow" | "letter"

interface GlitchTitleProps {
  children: string
  /**
   * `glitch` = datamosh vermelho-ciano; `rainbow` = preenchimento arco-íris
   * animado; `letter` = letragem sólida com contorno e sombra dura.
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
        className,
      )}
      data-text={treatment === "glitch" ? children : undefined}
    >
      {children}
    </Tag>
  )
}
