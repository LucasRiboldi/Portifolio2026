/**
 * Ilustrações SVG punk (Spider-Punk vibe) — expansão de assets/anomalias.
 * Puro SVG, currentColor + acentos neon, sem deps.
 */
import * as React from "react"
type P = { className?: string }

export function Guitar({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Guitarra" role="img">
      <g stroke="#000" strokeWidth="3" strokeLinejoin="round">
        <path d="M40 96 q-16 8 -22 -6 t 10 -22 q6 -10 20 -6 l 30 -44 l 14 10 l -30 44 q8 12 -2 22 t -20 8" fill="var(--sv-magenta)" />
        <line x1="72" y1="18" x2="96" y2="36" stroke="var(--sv-cyan)" strokeWidth="4" />
        <circle cx="42" cy="80" r="7" fill="#000" />
        <path d="M78 22 l14 10" stroke="var(--sv-yellow)" strokeWidth="4" />
      </g>
    </svg>
  )
}

export function BoltCluster({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Raios" role="img">
      <g stroke="#000" strokeWidth="3" strokeLinejoin="round">
        <path d="M56 8 L34 60 h18 l-8 52 40-64 h-20 l14-40Z" fill="var(--sv-yellow)" />
        <path d="M92 20 L80 50 h10 l-6 30 22-40h-12l8-20Z" fill="var(--sv-cyan)" opacity="0.9" />
      </g>
    </svg>
  )
}

export function MohawkSpider({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Aranha moicano" role="img">
      <g stroke="#000" strokeWidth="3" strokeLinecap="round">
        {/* moicano */}
        <path d="M60 6 L54 30 M60 4 L60 28 M60 6 L66 30 M50 12 L48 32 M70 12 L72 32" stroke="var(--sv-magenta)" strokeWidth="4" fill="none" />
        {/* cabeça */}
        <ellipse cx="60" cy="52" rx="26" ry="24" fill="#0a0612" />
        <path d="M46 46 Q60 40 74 46 L70 58 Q60 52 50 58 Z" fill="var(--sv-cyan)" />
        <path d="M46 46 L50 58 M74 46 L70 58" stroke="#fff" strokeWidth="1.5" />
        {/* pernas */}
        <path d="M34 52 L14 44 M36 62 L16 66 M86 52 L106 44 M84 62 L104 66" fill="none" stroke="var(--sv-lime)" strokeWidth="3.5" />
      </g>
    </svg>
  )
}

export function Boombox({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Boombox" role="img">
      <g stroke="#000" strokeWidth="3" strokeLinejoin="round">
        <rect x="16" y="40" width="88" height="52" rx="6" fill="var(--sv-violet)" />
        <path d="M30 40 l16 -14 M90 40 l-16 -14" stroke="#000" strokeWidth="4" />
        <circle cx="40" cy="66" r="13" fill="#0a0612" /><circle cx="40" cy="66" r="5" fill="var(--sv-cyan)" />
        <circle cx="80" cy="66" r="13" fill="#0a0612" /><circle cx="80" cy="66" r="5" fill="var(--sv-magenta)" />
        <rect x="54" y="48" width="12" height="8" fill="var(--sv-yellow)" />
      </g>
    </svg>
  )
}

export function SafetyPin({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Alfinete" role="img">
      <path d="M30 84 q-14 -6 -8 -22 q6 -16 28 -12 l 44 8 q10 2 8 -8" fill="none" stroke="var(--sv-cyan)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="30" cy="84" r="8" fill="#000" stroke="var(--sv-cyan)" strokeWidth="3" />
      <path d="M96 58 l14 -4" stroke="var(--sv-cyan)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function SprayCan({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Lata de spray" role="img">
      <g stroke="#000" strokeWidth="3" strokeLinejoin="round">
        <rect x="44" y="40" width="34" height="66" rx="5" fill="var(--sv-magenta)" />
        <rect x="52" y="28" width="18" height="12" fill="#000" />
        <rect x="54" y="20" width="14" height="8" rx="2" fill="var(--sv-lime)" />
        <g fill="var(--sv-lime)"><circle cx="92" cy="24" r="3" /><circle cx="100" cy="30" r="2" /><circle cx="96" cy="16" r="2" /><circle cx="104" cy="22" r="1.5" /></g>
      </g>
    </svg>
  )
}

export function StarBurst({ className }: P) {
  const pts = [...Array(24)].map((_, i) => {
    const a = (i / 24) * Math.PI * 2
    const r = i % 2 ? 56 : 30
    return `${60 + Math.cos(a) * r},${60 + Math.sin(a) * r}`
  }).join(" ")
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Explosão" role="img">
      <polygon points={pts} fill="var(--sv-orange)" stroke="#000" strokeWidth="3" />
      <circle cx="60" cy="60" r="16" fill="var(--sv-yellow)" stroke="#000" strokeWidth="3" />
    </svg>
  )
}

export function Anarchy({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="Símbolo" role="img" style={{ filter: "url(#art-rough)" }}>
      <circle cx="60" cy="60" r="42" fill="none" stroke="var(--sv-magenta)" strokeWidth="7" />
      <path d="M28 44 L92 44 L40 92 L60 40 L80 92 L28 44Z" fill="none" stroke="var(--sv-magenta)" strokeWidth="7" strokeLinejoin="round" />
    </svg>
  )
}

export const PUNK_ILLUSTRATIONS = [
  { name: "MohawkSpider", Comp: MohawkSpider },
  { name: "Guitar", Comp: Guitar },
  { name: "BoltCluster", Comp: BoltCluster },
  { name: "Boombox", Comp: Boombox },
  { name: "SafetyPin", Comp: SafetyPin },
  { name: "SprayCan", Comp: SprayCan },
  { name: "StarBurst", Comp: StarBurst },
  { name: "Anarchy", Comp: Anarchy },
] as const
