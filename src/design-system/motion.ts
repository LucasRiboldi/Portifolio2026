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

/* ---- 10 motions extras (energia punk / comic) ---- */
export const slamIn: Variants = {
  hidden: { opacity: 0, scale: 1.6, rotate: -8 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 500, damping: 22 } },
}
export const shake: Variants = {
  hidden: { x: 0 },
  visible: { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } },
}
export const swing: Variants = {
  hidden: { rotate: -12, opacity: 0, originY: 0 },
  visible: { rotate: [(-12), 8, -4, 0], opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
}
export const vibrate: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, x: [0, -1.5, 1.5, -1.5, 1.5, 0], transition: { x: { repeat: Infinity, duration: 0.25 }, opacity: { duration: 0.2 } } },
}
export const flicker: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: [0, 1, 0.3, 1, 0.6, 1], transition: { duration: 0.7 } },
}
export const popBurst: Variants = {
  hidden: { scale: 0, rotate: -30 },
  visible: { scale: [0, 1.25, 1], rotate: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
}
export const slideRip: Variants = {
  hidden: { opacity: 0, x: -60, skewX: 12 },
  visible: { opacity: 1, x: 0, skewX: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
}
export const spinPop: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -180 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 16 } },
}
export const elastic: Variants = {
  hidden: { scaleX: 0.4, scaleY: 1.4, opacity: 0 },
  visible: { scaleX: 1, scaleY: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 12 } },
}
export const drift: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: [14, -4, 0], transition: { duration: 0.6, ease: "easeOut" } },
}

export const MOTION_PRESETS = [
  { name: "popTilt", desc: "Entrada com tilt que assenta (spring)", token: "--ease-spring" },
  { name: "popIn", desc: "Pop de escala com estalo", token: "--ease-spring" },
  { name: "fadeRise", desc: "Sobe e aparece (reveal de seção)", token: "--ease-out" },
  { name: "tiltStack", desc: "Cards inclinam em direções alternadas", token: "--ease-spring" },
  { name: "glitchIn", desc: "Deslize com aberração cromática", token: "--duration-fast" },
  { name: "dimSwap", desc: "Troca de dimensão (skew + fade)", token: "--duration-slow" },
  { name: "slamIn", desc: "Impacto: entra grande e crava", token: "--ease-spring" },
  { name: "shake", desc: "Tremor lateral (POW!)", token: "--duration-slow" },
  { name: "swing", desc: "Balança pendurado e assenta", token: "--ease-out" },
  { name: "vibrate", desc: "Vibração contínua (energia)", token: "--duration-fast" },
  { name: "flicker", desc: "Piscada de neon", token: "--duration-slow" },
  { name: "popBurst", desc: "Estoura do zero com overshoot", token: "--ease-spring" },
  { name: "slideRip", desc: "Rasga da esquerda com skew", token: "--ease-spring" },
  { name: "spinPop", desc: "Gira 180° e cresce", token: "--ease-spring" },
  { name: "elastic", desc: "Elástico (squash & stretch)", token: "--ease-spring" },
  { name: "drift", desc: "Sobe suave com leve overshoot", token: "--ease-out" },
] as const
