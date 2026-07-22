import type { Track } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"
import { MusicPlayer } from "./music-player"

/** Quantas capas cabem na estante ao lado do player. */
const SHELF = 6

/**
 * Rádio — a zona psicodélica.
 *
 * O fundo é um `conic-gradient` de sete cores; o disco atrás do player usa a
 * mesma varredura, girando. A playlist inteira vai para o player (o visitante
 * escolhe a faixa); a estante ao lado mostra só as que têm capa, porque uma
 * grade de fallbacks repetidos não acrescenta nada ao que a lista já diz.
 */
export function ZoneRadio({ tracks }: { tracks: Track[] }) {
  const withCover = tracks.filter((t) => t.cover_image).slice(0, SHELF)

  return (
    <Zone {...ZONES.radio}>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative">
          {/* Disco girando atrás do player. */}
          <span
            aria-hidden
            className="k-swirl pointer-events-none absolute -left-16 -top-16 -z-10 hidden size-72 rounded-full opacity-70 blur-sm lg:block"
          />

          <MusicPlayer tracks={tracks} />
        </div>

        <div className="space-y-6 self-start">
          <p className="k-body text-sm font-medium leading-relaxed opacity-85">
            Tudo que estiver em <code className="k-sub">public/musica/</code> entra nesta playlist
            sozinho. Dá play e o visualizador reage ao som de verdade.
          </p>

          {withCover.length > 0 && (
            <RevealGroup as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {withCover.map((t) => (
                <RevealItem key={t.id} as="li" variants={PANEL_IN}>
                  <ComicPanel accent="violet" tilt className="h-full overflow-hidden">
                    <MediaFrame
                      src={t.cover_image}
                      fallback={t.title}
                      sizes="(max-width: 1024px) 50vw, 15vw"
                      className="aspect-square"
                    />
                    <div className="border-t-[3px] border-[var(--k-ink)] p-3">
                      <h3 className="k-title text-base leading-tight">{t.title}</h3>
                      {t.artist && <p className="k-sub mt-1 text-[10px] opacity-65">{t.artist}</p>}
                    </div>
                  </ComicPanel>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>

      <span aria-hidden className="k-title k-wobble mt-14 block text-center text-4xl sm:text-6xl">
        ♪ ~ turn it up ~ ♪
      </span>

      <Onoma accent="violet" className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block">
        BOOM!
      </Onoma>
    </Zone>
  )
}
