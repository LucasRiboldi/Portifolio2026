import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { CardsSections } from "@/components/cards/cards-sections"

export const metadata = { title: "Cards" }

/**
 * Coleção de cards.
 *
 * As oito seções (galerias, stacked 3D, tutorial, catálogo e booster completo)
 * viraram abas em `CardsSections`, com carregamento adiado. Empilhadas, somam
 * mais de 80 cartas hi-res, o motor de foil e o tutorial inteiro — o visitante
 * pagava por tudo isso para ver uma seção.
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
