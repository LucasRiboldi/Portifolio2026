import { RansomText } from "./ransom-text"

/** Posições que recebem o salto da anomalia — fixas: `Math.random()` no render
 *  daria markup diferente no servidor e no cliente, quebrando a hidratação. */
const GLITCHED: ReadonlySet<number> = new Set([2, 7, 11])

interface PunkNameProps {
  children: string
  className?: string
  /** Rótulo lido pelo leitor de tela; por omissão, o próprio texto. */
  label?: string
}

/**
 * Nome montado letra a letra em recortes de revista — a assinatura do autor na
 * capa, na anomalia **Terra-138 · Punk**.
 *
 * É o {@link RansomText} com as posições de glitch da Terra-138 já ligadas: a
 * mecânica do recorte vive no componente-base, aqui fica só a variante-anomalia.
 */
export function PunkName({ children, className, label }: PunkNameProps) {
  return (
    <RansomText className={className} label={label} glitchAt={GLITCHED}>
      {children}
    </RansomText>
  )
}
