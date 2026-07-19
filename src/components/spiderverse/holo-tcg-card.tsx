"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

/**
 * Motor compartilhado das cartas holográficas — o CSS REAL do
 * simeydotme/pokemon-cards-css (vendorizado em /public/poke-holo) sobre a
 * estrutura DOM do original (.card > __translater > __rotator > __front img
 * + __shine + __glare). O JS escreve as mesmas variáveis do Card.svelte;
 * springs viram um suavizador exponencial em rAF (0.35 na interação, 0.06
 * no leave). Usado pela galeria poke-holo e pela galeria ThunderCats.
 */

const CSS_FILES = [
  "cards.css",
  "cards/base.css",
  "cards/basic.css",
  "cards/regular-holo.css",
  "cards/cosmos-holo.css",
  "cards/reverse-holo.css",
  "cards/amazing-rare.css",
  "cards/radiant-holo.css",
  "cards/v-regular.css",
  "cards/v-full-art.css",
  "cards/v-max.css",
  "cards/v-star.css",
  "cards/rainbow-holo.css",
  "cards/rainbow-alt.css",
  "cards/secret-rare.css",
  "cards/shiny-rare.css",
  "cards/shiny-v.css",
  "cards/shiny-vmax.css",
  "cards/trainer-gallery-holo.css",
  "cards/trainer-gallery-v-max.css",
]

/** Folhas de estilo do sistema — renderize uma vez por página de galeria. */
export function HoloTcgStylesheets() {
  return (
    <>
      {CSS_FILES.map((f) => (
        // React 19 iça <link> para o <head>; precedence controla a ordem
        <link key={f} rel="stylesheet" href={`/poke-holo/css/${f}`} precedence={`poke-${f}`} />
      ))}
    </>
  )
}

export interface TcgCardDef {
  /** URL absoluta da face da carta (a partir de /public). */
  img: string
  name: string
  rarity: string
  label: string
  desc: string
  /** URL absoluta do foil (webp/png); sem ele valem os fallbacks do CSS. */
  foil?: string
  supertype?: string
  subtypes?: string
  trainerGallery?: boolean
  vars?: Record<string, string>
}

const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin)

interface Vec { x: number; y: number; o: number; tx: number; ty: number; s: number }
const REST: Vec = { x: 50, y: 50, o: 0, tx: 0, ty: 0, s: 1 }

