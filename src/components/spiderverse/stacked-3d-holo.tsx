"use client"

import { HoloTcgStylesheets } from "./holo-tcg-card"
import { useStackedTilt } from "./use-stacked-tilt"

/**
 * Stacked 3D + holo — as cartas REAIS (Pokémon hi-res e proxies ThunderCats)
 * com o foil do sistema poke-holo vendorizado montadas dentro do empilhamento
 * 3D do hover-tilt/stacked-3d.
 *
 * A mescla dos dois sistemas exige três cuidados, todos resolvidos em
 * stacked-3d.css (ver bloco "Stacked 3D + holo"):
 *   1. `.card__translater` traz `--translate-z: 150px`; dentro de um
 *      preserve-3d isso jogaria a face 150px à frente e comeria as camadas.
 *      O CSS zera esse transform — quem inclina agora é o `.st3d`.
 *   2. `.card__rotator` faria a sua própria rotação; também é zerada, senão
 *      o tilt seria aplicado duas vezes.
 *   3. `mix-blend-mode` achata o preserve-3d do ANCESTRAL direto. O shine e o
 *      glare do poke-holo são netos da camada, então o `.st3d` mantém o 3D —
 *      é por isso que a face inteira vive dentro de UMA camada, e não solta.
 *
 * Um único ponteiro alimenta os dois sistemas: o hook escreve as variáveis do
 * stacked (--rx/--ry/--o) e as do poke-holo (--pointer-*, --background-*),
 * que herdam por cascata até o `.card`.
 */

const P = "/poke-holo"
const T = "/cards-thundercats/web"

interface HoloStackDef {
  img: string
  name: string
  /** Marca curta no emblema flutuante (camada mais alta). */
  mark: string
  label: string
  desc: string
  rarity: string
  foil?: string
  subtypes?: string
  /** Cor do anel e do emblema — o acento de cada raridade. */
  accent: string
}

const CARDS: HoloStackDef[] = [
  {
    img: `${P}/138_hires.avif`,
    name: "Lugia V",
    mark: "V",
    label: "V · sunpillar",
    desc: "Faixas diagonais sob o anel flutuante",
    rarity: "rare holo v",
    foil: `${P}/138_foil_holo_sunpillar_2x.webp`,
    accent: "#4fd6ff",
  },
  {
    img: `${P}/250_hires.avif`,
    name: "Mew V",
    mark: "FA",
    label: "Full art · gravado",
    desc: "Textura gravada com placa em 1,6×",
    rarity: "rare ultra",
    foil: `${P}/250_foil_etched_sunpillar_2x.webp`,
    accent: "#ff5fd2",
  },
  {
    img: `${P}/160_hires.avif`,
    name: "Pikachu",
    mark: "★",
    label: "Secreta · ouro",
    desc: "Foil gravado além do set",
    rarity: "rare secret",
    foil: `${P}/160_foil_etched_swsecret_2x.webp`,
    accent: "#ffcc45",
  },
  {
    img: `${T}/custom-4-de-jun-de-2026-02-44-10.webp`,
    name: "Lion-O",
    mark: "LO",
    label: "Secreta · Thundera",
    desc: "Ouro gravado sob o emblema em 2,4×",
    rarity: "rare secret",
    accent: "#ffb327",
  },
  {
    img: `${T}/primalkin---majest.webp`,
    name: "Tygra",
    mark: "TY",
    label: "Rainbow · pastel",
    desc: "Iridescência com glitter e anel neon",
    rarity: "rare rainbow",
    accent: "#9d7bff",
  },
  {
    img: `${T}/custom-4-de-jun-de-2026-00-24-31.webp`,
    name: "Mumm-Ra",
    mark: "MR",
    label: "Shiny VMAX · prata",
    desc: "Prata em tela cheia, foil illusion",
    rarity: "rare shiny vmax",
    subtypes: "vmax",
    foil: `${P}/img/illusion.png`,
    accent: "#cfd8e6",
  },
]

function Stacked3dHoloCard({ def }: { def: HoloStackDef }) {
  const { ref, handlers } = useStackedTilt({ maxTilt: 18, holo: true })

  return (
    <figure className="m-0">
      <div
        ref={ref}
        role="img"
        aria-label={`Carta ${def.name} — ${def.label}, em camadas 3D`}
        {...handlers}
        className="st3d st3d-holo mx-auto w-[min(300px,80vw)]"
        style={{ "--accent": def.accent } as React.CSSProperties}
      >
        {/* z=0 — a face real com o foil holográfico do sistema vendorizado.
            Tudo o que usa mix-blend-mode fica contido nesta camada. */}
        <div className="st3d__layer st3d-holo__face">
          <div
            className="card interactive"
            data-rarity={def.rarity}
            data-supertype="pokémon"
            data-subtypes={def.subtypes ?? "basic"}
            style={
              {
                // o tilt é do .st3d; a rotação interna do poke-holo fica zerada
                "--rotate-x": "0deg",
                "--rotate-y": "0deg",
                "--card-scale": "1",
                "--translate-x": "0px",
                "--translate-y": "0px",
                ...(def.foil ? { "--foil": `url(${def.foil})` } : {}),
              } as React.CSSProperties
            }
          >
            <div className="card__translater">
              <div className="card__rotator">
                {/* alt="" — a face é decorativa; o contêiner já tem o rótulo */}
                <div className="card__front">
                  <img src={def.img} alt="" loading="lazy" width={734} height={1024} />
                  <div className="card__shine" />
                  <div className="card__glare" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* z=1 — anel de acento, o primeiro plano a descolar da face */}
        <div
          className="st3d__layer st3d__layer--float st3d-holo__ring"
          style={{ "--z": 1 } as React.CSSProperties}
        />

        {/* z=1.6 — placa com o nome, entre o anel e o emblema */}
        <div
          className="st3d__layer st3d__layer--float st3d-holo__deco"
          style={{ "--z": 1.6 } as React.CSSProperties}
        >
          <span className="st3d-holo__plate">{def.name}</span>
        </div>

        {/* z=2.4 — emblema, a camada mais alta: é a que mais anda no parallax */}
        <div
          className="st3d__layer st3d__layer--float st3d-holo__deco"
          style={{ "--z": 2.4 } as React.CSSProperties}
        >
          <span className="st3d-holo__badge">{def.mark}</span>
        </div>

        <span aria-hidden className="st3d__glare" />
      </div>

      {/* a placa transborda ~47px abaixo da borda da carta (medido no tilt
          máximo); mt-16 deixa ~17px de folga até a legenda.
          O nome não se repete aqui — quem o exibe é a placa flutuante. */}
      <figcaption className="mt-16 text-center">
        <span className="sv-display block text-sm uppercase text-white">{def.label}</span>
        <span className="sv-heavy text-[10px] uppercase tracking-wide text-white/55">
          {def.desc}
        </span>
      </figcaption>
    </figure>
  )
}

export function Stacked3dHoloGallery() {
  return (
    <>
      <HoloTcgStylesheets />
      {/* gap-x folgado: o anel e o emblema saem para fora da carta */}
      <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Stacked3dHoloCard key={c.img} def={c} />
        ))}
      </div>
    </>
  )
}
