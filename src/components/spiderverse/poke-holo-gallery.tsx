"use client"

import { HoloTcgCard, HoloTcgStylesheets, type TcgCardDef } from "./holo-tcg-card"

/**
 * Galeria de raridades — as cartas hi-res de /public/poke-holo, cada uma
 * com a raridade correta e, onde existe, o foil oficial (webp). O motor de
 * interação/CSS vive em holo-tcg-card.tsx.
 */

const P = "/poke-holo"

/** Ordem de booster: das comuns às secretas. */
const CARDS: TcgCardDef[] = [
  { img: `${P}/33_hires.png`, name: "Squirtle", rarity: "common",
    label: "Comum", desc: "Sem foil — a linha de base" },
  { img: `${P}/116_hires.png`, name: "Morpeko", rarity: "common",
    label: "Incomum", desc: "Arte texturizada, ainda sem foil" },
  { img: `${P}/49_hires.png`, name: "Pikachu", rarity: "reverse holo",
    label: "Reverse holo", desc: "Foil no fundo, arte fosca" },
  { img: `${P}/29_hires.png`, name: "Zapdos", rarity: "rare holo",
    label: "Holo clássica", desc: "Barras verticais + arco-íris" },
  { img: `${P}/SWSH012_hires.png`, name: "Morpeko", rarity: "rare holo cosmos",
    label: "Cosmos", desc: "Galáxia em três camadas",
    vars: { "--cosmosbg": "286px 232px" } },
  { img: `${P}/21_hires.png`, name: "Kyogre", rarity: "amazing rare",
    label: "Amazing rare", desc: "Explosão além da moldura" },
  { img: `${P}/82_hires.png`, name: "Zacian", rarity: "amazing rare",
    label: "Amazing rare", desc: "Foil que vaza da arte" },
  { img: `${P}/59_hires.png`, name: "Radiant Alakazam", rarity: "radiant rare",
    label: "Radiant", desc: "Cross-hatch metálico" },
  { img: `${P}/138_hires.png`, name: "Lugia V", rarity: "rare holo v",
    label: "V", desc: "Faixas geométricas diagonais",
    foil: `${P}/138_foil_holo_sunpillar_2x.webp` },
  { img: `${P}/250_hires.png`, name: "Mew V", rarity: "rare ultra",
    label: "Full art V", desc: "Textura gravada + brilho",
    foil: `${P}/250_foil_etched_sunpillar_2x.webp` },
  { img: `${P}/SWSH181_hires.png`, name: "Vaporeon V", rarity: "rare ultra",
    label: "Alt art V", desc: "Gravação sunpillar na ilustração",
    foil: `${P}/181_foil_etched_sunpillar_2x.webp` },
  { img: `${P}/271_hires.png`, name: "Gengar VMAX", rarity: "rare holo vmax",
    label: "VMAX alt", desc: "Gravação secreta em tela cheia", subtypes: "vmax",
    foil: `${P}/271_foil_etched_swsecret_2x.webp` },
  { img: `${P}/160_hires.png`, name: "Pikachu", rarity: "rare secret",
    label: "Secreta", desc: "Foil gravado além do set",
    foil: `${P}/160_foil_etched_swsecret_2x.webp` },
  { img: `${P}/TG05_hires.png`, name: "Pikachu & Akari", rarity: "trainer gallery rare holo",
    label: "Trainer gallery", desc: "Aquarela holográfica", trainerGallery: true,
    foil: `${P}/tg05_foil_holo_rainbow_2x.webp` },
  { img: `${P}/TG17_hires.png`, name: "Pikachu VMAX", rarity: "rare holo vmax",
    label: "TG VMAX", desc: "Gravação sunpillar em tela cheia",
    subtypes: "vmax", trainerGallery: true,
    foil: `${P}/tg17_foil_etched_sunpillar_2x.webp` },
]

export function PokeHoloGallery() {
  return (
    <>
      <HoloTcgStylesheets />
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CARDS.map((c) => (
          <HoloTcgCard key={c.img} def={c} />
        ))}
      </div>
    </>
  )
}
