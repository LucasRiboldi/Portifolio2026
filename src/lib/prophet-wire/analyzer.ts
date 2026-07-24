/**
 * PROPHET WIRE — Analyzer (Parte 8).
 *
 * Enriquece um `NewsItem` bruto com os metadados que só a leitura do conteúdo
 * revela: categoria/subcategoria corretas, designer, editora, mecânicas, nº de
 * jogadores, tempo de jogo, complexidade e ano. Delega a leitura à `AIClient`.
 *
 * Degradação declarada: se a IA está indisponível (`complete()` → null) ou
 * devolve algo ilegível, o item volta INTACTO (mantém a categoria-palpite do
 * Normalizer). O pipeline nunca trava por falta de IA. Toda categoria vinda da
 * IA é validada contra `NEWS_CATEGORIES` antes de ser aceita.
 */

import { NEWS_CATEGORIES, type NewsCategory, type NewsItem } from "./types"
import { extractJson, type AIClient } from "./ai-client"
import type { Logger } from "./logger"

export interface AnalyzerDeps {
  ai: AIClient
  logger: Logger
}

/** Campos que a IA pode preencher a partir do conteúdo. */
interface AnalysisFields {
  category?: string
  subcategory?: string
  designer?: string
  publisher?: string
  mechanics?: string[]
  playerCount?: string
  playTime?: string
  complexity?: string
  year?: number
}

const SYSTEM =
  "Você é um editor especializado em jogos de tabuleiro. Leia a notícia e extraia " +
  "metadados objetivos. Responda APENAS com um objeto JSON válido, sem comentários."

function buildPrompt(item: NewsItem): string {
  return [
    "Extraia os campos abaixo desta notícia de board games. Use null quando não constar.",
    "",
    `Categorias válidas: ${NEWS_CATEGORIES.join(", ")}.`,
    "",
    "Formato de resposta (JSON):",
    "{",
    '  "category": "<uma das categorias válidas>",',
    '  "subcategory": "<texto curto ou null>",',
    '  "designer": "<nome ou null>",',
    '  "publisher": "<editora ou null>",',
    '  "mechanics": ["<mecânica>", ...] ou [],',
    '  "playerCount": "<ex.: 2-4 ou null>",',
    '  "playTime": "<ex.: 60-90 min ou null>",',
    '  "complexity": "<ex.: média ou null>",',
    '  "year": <ano numérico ou null>',
    "}",
    "",
    `Título: ${item.title}`,
    `Resumo: ${item.summary}`,
    `Fonte: ${item.sourceName}`,
  ].join("\n")
}

/** Só aceita string não-vazia; caso contrário devolve undefined. */
function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

/** Normaliza um array de strings, descartando vazios. */
function strArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const out = value.map((v) => str(v)).filter((v): v is string => Boolean(v))
  return out.length ? out : undefined
}

/** Aceita a categoria só se for uma das válidas. */
function validCategory(value: unknown): NewsCategory | undefined {
  const s = str(value)
  return s && (NEWS_CATEGORIES as readonly string[]).includes(s) ? (s as NewsCategory) : undefined
}

/** Aplica os campos da análise sobre o item, sem sobrescrever com vazio. */
function merge(item: NewsItem, fields: AnalysisFields): NewsItem {
  const year =
    typeof fields.year === "number" && Number.isFinite(fields.year) ? fields.year : undefined
  return {
    ...item,
    category: validCategory(fields.category) ?? item.category,
    subcategory: str(fields.subcategory) ?? item.subcategory,
    designer: str(fields.designer) ?? item.designer,
    publisher: str(fields.publisher) ?? item.publisher,
    mechanics: strArray(fields.mechanics) ?? item.mechanics,
    playerCount: str(fields.playerCount) ?? item.playerCount,
    playTime: str(fields.playTime) ?? item.playTime,
    complexity: str(fields.complexity) ?? item.complexity,
    year: year ?? item.year,
  }
}

/**
 * Analisa um item. Devolve uma cópia enriquecida, ou o próprio item quando a IA
 * não pôde ajudar (indisponível ou resposta ilegível).
 */
export async function analyze(item: NewsItem, deps: AnalyzerDeps): Promise<NewsItem> {
  const { ai, logger } = deps
  const raw = await ai.complete({ system: SYSTEM, prompt: buildPrompt(item), temperature: 0 })

  if (raw === null) {
    logger.debug("analyzer: IA indisponível, mantendo item bruto", { slug: item.slug })
    return item
  }

  const parsed = extractJson(raw)
  if (!parsed || typeof parsed !== "object") {
    logger.warn("analyzer: resposta da IA ilegível, mantendo item bruto", { slug: item.slug })
    return item
  }

  const enriched = merge(item, parsed as AnalysisFields)
  logger.debug("analyzer: item enriquecido", { slug: item.slug, category: enriched.category })
  return enriched
}

/** Analisa um lote em sequência (respeita limites de taxa da IA). */
export async function analyzeBatch(items: readonly NewsItem[], deps: AnalyzerDeps): Promise<NewsItem[]> {
  const out: NewsItem[] = []
  for (const item of items) out.push(await analyze(item, deps))
  return out
}
