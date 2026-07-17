import { cn } from "@/lib/utils"

/* --- Speech bubble ---------------------------------------------------- */
export function SpeechBubble({
  children,
  spiky,
  thought,
  className,
}: {
  children: React.ReactNode
  spiky?: boolean
  thought?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "sv-bubble text-sm",
        spiky && "sv-bubble-spiky",
        thought && "sv-bubble-thought",
        className
      )}
    >
      {children}
    </span>
  )
}

/* --- Caption / narration box ------------------------------------------ */
export function CaptionBox({
  children,
  color = 'yellow',
  className,
}: {
  children: React.ReactNode
  color?: 'yellow' | 'cyan' | 'white'
  className?: string
}) {
  const c = { yellow: '', cyan: 'sv-caption-cyan', white: 'sv-caption-white' }[color]
  return <span className={cn("sv-caption", c, className)}>{children}</span>
}

/* --- Star-burst badge ------------------------------------------------- */
export function BurstBadge({
  children,
  color = 'yellow',
  className,
}: {
  children: React.ReactNode
  color?: 'yellow' | 'magenta' | 'cyan'
  className?: string
}) {
  const c = { yellow: '', magenta: 'sv-badge-burst-magenta', cyan: 'sv-badge-burst-cyan' }[color]
  return (
    <span className={cn("sv-badge-burst text-lg uppercase", c, className)}>{children}</span>
  )
}

/* --- Halftone divider ------------------------------------------------- */
export function HalftoneDivider({ className }: { className?: string }) {
  return <div className={cn("sv-divider my-6", className)} />
}

/* --- Split panel: two dimensions in one card -------------------------- */
export function SplitPanel({
  a,
  b,
  children,
  className,
}: {
  a: string // dimension class for side A (e.g. 'sv-dim-neon')
  b: string // dimension class for side B
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("sv-panel sv-split min-h-[140px] p-4", className)}>
      <span className={cn("sv-split-a sv-canvas", a)} />
      <span className={cn("sv-split-b sv-canvas", b)} />
      <div className="sv-split-content relative z-[2] h-full">{children}</div>
    </div>
  )
}

/* --- Onomatopoeia (POW! ZAP! BAM!) ------------------------------------ */
type OnomaColor = 'yellow' | 'cyan' | 'magenta' | 'lime' | 'violet' | 'orange'
const onomaColor: Record<OnomaColor, string> = {
  yellow: '',
  cyan: 'sv-onoma-cyan',
  magenta: 'sv-onoma-magenta',
  lime: 'sv-onoma-lime',
  violet: 'sv-onoma-violet',
  orange: 'sv-onoma-orange',
}

export function Onoma({
  children,
  color = 'yellow',
  className,
}: {
  children: React.ReactNode
  color?: OnomaColor
  className?: string
}) {
  return (
    <span className={cn("sv-onoma sv-onoma-pop text-4xl sm:text-5xl", onomaColor[color], className)}>
      {children}
    </span>
  )
}

/* --- Comic panel (dimension-aware card) ------------------------------ */
export function Panel({
  children,
  tilt,
  className,
}: {
  children: React.ReactNode
  tilt?: 1 | 2 | 3
  className?: string
}) {
  return (
    <div className={cn("sv-panel sv-action p-4", tilt && `sv-tilt-${tilt}`, className)}>
      <span className="sv-lines rounded-[6px]" />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

/* --- Comic button ----------------------------------------------------- */
type BtnColor = 'yellow' | 'cyan' | 'magenta' | 'lime' | 'violet' | 'orange'
const btnBg: Record<BtnColor, string> = {
  yellow: 'var(--sv-yellow)',
  cyan: 'var(--sv-cyan)',
  magenta: 'var(--sv-magenta)',
  lime: 'var(--sv-lime)',
  violet: 'var(--sv-violet)',
  orange: 'var(--sv-orange)',
}
const lightText: BtnColor[] = ['magenta', 'violet']

export function ComicButton({
  children,
  color = 'yellow',
  ghost,
  className,
  ...props
}: {
  children: React.ReactNode
  color?: BtnColor
  ghost?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const light = lightText.includes(color)
  return (
    <button
      className={cn(
        "sv-display border-[3px] border-black px-5 py-2 text-lg uppercase shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[-2deg]",
        ghost ? "bg-transparent" : light ? "text-white" : "text-black",
        className
      )}
      style={ghost ? { color: btnBg[color], borderColor: btnBg[color] } : { background: btnBg[color] }}
      {...props}
    >
      {children}
    </button>
  )
}

/* --- Comic page header (dimension-aware) ------------------------------ */
/**
 * `as` existe porque estas páginas têm duas vidas: sozinhas na própria rota
 * (onde o título é o h1 legítimo) e como capítulo do documento único do
 * Design System (onde 29 h1 na mesma página destroem a hierarquia para quem
 * navega por leitor de tela). O padrão continua h1 — só o documento rebaixa.
 */
export function ComicHeader({
  kicker,
  title,
  highlight,
  subtitle,
  as: Tag = "h1",
}: {
  kicker?: string
  title: string
  highlight?: string
  subtitle?: string
  as?: "h1" | "h2"
}) {
  return (
    <header className="mb-10">
      {kicker && <span className="sv-sticker sv-sticker-cyan text-sm">{kicker}</span>}
      <Tag className="sv-page-title mt-4">
        {title}{" "}
        {highlight && <span className="sv-rainbow art-bloom">{highlight}</span>}
      </Tag>
      {subtitle && (
        <p className="sv-heavy mt-4 max-w-xl text-sm uppercase tracking-wide opacity-80">
          {subtitle}
        </p>
      )}
    </header>
  )
}
