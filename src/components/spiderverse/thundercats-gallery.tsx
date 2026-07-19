"use client"

import { HoloTcgCard, HoloTcgStylesheets, type TcgCardDef } from "./holo-tcg-card"

/**
 * Galeria ThunderCats — o deck de Commander com proxies temáticos
 * (originais pesados em /public/cards-thundercats, fora do git; as webs
 * otimizadas em /web são geradas por scripts/convert-thundercats.mjs).
 * Cada carta recebe um efeito do sistema poke-holo via preset.
 */

type FxKey =
  | "holo" | "cosmos" | "reverse" | "amazing" | "radiant" | "v" | "ultra"
  | "vmax" | "vstar" | "rainbow" | "rainbowAlt" | "secret"
  | "shiny" | "shinyV" | "shinyVmax" | "tg"

const FX: Record<FxKey, Omit<TcgCardDef, "img" | "name">> = {
  holo:    { rarity: "rare holo", label: "Holo", desc: "Barras verticais + arco-íris" },
  cosmos:  { rarity: "rare holo cosmos", label: "Cosmos", desc: "Galáxia em três camadas",
             vars: { "--cosmosbg": "286px 232px" } },
  reverse: { rarity: "reverse holo", label: "Reverse holo", desc: "Foil no fundo" },
  amazing: { rarity: "amazing rare", label: "Amazing", desc: "Explosão além da moldura" },
  radiant: { rarity: "radiant rare", label: "Radiant", desc: "Cross-hatch metálico" },
  v:       { rarity: "rare holo v", label: "V", desc: "Faixas geométricas diagonais" },
  ultra:   { rarity: "rare ultra", label: "Full art", desc: "Textura gravada + brilho" },
  vmax:    { rarity: "rare holo vmax", label: "VMAX", desc: "Foil amplo em tela cheia",
             subtypes: "vmax" },
  vstar:   { rarity: "rare holo vstar", label: "VSTAR", desc: "Branco perolado" },
  rainbow: { rarity: "rare rainbow", label: "Rainbow", desc: "Pastel iridescente + glitter" },
  rainbowAlt: { rarity: "rare rainbow alt", label: "Rainbow alt", desc: "Iridescência densa" },
  secret:  { rarity: "rare secret", label: "Secreta", desc: "Ouro gravado" },
  shiny:   { rarity: "rare shiny", label: "Shiny", desc: "Cintilância prateada" },
  shinyV:  { rarity: "rare shiny v", label: "Shiny V", desc: "Prata + faixas V" },
  shinyVmax: { rarity: "rare shiny vmax", label: "Shiny VMAX", desc: "Prata em tela cheia",
             subtypes: "vmax", foil: "/poke-holo/img/illusion.png" },
  tg:      { rarity: "trainer gallery rare holo", label: "Trainer gallery",
             desc: "Aquarela holográfica", trainerGallery: true },
}

