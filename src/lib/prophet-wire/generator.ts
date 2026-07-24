/**
 * PROPHET WIRE — Generator (Parte 9).
 *
 * Transforma o `NewsItem` (já enriquecido pelo Analyzer) na peça publicável:
 * texto ORIGINAL em português — nunca cópia da fonte — na voz do Daily Prophet,
 * mais a camada de SEO que o spec pede (título chamativo, título SEO, subtítulo,
 * resumo, meta description, slug, keywords, hashtags).
 *
 * Mesma política do Analyzer: delega à `AIClient` e, se a IA está indisponível
 * (`complete()` → null) ou responde ilegível, aplica um FALLBACK determinístico
 * que deriva SEO do conteúdo bruto (slug, keywords, meta description a partir do
 * resumo). O item continua publicável — sem inventar fatos, só reaproveitando o
 * que já existe. Nada de placeholder.
 */

import type { NewsItem } from "./types"
import { extractJson, type AIClient } from "./ai-client"
import type { Logger } from "./logger"
import { slugify } from "./normalizer"

export interface GeneratorDeps {
  ai: AIClient
  logger: Logger
}

/** Campos que o Generator produz. */
interface GeneratedFields {
  title?: string
  seoTitle?: string
  subtitle?: string
  summary?: string
  metaDescription?: string
  slug?: string
  keywords?: string[]
  hashtags?: string[]
  dropcap?: string
}

const SYSTEM =
  "Você é o editor do «Daily Prophet», jornal vitoriano dedicado à criação de jogos de " +
  "tabuleiro. Escreva em português do Brasil, com voz editorial elegante e levemente " +
  "arcaica, SEM copiar o texto da fonte. Produza conteúdo ORIGINAL e otimizado para SEO. " +
  "Responda APENAS com um objeto JSON válido."

function buildPrompt(item: NewsItem): string {
  return [
    "Reescreva esta notícia de board games como matéria original do Daily Prophet.",
    "Não copie frases da fonte; recrie o conteúdo com suas palavras.",
    "",
    "Responda em JSON:",
    "{",
    '  "title": "<título chamativo, PT-BR>",',
    '  "seoTitle": "<título otimizado para busca, até ~60 caracteres>",',
    '  "subtitle": "<linha de apoio>",',
    '  "summary": "<resumo original de 2-3 frases>",',
    '  "metaDescription": "<meta description até ~155 caracteres>",',
    '  "keywords": ["<palavra-chave>", ...],',
    '  "hashtags": ["#<tag>", ...]',
    "}",
    "",
    `Título atual: ${item.title}`,
    `Resumo atual: ${item.summary}`,
    `Categoria: ${item.category}`,
    item.publisher ? `Editora: ${item.publisher}` : "",
    item.designer ? `Designer: ${item.designer}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

// ── Sanitização dos campos ─────────────────────────────────────────────

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function strArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined
  const out = value.map((v) => str(v)).filter((v): v is string => Boolean(v))
  return out.length ? out : undefined
}

/** Corta um texto num limite de caracteres sem partir palavra. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(" ")
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…"
}

// ── Fallback determinístico (sem IA) ───────────────────────────────────

/** Palavras-chave a partir do título: tokens significativos, sem repetição. */
const STOPWORDS = new Set([
  "a", "o", "os", "as", "de", "da", "do", "das", "dos", "e", "em", "no", "na", "para",
  "com", "por", "um", "uma", "que", "se", "ao", "à", "the", "of", "and", "to", "for",
])

function deriveKeywords(item: NewsItem): string[] {
  const words = `${item.title} ${item.category}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  return [...new Set(words)].slice(0, 6)
}

/**
 * Fallback: sem inventar fatos, deriva a camada de SEO do conteúdo bruto.
 * Slug do título, meta description do resumo, keywords/hashtags dos tokens.
 */
function fallbackFields(item: NewsItem): GeneratedFields {
  const keywords = deriveKeywords(item)
  return {
    slug: slugify(item.title),
    seoTitle: clamp(item.title, 60),
    metaDescription: clamp(item.summary || item.title, 155),
    keywords,
    hashtags: keywords.map((k) => "#" + k.replace(/-/g, "")),
  }
}

/** Aplica os campos gerados sobre o item, garantindo slug e SEO coerentes. */
function apply(item: NewsItem, fields: GeneratedFields): NewsItem {
  const title = str(fields.title) ?? item.title
  const summary = str(fields.summary) ?? item.summary
  const slug = slugify(str(fields.slug) ?? title) || item.slug
  return {
    ...item,
    title,
    subtitle: str(fields.subtitle) ?? item.subtitle,
    summary,
    slug,
    seoTitle: str(fields.seoTitle) ?? clamp(title, 60),
    metaDescription: str(fields.metaDescription) ?? clamp(summary || title, 155),
    keywords: strArray(fields.keywords) ?? item.keywords,
    hashtags: strArray(fields.hashtags) ?? item.hashtags,
    dropcap: str(fields.dropcap) ?? item.dropcap,
  }
}

/**
 * Gera a versão publicável de um item. Usa a IA quando disponível; caso
 * contrário, aplica o fallback determinístico. Sempre devolve um item com slug,
 * seoTitle e metaDescription preenchidos.
 */
export async function generate(item: NewsItem, deps: GeneratorDeps): Promise<NewsItem> {
  const { ai, logger } = deps
  const raw = await ai.complete({ system: SYSTEM, prompt: buildPrompt(item), temperature: 0.7 })

  if (raw === null) {
    logger.debug("generator: IA indisponível, aplicando SEO derivado", { slug: item.slug })
    return apply(item, fallbackFields(item))
  }

  const parsed = extractJson(raw)
  if (!parsed || typeof parsed !== "object") {
    logger.warn("generator: resposta ilegível, aplicando SEO derivado", { slug: item.slug })
    return apply(item, fallbackFields(item))
  }

  logger.debug("generator: matéria reescrita pela IA", { slug: item.slug })
  return apply(item, parsed as GeneratedFields)
}

/** Gera um lote em sequência. */
export async function generateBatch(items: readonly NewsItem[], deps: GeneratorDeps): Promise<NewsItem[]> {
  const out: NewsItem[] = []
  for (const item of items) out.push(await generate(item, deps))
  return out
}
