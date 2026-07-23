"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/design-system/gsap"

/**
 * A câmara virtual da HQ.
 *
 * O scroll deixa de rolar uma lista e passa a mover um olho sobre a página: o
 * capítulo que entra aproxima-se e ganha foco, os vizinhos afastam-se em Z e
 * perdem saturação. É o gesto que transforma "seções empilhadas" em narrativa —
 * o leitor percebe que há um antes e um depois, não só mais conteúdo.
 *
 * Um `ScrollTrigger` por capítulo, com `scrub`: o movimento fica preso ao
 * scroll (e ao Lenis, que já é o relógio do ScrollTrigger via
 * `SmoothScrollProvider`) em vez de correr no seu próprio tempo. Uma timeline
 * com tempo próprio dessincroniza assim que o utilizador arrasta a barra.
 *
 * `data-focus` é escrito aqui e lido pelo CSS: a dessaturação do capítulo fora
 * de foco é uma transição CSS, não uma propriedade animada quadro a quadro —
 * `filter` interpolado a 60fps num bloco desta altura é caro e a diferença
 * visual é nula.
 */
export function CameraStage({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]")

      chapters.forEach((el) => {
        el.dataset.focus = "off"

        gsap.fromTo(
          el,
          { scale: 0.93, z: -140, opacity: 0.55 },
          {
            scale: 1,
            z: 0,
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              // Entra enquanto sobe o ecrã e sai só depois de o topo passar —
              // a janela de "foco" é o miolo, onde a leitura acontece.
              start: "top 88%",
              end: "top 32%",
              scrub: 0.6,
              onEnter: () => (el.dataset.focus = "on"),
              onEnterBack: () => (el.dataset.focus = "on"),
              onLeaveBack: () => (el.dataset.focus = "off"),
            },
          },
        )

        // Saída: o capítulo lido recua em vez de sumir — continua a haver página
        // por baixo, como quem afasta o olho e não como quem apaga a luz.
        gsap.to(el, {
          scale: 0.955,
          z: -90,
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "bottom 62%",
            end: "bottom 6%",
            scrub: 0.6,
            onLeave: () => (el.dataset.focus = "off"),
            onEnterBack: () => (el.dataset.focus = "on"),
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="cp-stage">
      {children}
    </div>
  )
}
