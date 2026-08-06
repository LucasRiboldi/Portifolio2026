import Image from "next/image"
import { cn } from "@/lib/utils"
import { IMAGEM_TEMPORARIA } from "@/constants/criativo-landing"
import { Halftone } from "./atoms"

interface MediaFrameProps {
  src: string
  alt?: string
  /** Texto do fallback quando não há imagem — normalmente o título. */
  fallback: string
  sizes: string
  className?: string
  priority?: boolean
  /**
   * Imagem temporária no lugar do vazio. **Ligado por omissão.**
   *
   * Era opcional e as seis zonas passavam `themed` à mão — o que significa que
   * o padrão era o pior caso (só a inicial sobre retícula) e a exceção era o
   * bom. Invertido em 06/08/2026: campo de imagem sem `src` mostra a arte do
   * realm, e quem quiser o requadro só com a letra pede `themed={false}`.
   */
  themed?: boolean
}

/**
 * Moldura de imagem com marcador de lugar desenhado.
 *
 * Muito do conteúdo desta página entra sem capa (o painel ainda não subiu a
 * imagem). Em vez de um retângulo cinzento, o vazio vira requadro de HQ: a arte
 * comic do realm sob um véu, com a inicial gigante por cima. O buraco deixa de
 * parecer defeito e passa a parecer diagramação.
 */
export function MediaFrame({
  src,
  alt = "",
  fallback,
  sizes,
  className,
  priority,
  themed = true,
}: MediaFrameProps) {
  return (
    <span className={cn("relative block overflow-hidden bg-[var(--k-zone-b)]", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
      ) : themed ? (
        <>
          <Image
            src={IMAGEM_TEMPORARIA}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
          {/* véu + inicial: dá profundidade e um pouco de variação por item. */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--k-ink)]/55 via-transparent to-[var(--k-ink)]/10" />
          <span
            aria-hidden
            className="k-title absolute inset-0 flex items-center justify-center text-[5rem] leading-none text-[var(--k-white)] opacity-80 mix-blend-overlay"
          >
            {fallback.charAt(0)}
          </span>
        </>
      ) : (
        <span
          aria-hidden
          className="k-title absolute inset-0 flex items-center justify-center text-[6rem] leading-none text-[var(--k-ink)] opacity-25"
        >
          {fallback.charAt(0)}
        </span>
      )}
      <Halftone color="rgba(18,16,14,0.28)" step={5} />
    </span>
  )
}
