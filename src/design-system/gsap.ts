/**
 * GSAP do Design System — setup canônico.
 * ------------------------------------------------------------------------
 * Centraliza o registro de plugins e helpers para uso futuro no portal.
 * Complementa `motion/react` (Framer Motion): use GSAP para timelines
 * complexas, ScrollTrigger e sequências finas de scroll; use `motion` para
 * variantes declarativas de componente.
 *
 * Uso (client component):
 *   "use client"
 *   import { useGSAP } from "@gsap/react"
 *   import { gsap } from "@/design-system/gsap"
 *
 *   useGSAP(() => {
 *     if (prefersReducedMotion()) return
 *     gsap.from(".alvo", { y: 24, opacity: 0, ease: EASE.out, duration: DUR.base })
 *   }, { scope: ref })
 *
 * Durações/easings espelham os tokens --duration-* / --ease-* do Design System.
 */
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

let registered = false

/** Registra os plugins uma única vez (idempotente, safe em client). */
export function registerGsap() {
  if (registered || typeof window === "undefined") return
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  registered = true
}

registerGsap()

/** Respeita prefers-reduced-motion — mesma convenção do resto do portal. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  )
}

/** Durações (segundos) alinhadas aos tokens --duration-*. */
export const DUR = {
  fast: 0.15,
  base: 0.35,
  slow: 0.6,
} as const

/** Easings alinhados aos tokens --ease-*. */
export const EASE = {
  out: "power2.out",
  smooth: "power1.inOut",
  spring: "elastic.out(1, 0.5)",
  bounce: "back.out(1.7)",
} as const

export { gsap, ScrollTrigger, useGSAP }
