import type { ReactNode } from "react"

/**
 * Mão de cartas — envolve uma galeria e, em telas estreitas, transforma a
 * grade num leque sobreposto (ver poke-hand.css).
 *
 * O componente só distribui números; a aparência é toda CSS:
 *   --i      índice da carta
 *   --desloc posição no leque NORMALIZADA em [-1, 1] → rotação
 *   --dist   o mesmo em valor absoluto [0, 1]        → subida
 *
 * A normalização é o que mantém a abertura do leque constante. Com um
 * ângulo fixo por carta, uma mão de 15 giraria a carta das pontas em 28°;
 * normalizando, o extremo é sempre o mesmo, com 2 cartas ou com 20.
 *
 * `--sobrepor` controla o quanto cada carta entra por baixo da anterior, e
 * afrouxa quando são poucas: duas cartas empilhadas a 26% ficam quase
 * escondidas uma atrás da outra, o que não parece uma mão, parece um erro.
 */
export function PokeHand({
  children,
  className = "",
}: {
  children: ReactNode[]
  className?: string
}) {
  const total = children.length
  const meio = (total - 1) / 2
  // divisor da normalização; com 1 carta não há leque, evita dividir por 0
  const extremo = Math.max(meio, 1)
  const sobrepor = total <= 2 ? "6%" : total <= 4 ? "16%" : "26%"

  return (
    <div className={`poke-hand ${className}`} style={{ "--sobrepor": sobrepor } as React.CSSProperties}>
      {children.map((filho, i) => (
        <div
          key={i}
          style={
            {
              "--i": i,
              "--desloc": ((i - meio) / extremo).toFixed(3),
              "--dist": (Math.abs(i - meio) / extremo).toFixed(3),
            } as React.CSSProperties
          }
        >
          {filho}
        </div>
      ))}
    </div>
  )
}
