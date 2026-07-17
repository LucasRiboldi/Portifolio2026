"use client"

import { useState } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { REALM_MOTION, type MotionDemo } from "@/design-system/realm-motion"
import type { RealmId } from "@/lib/realms"

/**
 * Laboratório de motion — cada entrada do registro toca de verdade.
 *
 * Documentar movimento em texto é o jeito mais fácil de a documentação
 * mentir: o easing muda no código e a tabela continua igual. Aqui a demo usa
 * as mesmas curvas do realm, então diverge de forma visível.
 */

const spring = { type: "spring", stiffness: 260, damping: 18 } as const
const easeOut = [0, 0, 0.2, 1] as const

const demoVariants: Record<MotionDemo, Variants> = {
  pop: {
    idle: { opacity: 0, y: 24, rotate: -4, scale: 0.9 },
    play: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: spring },
  },
  hero: {
    idle: { y: 12, scale: 0.98 },
    play: { y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  },
  tilt: {
    idle: { y: 0, rotate: 0 },
    play: { y: -6, rotate: -2, transition: spring },
  },
  spring: {
    idle: { x: -40 },
    play: { x: 40, transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } },
  },
  shake: {
    idle: { x: 0 },
    play: { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.45, ease: "linear" } },
  },
  glitchBurst: {
    idle: { x: 0, skewX: 0 },
    play: { x: [0, -12, 8, 0], skewX: [0, -6, 3, 0], transition: { duration: 0.28, ease: "linear" } },
  },
  settle: {
    idle: { opacity: 0, y: 10 },
    play: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  },
  caret: {
    idle: { opacity: 1 },
    play: { opacity: [1, 0, 1, 0, 1], transition: { duration: 1.6, ease: "linear" } },
  },
  borderOnly: {
    idle: { borderColor: "rgba(255,255,255,0.15)" },
    play: { borderColor: "#50fa7b", transition: { duration: 0.15, ease: easeOut } },
  },
  typeIn: {
    idle: { opacity: 0 },
    play: { opacity: 1, transition: { duration: 0.05 } },
  },
  scan: {
    idle: { y: -30 },
    play: { y: 60, transition: { duration: 1.2, ease: "linear" } },
  },
  inkSettle: {
    idle: { opacity: 0, y: -3 },
    play: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  },
  linkRule: {
    idle: { scaleX: 0 },
    play: { scaleX: 1, transition: { duration: 0.25, ease: easeOut } },
  },
  none: {
    idle: { opacity: 1 },
    play: { opacity: 1 },
  },
}

/** O palco de cada demo — alguns gestos precisam de forma própria. */
function Stage({ demo, playing }: { demo: MotionDemo; playing: boolean }) {
  const state = playing ? "play" : "idle"

  if (demo === "none") {
    return (
      <div className="flex h-14 items-center justify-center">
        <span className="sv-heavy text-[10px] uppercase tracking-widest text-white/30">imóvel</span>
      </div>
    )
  }

  if (demo === "typeIn") {
    const text = "npm run build"
    return (
      <div className="flex h-14 items-center justify-center font-mono text-xs text-[#50fa7b]">
        {text.split("").map((c, i) => (
          <motion.span
            key={i}
            variants={{ idle: { opacity: 0 }, play: { opacity: 1, transition: { delay: i * 0.04 } } }}
            initial="idle"
            animate={state}
          >
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </div>
    )
  }

  if (demo === "caret") {
    return (
      <div className="flex h-14 items-center justify-center gap-1 font-mono text-xs text-[#50fa7b]">
        <span>~/portfolio</span>
        <motion.span
          className="inline-block h-3.5 w-2 bg-[#50fa7b]"
          variants={demoVariants.caret}
          initial="idle"
          animate={state}
        />
      </div>
    )
  }

  if (demo === "linkRule") {
    return (
      <div className="flex h-14 items-center justify-center">
        <span className="relative font-serif text-sm text-[#2a1c0a]">
          Leia a matéria
          <motion.span
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#2a1c0a]"
            variants={demoVariants.linkRule}
            initial="idle"
            animate={state}
          />
        </span>
      </div>
    )
  }

  if (demo === "scan") {
    return (
      <div className="relative h-14 overflow-hidden rounded border border-white/15 bg-black">
        <motion.span
          className="absolute inset-x-0 h-6 bg-gradient-to-b from-[rgba(80,250,123,0.35)] to-transparent"
          variants={demoVariants.scan}
          initial="idle"
          animate={state}
        />
      </div>
    )
  }

  if (demo === "inkSettle") {
    const word = "PROPHET"
    return (
      <div className="flex h-14 items-center justify-center bg-[#efe6cf]">
        {word.split("").map((c, i) => (
          <motion.span
            key={i}
            className="font-serif text-lg font-bold text-[#2a1c0a]"
            variants={{
              idle: { opacity: 0, y: -3 },
              play: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: easeOut } },
            }}
            initial="idle"
            animate={state}
          >
            {c}
          </motion.span>
        ))}
      </div>
    )
  }

  // demo genérica: um bloco carregando o gesto
  return (
    <div className="flex h-14 items-center justify-center">
      <motion.div
        className={cn(
          "flex h-10 w-24 items-center justify-center rounded border-2 border-black bg-[var(--sv-yellow)]",
          demo === "borderOnly" && "border-2 bg-transparent"
        )}
        variants={demoVariants[demo]}
        initial="idle"
        animate={state}
      >
        <span className="sv-heavy text-[9px] uppercase text-black">{demo}</span>
      </motion.div>
    </div>
  )
}

export function RealmMotionLab({ realm }: { realm: RealmId }) {
  const entries = REALM_MOTION[realm]
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState<string | null>(null)

  function play(name: string) {
    setPlaying(null)
    // deixa o estado voltar ao idle antes de tocar de novo
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(name)))
  }

  return (
    <div>
      {reduce && (
        <p className="mb-4 rounded border-2 border-[var(--sv-yellow)] bg-[var(--sv-yellow)]/10 p-2 text-[11px] text-[var(--sv-yellow)]">
          Seu sistema pede movimento reduzido — as demos abaixo tocam mesmo assim, sob seu comando,
          mas o site respeita a preferência.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map(e => (
          <div key={e.name} className="rounded-md border-2 border-black bg-[var(--sv-ink-2)] p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[var(--sv-cyan)]">{e.name}</p>
                <p className="font-mono text-[10px] text-white/45">{e.value}</p>
              </div>
              {e.demo !== "none" && (
                <button
                  type="button"
                  onClick={() => play(e.name)}
                  className="inline-flex shrink-0 items-center gap-1 rounded border border-white/20 px-2 py-1 text-[10px] uppercase text-white/70 transition-colors hover:border-[var(--sv-cyan)] hover:text-[var(--sv-cyan)]"
                  aria-label={`Tocar ${e.name}`}
                >
                  <Play className="size-3" /> tocar
                </button>
              )}
            </div>

            <div className="overflow-hidden rounded border border-white/10 bg-black/25">
              <Stage demo={e.demo} playing={playing === e.name} />
            </div>

            <p className="mt-2 text-[11px] leading-snug text-white/60">{e.use}</p>
            <p className="mt-1 text-[10px] leading-snug text-white/35">↳ {e.where}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
