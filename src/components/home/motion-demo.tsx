"use client"

/**
 * Demo funcional — Framer Motion no realm Creative (Spider-Verse).
 * Cartões com stagger na entrada (whileInView) + hover/tap com estalo.
 * Reusa as variantes-casa do Design System (motion/react).
 */
import { motion } from "motion/react"
import { stagger, popBurst } from "@/design-system/motion"

const CHIPS = [
  { t: "POP", c: "var(--sv-magenta)" },
  { t: "TILT", c: "var(--sv-cyan)" },
  { t: "SNAP", c: "var(--sv-yellow)" },
  { t: "ZAP", c: "var(--sv-lime)" },
]

export function MotionDemo() {
  return (
    <div className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="sv-heavy text-xs uppercase tracking-wide text-white">Motion vivo</p>
        <code className="font-mono text-[0.7rem] text-[var(--sv-cyan)]">motion/react</code>
      </div>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {CHIPS.map((chip) => (
          <motion.button
            key={chip.t}
            variants={popBurst}
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.92, rotate: 3 }}
            className="sv-heavy grid h-16 place-items-center rounded-md border-[3px] border-black text-lg text-black shadow-[var(--elevation-1)]"
            style={{ background: chip.c }}
          >
            {chip.t}!
          </motion.button>
        ))}
      </motion.div>
      <p className="mt-3 text-xs text-white/55">Passe o mouse ou toque — cada chip tem estalo próprio.</p>
    </div>
  )
}
