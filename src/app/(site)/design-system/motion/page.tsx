"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { RotateCw } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsLead } from "@/design-system/ds-ui"
import {
  popTilt, popIn, fadeRise, tiltStack, glitchIn, dimSwap,
  slamIn, shake, swing, vibrate, flicker, popBurst, slideRip, spinPop, elastic, drift,
  MOTION_PRESETS,
} from "@/design-system/motion"

const VARIANTS = {
  popTilt, popIn, fadeRise, tiltStack, glitchIn, dimSwap,
  slamIn, shake, swing, vibrate, flicker, popBurst, slideRip, spinPop, elastic, drift,
} as const

export default function MotionPage() {
  const [key, setKey] = useState(0)

  return (
    <div>
      <ComicHeader kicker="Fase 5 · Motion" title="Movimento com" highlight="estalo" />
      <DsLead>
        Biblioteca de motion do Design System, com <code className="text-[var(--sv-cyan)]">motion/react</code>.
        As durações e easings espelham os tokens. Clique em replay para reexecutar.
      </DsLead>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setKey((k) => k + 1)}
          className="sv-heavy inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-[var(--sv-yellow)] px-3 py-1.5 text-xs uppercase text-black shadow-[var(--elevation-1)] transition-transform hover:-translate-y-0.5"
        >
          <RotateCw className="size-3.5" /> Replay
        </button>
      </div>

      <div key={key} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOTION_PRESETS.map((p, i) => (
          <div key={p.name} className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
            <div className="grid h-24 place-items-center">
              <motion.div
                custom={i}
                variants={VARIANTS[p.name as keyof typeof VARIANTS]}
                initial="hidden"
                animate="visible"
                className="grid size-16 place-items-center rounded-md border-[3px] border-black bg-[var(--sv-magenta)] font-[family-name:var(--font-display)] text-2xl text-white"
              >
                {p.name.charAt(0).toUpperCase()}
              </motion.div>
            </div>
            <p className="sv-heavy mt-3 text-xs uppercase tracking-wide text-white">{p.name}</p>
            <p className="mt-0.5 text-xs text-white/55">{p.desc}</p>
            <code className="mt-1 inline-block font-mono text-[0.7rem] text-[var(--sv-cyan)]">{p.token}</code>
          </div>
        ))}
      </div>

      <pre className="mt-8 overflow-x-auto rounded-md border-2 border-black bg-black/50 p-4 text-xs leading-relaxed text-white/80">
        <code>{`import { motion } from "motion/react"
import { popTilt } from "@/design-system/motion"

<motion.div variants={popTilt} initial="hidden" animate="visible" custom={i}>
  Conteúdo
</motion.div>`}</code>
      </pre>
    </div>
  )
}
