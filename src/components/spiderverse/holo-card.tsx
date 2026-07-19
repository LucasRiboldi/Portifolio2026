"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"
import { CenaSalto } from "@/components/design-system/creative-assets"

/** Remap linear (o `adjust` do pokemon-cards-css). */
function adjust(v: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
  return toMin + ((toMax - toMin) * (v - fromMin)) / (fromMax - fromMin)
}

interface HoloState {
  rx: number
  ry: number
  mx: number
  my: number
  o: number
}

const REST: HoloState = { rx: 0, ry: 0, mx: 50, my: 50, o: 0 }

/**
 * Carta colecionável holográfica — técnica do simeydotme/pokemon-cards-css
 * (ver memória pokemon-cards-css-holo-technique), reconstruída sobre o DS:
 * arte CenaSalto (15.1) e sunpillars HSL do original.
 *
 * Como no original, o JS só escreve variáveis; a diferença é que lá os
 * valores passam por springs do Svelte — aqui um suavizador exponencial em
 * rAF faz o mesmo papel: perseguição rápida na interação (0.35) e
 * assentamento lento no leave (0.06), que é o que dá o "peso" da carta.
 */
export function HoloCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const cur = useRef<HoloState>({ ...REST })
  const target = useRef<HoloState>({ ...REST })
  const ease = useRef(0.35)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    }
  }, [])

  function tick() {
    const el = ref.current
    if (!el) {
      raf.current = null
      return
    }
    const c = cur.current
    const t = target.current
    const k = ease.current
    let done = true
    for (const key of ["rx", "ry", "mx", "my", "o"] as const) {
      c[key] += (t[key] - c[key]) * k
      if (Math.abs(t[key] - c[key]) > 0.01) done = false
      else c[key] = t[key]
    }

    // distância do ponteiro ao centro, 0..1 — modula a intensidade
    const pfc = Math.min(1, Math.hypot(c.mx - 50, c.my - 50) / 50)

    el.style.setProperty("--rx", `${c.ry.toFixed(2)}deg`)
    el.style.setProperty("--ry", `${c.rx.toFixed(2)}deg`)
    el.style.setProperty("--mx", `${c.mx.toFixed(2)}%`)
    el.style.setProperty("--my", `${c.my.toFixed(2)}%`)
    // remap 37–63 do original: o foil anda menos que o ponteiro
    el.style.setProperty("--bx", `${adjust(c.mx, 0, 100, 37, 63).toFixed(2)}%`)
    el.style.setProperty("--by", `${adjust(c.my, 0, 100, 33, 67).toFixed(2)}%`)
    el.style.setProperty("--o", c.o.toFixed(3))
    el.style.setProperty("--pfc", pfc.toFixed(3))

    raf.current = done ? null : requestAnimationFrame(tick)
  }

  function schedule() {
    if (raf.current === null) raf.current = requestAnimationFrame(tick)
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    target.current = {
      rx: (px - 0.5) * 24,
      ry: (0.5 - py) * 24,
      mx: px * 100,
      my: py * 100,
      o: 1,
    }
    ease.current = 0.35
    schedule()
  }

  function leave() {
    target.current = { ...REST }
    ease.current = 0.06
    schedule()
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
