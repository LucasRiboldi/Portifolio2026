import type { Artwork } from "@/lib/repos/criativo"
import { Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody, PanelFooter } from "@/components/layout/comic/panel"
import { beat, spanVars } from "@/design-system/comic-layout"
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
 * Capítulo 01 · Ateliê — a prancheta.
 *
 * Primeiro capítulo na arquitetura `Chapter › grelha › Panel`. A grade uniforme
 * anterior lia-se como catálogo de loja; aqui cada peça recebe largura e formato
 * do `beat()`, que devolve a uma lista vinda do banco o desalinho de uma página
 * montada à mão — sem que a zona precise de decidir diagramação peça a peça.
 *
 * O `<li>` é que é o quadro da grelha (leva `cp-col` e os spans): pôr o `Panel`
 * a ocupar as colunas obrigaria a um wrapper `display: contents`, e um elemento
 * assim não recebe `transform` — a animação de entrada morreria.
 */
export function ZoneAtelie({ artworks }: { artworks: Artwork[] }) {
  const { id, ...meta } = ZONES.atelie

  return (
    <Chapter id={id} palette={id} {...meta}>
      <RevealGroup as="ul" className="cp-grid cp-grid--rows cp-grid--dense">
        {artworks.map((a, i) => {
          const { span, shape } = beat(i)
          // A moldura estica para o que sobra do quadro em vez de impor uma
          // proporção. Com proporção fixa, o quadro alto ganhava um vazio por
          // baixo e a linha ficava com fundos irregulares; assim a imagem é que
          // absorve a diferença de altura entre vizinhos.
          const minH = span.rows ? "min-h-[22rem]" : (span.lg ?? 4) >= 8 ? "min-h-[18rem]" : "min-h-[12rem]"

          return (
            <RevealItem
              key={a.id}
              as="li"
              variants={PANEL_IN}
              className="cp-col"
              style={spanVars(span)}
            >
              <Panel as="article" shape={shape} accent="lime" lit className="group h-full">
                <PanelBody bleed className="flex min-h-0 flex-1 overflow-hidden">
                  <MediaFrame
                    src={a.image}
                    fallback={a.title}
                    themed
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className={`h-full w-full ${minH}`}
                  />
                </PanelBody>

                <PanelFooter className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="k-kicker text-[10px] text-[var(--k-lime)]">
                      {KIND_LABEL[a.kind] ?? a.kind}
                    </span>
                    <span className="k-num text-sm opacity-60">{a.year}</span>
                  </div>

                  <h3 className="k-title text-2xl">{a.title}</h3>
                  <p className="k-body text-sm leading-relaxed opacity-75">{a.description}</p>

                  {a.tools.length > 0 && (
                    <ul className="flex flex-wrap gap-2" aria-label="Ferramentas">
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
                </PanelFooter>
              </Panel>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Onoma
        accent="magenta"
        className="pointer-events-none absolute right-6 top-24 hidden text-5xl xl:block"
      >
        SPLASH!
      </Onoma>
    </Chapter>
  )
}
