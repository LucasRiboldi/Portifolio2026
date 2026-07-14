/**
 * ArtOverlay — camada de textura por universo (Onda 2 da direção de arte).
 * Renderiza layers aria-hidden absolutos com a camada .art-*, sem tocar nos
 * pseudo-elementos do .sv-canvas (que carregam o halftone-assinatura).
 *
 * Cada preset dá personalidade própria à tela mantendo a dimensão existente.
 */
type Universe = "painterly" | "watercolor" | "graffiti" | "noir" | "cyber" | "offset"

const csv = (o: Record<string, string>) => o as React.CSSProperties

export function ArtOverlay({ universe }: { universe: Universe }) {
  switch (universe) {
    // Portfólio (renaissance) — offset pictórico: retícula irregular + grão
    case "painterly":
      return (
        <>
          <div aria-hidden className="art-grain pointer-events-none absolute inset-0 z-[1]" />
          <div
            aria-hidden
            className="art-ht-irregular pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 opacity-20 [mask-image:linear-gradient(to_bottom,#000,transparent)]"
            style={csv({ "--ht-color": "rgba(255,214,120,0.5)" })}
          />
        </>
      )

    // Sobre (nouveau) — aquarela: papel + retícula suave quente
    case "watercolor":
      return (
        <>
          <div aria-hidden className="art-paper pointer-events-none absolute inset-0 z-[1]" style={csv({ "--paper-opacity": "0.09" })} />
          <div
            aria-hidden
            className="art-ht-hex pointer-events-none absolute inset-0 z-[1] opacity-[0.08]"
            style={csv({ "--ht-color": "rgba(120,80,180,0.6)", "--ht-size": "14px" })}
          />
        </>
      )

    // Contato (punk) — grafite: spray + linhas cinéticas
    case "graffiti":
      return (
        <>
          <div aria-hidden className="art-grain pointer-events-none absolute inset-0 z-[1]" style={csv({ "--grain-opacity": "0.11" })} />
          <div
            aria-hidden
            className="art-ht-lines pointer-events-none absolute inset-0 z-[1] opacity-[0.10]"
            style={csv({ "--ht-color": "rgba(182,255,0,0.6)", "--ht-size": "8px" })}
          />
        </>
      )

    // Blog (noir) — filme antigo: grão pesado + vinheta
    case "noir":
      return (
        <>
          <div aria-hidden className="art-grain pointer-events-none absolute inset-0 z-[1]" style={csv({ "--grain-opacity": "0.16" })} />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] [background:radial-gradient(circle,transparent_55%,rgba(0,0,0,0.55))]" />
        </>
      )

    // Skills/Tools (neon) — cyberpunk: retícula losango ciano + RGB sutil
    case "cyber":
      return (
        <>
          <div aria-hidden className="art-grain pointer-events-none absolute inset-0 z-[1]" style={csv({ "--grain-opacity": "0.08" })} />
          <div
            aria-hidden
            className="art-ht-diamond pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 opacity-25 [mask-image:linear-gradient(to_top,#000,transparent)]"
            style={csv({ "--ht-color": "rgba(0,229,255,0.5)", "--ht-size": "9px" })}
          />
        </>
      )

    // Genérico offset editorial
    case "offset":
    default:
      return (
        <div
          aria-hidden
          className="art-ht-irregular pointer-events-none absolute inset-0 z-[1] opacity-[0.08]"
          style={csv({ "--ht-color": "rgba(0,229,255,0.5)" })}
        />
      )
  }
}
