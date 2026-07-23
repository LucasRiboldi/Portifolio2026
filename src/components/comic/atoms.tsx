import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Átomos da linguagem visual Comic 2026.
 *
 * Todos são Server Components puros: são camadas de pintura, sem estado nem
 * evento. Ficam juntos porque nenhum chega a 30 linhas e separá-los criaria
 * dez imports para a mesma ideia — "letragem e textura de quadrinho".
 * O que é decorativo vai `aria-hidden`; o que carrega texto, não.
 */

export type Accent =
  | "yellow" | "orange" | "red" | "magenta" | "violet"
  | "blue" | "cyan" | "lime" | "green" | "pink"

/** Mapa acento → token. Evita interpolar nome de classe (o Tailwind não vê). */
export const ACCENT_VAR: Record<Accent, string> = {
  yellow: "var(--k-yellow)",
  orange: "var(--k-orange)",
  red: "var(--k-red)",
  magenta: "var(--k-magenta)",
  violet: "var(--k-violet)",
  blue: "var(--k-blue)",
  cyan: "var(--k-cyan)",
  lime: "var(--k-lime)",
  green: "var(--k-green)",
  pink: "var(--k-pink)",
}

/** Retícula benday. `step` controla a densidade dos pontos. */
export function Halftone({
  className,
  color = "rgba(18,16,14,0.22)",
  step = 7,
}: {
  className?: string
  color?: string
  step?: number
}) {
  return (
    <span
      aria-hidden
      className={cn("k-halftone pointer-events-none absolute inset-0", className)}
      style={{ "--k-dot": color, "--k-dot-step": `${step}px` } as React.CSSProperties}
    />
  )
}

/** Leque de linhas de velocidade a partir de um foco (em % do bloco). */
export function SpeedLines({
  className,
  x = 50,
  y = 50,
  color = "rgba(18,16,14,0.14)",
}: {
  className?: string
  x?: number
  y?: number
  color?: string
}) {
  return (
    <span
      aria-hidden
      className={cn("k-speedlines pointer-events-none absolute inset-0", className)}
      style={{ "--k-speed-x": `${x}%`, "--k-speed-y": `${y}%`, "--k-speed-color": color } as React.CSSProperties}
    />
  )
}

/** Explosão em estrela — fundo de selo de impacto. */
export function Burst({
  children,
  className,
  accent,
}: {
  children?: React.ReactNode
  className?: string
  accent?: Accent
}) {
  return (
    <span
      className={cn("k-burst inline-flex items-center justify-center text-center", className)}
      style={accent ? ({ "--k-zone-c": ACCENT_VAR[accent] } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  )
}

/** Onomatopeia solta — POW!, ZAP!, THWIP! */
export function Onoma({
  children,
  className,
  accent,
}: {
  children: React.ReactNode
  className?: string
  accent?: Accent
}) {
  return (
    <span
      aria-hidden
      className={cn("k-onoma select-none", className)}
      style={accent ? ({ "--k-zone-c": ACCENT_VAR[accent] } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  )
}

/** Anéis de impacto que pulsam a partir de um ponto. */
export function PulseRings({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute", className)}>
      {[0, 0.8, 1.6].map((delay) => (
        <span
          key={delay}
          className="k-pulse-ring absolute inset-0"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  )
}

/** Separador de tinta entre zonas. */
export function InkDivider({ className }: { className?: string }) {
  return <div aria-hidden className={cn("k-ink-divider w-full", className)} />
}

/** Selo de legenda — a plaquinha do canto do quadro. */
export function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("k-caption text-[11px] sm:text-xs", className)}>{children}</span>
}

/** Balão de fala (ou de pensamento). Conteúdo real — não é `aria-hidden`. */
export function Bubble({
  children,
  className,
  thought = false,
}: {
  children: React.ReactNode
  className?: string
  thought?: boolean
}) {
  return (
    <p className={cn("k-bubble k-body text-sm font-medium", thought && "k-bubble--thought", className)}>
      {children}
    </p>
  )
}

/** Nota em estrelas. O valor vai no `aria-label`; os símbolos são decoração. */
export function Stars({ value, className }: { value: number; className?: string }) {
  if (value <= 0) return null
  return (
    <span role="img" className={cn("k-stars text-sm", className)} aria-label={`Nota ${value} de 5`}>
      <span aria-hidden>{"★".repeat(value)}{"☆".repeat(5 - value)}</span>
    </span>
  )
}

/**
 * Botão de ação. Renderiza `<a>` quando recebe `href` e `<button>` caso
 * contrário — a semântica segue o comportamento, não a aparência.
 */
export function ComicButton({
  children,
  href,
  variant = "primary",
  className,
  ...rest
}: {
  children: React.ReactNode
  href?: string
  variant?: "primary" | "ghost"
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(
    "k-btn k-sub px-6 py-3 text-sm sm:text-base",
    variant === "primary" ? "k-btn--primary" : "k-btn--ghost",
    className,
  )

  if (href) {
    const external = href.startsWith("http")
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
