"use client"

import { type ReactNode } from "react"
import { useStackedTilt } from "./use-stacked-tilt"

/**
 * Galeria Stacked 3D — cartas e moedas em camadas com parallax.
 * Técnica de hover-tilt.simey.me/bespoke/stacked-3d (ver stacked-3d.css):
 * o contêiner inclina em preserve-3d e cada camada vive num translateZ
 * proporcional (0×, 1×, 2×) — a diferença de fator é o parallax.
 * O motor de tilt está em use-stacked-tilt.ts.
 */

function Stacked3d({
  className = "",
  label,
  children,
}: {
  className?: string
  label: string
  children: ReactNode
}) {
  const { ref, handlers } = useStackedTilt()

  return (
    <div ref={ref} role="img" aria-label={label} {...handlers} className={`st3d ${className}`}>
      {children}
      <span aria-hidden className="st3d__glare" />
    </div>
  )
}

/* ---- Emblemas (SVG inline, herdam a cor via currentColor) ---------------- */

function BurstEmblem() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <polygon
        fill="currentColor"
        stroke="#000"
        strokeWidth="3"
        points="50,2 57.65,31.52 83.94,16.06 68.48,42.35 98,50 68.48,57.65 83.94,83.94 57.65,68.48 50,98 42.35,68.48 16.06,83.94 31.52,57.65 2,50 31.52,42.35 16.06,16.06 42.35,31.52"
      />
      <circle cx="50" cy="50" r="10" fill="#fff" stroke="#000" strokeWidth="3" />
    </svg>
  )
}

function CodeEmblem() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        <path d="M34 28 12 50l22 22" />
        <path d="M66 28l22 22-22 22" />
        <path d="M56 20 44 80" />
      </g>
    </svg>
  )
}

function BalloonEmblem() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path
        fill="currentColor"
        stroke="#000"
        strokeWidth="3"
        d="M25 15h50a10 10 0 0 1 10 10v28a10 10 0 0 1-10 10H48L35 78l2-15H25a10 10 0 0 1-10-10V25a10 10 0 0 1 10-10z"
      />
      <g fill="#000">
        <circle cx="35" cy="39" r="4.5" />
        <circle cx="50" cy="39" r="4.5" />
        <circle cx="65" cy="39" r="4.5" />
      </g>
    </svg>
  )
}

function CoinMark({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <text
        x="50"
        y="54"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="44"
        fontWeight="900"
        fill="currentColor"
        stroke="#000"
        strokeWidth="2"
        paintOrder="stroke"
      >
        {text}
      </text>
    </svg>
  )
}

/* ---- Conteúdo ------------------------------------------------------------- */

const CARDS = [
  {
    kicker: "Realm 01",
    title: "Criativo",
    desc: "O emblema salta 2× a profundidade da moldura",
    label: "Carta Criativo com explosão em camadas 3D",
    colors: { a: "#8f2fb8", b: "#4a1a9c", c: "#2a0f5e" },
    emblem: "text-[var(--sv-magenta)]",
    Emblem: BurstEmblem,
  },
  {
    kicker: "Realm 02",
    title: "Desenvolvedor",
    desc: "Fundo, moldura e código em três planos",
    label: "Carta Desenvolvedor com código em camadas 3D",
    colors: { a: "#0e7d6d", b: "#0b3d64", c: "#081c3a" },
    emblem: "text-[var(--sv-cyan)]",
    Emblem: CodeEmblem,
  },
  {
    kicker: "Realm 03",
    title: "Anfitrião",
    desc: "O balão flutua acima da carta ao inclinar",
    label: "Carta Anfitrião com balão de fala em camadas 3D",
    colors: { a: "#d6720f", b: "#a3330f", c: "#5e120f" },
    emblem: "text-[var(--sv-yellow)]",
    Emblem: BalloonEmblem,
  },
]

const COINS = [
  {
    name: "Ouro",
    mark: "LR",
    label: "Moeda de ouro LR em camadas 3D",
    emblem: "text-[#fff3c4]",
    vars: { "--coin-hi": "#ffe89a", "--coin-mid": "#e0a72e", "--coin-lo": "#8a5a08" },
  },
  {
    name: "Prata",
    mark: "26",
    label: "Moeda de prata 26 em camadas 3D",
    emblem: "text-[#f4f8ff]",
    vars: { "--coin-hi": "#f2f6fb", "--coin-mid": "#b9c4d4", "--coin-lo": "#5d6b80" },
  },
  {
    name: "Bronze",
    mark: "★",
    label: "Moeda de bronze com estrela em camadas 3D",
    emblem: "text-[#ffd9bd]",
    vars: { "--coin-hi": "#e8a878", "--coin-mid": "#b06a3a", "--coin-lo": "#5c2f16" },
  },
]

export function Stacked3dGallery() {
  return (
    <div className="space-y-14">
      {/* Cartas */}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ kicker, title, desc, label, colors, emblem, Emblem }) => (
          <Stacked3d
            key={title}
            label={label}
            className="st3d-card mx-auto w-[min(300px,80vw)]"
          >
            <div
              className="st3d__layer st3d-card__base"
              style={
                {
                  "--st3d-a": colors.a,
                  "--st3d-b": colors.b,
                  "--st3d-c": colors.c,
                } as React.CSSProperties
              }
            />
            <div
              className="st3d__layer st3d__layer--float st3d-card__frame"
              style={{ "--z": 1 } as React.CSSProperties}
            >
              <span className="sv-heavy text-[10px] uppercase tracking-widest text-white/75">
                {kicker}
              </span>
              <div>
                <span className="sv-display block text-2xl uppercase text-white">{title}</span>
                <span className="mt-1 block text-[10px] leading-snug text-white/65">{desc}</span>
              </div>
            </div>
            <div
              className={`st3d__layer st3d__layer--float st3d-card__emblem ${emblem}`}
              style={{ "--z": 2 } as React.CSSProperties}
            >
              <Emblem />
            </div>
          </Stacked3d>
        ))}
      </div>

      {/* Moedas */}
      <div className="mx-auto grid w-fit grid-cols-3 gap-6 sm:gap-10">
        {COINS.map(({ name, mark, label, emblem, vars }) => (
          <div key={name} className="text-center">
            <Stacked3d
              label={label}
              className="st3d-coin w-[min(140px,26vw)]"
            >
              <div
                className="st3d__layer st3d-coin__base"
                style={vars as React.CSSProperties}
              />
              <div
                className="st3d__layer st3d__layer--float st3d-coin__disc"
                style={{ ...(vars as React.CSSProperties), "--z": 1 } as React.CSSProperties}
              />
              <div
                className={`st3d__layer st3d__layer--float st3d-coin__emblem ${emblem}`}
                style={{ "--z": 2 } as React.CSSProperties}
              >
                <CoinMark text={mark} />
              </div>
            </Stacked3d>
            <span className="sv-heavy mt-3 block text-[10px] uppercase tracking-widest text-white/60">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
