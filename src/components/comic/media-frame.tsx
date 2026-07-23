import Image from "next/image"
import { cn } from "@/lib/utils"
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
   * Quando `true`, o vazio (sem `src`) é preenchido com a imagem do realm
   * Creative (`/realms/creative.png`) — a arte comic gerada para o multiverso,
   * livre de direitos autorais. Fica atrás de um leve véu com a inicial gigante,
   * para o espaço parecer diagramação e não defeito.
   */
  themed?: boolean
}

/**
 * Moldura de imagem com fallback desenhado.
 *
 * Muito do conteúdo desta página entra sem capa (o admin ainda não subiu a
 * imagem). Em vez de um retângulo cinzento, o fallback vira um requadro de HQ:
 * quando a zona pede `themed`, a arte comic do realm com véu e inicial gigante;
 * senão, só a inicial sobre retícula. O buraco deixa de parecer defeito e passa
 * a parecer diagramação.
 */
export function MediaFrame({ src, alt = "", fallback, sizes, className, priority, themed }: MediaFrameProps) {
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
            src="/realms/creative.png"
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
