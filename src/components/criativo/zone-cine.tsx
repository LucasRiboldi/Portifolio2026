import type { Movie } from "@/lib/repos/criativo"
import { Onoma, Stars } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

const STATUS_LABEL: Record<string, string> = {
  assistido: "Assistido",
  assistindo: "Assistindo",
  fila: "Na fila",
}

/**
 * Cine — a sessão da madrugada.
 *
 * Os pôsteres ficam na razão 2:3 e o comentário entra por baixo como legenda
 * de programa de TV. O feixe de projetor no topo da zona vem do gradiente da
 * paleta `k-zone--cine`, não de um elemento extra.
 */
export function ZoneCine({ movies }: { movies: Movie[] }) {
  return (
    <Zone {...ZONES.cine} panel>
      <RevealGroup as="ul" className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {movies.map((m) => (
          <RevealItem key={m.id} as="li" variants={PANEL_IN}>
            <ComicPanel accent="orange" tilt className="group h-full overflow-hidden">
              <MediaFrame
                src={m.poster_image}
                fallback={m.title}
                themed
                sizes="(max-width: 640px) 50vw, 25vw"
                className="aspect-[2/3]"
              />

              <div className="border-t-[3px] border-[var(--k-ink)] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="k-kicker text-[9px] text-[var(--k-orange)]">
                    {STATUS_LABEL[m.status] ?? m.status}
                  </span>
                  {m.year > 0 && <span className="k-num text-sm opacity-60">{m.year}</span>}
                </div>

                <h3 className="k-title mt-2 text-xl leading-tight">{m.title}</h3>
                {m.director && <p className="k-sub mt-1 text-[10px] opacity-65">{m.director}</p>}
                <Stars value={m.rating} className="mt-2 block text-[var(--k-yellow)]" />
                {m.note && <p className="k-body mt-3 text-xs leading-relaxed opacity-75">{m.note}</p>}
              </div>
            </ComicPanel>
          </RevealItem>
        ))}
      </RevealGroup>

      <Onoma accent="pink" className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block">
        ACTION!
      </Onoma>
    </Zone>
  )
}
