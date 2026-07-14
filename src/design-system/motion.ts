/**
 * Motion do Design System (Aranhaverso) — variantes canônicas.
 * ------------------------------------------------------------------------
 * Reexporta as variantes-casa do spiderverse e adiciona presets alinhados
 * aos tokens de duração/easing. Use com `motion/react`.
 *
 * Durações espelham --duration-* / easings espelham --ease-* dos tokens.
 */
import type { Variants, Transition } from "motion/react"

export { popTilt, tiltStack, dimSwap } from "@/components/spiderverse/motion"

const spring: Transition = { type: "spring", stiffness: 260, damping: 18 }

/** Sobe e aparece — reveal padrão de seção (on-scroll). */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: [0, 0, 0.2, 1] } }),
}

/** Pop spring — entrada de painéis/badges com "estalo". */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: spring },
}

/** Glitch — deslize com aberração cromática (hover/entrada disruptiva). */
export const glitchIn: Variants = {
  hidden: { opacity: 0, x: -8, skewX: 6 },
  visible: { opacity: 1, x: 0, skewX: 0, transition: { duration: 0.15, ease: "easeOut" } },
}

/** Container com stagger dos filhos. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const MOTION_PRESETS = [
  { name: "popTilt", desc: "Entrada com tilt que assenta (spring)", token: "--ease-spring" },
  { name: "popIn", desc: "Pop de escala com estalo", token: "--ease-spring" },
  { name: "fadeRise", desc: "Sobe e aparece (reveal de seção)", token: "--ease-out" },
  { name: "tiltStack", desc: "Cards inclinam em direções alternadas", token: "--ease-spring" },
  { name: "glitchIn", desc: "Deslize com aberração cromática", token: "--duration-fast" },
  { name: "dimSwap", desc: "Troca de dimensão (skew + fade)", token: "--duration-slow" },
] as const
