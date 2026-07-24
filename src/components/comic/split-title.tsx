"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { toWords, isSpace } from "@/animations/split"
import { TREATMENT_CLASS, type Treatment } from "./glitch-title-classes"
import { gsap, useGSAP, prefersReducedMotion, EASE } from "@/design-system/gsap"

interface SplitTitleProps {
  children: string
  treatment?: Treatment
  as?: "h1" | "h2" | "h3"
  id?: string
  className?: string
}

/**
 * Manchete que entra palavra a palavra.
 *
 * A diferença para o {@link GlitchTitle} é só o gesto: o título não aparece,
 * ele é *impresso* — cada palavra sobe, roda e assenta com um atraso curto
 * entre elas, como tipos caindo na prensa. Num capítulo de HQ a manchete é o
 * primeiro quadro, e um fade não conta essa entrada.
 *
 * ## Porque a classe de tratamento vai em cada palavra
 *
 * Os tratamentos (`k-3d`, `kfx-neon`, `k-glitch`…) desenham o efeito a partir
 * do elemento que contém o texto — o glitch chega a duplicá-lo em
 * `::before`/`::after` via `attr(data-text)`. Aplicada só no `<h2>`, com as
 * palavras dentro de spans, a extrusão sairia da caixa do bloco inteiro em vez
 * de sair de cada palavra, e o glitch duplicaria a linha toda por trás. Por
 * isso cada palavra é uma unidade tipográfica completa, com a sua própria
 * classe e o seu próprio `data-text`.
 *
 * ## Acessibilidade
 *
 * Os pedaços são decorativos: `aria-hidden` neles e o texto real no
 * `aria-label` do cabeçalho. Sem isso, o leitor de ecrã anuncia a manchete
 * fatiada, palavra a palavra, como se fossem itens separados.
 *
 * `prefers-reduced-motion` não anima nada — o título já é renderizado no
 * estado final, e um "fade rápido" continua a ser movimento.
 */
export function SplitTitle({
  children,
  treatment = "letter",
  as: Tag = "h2",
  id,
  className,
}: SplitTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const tokens = toWords(children)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return

      gsap.from(ref.current.querySelectorAll("[data-word]"), {
        yPercent: 115,
        rotate: 4,
        opacity: 0,
        duration: 0.75,
        ease: EASE.out,
        stagger: 0.055,
        scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none none" },
      })
    },
    { scope: ref, dependencies: [children] },
  )

  return (
    <Tag
      ref={ref}
      id={id}
      aria-label={children}
      className={cn("k-title", className)}
      style={{
        // `clip` (e não `hidden`) porque as palavras sobem de baixo da linha de
        // base: o corte esconde o estado inicial sem criar contexto de scroll.
        overflow: "clip",
        // Os tratamentos desenham para fora da caixa do glifo — a extrusão 3D
        // desce, o néon irradia, a sombra dura desloca. Um corte justo comeria
        // essa parte do efeito, então a região de corte é alargada meio em.
        overflowClipMargin: "0.5em",
      }}
    >
      {tokens.map((token, i) =>
        isSpace(token) ? (
          <span key={i} aria-hidden>
            {token}
          </span>
        ) : (
          <span
            key={i}
            aria-hidden
            data-word
            data-text={treatment === "glitch" ? token : undefined}
            className={cn("inline-block", TREATMENT_CLASS[treatment])}
          >
            {token}
          </span>
        ),
      )}
    </Tag>
  )
}
