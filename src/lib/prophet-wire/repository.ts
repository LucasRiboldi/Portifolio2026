/**
 * PROPHET WIRE — Repository Pattern do acervo de notícias.
 *
 * Ponto único de acesso à persistência. O pipeline (Publisher, Dedup) e a
 * landing falam com esta INTERFACE, nunca com o banco direto — é o que permite
 * trocar a impl in-memory pela do Firestore sem tocar em quem
 * consome.
 *
 * A impl in-memory serve a dois papéis reais: (1) testes de integração do
 * pipeline sem rede; (2) fallback da landing quando o banco não está
 * configurado, semeado com as 6 notícias de `src/data/prophet-wire.ts`.
 */

import type { NewsItem } from "./types"

/** Contrato de persistência do acervo. */
export interface NewsRepository {
  /**
   * Insere ou atualiza uma notícia (chave: `slug`). Devolve o item gravado.
   * O Dedup (Parte 7) checa `findByHash` ANTES de chamar isto.
   */
  save(item: NewsItem): Promise<NewsItem>
  /** Localiza por hash de conteúdo — a chave de deduplicação. */
  findByHash(hash: string): Promise<NewsItem | null>
  /** Localiza por slug. */
  findBySlug(slug: string): Promise<NewsItem | null>
  /** Notícias publicadas, mais recentes primeiro, limitadas a `limit`. */
  listPublished(limit?: number): Promise<NewsItem[]>
  /** Notícias em rascunho (fila do admin), mais recentes primeiro. */
  listDrafts(limit?: number): Promise<NewsItem[]>
  /** Total de itens no acervo (usado no painel admin). */
  count(): Promise<number>
  /**
   * Remove do acervo. Existe para o painel: sem isto, um item ruim coletado
   * pelo agregador fica preso na fila para sempre — não há de onde tirá-lo.
   */
  remove(slug: string): Promise<void>
}

/** Ordena por `publishedAt` decrescente (mais recente primeiro). */
function byRecent(a: NewsItem, b: NewsItem): number {
  return b.publishedAt.localeCompare(a.publishedAt)
}

/**
 * Implementação em memória. Determinística e sem efeitos externos — o mapa é
 * indexado por `slug`; `findByHash` varre o acervo (o volume por execução é
 * pequeno, dezenas de itens, então o custo é irrelevante).
 */
export class InMemoryNewsRepository implements NewsRepository {
  private readonly bySlug = new Map<string, NewsItem>()

  constructor(seed: readonly NewsItem[] = []) {
    for (const item of seed) this.bySlug.set(item.slug, { ...item })
  }

  async save(item: NewsItem): Promise<NewsItem> {
    const stored = { ...item }
    this.bySlug.set(item.slug, stored)
    return { ...stored }
  }

  async remove(slug: string): Promise<void> {
    this.bySlug.delete(slug)
  }

  async findByHash(hash: string): Promise<NewsItem | null> {
    for (const item of this.bySlug.values()) {
      if (item.hash === hash) return { ...item }
    }
    return null
  }

  async findBySlug(slug: string): Promise<NewsItem | null> {
    const item = this.bySlug.get(slug)
    return item ? { ...item } : null
  }

  async listPublished(limit?: number): Promise<NewsItem[]> {
    return this.query("publicado", limit)
  }

  async listDrafts(limit?: number): Promise<NewsItem[]> {
    return this.query("rascunho", limit)
  }

  async count(): Promise<number> {
    return this.bySlug.size
  }

  private query(status: NewsItem["status"], limit?: number): NewsItem[] {
    const items = [...this.bySlug.values()]
      .filter((i) => i.status === status)
      .sort(byRecent)
      .map((i) => ({ ...i }))
    return typeof limit === "number" ? items.slice(0, limit) : items
  }
}
