import type { Track } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody, PanelFooter } from "@/components/layout/comic/panel"
import { spanVars } from "@/design-system/comic-layout"
import { ZONES } from "@/constants/criativo-landing"
import { MusicPlayer } from "./music-player"

/** Quantas capas cabem na estante ao lado do player. */
const SHELF = 6

/**
 * Capítulo 05 · Rádio — a zona psicodélica.
 *
 * O fundo é um `conic-gradient` de sete cores; o disco atrás do player usa a
 * mesma varredura, girando. A playlist inteira vai para o player (o visitante
 * escolhe a faixa); a estante ao lado mostra só as que têm capa, porque uma
 * grade de fallbacks repetidos não acrescenta nada ao que a lista já diz.
 *
 * Na grelha editorial o par é 7+5: o player manda, a estante acompanha.
 *
 * A estante é uma grelha aninhada, e uma grelha aninhada volta a ter 12 colunas
 * — as suas colunas são as da calha, não as da página. Por isso as capas vão a
 * 4 (três por fila dentro da calha) e não a 2, que ali dentro dariam seis capas
 * de 76px.
 */
export function ZoneRadio({ tracks }: { tracks: Track[] }) {
  const { id, ...meta } = ZONES.radio
  const withCover = tracks.filter((t) => t.cover_image).slice(0, SHELF)

  return (
    <Chapter id={id} palette={id} {...meta}>
      <div className="cp-grid gap-y-8">
        <div className="cp-col relative" style={{ "--cp-span-l": 7 } as React.CSSProperties}>
          {/* Disco girando atrás do player. */}
          <span
            aria-hidden
            className="k-swirl pointer-events-none absolute -left-16 -top-16 -z-10 hidden size-72 rounded-full opacity-70 blur-sm lg:block"
          />

          <MusicPlayer tracks={tracks} />
        </div>

        <div
          className="cp-col space-y-6 self-start"
          style={{ "--cp-span-l": 5 } as React.CSSProperties}
        >
          <p className="k-body text-sm font-medium leading-relaxed opacity-85">
            Tudo que estiver em <code className="k-sub">public/musica/</code> entra nesta playlist
            sozinho. Dá play e o visualizador reage ao som de verdade.
          </p>

          {withCover.length > 0 && (
            <RevealGroup as="ul" className="cp-grid">
              {withCover.map((t, i) => (
                <RevealItem
                  key={t.id}
                  as="li"
                  variants={PANEL_IN}
                  className="cp-col"
                  style={spanVars({ base: 2, sm: 4, lg: 4 })}
                >
                  <Panel
                    as="article"
                    shape={i % 3 === 0 ? "octagon" : "rect"}
                    accent="violet"
                    lit
                    className="h-full"
                  >
                    <PanelBody bleed>
                      <MediaFrame
                        src={t.cover_image}
                        fallback={t.title}
                        themed
                        sizes="(max-width: 1024px) 50vw, 15vw"
                        className="aspect-square w-full"
                      />
                    </PanelBody>
                    <PanelFooter>
                      <h3 className="k-title text-base leading-tight">{t.title}</h3>
                      {t.artist && <p className="k-sub mt-1 text-[10px] opacity-65">{t.artist}</p>}
                    </PanelFooter>
                  </Panel>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </div>

      <span aria-hidden className="k-title k-wobble mt-14 block text-center text-4xl sm:text-6xl">
        ♪ ~ turn it up ~ ♪
      </span>

      <Onoma
        accent="violet"
        className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block"
      >
        BOOM!
      </Onoma>
    </Chapter>
  )
}
