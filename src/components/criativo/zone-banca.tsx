import type { Comic } from "@/lib/repos/criativo"
import { Bubble, Onoma, Stars } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

/** Rótulo e cor de cada status — a etiqueta colada na capa. */
const STATUS: Record<string, { label: string; bg: string }> = {
  lendo: { label: "Lendo agora", bg: "var(--k-red)" },
  lido: { label: "Lido", bg: "var(--k-blue)" },
  fila: { label: "Na fila", bg: "var(--k-violet)" },
  largado: { label: "Larguei", bg: "var(--k-ink)" },
}

/**
 * Banca — as capas na prateleira.
 *
 * A etiqueta de status fica por cima da capa, girada, como o adesivo de preço
 * que a banca cola na revista. É o que faz a prateleira parecer usada em vez
 * de catálogo.
 */
export function ZoneBanca({ comics }: { comics: Comic[] }) {
  return (
    <Zone {...ZONES.banca} panel>
      <RevealGroup as="ul" className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {comics.map((c) => {
          const status = STATUS[c.status] ?? STATUS.lendo!

          return (
            <RevealItem key={c.id} as="li" variants={PANEL_IN}>
              <ComicPanel accent="red" tilt className="group h-full overflow-hidden">
                <span className="relative block">
                  <MediaFrame
                    src={c.cover_image}
                    fallback={c.title}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="aspect-[2/3]"
                  />

                  <span
                    className="k-kicker absolute -right-2 top-3 border-[3px] border-[var(--k-ink)] px-2 py-1 text-[9px] text-white shadow-[3px_3px_0_var(--k-ink)]"
                    style={{ background: status.bg, transform: "rotate(4deg)" }}
                  >
                    {status.label}
                  </span>
                </span>

                <div className="border-t-[3px] border-[var(--k-ink)] p-4">
                  <h3 className="k-title text-lg leading-tight">{c.title}</h3>
                  <p className="k-sub mt-1 text-[10px] opacity-65">
                    {c.author}
                    {c.publisher && ` · ${c.publisher}`}
                  </p>
                  <Stars value={c.rating} className="mt-2 block" />
                  {c.note && (
                    <p className="k-body mt-3 text-xs leading-relaxed opacity-75">{c.note}</p>
                  )}
                </div>
              </ComicPanel>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Bubble className="k-tilt-l mt-12 max-w-md">
        A pilha da cabeceira cresce mais rápido do que eu leio. Está sob controle.
      </Bubble>

      <Onoma accent="blue" className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block">
        FLIP!
      </Onoma>
    </Zone>
  )
}
