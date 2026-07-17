import Link from "next/link"
import { cn } from "@/lib/utils"
import { DIMENSIONS, dimClass, type Dimension } from "./sv-canvas"

/**
 * Grade de portais do multiverso.
 *
 * Cada card é ele próprio um `sv-canvas` com a classe da dimensão: o cartão
 * não *descreve* o estilo, ele é desenhado naquele estilo. Por isso o efeito
 * vem de graça de spiderverse-dimensions.css.
 *
 * Usado na landing do realm Creative (amostra) e em /dimensoes (índice
 * completo) — uma fonte só, para os dois não divergirem.
 */

/** Amostra da landing: variedade de arte, não as 6 primeiras da lista. */
const FEATURED: Dimension[] = ["neon", "noir", "manga", "graffiti", "renaissance", "pixel"]

interface DimensionCardsProps {
  /** Quando true, mostra só as dimensões em destaque. */
  featuredOnly?: boolean
  className?: string
}

export function DimensionCards({ featuredOnly, className }: DimensionCardsProps) {
  const items = featuredOnly
    ? FEATURED.map(id => DIMENSIONS.find(d => d.id === id)!).filter(Boolean)
    : DIMENSIONS

  const cardClass = cn(
    "sv-canvas group relative block overflow-hidden rounded-lg border-[3px] border-black",
    "shadow-[5px_5px_0_0_#000] min-h-[200px] sm:min-h-[220px]"
  )

  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map(d => {
        const body = (
          <div className="relative z-[1] flex h-full flex-col justify-between p-5">
            <span className="sv-panel sv-shift inline-flex w-fit items-center gap-2 px-3 py-1">
              <span className="sv-heavy text-[10px] uppercase tracking-wide">Terra-{d.earth}</span>
            </span>
            <span>
              <span className="sv-display block text-2xl uppercase sm:text-3xl">{d.label}</span>
              <span className="sv-heavy mt-1 block text-[11px] uppercase tracking-wide opacity-75">
                {d.desc}
              </span>
            </span>
          </div>
        )

        // Na amostra da landing o card leva ao índice. No próprio índice ele é
        // estático — linkar /dimensoes para /dimensoes não levaria a lugar algum.
        return featuredOnly ? (
          <Link
            key={d.id}
            href="/dimensoes"
            aria-label={`Dimensão ${d.label} — Terra-${d.earth}`}
            className={cn(
              cardClass,
              "transition-transform duration-200 hover:-translate-y-1.5 focus-visible:-translate-y-1.5",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--sv-cyan)]",
              dimClass[d.id]
            )}
          >
            {body}
          </Link>
        ) : (
          <div key={d.id} className={cn(cardClass, dimClass[d.id])}>
            {body}
          </div>
        )
      })}
    </div>
  )
}
