import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { CardsSections } from "@/components/cards/cards-sections"

export const metadata = { title: "Cards" }

/**
 * Coleção de cards.
 *
 * As três galerias viraram abas (`CardsSections`) e entram por carregamento
 * adiado: juntas somam ~30 imagens hi-res mais as folhas do motor de foil, e
 * carregá-las de uma vez fazia o visitante pagar por três seções para ver uma.
 */
export default function CardsPage() {
  return (
    <SvCanvas dimension="multiverse">
      <Onoma color="magenta" className="pointer-events-none absolute right-2 top-0 z-[2] hidden -rotate-6 md:block">
        FOIL!
      </Onoma>

      <ComicHeader
        kicker="Coleção LR"
        title="Cards"
        highlight="colecionáveis"
        subtitle="Cartas estilo TCG — foil, brilho e tilt reagem ao ponteiro, como cartas raras de verdade. Escolha uma seção."
      />

      <CardsSections />
    </SvCanvas>
  )
}
