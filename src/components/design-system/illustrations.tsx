/**
 * Ilustrações SVG do Design System — "alucinações" geométricas e animadas.
 * Puro SVG, sem dependências, theme-aware via CSS vars.
 */
import * as React from "react"

type P = { className?: string }

/* ---- Emblema aranha (glitch cromático) ---- */
export function SpiderEmblem({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Emblema aranha">
      <g stroke="#000" strokeWidth="3" strokeLinecap="round">
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          const bend = i % 2 ? 8 : -8
          return (
            <path
              key={i}
              d={`M60 60 Q${60 + Math.cos(a) * 26 + bend} ${60 + Math.sin(a) * 26} ${60 + Math.cos(a) * 48} ${60 + Math.sin(a) * 48}`}
              fill="none"
              stroke={i % 2 ? "var(--sv-cyan)" : "var(--sv-magenta)"}
            />
          )
        })}
        <ellipse cx="60" cy="60" rx="13" ry="17" fill="#000" />
        <ellipse cx="60" cy="50" rx="7" ry="9" fill="var(--sv-magenta)">
          <animate attributeName="fill" values="var(--sv-magenta);var(--sv-cyan);var(--sv-magenta)" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  )
}

/* ---- Portal multiverso ---- */
export function MultiversePortal({ className }: P) {
  const rings = ["var(--sv-magenta)", "var(--sv-cyan)", "var(--sv-yellow)", "var(--sv-lime)"]
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Portal multiverso">
      {rings.map((c, i) => (
        <circle
          key={i}
          cx="60" cy="60" r={50 - i * 11}
          fill="none" stroke={c} strokeWidth="4" strokeDasharray={`${18 - i * 2} ${8 + i * 3}`}
          opacity={0.9 - i * 0.12}
        >
          <animateTransform attributeName="transform" type="rotate" from={`0 60 60`} to={`${i % 2 ? -360 : 360} 60 60`} dur={`${6 + i * 2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="60" cy="60" r="8" fill="#fff">
        <animate attributeName="r" values="8;11;8" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/* ---- Burst / estrela de ação ---- */
export function ComicBurst({ className, label = "POW!" }: P & { label?: string }) {
  const pts = [...Array(20)].map((_, i) => {
    const a = (i / 20) * Math.PI * 2
    const r = i % 2 ? 58 : 40
    return `${60 + Math.cos(a) * r},${60 + Math.sin(a) * r}`
  }).join(" ")
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={label}>
      <polygon points={pts} fill="var(--sv-yellow)" stroke="#000" strokeWidth="3">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="12 60 60" dur="0.4s" repeatCount="indefinite" additive="sum" values="-6 60 60;6 60 60;-6 60 60" />
      </polygon>
      <text x="60" y="67" textAnchor="middle" fontFamily="var(--font-display)" fontSize="22" fill="#000">{label}</text>
    </svg>
  )
}

/* ---- Herói em salto (silhueta geométrica) ---- */
export function LeapingHero({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Herói saltando">
      <g transform="rotate(-15 60 60)">
        <path d="M60 22 L74 46 L64 52 L88 74 L70 72 L74 98 L58 78 L44 96 L48 70 L30 74 L52 54 L42 48 Z"
          fill="var(--sv-magenta)" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="60" cy="38" r="10" fill="#000" />
        <path d="M55 36 Q60 30 65 36 Q62 42 60 42 Q58 42 55 36Z" fill="var(--sv-cyan)" />
      </g>
    </svg>
  )
}

/* ---- Teia de canto ---- */
export function WebCorner({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Teia" fill="none" stroke="var(--sv-paper)" strokeWidth="1.2" opacity="0.7">
      {[16, 30, 46, 64, 84].map((r) => (
        <path key={r} d={`M0 0 A${r} ${r} 0 0 1 ${r} 0 M0 0 A${r} ${r} 0 0 0 0 ${r}`} />
      ))}
      {[...Array(6)].map((_, i) => {
        const a = (i / 10) * Math.PI / 2
        return <line key={i} x1="0" y1="0" x2={Math.cos(a) * 96} y2={Math.sin(a) * 96} />
      })}
    </svg>
  )
}

/* ---- Raio comic ---- */
export function Bolt({ className }: P) {
  return (
    <svg viewBox="0 0 60 120" className={className} role="img" aria-label="Raio">
      <path d="M34 6 L10 66 L28 66 L22 114 L52 44 L32 44 Z" fill="var(--sv-yellow)" stroke="#000" strokeWidth="3" strokeLinejoin="round">
        <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  )
}

export const ILLUSTRATIONS = [
  { name: "SpiderEmblem", Comp: SpiderEmblem },
  { name: "MultiversePortal", Comp: MultiversePortal },
  { name: "ComicBurst", Comp: ComicBurst },
  { name: "LeapingHero", Comp: LeapingHero },
  { name: "WebCorner", Comp: WebCorner },
  { name: "Bolt", Comp: Bolt },
] as const
