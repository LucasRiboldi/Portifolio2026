"use client"

import { useRef } from "react"
import { useReducedMotion } from "motion/react"

/**
 * Galeria de raridades — o CSS REAL do simeydotme/pokemon-cards-css
 * (vendorizado em /public/poke-holo) aplicado a uma carta LR por estilo.
 *
 * A estrutura DOM é a do original (.card > __translater > __rotator >
 * __front img + __shine + __glare): o base.css estiliza `.card__rotator *`
 * com display:grid/grid-area:1/1, então a face PRECISA ser uma imagem única
 * (lr-front.svg) — conteúdo HTML rico quebraria. O JS escreve as mesmas
 * variáveis do original; os foils por carta do TCG (CDN) são substituídos
 * pelas texturas locais genéricas via --foil inline.
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
]

interface StyleDef {
  rarity: string
  label: string
  desc: string
  supertype?: string
  trainerGallery?: boolean
  vars?: Record<string, string>
}

const FOIL = "url(/poke-holo/img/illusion.png)"

const STYLES: StyleDef[] = [
  { rarity: "common", label: "Comum", desc: "Sem foil — a linha de base" },
  { rarity: "rare holo", label: "Holo clássica", desc: "Barras verticais + arco-íris" },
  { rarity: "rare holo cosmos", label: "Cosmos", desc: "Galáxia em três camadas",
    vars: { "--cosmosbg": "286px 232px" } },
  { rarity: "reverse holo", label: "Reverse holo", desc: "Foil no fundo, arte fosca" },
  { rarity: "amazing rare", label: "Amazing rare", desc: "Explosão além da moldura" },
  { rarity: "radiant rare", label: "Radiant", desc: "Cross-hatch metálico" },
  { rarity: "rare holo v", label: "V", desc: "Faixas geométricas diagonais" },
  { rarity: "rare ultra", label: "Full art V", desc: "Textura gravada + brilho",
    supertype: "pokémon" },
  { rarity: "rare holo vmax", label: "VMAX", desc: "Foil amplo de fundo" },
  { rarity: "rare holo vstar", label: "VSTAR", desc: "Branco perolado" },
  { rarity: "rare rainbow", label: "Rainbow", desc: "Pastel iridescente + glitter" },
  { rarity: "rare rainbow alt", label: "Rainbow alt", desc: "Iridescência densa" },
  { rarity: "rare secret", label: "Secreta dourada", desc: "Ouro gravado" },
  { rarity: "rare shiny", label: "Shiny", desc: "Cintilância prateada" },
  { rarity: "rare shiny v", label: "Shiny V", desc: "Prata + faixas V" },
  { rarity: "rare shiny vmax", label: "Shiny VMAX", desc: "Prata em tela cheia" },
  { rarity: "trainer gallery rare holo", label: "Trainer gallery", desc: "Aquarela holográfica",
    trainerGallery: true },
]

const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin)

interface Vec { x: number; y: number; o: number }
const REST: Vec = { x: 50, y: 50, o: 0 }

function GalleryCard({ def }: { def: StyleDef }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const cur = useRef<Vec>({ ...REST })
  const target = useRef<Vec>({ ...REST })
  const ease = useRef(0.35)
  const raf = useRef<number | null>(null)

  function tick() {
    const el = cardRef.current
    if (!el) { raf.current = null; return }
    const c = cur.current
    const t = target.current
    const k = ease.current
    let done = true
    for (const key of ["x", "y", "o"] as const) {
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
    raf.current = done ? null : requestAnimationFrame(tick)
  }

  const schedule = () => { if (raf.current === null) raf.current = requestAnimationFrame(tick) }

  function move(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduceMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    target.current = {
      x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
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
    <figure className="m-0">
      <div
        ref={cardRef}
        className="card interactive"
        data-rarity={def.rarity}
        data-supertype={def.supertype ?? "pokémon"}
        data-subtypes="basic"
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
          "--foil": FOIL,
          ...def.vars,
        } as React.CSSProperties}
      >
        <div className="card__translater">
          <button
            type="button"
            className="card__rotator"
            onPointerMove={move}
            onPointerLeave={leave}
            aria-label={`Carta LR no estilo ${def.label}`}
          >
            {/* alt="" — a face é decorativa; o botão já carrega o rótulo */}
            <img className="card__back" src="/poke-holo/lr-back.svg" alt="" loading="lazy" width={660} height={921} />
            <div className="card__front">
              <img src="/poke-holo/lr-front.svg" alt="" loading="lazy" width={660} height={921} />
              <div className="card__shine" />
              <div className="card__glare" />
            </div>
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-center">
        <span className="sv-display block text-sm uppercase text-white">{def.label}</span>
        <span className="sv-heavy text-[10px] uppercase tracking-wide text-white/55">{def.desc}</span>
      </figcaption>
    </figure>
  )
}

export function PokeHoloGallery() {
  return (
    <>
      {CSS_FILES.map((f) => (
        // React 19 iça <link> para o <head>; precedence controla a ordem
        <link key={f} rel="stylesheet" href={`/poke-holo/css/${f}`} precedence={`poke-${f}`} />
      ))}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {STYLES.map((s) => (
          <GalleryCard key={s.rarity} def={s} />
        ))}
      </div>
    </>
  )
}
