"use client"

import { HoloTcgCard, HoloTcgStylesheets, type TcgCardDef } from "./holo-tcg-card"
import { PokeHand } from "./poke-hand"

/**
 * Galeria ThunderCats — o deck de Commander com proxies temáticos
 * (originais pesados em /public/cards-thundercats, fora do git; as webs
 * otimizadas em /web são geradas por scripts/convert-thundercats.mjs).
 * Cada carta recebe um efeito do sistema poke-holo via preset.
 */

/**
 * Só efeitos que cobrem a carta INTEIRA: os demais do sistema (holo,
 * cosmos, reverse, amazing, radiant, shiny, trainer gallery) usam
 * clip-paths calibrados para a janela de arte do frame Pokémon e ficam
 * deslocados sobre cartas de Magic.
 */
type FxKey =
  | "v" | "ultra" | "vmax" | "vstar" | "rainbow" | "rainbowAlt"
  | "secret" | "shinyV" | "shinyVmax"

const FX: Record<FxKey, Omit<TcgCardDef, "img" | "name">> = {
  v:       { rarity: "rare holo v", label: "V", desc: "Faixas geométricas diagonais" },
  ultra:   { rarity: "rare ultra", label: "Full art", desc: "Textura gravada + brilho" },
  vmax:    { rarity: "rare holo vmax", label: "VMAX", desc: "Foil amplo em tela cheia",
             subtypes: "vmax" },
  vstar:   { rarity: "rare holo vstar", label: "VSTAR", desc: "Branco perolado" },
  rainbow: { rarity: "rare rainbow", label: "Rainbow", desc: "Pastel iridescente + glitter" },
  rainbowAlt: { rarity: "rare rainbow alt", label: "Rainbow alt", desc: "Iridescência densa" },
  secret:  { rarity: "rare secret", label: "Secreta", desc: "Ouro gravado" },
  shinyV:  { rarity: "rare shiny v", label: "Shiny V", desc: "Prata + faixas V" },
  shinyVmax: { rarity: "rare shiny vmax", label: "Shiny VMAX", desc: "Prata em tela cheia",
             subtypes: "vmax", foil: "/poke-holo/img/illusion.png" },
}

const DECK: { slug: string; name: string; fx: FxKey }[] = [
  { slug: "custom-4-de-jun-de-2026-02-44-10", name: "Lion-O, Leader of the ThunderCats", fx: "secret" },
  { slug: "custom-23-de-jun-de-2026-22-11-39", name: "Lion-O, Leader of the ThunderCats", fx: "rainbow" },
  { slug: "daxos", name: "Lion-O, Leader of the ThunderCats", fx: "v" },
  { slug: "marasi", name: "Lion-O, Leader of the ThunderCats", fx: "ultra" },
  { slug: "jazal-goldmane", name: "Lion-O, Prince of Thundera", fx: "secret" },
  { slug: "felidar-sovereign", name: "Lion-O, Son of Claudus", fx: "vstar" },
  { slug: "boros-charm", name: "Lion-O's Charm", fx: "v" },
  { slug: "custom-4-de-jun-de-2026-00-28-37", name: "Cheetara, The Wildrunner", fx: "ultra" },
  { slug: "mirri-weatherlight-duelist", name: "Cheetara, The Wildrunner", fx: "v" },
  { slug: "custom-23-de-jun-de-2026-22-07-14-2", name: "Panthro", fx: "v" },
  { slug: "primalkin---majest", name: "Tygra", fx: "rainbow" },
  { slug: "000004", name: "Wily Kit & Wily Kat", fx: "rainbowAlt" },
  { slug: "custom-4-de-jun-de-2026-00-14-55", name: "Wily Kit & Wily Kat", fx: "rainbow" },
  { slug: "custom-4-de-jun-de-2026-00-18-51", name: "'Purrs'", fx: "rainbowAlt" },
  { slug: "cryptolith-rite", name: "'Purrs'", fx: "shinyV" },
  { slug: "cleric-class", name: "Spirit of Jaga", fx: "vstar" },
  { slug: "custom-4-de-jun-de-2026-00-24-31", name: "Mumm-Ra, Summoner of Ancient Spirits", fx: "shinyVmax" },
  { slug: "vanquishers-banner", name: "Mumm-Ra, Summoner of Ancient Spirits", fx: "vmax" },
  { slug: "custom-4-de-jun-de-2026-00-17-14", name: "The Ever-Living", fx: "shinyV" },
  { slug: "beastmaster-ascencion", name: "The Ever-Living", fx: "vmax" },
  { slug: "custom-4-de-jun-de-2026-02-52-07", name: "Decaying Form", fx: "shinyV" },
  { slug: "idol-of-oblivion", name: "Decaying Form", fx: "shinyVmax" },
  { slug: "custom-4-de-jun-de-2026-02-45-58", name: "Jackalman", fx: "v" },
  { slug: "mentor-of-the-meek-3", name: "Jackalman", fx: "shinyV" },
  { slug: "custom-4-de-jun-de-2026-02-48-17", name: "Slithe, Escamoso", fx: "ultra" },
  { slug: "masked-vandal", name: "Slithe, Escamoso", fx: "shinyV" },
  { slug: "custom-4-de-jun-de-2026-00-22-57", name: "Thunder Tank", fx: "vmax" },
  { slug: "tandertank", name: "Thunder Tank", fx: "vmax" },
  { slug: "cradle-of-vitality", name: "Thunder Tank", fx: "vstar" },
  { slug: "akroma-will", name: "O Olho de Tandera", fx: "secret" },
  { slug: "arcane-signet", name: "A Pedra da Guerra", fx: "secret" },
  { slug: "custom-4-de-jun-de-2026-00-21-02", name: "The Vision Beyond Reach", fx: "vstar" },
  { slug: "eldrazi-monument", name: "The Vision Beyond Reach", fx: "secret" },
  { slug: "custom-22-de-jun-de-2026-00-30-17", name: "Lifecrafter's Bestiary", fx: "rainbowAlt" },
  { slug: "custom-22-de-jun-de-2026-00-32-16", name: "Hour of Reckoning", fx: "rainbow" },
  { slug: "cathars-crusade", name: "Thundera's Crusade", fx: "rainbow" },
  { slug: "felidar-retreat", name: "Arrival in the Third World", fx: "rainbowAlt" },
  { slug: "make-a-stand", name: "ThunderCats, Hooo!", fx: "rainbow" },
  { slug: "custom-23-de-jun-de-2026-22-09-01", name: "Crib Swap", fx: "vstar" },
  { slug: "crib-swap", name: "Crib Swap", fx: "rainbowAlt" },
  { slug: "boros-garrison", name: "Cats Lair", fx: "v" },
  { slug: "rugged-highlands---majest", name: "Cats Lair", fx: "v" },
  { slug: "command-tower", name: "Command Tower of Thundera", fx: "ultra" },
  { slug: "exotic-orchard", name: "King Claudus's Throne Room", fx: "ultra" },
  { slug: "jungle-shrine", name: "Hook Mountain", fx: "vmax" },
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
      {/* no celular vira leque rolável: 45 cartas em coluna dariam uma
          página sem fim */}
      <PokeHand className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CARDS.map((c, i) => (
          <HoloTcgCard key={`${c.img}-${i}`} def={c} />
        ))}
      </PokeHand>
    </>
  )
}
