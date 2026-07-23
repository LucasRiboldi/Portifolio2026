import type { Comic } from "@/lib/repos/criativo"
import { Bubble, Onoma, Stars } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody, PanelFooter } from "@/components/layout/comic/panel"
import { spanVars, type PanelShape } from "@/design-system/comic-layout"
import { ZONES } from "@/constants/criativo-landing"

/** Rótulo e cor de cada status — a etiqueta colada na capa. */
const STATUS: Record<string, { label: string; bg: string }> = {
  lendo: { label: "Lendo agora", bg: "var(--k-red)" },
  lido: { label: "Lido", bg: "var(--k-blue)" },
  fila: { label: "Na fila", bg: "var(--k-violet)" },
  largado: { label: "Larguei", bg: "var(--k-ink)" },
}

/**
 * A prateleira: seis capas por fila no desktop, duas no telemóvel.
 *
 * As capas mantêm todas a mesma largura — numa banca o que varia é a revista,
 * não o espaço que ela ocupa na estante. A quebra da grade vem da inclinação e
 * do canto mordido, em posições primas entre si (3 e 4) para o padrão não cair
 * sempre na mesma coluna de uma fila de seis.
 */
function shelf(i: number): PanelShape {
  if (i % 4 === 0) return "cutBL"
  if (i % 3 === 0) return "tiltL"
  return "rect"
}

/**
 * Capítulo 03 · Banca — as capas na prateleira.
 *
 * A etiqueta de status fica por cima da capa, girada, como o adesivo de preço
 * que a banca cola na revista. É o que faz a prateleira parecer usada em vez de
 * catálogo.
 */
export function ZoneBanca({ comics }: { comics: Comic[] }) {
  const { id, ...meta } = ZONES.banca

  return (
    <Chapter id={id} palette={id} scene="skew" {...meta}>
      <RevealGroup as="ul" className="cp-grid">
        {comics.map((c, i) => {
          const status = STATUS[c.status] ?? STATUS.lendo!

          return (
            <RevealItem
              key={c.id}
              as="li"
              variants={PANEL_IN}
              className="cp-col"
              style={spanVars({ base: 2, sm: 2, lg: 2 })}
            >
              <Panel
                as="article"
                shape={shelf(i)}
                cut={20}
                accent="red"
                lit
                className="group h-full"
              >
                <PanelBody bleed className="relative">
                  <MediaFrame
                    src={c.cover_image}
                    fallback={c.title}
                    themed
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                    className="aspect-[2/3] w-full"
                  />

                  {/* Acima da retícula da moldura (z-2), senão o adesivo fica por
                      baixo dos pontos de impressão e perde o contraste. */}
                  <span
                    className="k-kicker absolute right-1 top-3 z-[3] border-[3px] border-[var(--k-ink)] px-2 py-1 text-[9px] text-white shadow-[3px_3px_0_var(--k-ink)]"
                    style={{ background: status.bg, transform: "rotate(4deg)" }}
                  >
                    {status.label}
                  </span>
                </PanelBody>

                <PanelFooter>
                  <h3 className="k-title text-lg leading-tight">{c.title}</h3>
                  <p className="k-sub mt-1 text-[10px] opacity-65">
                    {c.author}
                    {c.publisher && ` · ${c.publisher}`}
                  </p>
                  <Stars value={c.rating} className="mt-2 block" />
                  {c.note && (
                    <p className="k-body mt-3 text-xs leading-relaxed opacity-75">{c.note}</p>
                  )}
                </PanelFooter>
              </Panel>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Bubble className="k-tilt-l mt-12 max-w-md">
        A pilha da cabeceira cresce mais rápido do que eu leio. Está sob controle.
      </Bubble>

      <Onoma
        accent="blue"
        className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block"
      >
        FLIP!
      </Onoma>
    </Chapter>
  )
}
