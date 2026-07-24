/**
 * PROPHET WIRE — contratos do agregador de notícias de board games.
 *
 * Este arquivo define APENAS os tipos (a "linguagem" do sistema). Nenhum
 * módulo do pipeline importa implementação de outro: todos falam através
 * destes contratos. É o que mantém baixo acoplamento e permite testar cada
 * módulo isolado (Clean Architecture / Dependency Inversion).
 *
 * A Fase 0 usa somente `NewsItem` e `NewsCategory` — os campos de coleta
 * (hash, sourceUrl bruto, status) já vivem aqui para o pipeline das próximas
 * fases preencher sem alterar o contrato.
 */

/** Categorias de classificação (fechadas — a IA precisa escolher uma). */
export type NewsCategory =
  | "Notícias"
  | "Lançamentos"
  | "Crowdfunding"
  | "Kickstarter"
  | "Gamefound"
  | "Expansões"
  | "Reimpressões"
  | "Eventos"
  | "Prêmios"
  | "Reviews"
  | "Preview"
  | "Rumores"
  | "Mercado"
  | "Editoras"
  | "Designers"
  | "Promoções"

/** Estado de publicação — controlado por `config.ts` (rascunho vs. automático). */
export type NewsStatus = "rascunho" | "publicado"

/** Como o Collector (fase futura) deve buscar uma fonte. */
export type SourceKind = "rss" | "html" | "api"

/**
 * Uma fonte de notícias. O Collector percorre este registry; o Normalizer usa
 * `defaultCategory` como palpite inicial antes de a IA reclassificar.
 */
export interface Source {
  /** Identificador estável (kebab-case), usado como chave e nos logs. */
  id: string
  /** Nome legível impresso na notícia (ex.: "BoardGameGeek"). */
  name: string
  /** Endereço do feed/página/endpoint a coletar. */
  url: string
  /** Estratégia de coleta. */
  kind: SourceKind
  /** Categoria-palpite antes da classificação por IA. */
  defaultCategory: NewsCategory
  /** Fonte ligada? Permite desativar sem remover do registry. */
  enabled: boolean
}

/** A imagem de uma notícia, com os campos de acessibilidade e legenda. */
export interface NewsImage {
  /** Caminho ou URL da arte. `null` quando ainda não há arte (moldura vazia). */
  src: string | null
  /** Texto alternativo (ALT) — obrigatório mesmo sem `src`. */
  alt: string
  /** Legenda impressa sob a gravura. */
  caption: string
}

/**
 * Uma notícia normalizada — o contrato que atravessa TODO o pipeline e que a
 * landing page consome. Os campos marcados "pipeline" são preenchidos pelas
 * fases seguintes (analyzer/generator); na Fase 0 vêm da semente estática.
 */
export interface NewsItem {
  // ── Identidade ──────────────────────────────────────────────
  /** Slug único e estável (usado como key e como rota futura). */
  slug: string
  /** Hash do conteúdo-fonte — chave de deduplicação. "seed:<slug>" na Fase 0. */
  hash: string

  // ── Conteúdo editorial ──────────────────────────────────────
  /** Título chamativo (PT-BR). */
  title: string
  /** Subtítulo / linha de apoio. */
  subtitle: string
  /** Resumo curto — o corpo do card na landing. */
  summary: string
  /** Capitular da abertura do resumo (uma letra). */
  dropcap: string
  /** Nota de rodapé do card (curta, itálico). */
  note: string

  // ── Classificação ───────────────────────────────────────────
  category: NewsCategory
  subcategory: string
  tags: string[]

  // ── Mídia ───────────────────────────────────────────────────
  image: NewsImage

  // ── Metadados de board game (pipeline) ──────────────────────
  designer?: string
  publisher?: string
  mechanics?: string[]
  playerCount?: string
  playTime?: string
  complexity?: string
  year?: number

  // ── SEO (pipeline) ──────────────────────────────────────────
  seoTitle?: string
  metaDescription?: string
  keywords?: string[]
  hashtags?: string[]

  // ── Proveniência ────────────────────────────────────────────
  /** Nome legível da fonte (ex.: "BoardGameGeek"). */
  sourceName: string
  /** URL original da notícia. */
  sourceUrl: string
  /** ISO date da publicação da fonte. */
  publishedAt: string

  // ── Estado ──────────────────────────────────────────────────
  status: NewsStatus
}
