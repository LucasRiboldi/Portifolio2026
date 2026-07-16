import type { RealmId } from "@/lib/realms"

/**
 * Versões miniatura dos logos animados do portal, para o botão de troca de
 * universo. Cada realm mantém a sua característica:
 *  - creative  → aberração cromática (mundos paralelos)
 *  - developer → cursor de terminal piscando
 *  - arcane    → selo girando com o d20
 *
 * Marcação espelha `components/portal/logos/*`; o CSS vive em
 * `styles/realm-logo.css` (classes `.rl-*`, escala de botão).
 * Os ids do <use> são sufixados por realm para não colidir com o portal.
 */

function MiniCriativo() {
  return (
    <span className="rl rl-cri" aria-hidden>
      <svg viewBox="0 0 120 120" className="base">
        <g id="rl-pw">
          <circle cx="46" cy="68" r="28" />
          <circle cx="74" cy="68" r="28" />
          <circle cx="60" cy="46" r="28" />
        </g>
      </svg>
      <svg viewBox="0 0 120 120" className="r">
        <use href="#rl-pw" />
      </svg>
      <svg viewBox="0 0 120 120" className="c">
        <use href="#rl-pw" />
      </svg>
    </span>
  )
}

function MiniDev() {
  return (
    <span className="rl rl-dev" aria-hidden>
      <span className="p">❯</span>
      <span className="cur" />
    </span>
  )
}

function MiniAnfitriao() {
  return (
    <span className="rl rl-anf" aria-hidden>
      <svg viewBox="0 0 124 124" className="ringwrap">
        <circle className="ring draw" cx="62" cy="62" r="54" />
        <circle className="ring" cx="62" cy="62" r="45" style={{ opacity: 0.5 }} />
      </svg>
      <span className="inner">
        <svg viewBox="0 0 124 124">
          <polygon className="out" points="62,31 88,47 88,77 62,93 36,77 36,47" />
          <polygon className="face" points="62,47 47,76 77,76" />
        </svg>
      </span>
    </span>
  )
}

export function RealmLogoMini({ realm }: { realm: RealmId }) {
  if (realm === "creative") return <MiniCriativo />
  if (realm === "developer") return <MiniDev />
  return <MiniAnfitriao />
}
