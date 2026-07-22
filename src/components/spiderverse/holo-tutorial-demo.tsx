"use client"

import { forwardRef, useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

/**
 * As cartas de demonstração do tutorial (holo-tutorial.tsx).
 *
 * Este motor é uma versão enxuta e legível do que roda nas galerias reais:
 * escreve as MESMAS variáveis que o CSS didático (holo-tutorial.css) lê, e
 * o snippet mostrado no Passo 1 é recortado daqui. Mantenha os três em dia.
 */

interface PointerState {
  rx: number
  ry: number
  mx: number
  my: number
  o: number
}

const REST: PointerState = { rx: 0, ry: 0, mx: 50, my: 50, o: 0 }
const KEYS = ["rx", "ry", "mx", "my", "o"] as const

/** Remap linear — o `adjust` do pokemon-cards-css (ver Passo 3). */
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin)

export function useTutorialPointer({ readout = false }: { readout?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLPreElement>(null)
  const reduceMotion = useReducedMotion()

  const cur = useRef<PointerState>({ ...REST })
  const target = useRef<PointerState>({ ...REST })
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
    // o remap 37–63 / 33–67 citado na nota do Passo 3
    el.style.setProperty("--bx", `${adjust(c.mx, 0, 100, 37, 63).toFixed(2)}%`)
    el.style.setProperty("--by", `${adjust(c.my, 0, 100, 33, 67).toFixed(2)}%`)
    el.style.setProperty("--o", c.o.toFixed(3))

    if (readout && readoutRef.current) {
      // escrita direta no DOM: passar isto por estado do React seria um
      // re-render por quadro, exatamente o que o tutorial prega evitar
      readoutRef.current.textContent =
        `--mx: ${c.mx.toFixed(2)}%\n` +
        `--my: ${c.my.toFixed(2)}%\n` +
        `--o:  ${c.o.toFixed(3)}`
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
      rx: (0.5 - py) * 22, // ponteiro em Y → rotateX (sinal invertido)
      ry: (px - 0.5) * 22, // ponteiro em X → rotateY
      mx: px * 100,
      my: py * 100,
      o: 1,
    }
    ease.current = 0.35 // perseguição rápida
    schedule()
  }

  function onPointerLeave() {
    target.current = { ...REST }
    ease.current = 0.06 // assentamento lento — o "peso"
    schedule()
  }

  return { ref, readoutRef, handlers: { onPointerMove, onPointerLeave } }
}

type Handlers = {
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

export const TutorialCard = forwardRef<
  HTMLDivElement,
  { handlers: Handlers; tilt?: boolean; shine?: boolean; glare?: boolean; raw?: boolean }
>(function TutorialCard({ handlers, tilt, shine, glare, raw }, ref) {
  const classes = ["tut-card", tilt && "tut-card--tilt", raw && "tut-card--raw"]
    .filter(Boolean)
    .join(" ")

  const camadas = [tilt && "inclinação", shine && "foil", glare && "reflexo"].filter(Boolean)

  return (
    <div
      ref={ref}
      {...handlers}
      role="img"
      aria-label={
        camadas.length
          ? `Carta de demonstração com ${camadas.join(" + ")}`
          : "Carta de demonstração sem efeitos"
      }
      className={classes}
    >
      <span aria-hidden className="tut-card__art" />
      {shine ? <span aria-hidden className="tut-card__shine" /> : null}
      {glare ? <span aria-hidden className="tut-card__glare" /> : null}
    </div>
  )
})

export const TutorialStack = forwardRef<HTMLDivElement, { handlers: Handlers }>(
  function TutorialStack({ handlers }, ref) {
    return (
      <div
        ref={ref}
        {...handlers}
        role="img"
        aria-label="Demonstração de três camadas empilhadas em profundidade"
        className="tut-stack"
      >
        <span aria-hidden className="tut-stack__layer tut-stack__base" style={{ "--z": 0 } as React.CSSProperties} />
        <span aria-hidden className="tut-stack__layer tut-stack__mid" style={{ "--z": 1 } as React.CSSProperties} />
        <span aria-hidden className="tut-stack__layer tut-stack__top" style={{ "--z": 2 } as React.CSSProperties}>
          ★
        </span>
      </div>
    )
  }
)