const DECK: { slug: string; name: string; fx: FxKey }[] = [
  { slug: "custom-4-de-jun-de-2026-02-44-10", name: "Lion-O, Leader of the ThunderCats", fx: "secret" },
  { slug: "custom-23-de-jun-de-2026-22-11-39", name: "Lion-O, Leader of the ThunderCats", fx: "rainbow" },
  { slug: "daxos", name: "Lion-O, Leader of the ThunderCats", fx: "v" },
  { slug: "marasi", name: "Lion-O, Leader of the ThunderCats", fx: "ultra" },
  { slug: "jazal-goldmane", name: "Lion-O, Prince of Thundera", fx: "secret" },
  { slug: "felidar-sovereign", name: "Lion-O, Son of Claudus", fx: "amazing" },
  { slug: "boros-charm", name: "Lion-O's Charm", fx: "holo" },
  { slug: "custom-4-de-jun-de-2026-00-28-37", name: "Cheetara, The Wildrunner", fx: "ultra" },
  { slug: "mirri-weatherlight-duelist", name: "Cheetara, The Wildrunner", fx: "v" },
  { slug: "custom-23-de-jun-de-2026-22-07-14-2", name: "Panthro", fx: "v" },
  { slug: "primalkin---majest", name: "Tygra", fx: "rainbow" },
  { slug: "000004", name: "Wily Kit & Wily Kat", fx: "cosmos" },
  { slug: "custom-4-de-jun-de-2026-00-14-55", name: "Wily Kit & Wily Kat", fx: "cosmos" },
  { slug: "custom-4-de-jun-de-2026-00-18-51", name: "'Purrs'", fx: "tg" },
  { slug: "cryptolith-rite", name: "'Purrs'", fx: "cosmos" },
  { slug: "cleric-class", name: "Spirit of Jaga", fx: "vstar" },
  { slug: "custom-4-de-jun-de-2026-00-24-31", name: "Mumm-Ra, Summoner of Ancient Spirits", fx: "shinyVmax" },
  { slug: "vanquishers-banner", name: "Mumm-Ra, Summoner of Ancient Spirits", fx: "vmax" },
  { slug: "custom-4-de-jun-de-2026-00-17-14", name: "The Ever-Living", fx: "shiny" },
  { slug: "beastmaster-ascencion", name: "The Ever-Living", fx: "amazing" },
  { slug: "custom-4-de-jun-de-2026-02-52-07", name: "Decaying Form", fx: "shinyV" },
  { slug: "idol-of-oblivion", name: "Decaying Form", fx: "shiny" },
  { slug: "custom-4-de-jun-de-2026-02-45-58", name: "Jackalman", fx: "holo" },
  { slug: "mentor-of-the-meek-3", name: "Jackalman", fx: "reverse" },
  { slug: "custom-4-de-jun-de-2026-02-48-17", name: "Slithe, Escamoso", fx: "reverse" },
  { slug: "masked-vandal", name: "Slithe, Escamoso", fx: "holo" },
  { slug: "custom-4-de-jun-de-2026-00-22-57", name: "Thunder Tank", fx: "vmax" },
  { slug: "tandertank", name: "Thunder Tank", fx: "vmax" },
  { slug: "cradle-of-vitality", name: "Thunder Tank", fx: "holo" },
  { slug: "akroma-will", name: "O Olho de Tandera", fx: "secret" },
  { slug: "arcane-signet", name: "A Pedra da Guerra", fx: "radiant" },
  { slug: "custom-4-de-jun-de-2026-00-21-02", name: "The Vision Beyond Reach", fx: "vstar" },
  { slug: "eldrazi-monument", name: "The Vision Beyond Reach", fx: "radiant" },
  { slug: "custom-22-de-jun-de-2026-00-30-17", name: "Lifecrafter's Bestiary", fx: "radiant" },
  { slug: "custom-22-de-jun-de-2026-00-32-16", name: "Hour of Reckoning", fx: "amazing" },
  { slug: "cathars-crusade", name: "Thundera's Crusade", fx: "tg" },
  { slug: "felidar-retreat", name: "Arrival in the Third World", fx: "tg" },
  { slug: "make-a-stand", name: "ThunderCats, Hooo!", fx: "rainbow" },
  { slug: "custom-23-de-jun-de-2026-22-09-01", name: "Crib Swap", fx: "reverse" },
  { slug: "crib-swap", name: "Crib Swap", fx: "rainbowAlt" },
  { slug: "boros-garrison", name: "Cats Lair", fx: "reverse" },
  { slug: "rugged-highlands---majest", name: "Cats Lair", fx: "reverse" },
  { slug: "command-tower", name: "Command Tower of Thundera", fx: "reverse" },
  { slug: "exotic-orchard", name: "King Claudus's Throne Room", fx: "reverse" },
  { slug: "jungle-shrine", name: "Hook Mountain", fx: "cosmos" },
]

const CARDS: TcgCardDef[] = DECK.map(({ slug, name, fx }) => ({
  img: `/cards-thundercats/web/${slug}.webp`,
  name,
  ...FX[fx],
}))

export function ThundercatsGallery() {
  return (
    <>
      <HoloTcgStylesheets />
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CARDS.map((c, i) => (
          <HoloTcgCard key={`${c.img}-${i}`} def={c} />
        ))}
      </div>
    </>
  )
}
