import Image from "next/image"
import { cn } from "@/lib/utils"

interface ComicBookProps {
  title: string
  /** Capa. Sem imagem, entra a arte do realm com a inicial por cima. */
  cover?: string
  /** Etiqueta colada na capa — "Lendo agora", "Na fila"… */
  sticker?: { label: string; bg: string }
  sizes: string
  /** Legenda por baixo do livro: autor, nota, estrelas. */
  children?: React.ReactNode
  className?: string
}

/**
 * Um exemplar na prateleira — capa, miolo e contracapa em três dimensões.
 *
 * A capa abre alguns graus sobre a lombada quando o ponteiro (ou o foco) chega,
 * as folhas saem em leque e um brilho varre o papel. É a técnica do pen
 * "3D Book Effect" (filipz), reescrita em CSS e vestida com a tinta da casa —
 * o desenho todo está em `styles/comic-book.css`, e o porquê de não haver GSAP
 * aqui está documentado lá.
 *
 * Server component: o efeito é inteiramente CSS, então a Banca continua a
 * renderizar no servidor e nenhum livro custa JavaScript no cliente.
 *
 * As camadas decorativas (folhas, contracapa, dobra, brilho) não são anunciadas
 * — quem usa leitor de ecrã recebe a capa com o título e a legenda por baixo,
 * que é o que a estante realmente diz.
 */
export function ComicBook({ title, cover, sticker, sizes, children, className }: ComicBookProps) {
  return (
    <article className={cn("cb", className)}>
      <div className="cb__body">
        <span aria-hidden className="cb__back" />

        {/* Três folhas: a de cima anda mais no leque, a de baixo fica parada e
            faz de miolo. É o escalonamento que dá espessura ao volume. */}
        <span aria-hidden className="cb__pages">
          <span className="cb__page" />
          <span className="cb__page" />
          <span className="cb__page" />
        </span>

        <div className="cb__cover">
          {cover ? (
            <Image src={cover} alt={`Capa de ${title}`} fill sizes={sizes} className="object-cover" />
          ) : (
            <span aria-hidden className="cb__art relative block bg-[var(--k-zone-b)]">
              <Image
                src="/realms/creative.png"
                alt=""
                fill
                sizes={sizes}
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-[var(--k-ink)]/55 to-transparent" />
              <span className="k-title absolute inset-0 flex items-center justify-center text-[4rem] leading-none text-[var(--k-white)] opacity-80 mix-blend-overlay">
                {title.charAt(0)}
              </span>
            </span>
          )}

          <span aria-hidden className="cb__gutter" />
          <span aria-hidden className="cb__sheen" />
        </div>

        {sticker && (
          <span className="cb__sticker k-kicker text-[9px]" style={{ background: sticker.bg }}>
            {sticker.label}
          </span>
        )}
      </div>

      {children && <div className="cb__caption">{children}</div>}
    </article>
  )
}
