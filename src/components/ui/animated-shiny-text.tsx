import { type ComponentPropsWithoutRef, type CSSProperties, type FC } from "react"

import { cn } from "@/lib/utils"

/**
 * ANIMATED SHINY TEXT — Magic UI, adaptado.
 *
 * ## O que mudou em relação ao que o registry entrega, e por quê
 *
 * 1. **Dialeto do Tailwind.** O original usa utilitários que só existem no
 *    Tailwind 4: `bg-linear-to-r`, `bg-size-[…]`, `bg-position-[…]` e
 *    `via-50%`. Este projeto está no 3, onde nenhum deles é gerado — a peça
 *    chegava sem gradiente e sem varredura, parada e sem erro. Aqui estão
 *    reescritos em `bg-gradient-to-r` e propriedades arbitrárias.
 *
 * 2. **Cor.** O cinza neutro do registry não pertence a este realm. A
 *    varredura passa pelos tokens do multiverso (`--k-cyan`), e a cor de
 *    repouso é herdada (`currentColor`) em vez de fixada — assim a peça
 *    obedece a quem a usa, como o resto dos átomos do /criativo.
 *
 * 3. **`mx-auto max-w-md` saiu.** Era decisão de layout embutida num
 *    componente de texto: centralizava e limitava a largura de qualquer
 *    trecho onde fosse aplicado. Quem posiciona é o chamador.
 *
 * ## Por que ele é seguro para o LCP
 *
 * A varredura anima `background-position` sobre texto recortado
 * (`bg-clip-text`), NUNCA `opacity`. O texto está pintado no primeiro quadro,
 * com ou sem JavaScript — que é a regra que o herói deste realm protege desde
 * que foi escrito. Foi por isso que esta peça entrou no lugar de um
 * `text-reveal` clássico, que começa em opacidade zero.
 */
export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  /** Largura da faixa de brilho, em px. Quanto menor, mais seco o lampejo. */
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 120,
  ...props
}) => {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        /* A TINTA PRECISA SER TRANSLÚCIDA, e esta é a linha que faz a peça
           existir. `bg-clip-text` pinta o gradiente ATRÁS dos glifos; se a cor
           do texto for opaca, ele fica coberto e não se vê lampejo nenhum. O
           registry escondia isso num `text-neutral-600/70` fixo. Aqui a cor
           continua sendo herdada — só passa por um `color-mix` que lhe tira
           35%, o bastante para o brilho atravessar sem clarear o texto. */
        "[color:color-mix(in_srgb,currentColor_65%,transparent)]",
        // A varredura: fundo estreito, recortado no texto, correndo na
        // horizontal. `bg-no-repeat` é o que impede a faixa de se multiplicar.
        "animate-shiny-text bg-clip-text bg-no-repeat",
        "[background-size:var(--shiny-width)_100%] [background-position:0_0]",
        // O gradiente do lampejo, na cor do multiverso.
        "bg-gradient-to-r from-transparent via-[var(--k-cyan)] to-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
