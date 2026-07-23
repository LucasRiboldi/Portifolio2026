import type { Movie } from "@/lib/repos/criativo"
import { Onoma, Stars } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody, PanelFooter } from "@/components/layout/comic/panel"
import { SPAN, spanVars, type PanelShape, type PanelSpan } from "@/design-system/comic-layout"
import { ZONES } from "@/constants/criativo-landing"

const STATUS_LABEL: Record<string, string> = {
  assistido: "Assistido",
  assistindo: "Assistindo",
  fila: "Na fila",
}

/**
 * Ritmo próprio do Cine.
 *
 * O `beat()` genérico mistura quadros largos, e um pôster largo fica errado — a
 * forma do cartaz é vertical e é isso que o olho reconhece. Aqui a variação vem
 * do *formato do requadro* e do tamanho, não da proporção: os cartazes ficam
 * sempre em 2:3. A cada seis, um destaque duplo abre a fila, como a estreia na
 * fachada do cinema.
 *
 * Nada de `wedge` em quadro com texto: o trapézio corta as diagonais em cima e
 * em baixo, e foi exatamente onde a última linha do comentário desapareceu. Os
 * formatos que só mordem um canto (`cutBR`/`cutBL`) dão a mesma quebra de
 * grade sem comer conteúdo.
 */
function reel(i: number): { span: PanelSpan; shape: PanelShape } {
  // O destaque é largo, não duplo. Ocupar duas linhas fazia-o herdar a altura de
  // dois cartazes empilhados (~1200px) e engolir o ecrã inteiro; largo e de uma
  // linha só, fica ao lado dos vizinhos como a marquise fica ao lado da fila.
  if (i % 6 === 0) return { span: { base: 4, sm: 8, lg: 6 }, shape: "cutBR" }
  if (i % 6 === 3) return { span: SPAN.quarter, shape: "cutBL" }
  return { span: SPAN.quarter, shape: "rect" }
}

/**
 * Capítulo 04 · Cine — a sessão da madrugada.
 *
 * Segundo capítulo migrado. O feixe de projetor continua a vir do gradiente da
 * paleta `k-zone--cine`, não de um elemento extra.
 */
export function ZoneCine({ movies }: { movies: Movie[] }) {
  const { id, ...meta } = ZONES.cine

  return (
    <Chapter id={id} palette={id} scene="zoom" {...meta}>
      <RevealGroup as="ul" className="cp-grid cp-grid--rows cp-grid--dense">
        {movies.map((m, i) => {
          const { span, shape } = reel(i)
          const feature = (span.lg ?? 3) > 3

          return (
            <RevealItem
              key={m.id}
              as="li"
              variants={PANEL_IN}
              className="cp-col"
              style={spanVars(span)}
            >
              <Panel as="article" shape={shape} cut={feature ? 40 : 24} accent="orange" lit className="group h-full">
                {/* O cartaz pequeno guarda o 2:3 — é a forma que faz o olho ler
                    "pôster". O destaque é largo e por isso vai a 16:9, como o
                    painel iluminado da fachada. */}
                <PanelBody bleed className="flex min-h-0 flex-1 overflow-hidden">
                  <MediaFrame
                    src={m.poster_image}
                    fallback={m.title}
                    themed
                    sizes={feature ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, 25vw"}
                    className={feature ? "aspect-[16/9] w-full" : "aspect-[2/3] w-full"}
                  />
                </PanelBody>

                <PanelFooter>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="k-kicker text-[9px] text-[var(--k-orange)]">
                      {STATUS_LABEL[m.status] ?? m.status}
                    </span>
                    {m.year > 0 && <span className="k-num text-sm opacity-60">{m.year}</span>}
                  </div>

                  <h3 className={`k-title mt-2 leading-tight ${feature ? "text-3xl" : "text-xl"}`}>
                    {m.title}
                  </h3>
                  {m.director && <p className="k-sub mt-1 text-[10px] opacity-65">{m.director}</p>}
                  <Stars value={m.rating} className="mt-2 block text-[var(--k-yellow)]" />
                  {m.note && (
                    <p className="k-body mt-3 text-xs leading-relaxed opacity-75">{m.note}</p>
                  )}
                </PanelFooter>
              </Panel>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Onoma
        accent="pink"
        className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block"
      >
        ACTION!
      </Onoma>
    </Chapter>
  )
}
