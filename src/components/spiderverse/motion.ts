import type { Variants } from "motion/react"

/** Pop-in with a tilt that settles — the house entrance animation. */
export const popTilt: Variants = {
  hidden: { opacity: 0, y: 26, rotate: -6, scale: 0.88 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 260, damping: 17 },
  }),
}

/** Alternating tilt — cards lean opposite ways as they enter. */
export const tiltStack: Variants = {
  hidden: (i: number = 0) => ({ opacity: 0, y: 20, rotate: i % 2 ? 8 : -8 }),
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotate: i % 2 ? 1.5 : -1.5,
    transition: { delay: i * 0.05, type: "spring", stiffness: 220, damping: 16 },
  }),
}

/** Cross-style swap: skew + fade used when switching dimensions. */
export const dimSwap: Variants = {
  hidden: { opacity: 0, skewX: -8, scale: 0.96 },
  visible: { opacity: 1, skewX: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 18 } },
  exit: { opacity: 0, skewX: 6, scale: 0.98, transition: { duration: 0.2 } },
}
