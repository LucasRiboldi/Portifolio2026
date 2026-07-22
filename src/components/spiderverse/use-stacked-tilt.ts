"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

/**
 * Motor de tilt do Stacked 3D — escreve variáveis CSS num suavizador
 * exponencial em rAF (perseguição 0.35 na interação, assentamento 0.08 no
 * leave), o mesmo idioma do holo-card/holo-tcg-card: o JS só escreve
 * variáveis, o desenho é todo CSS.
 *
 * Com `holo: true` escreve TAMBÉM as variáveis do sistema poke-holo
 * vendorizado (--pointer-*, --background-*, --card-opacity). Elas herdam
 * daqui para o `.card` aninhado, então o mesmo ponteiro alimenta o foil
 * holográfico e a separação das camadas 3D.
 */

interface TiltState {
  rx: number
  ry: number
  mx: number
  my: number
  sx: number
  sy: number
  o: number
}

const REST: TiltState = { rx: 0, ry: 0, mx: 50, my: 50, sx: 0, sy: 0, o: 0 }
const KEYS = ["rx", "ry", "mx", "my", "sx", "sy", "o"] as const

/** Remap linear (o `adjust` do pokemon-cards-css). */
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin)

export function useStackedTilt({
  maxTilt = 22,
  holo = false,
}: { maxTilt?: number; holo?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const cur = useRef<TiltState>({ ...REST })
  const target = useRef<TiltState>({ ...REST })
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
    for (const key of KEYS) {
      c[key] += (t[key] - c[key]) * k
      if (Math.abs(t[key] - c[key]) > 0.01) done = false
      else c[key] = t[key]
    }

    el.style.setProperty("--rx", `${c.rx.toFixed(2)}deg`)
    el.style.setProperty("--ry", `${c.ry.toFixed(2)}deg`)
    el.style.setProperty("--mx", `${c.mx.toFixed(2)}%`)
    el.style.setProperty("--my", `${c.my.toFixed(2)}%`)
    el.style.setProperty("--sx", c.sx.toFixed(3))
    el.style.setProperty("--sy", c.sy.toFixed(3))
    el.style.setProperty("--o", c.o.toFixed(3))

    if (holo) {
      // as MESMAS fórmulas do Card.svelte original — herdadas pelo `.card`
      const fromCenter = Math.min(1, Math.hypot(c.mx - 50, c.my - 50) / 50)
      el.style.setProperty("--pointer-x", `${c.mx.toFixed(2)}%`)
      el.style.setProperty("--pointer-y", `${c.my.toFixed(2)}%`)
      el.style.setProperty("--pointer-from-center", fromCenter.toFixed(3))
      el.style.setProperty("--pointer-from-top", (c.my / 100).toFixed(3))
      el.style.setProperty("--pointer-from-left", (c.mx / 100).toFixed(3))
      el.style.setProperty("--card-opacity", c.o.toFixed(3))
      el.style.setProperty("--background-x", `${adjust(c.mx, 0, 100, 37, 63).toFixed(2)}%`)
      el.style.setProperty("--background-y", `${adjust(c.my, 0, 100, 33, 67).toFixed(2)}%`)
    }

    raf.current = done ? null : requestAnimationFrame(tick)
  }

  function schedule() {
    if (raf.current === null) raf.current = requestAnimationFrame(tick)
  }

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    target.current = {
      rx: (0.5 - py) * maxTilt,
      ry: (px - 0.5) * maxTilt,
      mx: px * 100,
      my: py * 100,
      sx: (px - 0.5) * 2,
      sy: (py - 0.5) * 2,
      o: 1,
    }
    ease.current = 0.35
    schedule()
  }

  function onPointerLeave() {
    target.current = { ...REST }
    ease.current = 0.08
    schedule()
  }

  return { ref, handlers: { onPointerMove, onPointerLeave } }
}
