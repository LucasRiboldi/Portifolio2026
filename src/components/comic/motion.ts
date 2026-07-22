import type { Transition, Variants } from "motion/react"

/**
 * Vocabulário de movimento da landing Comic 2026.
 *
 * Uma única curva (`EASE`) atravessa a página inteira: é ela que dá a
 * sensação de "peso cinematográfico" — entrada rápida, saída longa. Variar a
 * curva por componente é o que faz uma landing parecer montada por pessoas
 * diferentes.
 */
export const EASE = [0.16, 1, 0.3, 1] as const

export const TRANSITION: Transition = { duration: 0.7, ease: EASE }

/** Container que escalona os filhos — usar com `REVEAL` nos itens. */
export const STAGGER: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

/** Entrada padrão: sobe e revela. */
export const REVEAL: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: TRANSITION },
}

/** Entrada de painel de HQ: chega ligeiramente ampliado e torto. */
export const PANEL_IN: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97, rotate: -0.6 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: TRANSITION },
}

/** Corte lateral — para blocos alternados esquerda/direita. */
export const slideIn = (from: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: from === "left" ? -48 : 48 },
  show: { opacity: 1, x: 0, transition: TRANSITION },
})

/** Viewport partilhado: anima uma vez só, um pouco antes de entrar na tela. */
export const VIEWPORT = { once: true, margin: "-12% 0px -12% 0px" } as const
