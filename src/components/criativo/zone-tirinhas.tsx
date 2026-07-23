import type { Strip } from "@/lib/repos/criativo"
import { Bubble, Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody } from "@/components/layout/comic/panel"
import { SPAN, spanVars } from "@/design-system/comic-layout"
import { ZONES } from "@/constants/criativo-landing"

/**
 * Capítulo 08 · Tirinhas — a zona que existe só para brincadeira.
 *
 * Cada tira é literalmente dois requadros lado a lado, com a piada em balões.
 * Quando há imagem cadastrada, ela substitui os dois quadros e a tira vira
 * desenho; sem imagem, o texto sustenta a piada sozinho.
 *
 * É o único sítio da página onde `Panel` aparece aninhado: a tira é um quadro
 * que contém dois quadros, que é exatamente o que uma tira é. A inclinação fica
 * na `<figure>` e não nos painéis — inclinar cada um deles separadamente
 * desalinharia a dobra entre os dois.
 *
 * A tira inteira é uma `<figure>` com `<figcaption>`: o título é a legenda, não
 * um cabeçalho de navegação — não faz sentido no sumário da página.
 */
export function ZoneTirinhas({ strips }: { strips: Strip[] }) {
  const { id, ...meta } = ZONES.tirinhas

  return (
    <Chapter id={id} palette={id} scene="clip" {...meta}>
      <RevealGroup as="ul" className="cp-grid">
        {strips.map((s, i) => (
          <RevealItem
            key={s.id}
            as="li"
            variants={PANEL_IN}
            className="cp-col"
            style={spanVars(SPAN.half)}
          >
            <figure className={i % 2 === 0 ? "k-tilt-l" : "k-tilt-r"}>
              {s.image ? (
                <Panel as="div" accent="yellow" lit className="group">
                  <PanelBody bleed>
                    <MediaFrame
                      src={s.image}
                      alt={s.title}
                      fallback={s.title}
                      themed
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="aspect-[2/1] w-full"
                    />
                  </PanelBody>
                </Panel>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Quadro 1 — setup */}
                  <Panel as="div" accent="yellow" className="min-h-[11rem]">
                    <PanelBody className="relative flex items-end">
                      <span
                        aria-hidden
                        className="k-title absolute right-3 top-2 text-4xl text-[var(--k-ink)] opacity-10"
                      >
                        1
                      </span>
                      <Bubble>{s.setup}</Bubble>
                    </PanelBody>
                  </Panel>

                  {/* Quadro 2 — punchline */}
                  <Panel as="div" accent="yellow" shape="cutBL" cut={18} className="min-h-[11rem]">
                    <PanelBody className="relative flex items-end">
                      <span
                        aria-hidden
                        className="k-title absolute right-3 top-2 text-4xl text-[var(--k-ink)] opacity-10"
                      >
                        2
                      </span>
                      <Onoma accent="yellow" className="absolute right-4 top-6 text-2xl">
                        HA!
                      </Onoma>
                      <Bubble>{s.punchline}</Bubble>
                    </PanelBody>
                  </Panel>
                </div>
              )}

              <figcaption className="k-sub mt-4 text-xs opacity-70">{s.title}</figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Chapter>
  )
}
