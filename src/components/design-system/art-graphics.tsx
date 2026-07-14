/**
 * Grafismos narrativos (Onda 3) — marcas "desenhadas à mão".
 * SVG reutilizável, usa o filtro #art-rough para tremor orgânico.
 * Usar SEMPRE com propósito (apontar, circular, anotar), nunca só decoração.
 */
type P = { className?: string; color?: string }

/** Seta curva desenhada à mão — aponta para algo. */
export function ArtArrow({ className, color = "var(--sv-magenta)" }: P) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden style={{ filter: "url(#art-rough)" }}>
      <path d="M6 12 Q40 4 62 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M50 30 L64 36 L58 22" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Círculo de anotação (como caneta circulando um item). */
export function ArtCircleMark({ className, color = "var(--sv-cyan)" }: P) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden style={{ filter: "url(#art-rough)" }}>
      <path
        d="M60 6 C100 6 116 22 114 36 C112 54 82 64 56 64 C24 64 6 50 8 32 C10 16 30 8 60 6 C86 6 104 16 106 30"
        fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
      />
    </svg>
  )
}

/** Rabisco de ênfase (sublinhado bruto duplo). */
export function ArtScribble({ className, color = "var(--sv-lime)" }: P) {
  return (
    <svg viewBox="0 0 140 16" className={className} aria-hidden style={{ filter: "url(#art-rough)" }}>
      <path d="M4 6 Q40 2 72 6 T136 5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M8 11 Q44 8 76 11 T132 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/** Asterisco/estrela desenhado — marca de nota. */
export function ArtStarMark({ className, color = "var(--sv-yellow)" }: P) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden style={{ filter: "url(#art-rough)" }}>
      <g stroke={color} strokeWidth="3" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="34" /><line x1="8" y1="12" x2="32" y2="28" /><line x1="32" y1="12" x2="8" y2="28" />
      </g>
    </svg>
  )
}
