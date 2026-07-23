import { cn } from "@/lib/utils"

/**
 * Paleta de recortes de revista. Alternada por posição da letra, nunca
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

interface RansomTextProps {
  children: string
  className?: string
  /** Rótulo lido pelo leitor de tela; por omissão, o próprio texto. */
  label?: string
  /**
   * Posições (índice da letra) que recebem o salto de anomalia `k-punk-glitch`.
   * Vazio por omissão — o ransom limpo. O `PunkName` passa as posições da
   * Terra-138.
   */
  glitchAt?: ReadonlySet<number>
}

/**
 * Texto montado letra a letra em recortes de revista — o efeito "ransom note".
 *
 * Base reutilizável separada do `PunkName`: aqui vive só a mecânica do recorte
 * (um `<span>` por letra, cor alternada por posição, acessível como um bloco de
 * texto). O `PunkName` é este componente com as posições de glitch da anomalia
 * Terra-138 já ligadas.
 *
 * Cada letra é decorativa dentro de um contêiner com `aria-label`: sem isso o
 * leitor de tela soletraria "L… U… C… A… S", que é o efeito visual desejado e
 * exatamente o que não se quer no áudio.
 */
export function RansomText({ children, className, label, glitchAt }: RansomTextProps) {
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
            className={cn("k-punk-letter", glitchAt?.has(i) && "k-punk-glitch")}
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
