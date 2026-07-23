import type { Strip } from "@/lib/repos/criativo"
import { Bubble, Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

/**
 * Tirinhas — a zona que existe só para brincadeira.
 *
 * Cada tira é literalmente dois requadros lado a lado, com a piada em balões.
 * Quando há imagem cadastrada, ela substitui os dois quadros e a tira vira
 * desenho; sem imagem, o texto sustenta a piada sozinho.
 *
 * A tira inteira é uma `<figure>` com `<figcaption>`: o título é a legenda,
 * não um cabeçalho de navegação — não faz sentido no sumário da página.
 */
export function ZoneTirinhas({ strips }: { strips: Strip[] }) {
  return (
    <Zone {...ZONES.tirinhas} panel>
      <RevealGroup as="ul" className="grid gap-8 lg:grid-cols-2">
        {strips.map((s, i) => (
          <RevealItem key={s.id} as="li" variants={PANEL_IN}>
            <figure className={i % 2 === 0 ? "k-tilt-l" : "k-tilt-r"}>
              {s.image ? (
                <div className="k-panel overflow-hidden">
                  <MediaFrame
                    src={s.image}
                    alt={s.title}
                    fallback={s.title}
                    themed
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="aspect-[2/1]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Quadro 1 — setup */}
                  <div className="k-panel relative flex min-h-[11rem] items-end p-4">
                    <span
                      aria-hidden
                      className="k-title absolute right-3 top-2 text-4xl text-[var(--k-ink)] opacity-10"
                    >
                      1
                    </span>
                    <Bubble>{s.setup}</Bubble>
                  </div>

                  {/* Quadro 2 — punchline */}
                  <div className="k-panel relative flex min-h-[11rem] items-end p-4">
                    <span
                      aria-hidden
                      className="k-title absolute right-3 top-2 text-4xl text-[var(--k-ink)] opacity-10"
                    >
                      2
                    </span>
                    <Onoma
                      accent="yellow"
                      className="absolute right-4 top-6 text-2xl"
                    >
                      HA!
                    </Onoma>
                    <Bubble>{s.punchline}</Bubble>
                  </div>
                </div>
              )}

              <figcaption className="k-sub mt-4 text-xs opacity-70">{s.title}</figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Zone>
  )
}
