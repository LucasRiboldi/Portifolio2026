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
    id: "bgg-blog",
    name: "BoardGameGeek Blog",
    url: "https://boardgamegeek.com/rss/blog/1",
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
    // Desligada em 05/08/2026: 401 — a XML API2 do BGG passou a exigir autenticação ("Unauthorized").
    enabled: false,
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
    // Desligada em 05/08/2026: 403 — Cloudflare barra o agente; nenhuma variante do feed passa.
    enabled: false,
  },
  {
    id: "gamefound",
    name: "Gamefound",
    url: "https://gamefound.com/",
    kind: "html",
    defaultCategory: "Gamefound",
    // Desligada em 05/08/2026: Responde 200, mas é HTML sem <item>/<entry>: precisa de extractor próprio.
    enabled: false,
  },
  {
    id: "kickstarter-tabletop",
    name: "Kickstarter — Tabletop Games",
    url: "https://www.kickstarter.com/discover/categories/games/tabletop%20games",
    kind: "html",
    defaultCategory: "Kickstarter",
    // Desligada em 05/08/2026: 403 — bloqueio de bot, com UA de navegador também.
    enabled: false,
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
    url: "https://www.cmon.com/feed",
    kind: "rss",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: 403 no runtime. O feed EXISTE e responde 200 no curl com o mesmo UA — o
    // que barra é a impressão TLS do fetch do Node, lida pelo Cloudflare. Trocar
    // User-Agent não resolve; exigiria um cliente que imite navegador.
    enabled: false,
  },
  {
    id: "fantasy-flight",
    name: "Fantasy Flight Games",
    url: "https://www.fantasyflightgames.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: 403 — bloqueio de bot, com UA de navegador também.
    enabled: false,
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
    // Desligada em 05/08/2026: Responde 200, mas é HTML sem <item>/<entry>: precisa de extractor próprio.
    enabled: false,
  },
  {
    id: "plaid-hat",
    name: "Plaid Hat Games",
    url: "https://www.plaidhatgames.com/news/",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: Responde 200, mas é HTML sem <item>/<entry>: precisa de extractor próprio.
    enabled: false,
  },
  {
    id: "portal-games",
    name: "Portal Games",
    url: "https://portalgames.pl/en/feed/",
    kind: "rss",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: O feed morreu: /en/feed/ redireciona (301) para a home, que é HTML.
    enabled: false,
  },
  {
    id: "czech-games",
    name: "Czech Games Edition",
    url: "https://czechgames.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: 403 — bloqueio de bot.
    enabled: false,
  },
  {
    id: "ravensburger",
    name: "Ravensburger",
    url: "https://www.ravensburger.org/us/discover/news/index.html",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: Responde 200, mas é HTML sem <item>/<entry>: precisa de extractor próprio.
    enabled: false,
  },
  {
    id: "kosmos",
    name: "Kosmos",
    url: "https://www.kosmos.de/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: 404 — a página de notícias saiu do ar.
    enabled: false,
  },
  {
    id: "asmodee",
    name: "Asmodee",
    url: "https://www.asmodee.com/en/news/",
    kind: "html",
    defaultCategory: "Editoras",
    // Desligada em 05/08/2026: 530 (Cloudflare 1016, falha de DNS na origem) — quebrado do lado deles.
    enabled: false,
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
    // Desligada em 05/08/2026: 429 mesmo em fila com 3s de pausa. O limite do RSS público do reddit é por
    // IP, não por concorrência — só UMA das três chamadas passa. Mantida ativa
    // apenas `reddit-boardgames`, a mais abrangente.
    enabled: false,
  },
  {
    id: "reddit-boardgamedeals",
    name: "Reddit — r/boardgamedeals",
    url: "https://www.reddit.com/r/boardgamedeals/.rss",
    kind: "rss",
    defaultCategory: "Promoções",
    // Desligada em 05/08/2026: 429 pelo mesmo motivo de `reddit-soloboardgaming`.
    enabled: false,
  },

  // ── Eventos ──────────────────────────────────────────────────────────
  {
    id: "gen-con",
    name: "Gen Con",
    url: "https://www.gencon.com/happenings/news",
    kind: "html",
    defaultCategory: "Eventos",
    // Desligada em 05/08/2026: 404 — a URL de notícias mudou e não achei substituta.
    enabled: false,
  },
  {
    id: "spiel-essen",
    name: "SPIEL Essen",
    url: "https://www.spiel-essen.de/en/news/",
    kind: "html",
    defaultCategory: "Eventos",
    // Desligada em 05/08/2026: Responde 200, mas é HTML sem <item>/<entry>: precisa de extractor próprio.
    enabled: false,
  },
  {
    id: "uk-games-expo",
    name: "UK Games Expo",
    url: "https://www.ukgamesexpo.co.uk/news/",
    kind: "html",
    defaultCategory: "Eventos",
    // Desligada em 05/08/2026: 404 — a URL de notícias mudou e não achei substituta.
    enabled: false,
  },
  {
    id: "origins",
    name: "Origins Game Fair",
    url: "https://www.originsgamefair.com/news",
    kind: "html",
    defaultCategory: "Eventos",
    // Desligada em 05/08/2026: 403 — bloqueio de bot.
    enabled: false,
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
