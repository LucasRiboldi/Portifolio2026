import type { Track } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"
import { AudioVisualizer } from "./audio-visualizer"

/**
 * Rádio — a zona psicodélica.
 *
 * O fundo é um `conic-gradient` de sete cores que gira devagar; o disco atrás
 * do player usa a mesma varredura. A primeira faixa vira o player; as demais
 * ficam como capas na estante ao lado.
 */
export function ZoneRadio({ tracks }: { tracks: Track[] }) {
  const [featured, ...rest] = tracks

  return (
    <Zone {...ZONES.radio}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative">
          {/* Disco girando atrás do player. */}
          <span
            aria-hidden
            className="k-swirl pointer-events-none absolute -left-16 -top-16 -z-10 hidden size-72 rounded-full opacity-70 blur-sm lg:block"
          />

          {featured ? (
            <AudioVisualizer
              src={featured.audio_url}
              title={featured.title}
              artist={featured.artist}
            />
          ) : (
            <ComicPanel className="p-8">
              <p className="k-body text-sm opacity-80">
                Nenhuma faixa cadastrada. Suba uma pelo /admin → Rádio.
              </p>
            </ComicPanel>
          )}

          {featured?.note && (
            <p className="k-body mt-5 max-w-lg text-sm font-medium leading-relaxed opacity-85">
              {featured.note}
            </p>
          )}
        </div>

        {rest.length > 0 && (
          <RevealGroup as="ul" className="grid grid-cols-2 gap-4 self-start">
            {rest.map((t) => (
              <RevealItem key={t.id} as="li" variants={PANEL_IN}>
                <ComicPanel accent="violet" tilt className="h-full overflow-hidden">
                  <MediaFrame
                    src={t.cover_image}
                    fallback={t.title}
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="aspect-square"
                  />
                  <div className="border-t-[3px] border-[var(--k-ink)] p-3">
                    <h3 className="k-title text-base leading-tight">{t.title}</h3>
                    <p className="k-sub mt-1 text-[10px] opacity-65">{t.artist}</p>
                  </div>
                </ComicPanel>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
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
