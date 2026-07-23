import type { Artwork } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { ComicPanel } from "@/components/comic/comic-panel"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

const KIND_LABEL: Record<string, string> = {
  ilustracao: "Ilustração",
  edicao: "Edição de imagem",
  "3d": "3D",
  pixel: "Pixel art",
  vetor: "Vetor",
  colagem: "Colagem",
}

/**
 * Ateliê — a prancheta.
 *
 * A grade alterna painéis largos e altos: uma grade uniforme lê-se como
 * catálogo de loja, e o ponto aqui é parecer uma página de revista onde as
 * peças foram encaixadas à mão.
 */
export function ZoneAtelie({ artworks }: { artworks: Artwork[] }) {
  return (
    <Zone {...ZONES.atelie} panel>
      <RevealGroup as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((a, i) => (
          <RevealItem
            key={a.id}
            as="li"
            variants={PANEL_IN}
            className={i % 5 === 0 ? "sm:col-span-2" : undefined}
          >
            <ComicPanel accent="lime" tilt className="group h-full overflow-hidden">
              <MediaFrame
                src={a.image}
                fallback={a.title}
                themed
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={i % 5 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}
              />

              <div className="border-t-[3px] border-[var(--k-ink)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="k-kicker text-[10px] text-[var(--k-lime)]">
                    {KIND_LABEL[a.kind] ?? a.kind}
                  </span>
                  <span className="k-num text-sm opacity-60">{a.year}</span>
                </div>

                <h3 className="k-title mt-3 text-2xl">{a.title}</h3>
                <p className="k-body mt-2 text-sm leading-relaxed opacity-75">{a.description}</p>

                {a.tools.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Ferramentas">
                    {a.tools.map((t) => (
                      <li
                        key={t}
                        className="k-sub border-2 border-current px-2 py-0.5 text-[10px] opacity-70"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ComicPanel>
          </RevealItem>
        ))}
      </RevealGroup>

      <Onoma accent="magenta" className="pointer-events-none absolute right-6 top-24 hidden text-5xl xl:block">
        SPLASH!
      </Onoma>
    </Zone>
  )
}