export function HoloTcgCard({ def }: { def: TcgCardDef }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const cur = useRef<Vec>({ ...REST })
  const target = useRef<Vec>({ ...REST })
  const ease = useRef(0.35)
  const popEase = useRef(0.12)
  const raf = useRef<number | null>(null)
  const [active, setActive] = useState(false)

  function tick() {
    const el = cardRef.current
    if (!el) { raf.current = null; return }
    const c = cur.current
    const t = target.current
    let done = true
    for (const key of ["x", "y", "o", "tx", "ty", "s"] as const) {
      // ponteiro segue o ease da interação; pop (translate/scale) tem o seu
      const k = key === "tx" || key === "ty" || key === "s" ? popEase.current : ease.current
      c[key] += (t[key] - c[key]) * k
      if (Math.abs(t[key] - c[key]) > 0.01) done = false
      else c[key] = t[key]
    }
    const fromCenter = Math.min(1, Math.hypot(c.x - 50, c.y - 50) / 50)
    // as MESMAS variáveis e fórmulas do Card.svelte original
    el.style.setProperty("--pointer-x", `${c.x.toFixed(2)}%`)
    el.style.setProperty("--pointer-y", `${c.y.toFixed(2)}%`)
    el.style.setProperty("--pointer-from-center", fromCenter.toFixed(3))
    el.style.setProperty("--pointer-from-top", (c.y / 100).toFixed(3))
    el.style.setProperty("--pointer-from-left", (c.x / 100).toFixed(3))
    el.style.setProperty("--card-opacity", c.o.toFixed(3))
    el.style.setProperty("--rotate-x", `${(-(c.x - 50) / 3.5).toFixed(2)}deg`)
    el.style.setProperty("--rotate-y", `${((c.y - 50) / 3.5).toFixed(2)}deg`)
    el.style.setProperty("--background-x", `${adjust(c.x, 0, 100, 37, 63).toFixed(2)}%`)
    el.style.setProperty("--background-y", `${adjust(c.y, 0, 100, 33, 67).toFixed(2)}%`)
    el.style.setProperty("--translate-x", `${c.tx.toFixed(1)}px`)
    el.style.setProperty("--translate-y", `${c.ty.toFixed(1)}px`)
    el.style.setProperty("--card-scale", c.s.toFixed(3))
    raf.current = done ? null : requestAnimationFrame(tick)
  }

  const schedule = () => { if (raf.current === null) raf.current = requestAnimationFrame(tick) }

  function move(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduceMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    target.current = {
      ...target.current,
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
      o: 1,
    }
    ease.current = 0.35
    schedule()
  }

  function leave() {
    target.current = { ...target.current, x: 50, y: 50, o: 0 }
    ease.current = 0.06
    schedule()
  }

  /** Popover do original: centraliza no viewport e amplia até caber (máx 1.75×). */
  function setCenterAndScale() {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const c = cur.current
    // desconta o translate já aplicado para achar a posição de repouso
    const baseX = rect.x - c.tx
    const baseY = rect.y - c.ty
    const baseW = rect.width / c.s
    const baseH = rect.height / c.s
    const view = document.documentElement
    target.current.tx = Math.round(view.clientWidth / 2 - baseX - baseW / 2)
    target.current.ty = Math.round(view.clientHeight / 2 - baseY - baseH / 2)
    target.current.s = Math.min(
      (window.innerWidth / baseW) * 0.9,
      (window.innerHeight / baseH) * 0.9,
      1.75
    )
    schedule()
  }

  function deactivate() {
    setActive(false)
    target.current = { ...target.current, tx: 0, ty: 0, s: 1 }
    popEase.current = 0.08
    schedule()
  }

  function toggle() {
    if (active) { deactivate(); return }
    setActive(true)
    popEase.current = 0.12
    setCenterAndScale()
  }

  // com a carta ampliada: Esc fecha, clique fora fecha, scroll/resize recentram
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") deactivate() }
    const onDown = (e: PointerEvent) => {
      if (!cardRef.current?.contains(e.target as Node)) deactivate()
    }
    const onShift = () => setCenterAndScale()
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("scroll", onShift, { passive: true })
    window.addEventListener("resize", onShift)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("scroll", onShift)
      window.removeEventListener("resize", onShift)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <figure className="m-0">
      <div
        ref={cardRef}
        className={`card interactive ${active ? "active interacting" : ""}`}
        data-rarity={def.rarity}
        data-supertype={def.supertype ?? "pokémon"}
        data-subtypes={def.subtypes ?? "basic"}
        data-trainer-gallery={def.trainerGallery ? "true" : undefined}
        style={{
          "--card-scale": "1",
          "--translate-x": "0px",
          "--translate-y": "0px",
          "--card-opacity": "0",
          "--pointer-x": "50%",
          "--pointer-y": "50%",
          "--background-x": "50%",
          "--background-y": "50%",
          "--rotate-x": "0deg",
          "--rotate-y": "0deg",
          "--pointer-from-center": "0",
          "--pointer-from-top": "0.5",
          "--pointer-from-left": "0.5",
          // foil próprio da carta quando existe; sem ele, valem os
          // fallbacks de cada raridade no CSS vendorizado
          ...(def.foil ? { "--foil": `url(${def.foil})` } : {}),
          ...def.vars,
        } as React.CSSProperties}
      >
        <div className="card__translater">
          <button
            type="button"
            className="card__rotator"
            onPointerMove={move}
            onPointerLeave={leave}
            onClick={toggle}
            aria-expanded={active}
            aria-label={`Carta ${def.name} no estilo ${def.label}`}
          >
            {/* alt="" — a face é decorativa; o botão já carrega o rótulo */}
            <img className="card__back" src="/poke-holo/lr-back.svg" alt="" loading="lazy" width={660} height={921} />
            <div className="card__front">
              <img src={def.img} alt="" loading="lazy" width={734} height={1024} />
              <div className="card__shine" />
              <div className="card__glare" />
            </div>
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-center">
        <span className="sv-display block text-sm uppercase text-white">{def.label}</span>
        <span className="sv-heavy text-[10px] uppercase tracking-wide text-white/55">
          {def.name} · {def.desc}
        </span>
      </figcaption>
    </figure>
  )
}
