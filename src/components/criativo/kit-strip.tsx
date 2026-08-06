import Link from "next/link"

import { Caption, Halftone, SpeedLines } from "@/components/comic/atoms"
import { KitCarousel, type LaminaKit } from "./kit-carousel"
import { IMAGEM_TEMPORARIA } from "@/constants/criativo-landing"

/**
 * A GALERIA — o que era a vitrine de primitivos.
 *
 * Até 06/08/2026 esta faixa mostrava doze amostras do sistema (letras 3D,
 * glitch, onomatopeia, balão…) numa grelha estática. Virou galeria de imagens
 * em carrossel a pedido: o mesmo lugar na página, outro conteúdo.
 *
 * As lâminas apontam todas para a arte do realm enquanto não há capas
 * próprias — a mesma imagem temporária que os requadros usam no lugar do
 * vazio. Trocar por arte de verdade é trocar `src` aqui; a estrutura não
 * muda.
 *
 * O carrossel é cliente (arrasto, teclado, virada); esta faixa continua a ser
 * server component e só lhe entrega os dados.
 */

const LAMINAS: readonly LaminaKit[] = [
  { id: "capa", titulo: "Capa", legenda: "Edição #2026 · a abertura da revista", src: IMAGEM_TEMPORARIA },
  { id: "atelie", titulo: "Ateliê", legenda: "Terra-1610 · ilustração e vetor", src: IMAGEM_TEMPORARIA },
  { id: "oficina", titulo: "Oficina", legenda: "Terra-BYTE · interfaces e código", src: IMAGEM_TEMPORARIA },
  { id: "banca", titulo: "Banca", legenda: "Terra-616 · o que anda na cabeceira", src: IMAGEM_TEMPORARIA },
  { id: "cine", titulo: "Cine", legenda: "Terra-42 · sessão da madrugada", src: IMAGEM_TEMPORARIA },
  { id: "mural", titulo: "Mural", legenda: "Terra-CORTIÇA · recados e bilhetes", src: IMAGEM_TEMPORARIA },
]

export function KitStrip() {
  return (
    <section
      aria-labelledby="kit-title"
      className="k-zone k-zone--oficina k-grain relative overflow-hidden py-16"
    >
      <SpeedLines x={12} y={20} color="rgba(255,255,255,0.07)" />
      <Halftone color="rgba(0,212,255,0.18)" step={8} />

      {/* Mesma mancha dos capítulos: a faixa mostra o vocabulário do sistema, e
          teria pouca autoridade a anunciá-lo desalinhada do resto da revista. */}
      <div className="cp-bleed">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Caption>A galeria</Caption>
            {/* O letreiro de ação (ref. MWzRBo) entra aqui e em mais nenhum
                título: é o gesto mais forte da página, e repetido deixaria de
                marcar esta faixa como a diferente. */}
            {/* O efeito vai no <span>, não no <h2>: `.k-onoma-lettering` é
                `inline-block` (precisa de ser, para o `transform` pegar), e no
                próprio heading isso fazia o título subir para a linha da
                legenda em vez de ficar abaixo dela. */}
            <h2 id="kit-title" className="mt-4 text-4xl sm:text-5xl">
              <span className="k-onoma-lettering">Folheie</span>
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

        <div className="mt-10">
          <KitCarousel laminas={LAMINAS} />
        </div>
      </div>
    </section>
  )
}
