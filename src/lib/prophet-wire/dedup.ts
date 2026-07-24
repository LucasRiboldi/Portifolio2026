/**
 * PROPHET WIRE — Dedup (Parte 7).
 *
 * "Nunca publicar uma notícia já existente." Este módulo é a barreira que
 * garante isso, em três frentes que o spec pede:
 *
 *   1. hash de conteúdo idêntico   — mesma notícia re-coletada (rápido, exato);
 *   2. mesmo link canônico         — mesma URL vinda por outra fonte;
 *   3. título muito parecido       — mesmo assunto/jogo redigido diferente.
 *
 * Compara cada candidato contra o acervo (via `NewsRepository`) E contra os já
 * aceitos no lote atual, para não deixar dois quase-iguais passarem juntos.
 * Não decide publicação — só separa novidade de repetição; quem grava é o
 * Publisher (Parte 11).
 */

import type { NewsItem } from "./types"
import type { NewsRepository } from "./repository"
import type { Logger } from "./logger"

/** Por que um item foi considerado duplicado (para logs e auditoria). */
export type DuplicateReason = "hash" | "link" | "titulo-similar"

export interface DedupResult {
  /** Itens inéditos, na ordem de entrada. */
  unique: NewsItem[]
  /** Itens descartados, com o motivo e — quando houver — o slug do original. */
  duplicates: Array<{ item: NewsItem; reason: DuplicateReason; matched?: string }>
}

export interface DedupOptions {
  /**
   * Limiar de similaridade de título (0–1) acima do qual dois títulos são
   * considerados a mesma notícia. Default 0.82 (Dice/Sørensen sobre bigramas).
   */
  titleThreshold?: number
}

// ── Similaridade de título ─────────────────────────────────────────────

/** Normaliza um título para comparação: minúsculas, sem acento/pontuação. */
function canonTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Bigramas de caracteres de uma string (para o coeficiente de Sørensen–Dice). */
function bigrams(s: string): Map<string, number> {
  const map = new Map<string, number>()
  for (let i = 0; i < s.length - 1; i++) {
    const bg = s.slice(i, i + 2)
    map.set(bg, (map.get(bg) ?? 0) + 1)
  }
  return map
}

/**
 * Similaridade de Sørensen–Dice entre dois títulos (0 = nada, 1 = idêntico).
 * Robusta a reordenações leves e a palavras a mais, ao contrário de igualdade
 * exata. Títulos muito curtos caem no caminho de igualdade direta.
 */
export function titleSimilarity(a: string, b: string): number {
  const x = canonTitle(a)
  const y = canonTitle(b)
  if (!x || !y) return 0
  if (x === y) return 1
  if (x.length < 2 || y.length < 2) return x === y ? 1 : 0

  const bx = bigrams(x)
  const by = bigrams(y)
  let intersection = 0
  for (const [bg, count] of bx) {
    const other = by.get(bg)
    if (other) intersection += Math.min(count, other)
  }
  const total = [...bx.values()].reduce((s, n) => s + n, 0) + [...by.values()].reduce((s, n) => s + n, 0)
  return (2 * intersection) / total
}

// ── Deduplicação ───────────────────────────────────────────────────────

/** Compara um candidato contra uma lista já conhecida. */
function findDuplicate(
  candidate: NewsItem,
  known: readonly NewsItem[],
  threshold: number,
): { reason: DuplicateReason; matched: string } | null {
  for (const existing of known) {
    if (existing.hash === candidate.hash) return { reason: "hash", matched: existing.slug }
    if (candidate.sourceUrl && existing.sourceUrl === candidate.sourceUrl) {
      return { reason: "link", matched: existing.slug }
    }
    if (titleSimilarity(candidate.title, existing.title) >= threshold) {
      return { reason: "titulo-similar", matched: existing.slug }
    }
  }
  return null
}

/**
 * Separa inéditos de repetidos. Cada candidato é checado contra o repositório
 * (findByHash é a via rápida) e contra os já aceitos neste lote. Descartes são
 * contados em `discarded` no RunReport.
 */
export async function dedup(
  candidates: readonly NewsItem[],
  repo: NewsRepository,
  logger: Logger,
  options: DedupOptions = {},
): Promise<DedupResult> {
  const threshold = options.titleThreshold ?? 0.82
  const unique: NewsItem[] = []
  const duplicates: DedupResult["duplicates"] = []

  for (const candidate of candidates) {
    // 1) via rápida e exata: hash já no acervo.
    const byHash = await repo.findByHash(candidate.hash)
    if (byHash) {
      duplicates.push({ item: candidate, reason: "hash", matched: byHash.slug })
      logger.count("discarded")
      logger.debug("descartado: hash já existe", { slug: candidate.slug, matched: byHash.slug })
      continue
    }

    // 2) link/título contra os inéditos deste lote (ainda não gravados).
    const inBatch = findDuplicate(candidate, unique, threshold)
    if (inBatch) {
      duplicates.push({ item: candidate, reason: inBatch.reason, matched: inBatch.matched })
      logger.count("discarded")
      logger.debug("descartado: duplicado no lote", { slug: candidate.slug, ...inBatch })
      continue
    }

    // 3) link/título contra o acervo publicado (mesmo assunto por outra fonte).
    const known = await repo.listPublished()
    const inRepo = findDuplicate(candidate, known, threshold)
    if (inRepo) {
      duplicates.push({ item: candidate, reason: inRepo.reason, matched: inRepo.matched })
      logger.count("discarded")
      logger.debug("descartado: duplicado no acervo", { slug: candidate.slug, ...inRepo })
      continue
    }

    unique.push(candidate)
  }

  logger.info("deduplicação concluída", { entrada: candidates.length, ineditos: unique.length, descartados: duplicates.length })
  return { unique, duplicates }
}
