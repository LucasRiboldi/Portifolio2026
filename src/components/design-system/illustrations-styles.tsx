/**
 * Ilustrações em OUTROS estilos (além do comic/punk):
 * line-art, geométrico flat, isométrico, blueprint técnico e dotwork.
 * Mostra a pluralidade de linguagens do multiverso.
 */
import * as React from "react"
type P = { className?: string }

/* Line-art contínuo */
export function LineWave({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Line art" role="img" fill="none" stroke="var(--sv-cyan)" strokeWidth="2.5" strokeLinecap="round">
      <path d="M8 70 Q30 20 52 60 T96 50 Q112 46 114 66" />
      <path d="M8 84 Q34 44 58 78 T110 70" opacity="0.6" />
      <circle cx="52" cy="60" r="4" fill="var(--sv-magenta)" stroke="none" />
    </svg>
  )
}

/* Geométrico flat (formas primárias) */
export function GeoPrism({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Geométrico" role="img">
      <polygon points="60,12 108,96 12,96" fill="var(--sv-magenta)" />
      <circle cx="60" cy="70" r="26" fill="var(--sv-cyan)" opacity="0.85" />
      <rect x="44" y="54" width="32" height="32" fill="var(--sv-yellow)" opacity="0.9" />
    </svg>
  )
}

/* Isométrico */
export function IsoCube({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Isométrico" role="img" stroke="#000" strokeWidth="2.5" strokeLinejoin="round">
      <polygon points="60,20 100,42 60,64 20,42" fill="var(--sv-cyan)" />
      <polygon points="60,64 100,42 100,88 60,110" fill="var(--sv-violet)" />
      <polygon points="60,64 20,42 20,88 60,110" fill="var(--sv-magenta)" />
    </svg>
  )
}

/* Blueprint técnico */
export function Blueprint({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Blueprint" role="img">
      <rect width="120" height="120" fill="#0a2a4a" />
      <g stroke="rgba(120,200,255,0.25)" strokeWidth="1">
        {[...Array(11)].map((_, i) => <line key={"h" + i} x1="0" y1={i * 12} x2="120" y2={i * 12} />)}
        {[...Array(11)].map((_, i) => <line key={"v" + i} x1={i * 12} y1="0" x2={i * 12} y2="120" />)}
      </g>
      <circle cx="60" cy="60" r="34" fill="none" stroke="#7fd0ff" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M60 26 V94 M26 60 H94" stroke="#7fd0ff" strokeWidth="1.5" />
    </svg>
  )
}

/* Dotwork (stippling) */
export function DotWork({ className }: P) {
  const dots: React.ReactElement[] = []
  for (let i = 0; i < 220; i++) {
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * 42
    const cx = 60 + Math.cos(a) * r
    const cy = 60 + Math.sin(a) * r
    const dens = 1 - r / 42
    dots.push(<circle key={i} cx={cx} cy={cy} r={0.6 + dens * 1.6} fill="var(--sv-lime)" />)
  }
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Dotwork" role="img">{dots}</svg>
  )
}

export const STYLE_ILLUSTRATIONS = [
  { name: "Line-art", Comp: LineWave },
  { name: "Geométrico", Comp: GeoPrism },
  { name: "Isométrico", Comp: IsoCube },
  { name: "Blueprint", Comp: Blueprint },
  { name: "Dotwork", Comp: DotWork },
] as const
