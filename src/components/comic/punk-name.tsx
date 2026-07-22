import { cn } from "@/lib/utils"

/**
 * Paleta de recortes da Terra-138. Alternada por posição da letra, nunca
 * sorteada: `Math.random()` no render daria markup diferente no servidor e no
 * cliente, e a hidratação reclamaria.
 */
const SCRAPS = [
  { bg: "var(--k-paper)", fg: "var(--k-ink)", rot: -4 },
  { bg: "var(--k-ink)", fg: "var(--k-paper)", rot: 3 },
  { bg: "var(--k-yellow)", fg: "var(--k-ink)", rot: -2 },
  { bg: "var(--k-magenta)", fg: "var(--k-white)", rot: 5 },
  { bg: "var(--k-white)", fg: "var(--k-ink)", rot: -6 },
  { bg: "var(--k-lime)", fg: "var(--k-ink)", rot: 2 },
  { bg: "var(--k-cyan)", fg: "var(--k-ink)", rot: -3 },
]

/** Posições que recebem o salto da anomalia — fixas, pelo mesmo motivo. */
const GLITCHED = new Set([2, 7, 11])

interface PunkNameProps {
  children: string
  className?: string
  /** Rótulo lido pelo leitor de tela; por omissão, o próprio texto. */
  label?: string
}

/**
 * Nome montado letra a letra em recortes de revista — a assinatura do autor na
 * capa, na anomalia **Terra-138 · Punk**.
 *
 * Cada letra é um `<span>` decorativo dentro de um contêiner com `aria-label`:
 * sem isso o leitor de tela soletraria "L… U… C… A… S", que é exatamente o
 * efeito visual que se quer e exatamente o que não se quer no áudio.
 */
export function PunkName({ children, className, label }: PunkNameProps) {
  const letters = [...children]

  return (
    <span
      className={cn("k-punk k-title", className)}
      role="text"
      aria-label={label ?? children}
    >
      {letters.map((ch, i) => {
        if (ch === " ") return <span key={i} aria-hidden className="k-punk-space" />

        const scrap = SCRAPS[i % SCRAPS.length]!

        return (
          <span
            key={i}
            aria-hidden
            className={cn("k-punk-letter", GLITCHED.has(i) && "k-punk-glitch")}
            style={
              {
                "--k-punk-bg": scrap.bg,
                "--k-punk-fg": scrap.fg,
                "--k-punk-rot": `${scrap.rot}deg`,
              } as React.CSSProperties
            }
          >
            {ch}
          </span>
        )
      })}
    </span>
  )
}
