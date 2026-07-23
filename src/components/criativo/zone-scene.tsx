"use client"

import { useRef } from "react"
import { useGSAP, gsap, prefersReducedMotion, EASE } from "@/design-system/gsap"

/**
 * O gesto de entrada de uma dimensão — cada zona ganha uma "cena" própria.
 *
 * Envolve o conteúdo de uma zona e, quando ele entra na banda de leitura,
 * roda um reveal escolhido por `variant`. A variedade é o ponto: o prompt pede
 * que "cada seção surpreenda" e que o mesmo efeito não se repita — então o
 * ateliê abre por máscara, o cine dá zoom, a oficina desliza da esquerda, e por
 * aí. É GSAP ScrollTrigger com `toggleActions: play none none none` (toca uma
 * vez, ao entrar), não scrub: o conteúdo é longo e um scrub o faria "respirar"
 * o tempo todo, cansando a leitura.
 *
 * `prefers-reduced-motion`: não registra trigger nenhum — o conteúdo já está no
 * estado final, visível e estático.
 */
export type SceneVariant = "rise" | "clip" | "zoom" | "skew" | "slideL" | "slideR" | "pop"

const FROM: Record<SceneVariant, gsap.TweenVars> = {
  rise: { y: 64, opacity: 0 },
  clip: { clipPath: "inset(0 0 100% 0)", opacity: 1 },
  zoom: { scale: 0.9, opacity: 0, transformOrigin: "center" },
  skew: { skewY: 4, y: 44, opacity: 0 },
  slideL: { x: -60, opacity: 0 },
  slideR: { x: 60, opacity: 0 },
  pop: { scale: 0.82, rotate: -3, opacity: 0, transformOrigin: "center" },
}

export function ZoneScene({
  variant = "rise",
  className,
  children,
}: {
  variant?: SceneVariant
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.from(ref.current, {
        ...FROM[variant],
        duration: 0.9,
        ease: variant === "pop" ? EASE.bounce : EASE.out,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      })
    },
    { scope: ref, dependencies: [variant] },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
