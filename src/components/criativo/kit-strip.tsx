import Link from "next/link"
import {
  Bubble,
  Burst,
  Caption,
  Halftone,
  Onoma,
  PulseRings,
  SpeedLines,
  Stars,
} from "@/components/comic/atoms"
import { PunkName } from "@/components/comic/punk-name"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"

/**
 * Vitrine do sistema — as peças da linguagem visual mostradas em uso.
 *
 * Fica logo depois da capa de propósito: antes de o visitante atravessar as
 * oito dimensões, esta faixa mostra que elas partilham um vocabulário. Cada
 * item é o componente de verdade, não uma imagem dele — se um primitivo
 * quebrar, quebra aqui à vista.
 *
 * A faixa herda `k-zone--multiverso` do bloco que a envolve, então as amostras
 * aparecem na paleta da capa.
 */
export function KitStrip() {
  return (
    <section
      aria-labelledby="kit-title"
      className="k-zone k-zone--oficina k-grain relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
    >
      <SpeedLines x={12} y={20} color="rgba(255,255,255,0.07)" />
      <Halftone color="rgba(0,212,255,0.18)" step={8} />

      <div className="mx-auto max-w-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Caption>O kit</Caption>
            <h2 id="kit-title" className="k-title k-3d mt-4 text-3xl sm:text-4xl">
              Peças do sistema
            </h2>
          </div>

          <Link
            href="/design-system"
            className="k-sub group inline-flex items-center gap-2 text-sm text-[var(--k-lime)]"
          >
            Ver o design system
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <RevealGroup as="ul" className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Letras 3D", el: <span className="k-title k-3d text-3xl">ABC</span> },
            { label: "Glitch", el: <span className="k-title k-glitch text-3xl" data-text="ERR">ERR</span> },
            { label: "Onomatopeia", el: <Onoma accent="yellow" className="text-3xl">POW!</Onoma> },
            { label: "Explosão", el: <Burst accent="magenta" className="size-16 text-[10px]"><span className="k-title">NOVO</span></Burst> },
            { label: "Balão", el: <Bubble className="text-[11px]">Oi!</Bubble> },
            { label: "Anomalia 138", el: <PunkName className="text-lg">PUNK</PunkName> },
            { label: "Legenda", el: <Caption>Terra-616</Caption> },
            { label: "Retícula", el: <span className="k-halftone block size-16 rounded" style={{ "--k-dot": "var(--k-cyan)", "--k-dot-step": "6px" } as React.CSSProperties} /> },
            { label: "Estrelas", el: <Stars value={4} className="text-[var(--k-yellow)]" /> },
            { label: "Impacto", el: <span className="relative block size-16"><PulseRings className="inset-0" /></span> },
            { label: "Linhas", el: <span className="k-speedlines block size-16 rounded" style={{ "--k-speed-color": "rgba(255,255,255,0.5)" } as React.CSSProperties} /> },
            { label: "Recorte", el: <span className="k-cut-tr block size-16 border-[3px] border-[var(--k-ink)] bg-[var(--k-lime)]" /> },
          ].map((item) => (
            <RevealItem key={item.label} as="li" variants={PANEL_IN}>
              <div className="k-panel flex h-full flex-col items-center justify-between gap-4 p-4 text-center">
                <span className="flex min-h-[4.5rem] items-center justify-center">{item.el}</span>
                <span className="k-kicker text-[9px] opacity-60">{item.label}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
