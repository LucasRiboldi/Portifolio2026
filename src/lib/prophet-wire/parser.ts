/**
 * PROPHET WIRE — Parser (Parte 5).
 *
 * Converte o payload bruto do Collector em itens estruturados (`ParsedItem`) e
 * aplica a janela de coleta (`config.collectWindowHours`) lendo a data de cada
 * item. Aqui mora o único conhecimento sobre formatos de feed.
 *
 * ESCOPO: cobre feeds RSS 2.0 (`<item>`) e Atom (`<entry>`), que são a maioria
 * das fontes do registry. Fonte sem feed cai nos extractors de `extractors.ts`,
 * consultados **depois** do caminho estruturado — se o site publicar um feed,
 * ele volta a valer sozinho. Sem extractor registrado, o parser ignora com um
 * aviso, sem inventar itens (nada de placeholder).
 *
 * O parser é tolerante mas dependency-free: não é um parser XML genérico, e sim
 * um extrator de feeds. Se um formato novo aparecer, estende-se aqui.
 */

import type { RawPayload } from "./collector"
import type { Logger } from "./logger"
import { EXTRACTORS } from "./extractors"

/** Um item de notícia extraído de um feed, ainda não mapeado para `NewsItem`. */
export interface ParsedItem {
  /** Id da fonte de origem (para rastrear proveniência). */
  sourceId: string
  title: string
  /** URL canônica do item. */
  link: string
  /** Data de publicação em ISO, ou `null` se o feed não trouxe/foi ilegível. */
  publishedAt: string | null
  /** Resumo/descrição em texto puro (tags removidas). */
  summary: string
  /** Primeira imagem encontrada (enclosure/media/`<img>`), ou `null`. */
  imageUrl: string | null
}

// ── Utilidades de texto ────────────────────────────────────────────────

/** Remove CDATA e decodifica as entidades XML básicas. */
function unwrap(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim()
}

