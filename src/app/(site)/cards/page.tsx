import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { HoloCard } from "@/components/spiderverse/holo-card"
import { PokeHoloGallery } from "@/components/spiderverse/poke-holo-gallery"
import { ThundercatsGallery } from "@/components/spiderverse/thundercats-gallery"
import { Stacked3dGallery } from "@/components/spiderverse/stacked-3d-gallery"
import { Stacked3dHoloGallery } from "@/components/spiderverse/stacked-3d-holo"
import { HoloTutorial } from "@/components/spiderverse/holo-tutorial"
import { HoloRarityCatalog } from "@/components/spiderverse/holo-rarity-catalog"

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

      {/* ---------- 4. STACKED 3D ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="Stacked 3D">
        <ComicHeader
          as="h2"
          kicker="Camadas em profundidade"
          title="Stacked"
          highlight="3D"
          subtitle="Cartas e moedas montadas em planos separados — cada camada flutua num translateZ diferente, então o emblema salta mais que a moldura quando você inclina a peça com o mouse."
        />
        <Stacked3dGallery />
      </section>

      {/* ---------- 5. STACKED 3D + HOLO ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="Stacked 3D holográfico">
        <ComicHeader
          as="h2"
          kicker="Os dois sistemas juntos"
          title="Stacked 3D"
          highlight="holográfico"
          subtitle="As cartas reais — Pokémon e ThunderCats — com o foil holográfico correndo na face enquanto anel, placa e emblema descolam em profundidades diferentes. Um ponteiro só alimenta os dois efeitos."
        />
        <Stacked3dHoloGallery />
      </section>

      {/* ---------- 6. TUTORIAL ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="Tutorial: como fazer os efeitos holo">
        <ComicHeader
          as="h2"
          kicker="Passo a passo"
          title="Como se faz"
          highlight="um holo"
          subtitle="O tutorial completo em português: da posição do ponteiro até o foil metálico e as camadas em 3D. Cada trecho de código é o mesmo que roda na demo ao lado — passe o mouse nelas."
        />
        <HoloTutorial />
      </section>

      {/* ---------- 7. CATÁLOGO DE RARIDADES ---------- */}
      <section className="mt-16 sm:mt-24" aria-label="Catálogo de raridades">
        <ComicHeader
          as="h2"
          kicker="Uma a uma"
          title="Catálogo de"
          highlight="raridades"
          subtitle="Cada efeito do sistema com a explicação de como ele é feito e o arquivo CSS onde a regra mora — as descrições saíram do código, não da documentação."
        />
        <HoloRarityCatalog />
      </section>
    </SvCanvas>
  )
}
