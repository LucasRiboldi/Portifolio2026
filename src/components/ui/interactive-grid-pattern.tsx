"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * InteractiveGridPattern is a component that renders a grid pattern with interactive squares.
 *
 * @param width - The width of each square.
 * @param height - The height of each square.
 * @param squares - The number of squares in the grid. The first element is the number of horizontal squares, and the second element is the number of vertical squares.
 * @param className - The class name of the grid.
 * @param squaresClassName - The class name of the squares.
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number] // [horizontal, vertical]
  className?: string
  squaresClassName?: string
}

/**
 * The InteractiveGridPattern component.
 *
 * @see InteractiveGridPatternProps for the props interface.
 * @returns A React component.
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        // A borda cinza do registry saiu: no herói ela desenharia um retângulo
        // duro por cima do mesh. A grelha é campo, não caixa.
        "absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              /* `not-[&:hover]:duration-1000` saiu: a variante `not-*` é do
                 Tailwind 4 e aqui não gera classe nenhuma — ficava só o
                 `duration-100`, e a saída do quadrado apagava tão rápido
                 quanto acendia, sem o rastro que a peça quer. O mesmo efeito
                 sai de uma transição longa no repouso e curta no aceso: a
                 célula acende na hora e demora a esfriar. */
              /* `color-mix` e não o modificador `/25` do Tailwind: a sintaxe
                 `fill-[color:var(--x)]/25` NÃO injeta alfa quando a cor é uma
                 variável CSS — o Tailwind 3 precisa de um valor que ele saiba
                 decompor em canais, e com `var()` ele desiste e devolve preto
                 sólido. Medido: a célula acendia `rgb(0,0,0)` em cima do mesh.
                 O `color-mix` resolve no navegador, onde a variável já existe. */
              "stroke-[color-mix(in_srgb,var(--k-ink)_20%,transparent)] transition-[fill] duration-700 ease-out",
              hoveredSquare === index
                ? "fill-[color-mix(in_srgb,var(--k-cyan)_25%,transparent)] duration-100"
                : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => setHoveredSquare(index)}
            onMouseLeave={() => setHoveredSquare(null)}
          />
        )
      })}
    </svg>
  )
}