/** Tira tags HTML e colapsa espaços — o resumo vai em texto puro. */
function stripHtml(value: string): string {
  return unwrap(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Conteúdo do primeiro `<tag>…</tag>` dentro de `block` (sem namespace). */
function tag(block: string, name: string): string | null {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")
  const m = block.match(re)
  return m ? unwrap(m[1]!) : null
}

/** Valor de um atributo do primeiro `<tag …attr="valor">` em `block`. */
function tagAttr(block: string, name: string, attr: string): string | null {
  const re = new RegExp(`<${name}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, "i")
  const m = block.match(re)
  return m ? unwrap(m[1]!) : null
}

/** Extrai todos os blocos `<tagName>…</tagName>`. */
function blocks(xml: string, tagName: string): string[] {
  const re = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, "gi")
  return [...xml.matchAll(re)].map((m) => m[1]!)
}

/** Converte uma data de feed (RFC-822 ou ISO) em ISO, ou `null`. */
function toIso(value: string | null): string | null {
  if (!value) return null
  const t = Date.parse(value)
  return Number.isNaN(t) ? null : new Date(t).toISOString()
}

/**
 * Resolve `link` contra a URL da fonte quando o feed traz caminho relativo
 * (ex.: GMT Games devolve `/news.aspx?showarticle=593`). Sem isto a URL vai
 * quebrada para o Firestore — proveniência perdida.
 */
function absolutizar(link: string, baseUrl: string): string {
  if (!link) return link
  try {
    return new URL(link, baseUrl).toString()
  } catch {
    return link
  }
}

/** Primeira imagem: enclosure, media:content/thumbnail, ou `<img src>` no corpo. */
function findImage(block: string): string | null {
  return (
    tagAttr(block, "enclosure", "url") ??
    tagAttr(block, "media:content", "url") ??
    tagAttr(block, "media:thumbnail", "url") ??
    block.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ??
    null
  )
}

/** Link de um `<entry>` Atom: `<link href="…">` (rel=alternate quando houver). */
function atomLink(block: string): string {
  const alt = block.match(/<link\b[^>]*\brel=["']alternate["'][^>]*\bhref=["']([^"']+)["']/i)
  if (alt) return unwrap(alt[1]!)
  return tagAttr(block, "link", "href") ?? ""
}

// ── Parsing por formato ────────────────────────────────────────────────

function parseRssItem(sourceId: string, block: string, baseUrl: string): ParsedItem {
  return {
    sourceId,
    title: stripHtml(tag(block, "title") ?? ""),
    link: absolutizar(tag(block, "link") ?? "", baseUrl),
    publishedAt: toIso(tag(block, "pubDate") ?? tag(block, "dc:date")),
    summary: stripHtml(tag(block, "description") ?? tag(block, "content:encoded") ?? ""),
    imageUrl: findImage(block),
  }
}

function parseAtomEntry(sourceId: string, block: string, baseUrl: string): ParsedItem {
  return {
    sourceId,
    title: stripHtml(tag(block, "title") ?? ""),
    link: absolutizar(atomLink(block), baseUrl),
    publishedAt: toIso(tag(block, "updated") ?? tag(block, "published")),
    summary: stripHtml(tag(block, "summary") ?? tag(block, "content") ?? ""),
    imageUrl: findImage(block),
  }
}

/**
 * Interpreta um payload de feed. Detecta RSS vs Atom pela presença de
 * `<item>`/`<entry>`. Fontes sem feed (html/api) devolvem `[]` com aviso.
 * Nunca lança: um payload malformado vira lista vazia + `error` no log.
 */
export function parsePayload(payload: RawPayload, logger: Logger): ParsedItem[] {
  if (!payload.ok || !payload.body) return []
  const { source, body } = payload

  try {
    const items = blocks(body, "item")
    if (items.length > 0) return items.map((b) => parseRssItem(source.id, b, source.url))

    const entries = blocks(body, "entry")
    if (entries.length > 0) return entries.map((b) => parseAtomEntry(source.id, b, source.url))

    /**
     * Sem feed: só então vale um extractor de HTML.
     *
     * A ordem importa. Se o site publicar um feed amanhã, o caminho estruturado
     * volta a valer sozinho e o extractor deixa de rodar — sem ninguém precisar
     * lembrar de desligá-lo.
     */
    const extrator = EXTRACTORS[source.id]
    if (extrator) {
      const extraidos = extrator(body, source.id)
      if (extraidos.length === 0) {
        // Zero itens de um extractor é suspeito: o site provavelmente mudou de
        // layout. Sem este aviso, a fonte secaria em silêncio.
        logger.warn("extractor não achou item — o layout da fonte pode ter mudado", {
          source: source.id,
        })
      } else {
        logger.debug("extraído de HTML", { source: source.id, itens: extraidos.length })
      }
      return extraidos
    }

    logger.warn("payload sem <item>/<entry> — fonte precisa de extractor próprio", {
      source: source.id,
      kind: source.kind,
    })
    return []
  } catch (err) {
    logger.error("falha ao parsear payload", { source: source.id, error: String(err) })
    logger.count("errors")
    return []
  }
}

/**
 * Mantém só itens publicados dentro da janela (`hours`) contada a partir de
 * `now`. Itens sem data são DESCARTADOS: não há como provar que são das últimas
 * 24h, e o spec proíbe republicar coisa antiga. Descartes contam em `discarded`.
 */
export function withinWindow(
  items: ParsedItem[],
  hours: number,
  now: Date,
  logger: Logger,
): ParsedItem[] {
  const cutoff = now.getTime() - hours * 3_600_000
  const kept: ParsedItem[] = []
  for (const item of items) {
    const ts = item.publishedAt ? Date.parse(item.publishedAt) : NaN
    if (!Number.isNaN(ts) && ts >= cutoff && ts <= now.getTime()) {
      kept.push(item)
    } else {
      logger.count("discarded")
    }
  }
  return kept
}

/** Conveniência: parseia e já aplica a janela num passo só. */
export function parseWithinWindow(
  payload: RawPayload,
  hours: number,
  now: Date,
  logger: Logger,
): ParsedItem[] {
  return withinWindow(parsePayload(payload, logger), hours, now, logger)
}
