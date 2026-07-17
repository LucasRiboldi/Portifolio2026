/**
 * Brasão do Daily Prophet — escudo com D.P. entalhado.
 * SVG estático (CSS puro, sem animação para Lighthouse).
 */
export function DailyProphetSeal() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="arc-seal"
      aria-hidden="true"
      role="presentation"
    >
      {/* Escudo base */}
      <path
        d="M 50 10 L 80 35 L 80 70 Q 80 95 50 110 Q 20 95 20 70 L 20 35 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Letra D (esquerda) */}
      <text
        x="35"
        y="65"
        fontSize="24"
        fontWeight="700"
        fontFamily="serif"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.9"
      >
        D
      </text>

      {/* Ponto/separador central */}
      <circle cx="50" cy="60" r="2" fill="currentColor" opacity="0.7" />

      {/* Letra P (direita) */}
      <text
        x="65"
        y="65"
        fontSize="24"
        fontWeight="700"
        fontFamily="serif"
        textAnchor="middle"
        fill="currentColor"
        opacity="0.9"
      >
        P
      </text>
    </svg>
  )
}
