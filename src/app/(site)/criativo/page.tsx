import Link from "next/link"
import { BentoGrid } from "@/components/home/bento-grid"
import { ComicCover } from "@/components/home/comic-cover"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { Onoma } from "@/components/spiderverse/decor"
import { ArcaneProphet } from "@/components/realms/arcane-prophet"
import { HoloCard } from "@/components/spiderverse/holo-card"
import { PokeHoloGallery } from "@/components/spiderverse/poke-holo-gallery"
import { getProjects } from "@/lib/repos/projects"
import { getTools } from "@/lib/repos/tools"

/**
 * Cabeçalho de seção — dá o mesmo ritmo a todos os blocos da landing.
 * O kicker é o selo de legenda de HQ; o título é sempre h2 (o h1 é o
 * masthead da capa).
 */
function SectionHeading({
  id,
  kicker,
  title,
  highlight,
  subtitle,
}: {
  id: string
  kicker: string
  title: string
  highlight?: string
  subtitle?: string
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <span className="sv-caption inline-block text-xs sm:text-sm">{kicker}</span>
      <h2 id={id} className="sv-display fx-shadow-long mt-3 text-3xl uppercase leading-none sm:text-5xl">
        {title} {highlight && <span className="sv-rainbow sv-underline">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="sv-heavy mt-3 max-w-2xl text-xs uppercase leading-snug tracking-wide text-white/70 sm:text-sm">
          {subtitle}
        </p>
      )}
    </header>
  )
}

export default async function CriativoHome() {
  const [projects, tools] = await Promise.all([getProjects(), getTools()])

  return (
    <>
      {/* Realm ARCANE (Game Design) — jornal antigo, só aparece em data-realm="arcane" */}
      <ArcaneProphet className="realm-only-arcane" />

      {/* Realms Creative + Developer (some no Arcane) */}
      <div className="realm-hide-arcane">
        <SvCanvas dimension="multiverse" className="art-grain py-8 sm:py-10">
          {/* onomatopeia da capa (só onde há espaço lateral livre) */}
          <Onoma
            color="magenta"
            className="pointer-events-none absolute -top-2 right-4 z-[2] hidden rotate-12 xl:block"
          >
            THWIP!
          </Onoma>

          {/* carimbo narrativo (com propósito: assina a "edição") */}
          <span
            aria-hidden
            className="art-stamp sv-tilt-2 pointer-events-none absolute right-6 top-24 z-[2] hidden text-xs xl:inline-flex"
            style={{ color: "var(--sv-lime)" }}
          >
            Terra-2026
          </span>

          {/* ---------- 1. CAPA (hero) ---------- */}
          <ComicCover projects={projects} tools={tools} />

          {/* ---------- 2. NESTA EDIÇÃO ---------- */}
          <section className="mt-16 sm:mt-24" aria-labelledby="sec-edicao">
            <SectionHeading
              id="sec-edicao"
              kicker="Nesta edição…"
              title="O miolo da"
              highlight="revista"
              subtitle="Cada bloco foi impresso numa dimensão diferente do multiverso — mangá, noir, neon, graffiti, 2099."
            />
            <BentoGrid projects={projects} tools={tools} />
          </section>

          {/* ---------- 3. CARTA COLECIONÁVEL ---------- */}
          <section className="mt-16 sm:mt-24" aria-labelledby="sec-carta">
            <SectionHeading
              id="sec-carta"
              kicker="Item raro"
              title="Carta"
              highlight="holográfica"
              subtitle="Mova o mouse sobre a carta — foil, brilho e tilt reagem ao ponteiro, como uma carta rara de verdade."
            />
            <div className="mx-auto w-[min(320px,85vw)]">
              <HoloCard />
            </div>
          </section>

          {/* ---------- 3b. A COLEÇÃO ---------- */}
          <section className="mt-16 sm:mt-24" aria-labelledby="sec-colecao">
            <SectionHeading
              id="sec-colecao"
              kicker="Booster aberto"
              title="A coleção"
              highlight="completa"
              subtitle="Uma carta LR em cada raridade do TCG — holo, cosmos, rainbow, secreta, shiny e mais. Passe o mouse em cada uma."
            />
            <PokeHoloGallery />
          </section>

          {/* ---------- 4. CHAMADA DO MULTIVERSO ----------
              Sem grade de dimensões aqui: os próprios cards do miolo já são
              as dimensões. Esta faixa só aponta para o índice completo. */}
          <section className="art-tape relative mt-16 sm:mt-24" aria-labelledby="sec-multiverso">
            <Onoma
              color="cyan"
              className="pointer-events-none absolute -top-8 right-0 z-[2] hidden -rotate-6 lg:block"
            >
              BAM!
            </Onoma>

            {/* portal giratório — o convite visual para atravessar as dimensões */}
            <span
              aria-hidden
              className="fx-portal pointer-events-none absolute -top-10 right-10 z-[2] hidden size-20 xl:block"
            />

            <div className="art-tex-foil relative overflow-hidden rounded-lg border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000] sm:p-10">
              {/* a retícula por cima do foil segura o texto legível */}
              <span
                aria-hidden
                className="art-tex-benday absolute inset-0 opacity-40"
                style={{ "--tex-a": "rgba(10,6,18,0.5)", "--tex-b": "rgba(10,6,18,0.3)" } as React.CSSProperties}
              />
              <div className="relative z-[1] max-w-2xl">
                <span className="sv-caption inline-block text-xs sm:text-sm">O multiverso</span>
                <h2 id="sec-multiverso" className="sv-display mt-3 text-3xl uppercase leading-none text-black sm:text-5xl">
                  Cada requadro acima é uma dimensão
                </h2>
                <p className="sv-heavy mt-3 text-xs uppercase leading-snug tracking-wide text-black/80 sm:text-sm">
                  Mumbattan, Noir, Mangá, Graffiti, 2099 — e outras 15 esperando.
                  Cada portal é um estilo de desenho vivo.
                </p>
                <Link
                  href="/dimensoes"
                  className="sv-display mt-6 inline-block border-[3px] border-black bg-[var(--sv-ink)] px-6 py-3 text-base uppercase text-[var(--sv-paper)] shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[-1deg] sm:text-lg"
                >
                  → Atravessar as 20 dimensões
                </Link>
              </div>
            </div>
          </section>
        </SvCanvas>
      </div>
    </>
  )
}
