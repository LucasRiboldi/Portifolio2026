/**
 * PROPHET WIRE — registry de fontes de notícias de board games.
 *
 * Lista única e tipada que o Collector (Parte 4) percorre. Adicionar uma fonte
 * é acrescentar uma entrada aqui — nenhum outro módulo muda. `defaultCategory`
 * é só um palpite inicial; a IA (Parte 8) reclassifica.
 *
 * `kind`:
 *   "rss"  → feed RSS/Atom (caminho preferido — barato e estruturado).
 *   "html" → página sem feed; exige raspagem no Parser.
 *   "api"  → endpoint JSON (ex.: BGG XML API2 tratado como api).
 */

import type { Source } from "./types"

export const SOURCES: readonly Source[] = [
  // ── Prioridade alta — portais e editoras ──────────────────────────────
  {
    id: "bgg-news",
    name: "BoardGameGeek News",
    url: "https://boardgamegeek.com/rss/news",
    kind: "rss",
    defaultCategory: "Notícias",
    enabled: true,
  },
  {
    id: "bgg-hotness",
    name: "BoardGameGeek Hotness",
    url: "https://boardgamegeek.com/xmlapi2/hot?type=boardgame",
    kind: "api",
    defaultCategory: "Notícias",
    enabled: true,
  },
  {
    id: "dice-tower",
    name: "The Dice Tower",
    url: "https://www.dicetower.com/rss.xml",
    kind: "rss",
    defaultCategory: "Reviews",
    enabled: true,
  },
  {
    id: "icv2-games",
    name: "ICv2 — Games",
    url: "https://icv2.com/rss/articles/subject/6.xml",
    kind: "rss",
    defaultCategory: "Mercado",
    enabled: true,
  },
  {
    id: "gamefound",
    name: "Gamefound",
    url: "https://gamefound.com/",
    kind: "html",
    defaultCategory: "Gamefound",
    enabled: true,
  },
  {
    id: "kickstarter-tabletop",
    name: "Kickstarter — Tabletop Games",
    url: "https://www.kickstarter.com/discover/categories/games/tabletop%20games",
    kind: "html",
    defaultCategory: "Kickstarter",
    enabled: true,
  },

  // ── Editoras ─────────────────────────────────────────────────────────
  {
    id: "stonemaier",
    name: "Stonemaier Games",
    url: "https://stonemaiergames.com/feed/",
    kind: "rss",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "cmon",
    name: "CMON",
    url: "https://www.cmon.com/news",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "fantasy-flight",
    name: "Fantasy Flight Games",
    url: "https://www.fantasyflightgames.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "leder-games",
    name: "Leder Games",
    url: "https://ledergames.com/blogs/news.atom",
    kind: "rss",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "gmt-games",
    name: "GMT Games",
    url: "https://www.gmtgames.com/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "plaid-hat",
    name: "Plaid Hat Games",
    url: "https://www.plaidhatgames.com/news/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "portal-games",
    name: "Portal Games",
    url: "https://portalgames.pl/en/feed/",
    kind: "rss",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "czech-games",
    name: "Czech Games Edition",
    url: "https://czechgames.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "ravensburger",
    name: "Ravensburger",
    url: "https://www.ravensburger.org/us/discover/news/index.html",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "kosmos",
    name: "Kosmos",
    url: "https://www.kosmos.de/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },
  {
    id: "asmodee",
    name: "Asmodee",
    url: "https://www.asmodee.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    enabled: true,
  },

  // ── Comunidades (Reddit) ─────────────────────────────────────────────
  {
    id: "reddit-boardgames",
    name: "Reddit — r/boardgames",
    url: "https://www.reddit.com/r/boardgames/.rss",
    kind: "rss",
    defaultCategory: "Notícias",
    enabled: true,
  },
  {
    id: "reddit-soloboardgaming",
    name: "Reddit — r/soloboardgaming",
    url: "https://www.reddit.com/r/soloboardgaming/.rss",
    kind: "rss",
    defaultCategory: "Notícias",
    enabled: true,
  },
  {
    id: "reddit-boardgamedeals",
    name: "Reddit — r/boardgamedeals",
    url: "https://www.reddit.com/r/boardgamedeals/.rss",
    kind: "rss",
    defaultCategory: "Promoções",
    enabled: true,
  },

  // ── Eventos ──────────────────────────────────────────────────────────
  {
    id: "gen-con",
    name: "Gen Con",
    url: "https://www.gencon.com/happenings/news",
    kind: "html",
    defaultCategory: "Eventos",
    enabled: true,
  },
  {
    id: "spiel-essen",
    name: "SPIEL Essen",
    url: "https://www.spiel-essen.de/en/news/",
    kind: "html",
    defaultCategory: "Eventos",
    enabled: true,
  },
  {
    id: "uk-games-expo",
    name: "UK Games Expo",
    url: "https://www.ukgamesexpo.co.uk/news/",
    kind: "html",
    defaultCategory: "Eventos",
    enabled: true,
  },
  {
    id: "origins",
    name: "Origins Game Fair",
    url: "https://www.originsgamefair.com/news",
    kind: "html",
    defaultCategory: "Eventos",
    enabled: true,
  },
] as const

/** Fontes ativas — o Collector só percorre estas. */
export function activeSources(): readonly Source[] {
  return SOURCES.filter((s) => s.enabled)
}

/** Busca uma fonte pelo id (usada nos logs e no admin). */
export function findSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id)
}
