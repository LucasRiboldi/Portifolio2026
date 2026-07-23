"use client"

import { useRef } from "react"
import { useGSAP, gsap, prefersReducedMotion } from "@/design-system/gsap"

/**
 * Parallax de scroll amarrado ao progresso (scrub) para um elemento decorativo.
 *
 * Renderiza um `<span aria-hidden>` — feito para o número-fantasma das faixas e
 * afins: o elemento desliza em `y` conforme a seção cruza a tela, dando a
 * profundidade de camada que uma página impressa não tem. É `transform`, então
 * não mexe na ancoragem absoluta do elemento, só no seu deslocamento visual.
 *
 * `prefers-reduced-motion`: sem trigger — o elemento fica onde o CSS o pôs.
 */
export function ScrubParallax({
  from = 0,
  to = -110,
  className,
  children,
}: {
  from?: number
  to?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.fromTo(
        ref.current,
        { y: from },
        {
          y: to,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    },
    { scope: ref, dependencies: [from, to] },
  )

  return (
    <span ref={ref} aria-hidden className={className}>
      {children}
    </span>
  )
}
