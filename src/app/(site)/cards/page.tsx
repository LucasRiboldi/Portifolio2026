import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { HoloCard } from "@/components/spiderverse/holo-card"
import { PokeHoloGallery } from "@/components/spiderverse/poke-holo-gallery"
import { ThundercatsGallery } from "@/components/spiderverse/thundercats-gallery"

export const metadata = { title: "Cards" }

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
        subtitle="Cartas LR estilo TCG — foil, brilho e tilt reagem ao ponteiro, como cartas raras de verdade."
      />

      {/* ---------- 1. CARTA COLECIONÁVEL ---------- */}
      <section aria-label="Carta holográfica">
        <ComicHeader
          as="h2"
          kicker="Item raro"
          title="Carta"
          highlight="holográfica"
          subtitle="Mova o mouse sobre a carta — foil, brilho e tilt reagem ao ponteiro, como uma carta rara de verdade."
        />
        <div className="mx-auto w-[min(320px,85vw)]">
          <HoloCard />
        </div>
      </section>

      {/* ---------- 2. A COLEÇÃO COMPLETA ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="A coleção completa">
        <ComicHeader
          as="h2"
          kicker="Booster aberto"
          title="A coleção"
          highlight="completa"
          subtitle="Cartas reais do TCG, uma em cada raridade — holo, cosmos, amazing, full art, VMAX, secreta. Passe o mouse em cada uma."
        />
        <PokeHoloGallery />
      </section>

      {/* ---------- 3. DECK THUNDERCATS ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="Deck ThunderCats">
        <ComicHeader
          as="h2"
          kicker="Thunder, thunder…"
          title="Deck"
          highlight="ThunderCats"
          subtitle="O deck de Commander com proxies temáticos de ThunderCats — cada carta com um efeito holográfico do sistema."
        />
        <ThundercatsGallery />
      </section>
    </SvCanvas>
  )
}
