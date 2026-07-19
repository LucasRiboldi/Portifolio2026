"use client"

import { useRef } from "react"
import { useReducedMotion } from "motion/react"
import { CenaSalto } from "@/components/design-system/creative-assets"

/**
 * Carta colecionável holográfica — o efeito do poke-holo (tilt 3D + foil
 * arco-íris + glare especular seguindo o cursor), reconstruído sobre o
 * design system do realm: a arte é a CenaSalto do acervo (15.1) e as cores
 * do foil são as quatro tintas neon do multiverso.
 *
 * O componente só escreve variáveis CSS (--rx/--ry/--mx/--my/--o); o desenho
 * das camadas vive em holo-card.css. `prefers-reduced-motion` congela tudo.
 */
export function HoloCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width // 0..1
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty("--rx", `${(0.5 - py) * 24}deg`)
    el.style.setProperty("--ry", `${(px - 0.5) * 24}deg`)
    el.style.setProperty("--mx", `${px * 100}%`)
    el.style.setProperty("--my", `${py * 100}%`)
    el.style.setProperty("--o", "1")
  }

  function leave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--o", "0")
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`holo-card ${className}`}
    >
      <div className="holo-card__front">
        {/* cabeça da carta, no idioma TCG */}
        <div className="flex items-baseline justify-between px-3 pt-2">
          <span className="sv-display text-lg uppercase text-white">Lucas Riboldi</span>
          <span className="sv-heavy text-[10px] uppercase text-[var(--sv-yellow)]">
            PV 2026 <span aria-hidden>⚡</span>
          </span>
        </div>

        {/* arte emoldurada */}
        <div className="mx-3 mt-1 overflow-hidden rounded-sm border-2 border-black">
          <CenaSalto className="block w-full" />
        </div>

        {/* ataques */}
        <div className="flex-1 px-3 py-2 text-[11px] leading-snug text-white/85">
          <p>
            <b className="text-[var(--sv-cyan)]">Design de Produto</b> — cria interfaces que
            comunicam antes de explicar.
          </p>
          <p className="mt-1">
            <b className="text-[var(--sv-lime)]">Código</b> — transforma a ideia em coisa
            navegável. Efeito colateral: experimentos toda semana.
          </p>
        </div>

        {/* rodapé raro */}
        <div className="sv-heavy flex items-center justify-between border-t-2 border-black/40 px-3 py-1.5 text-[9px] uppercase tracking-wide text-white/60">
          <span>Ilustração: acervo do multiverso</span>
          <span className="text-[var(--sv-magenta)]">160/159 ★ secreta</span>
        </div>
      </div>

      <span aria-hidden className="holo-card__shine" />
      <span aria-hidden className="holo-card__glare" />
    </div>
  )
}
