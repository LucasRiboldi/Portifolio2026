"use client"

import React, { memo } from "react"

/**
 * AURORA TEXT — Magic UI, adaptado.
 *
 * ## O que mudou
 *
 * 1. **`bg-size-[200%_auto]` era Tailwind 4.** Neste projeto (Tailwind 3) a
 *    classe não é gerada, o fundo fica do tamanho do texto e a varredura não
 *    tem para onde correr — o gradiente ficaria parado. Virou propriedade
 *    arbitrária.
 *
 * 2. **A paleta é a do multiverso.** As quatro cores padrão do registry
 *    (rosa/roxo/azul genéricos) não são as deste realm. O padrão agora sai dos
 *    tokens `--k-*`, os mesmos que o mesh do herói já consome — o gradiente
 *    passa a pertencer à página em vez de pousar sobre ela.
 *
 * 3. **O giro e a escala saíram dos quadros** (ver `globals.css`): só a cor se
 *    move. O motivo está lá.
 *
 * ## O `sr-only` não é enfeite
 *
 * O texto visível é `aria-hidden` e pintado com `color: transparent` — sem a
 * cópia para leitor de tela, a palavra sumiria da árvore de acessibilidade.
 * Isso veio do registry e está certo; fica registrado para ninguém "limpar"
 * o que parece duplicação.
 */
interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  /** Paradas do gradiente. O padrão são os tokens do realm. */
  colors?: string[]
  /** Multiplicador de velocidade. 1 = os 12s declarados no utilitário. */
  speed?: number
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = [
      "var(--k-magenta)",
      "var(--k-orange)",
      "var(--k-yellow)",
      "var(--k-cyan)",
    ],
    speed = 1,
  }: AuroraTextProps) => {
    const gradiente = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
      animationDuration: `${12 / speed}s`,
    }

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          aria-hidden="true"
          className="animate-aurora relative bg-clip-text text-transparent [background-size:200%_auto]"
          style={gradiente}
        >
          {children}
        </span>
      </span>
    )
  },
)

AuroraText.displayName = "AuroraText"
