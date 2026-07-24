/**
 * PROPHET WIRE — Normalizer (Parte 6).
 *
 * Mapeia um `ParsedItem` (saída do Parser) para um `NewsItem` bruto — a forma
 * canônica que atravessa o resto do pipeline. "Bruto" porque os campos de IA
 * (designer, mecânicas, SEO, texto reescrito) ficam vazios: quem os preenche é
 * o Analyzer (Parte 8) e o Generator (Parte 9).
 *
 * Responsabilidades desta etapa:
 *   • slug estável e legível a partir do título;
 *   • hash de conteúdo (sha-256) — a chave que o Dedup (Parte 7) compara;
 *   • categoria-palpite herdada da fonte (a IA reclassifica depois);
 *   • status inicial conforme `config.publishMode`.
 */

import { createHash } from "node:crypto"

import type { NewsItem, Source } from "./types"
import type { ParsedItem } from "./parser"
import { initialStatus } from "./config"

/** Remove acentos, baixa a caixa e troca não-alfanuméricos por hífen. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/**
 * Hash de conteúdo — chave de deduplicação. Baseado no link canônico (quando
 * houver) OU no título normalizado, para que a mesma notícia coletada de duas
 * fontes ou re-encontrada amanhã produza o mesmo hash.
 */
export function contentHash(item: Pick<ParsedItem, "link" | "title">): string {
  const basis = (item.link || item.title).trim().toLowerCase()
  return "sha256:" + createHash("sha256").update(basis).digest("hex").slice(0, 32)
}

/** Primeira letra "de verdade" (maiúscula) para a capitular; fallback "•". */
function firstLetter(...candidates: string[]): string {
  for (const c of candidates) {
    const m = c.match(/[a-zA-ZÀ-ÿ0-9]/)
    if (m) return m[0]!.toUpperCase()
  }
  return "•"
}

/** Garante um slug único dentro de um lote, sufixando -2, -3… se preciso. */
function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "noticia"
  let slug = root
  let n = 2
  while (taken.has(slug)) slug = `${root}-${n++}`
  taken.add(slug)
  return slug
}

export interface NormalizeOptions {
  /** Fallback de data quando o item não trouxe uma (não deveria, após a janela). */
  now?: Date
  /** Conjunto de slugs já usados no lote (para garantir unicidade). */
  taken?: Set<string>
}

/**
 * Converte um `ParsedItem` + sua `Source` num `NewsItem` bruto. Não inventa
 * conteúdo: os campos que ainda não temos (subtítulo, tags, metadados de jogo,
 * SEO) ficam vazios/omitidos para a IA preencher.
 */
export function normalize(item: ParsedItem, source: Source, options: NormalizeOptions = {}): NewsItem {
  const taken = options.taken ?? new Set<string>()
  const now = options.now ?? new Date()
  const publishedAt = item.publishedAt ?? now.toISOString()

  return {
    slug: uniqueSlug(slugify(item.title), taken),
    hash: contentHash(item),
    title: item.title,
    subtitle: "",
    summary: item.summary,
    dropcap: firstLetter(item.summary, item.title),
    note: "",
    category: source.defaultCategory,
    subcategory: "",
    tags: [],
    image: {
      src: item.imageUrl,
      alt: item.title,
      caption: "",
    },
    sourceName: source.name,
    sourceUrl: item.link,
    publishedAt,
    status: initialStatus(),
  }
}

/**
 * Normaliza um lote compartilhando o mesmo conjunto de slugs — garante que dois
 * itens com o mesmo título no lote não colidam de slug.
 */
export function normalizeBatch(
  pairs: ReadonlyArray<{ item: ParsedItem; source: Source }>,
  options: Omit<NormalizeOptions, "taken"> = {},
): NewsItem[] {
  const taken = new Set<string>()
  return pairs.map(({ item, source }) => normalize(item, source, { ...options, taken }))
}
