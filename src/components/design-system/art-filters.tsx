/**
 * ArtFilters — defs de filtros SVG usados pela camada .art-* (art-direction).
 * Renderizado uma única vez no layout do site. Invisível (0×0).
 *
 * #art-rough → desloca bordas para "linha tremida" / borda imperfeita.
 * #art-ink   → turbulência de tinta para respingos/manchas.
 */
export function ArtFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="art-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="art-ink">
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="2" seed="3" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.1" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
    </svg>
  )
}
