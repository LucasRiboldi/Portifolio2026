import "server-only"

/**
 * PROPHET WIRE — implementação Firestore de `NewsRepository`.
 *
 * Mesma interface que `InMemoryNewsRepository`; troca de impl não toca em
 * quem consome (pipeline, painel admin, landing). Usa o Admin SDK porque quem
 * escreve é o cron, que não tem sessão de usuário. A filtragem por `status`
 * acontece na query, então a landing pública nunca enxerga rascunho — a
 * garantia que antes vinha da RLS agora é responsabilidade destas consultas.
 *
 * O `slug` é o id do documento: era a chave de conflito do upsert no Postgres
 * (`onConflict: "slug"`) e continua sendo a identidade aqui.
 */

import { getDb } from "@/lib/firebase/admin"
import type { NewsRepository } from "./repository"

const COLECAO = "prophet_wire_news"
import type { NewsItem, NewsCategory, NewsStatus } from "./types"

interface NewsRow {
  slug: string
  hash: string
  title: string
  subtitle: string
  summary: string
  dropcap: string
  note: string
  category: string
  subcategory: string
  tags: string[]
  image: { src: string | null; alt: string; caption: string }
  designer: string | null
  publisher: string | null
  mechanics: string[] | null
  player_count: string | null
  play_time: string | null
  complexity: string | null
  year: number | null
  seo_title: string | null
  meta_description: string | null
  keywords: string[] | null
  hashtags: string[] | null
  source_name: string
  source_url: string
  published_at: string
  status: string
}

function toRow(item: NewsItem): NewsRow {
  return {
    slug: item.slug,
    hash: item.hash,
    title: item.title,
    subtitle: item.subtitle,
    summary: item.summary,
    dropcap: item.dropcap,
    note: item.note,
    category: item.category,
    subcategory: item.subcategory,
    tags: item.tags,
    image: item.image,
    designer: item.designer ?? null,
    publisher: item.publisher ?? null,
    mechanics: item.mechanics ?? null,
    player_count: item.playerCount ?? null,
    play_time: item.playTime ?? null,
    complexity: item.complexity ?? null,
    year: item.year ?? null,
    seo_title: item.seoTitle ?? null,
    meta_description: item.metaDescription ?? null,
    keywords: item.keywords ?? null,
    hashtags: item.hashtags ?? null,
    source_name: item.sourceName,
    source_url: item.sourceUrl,
    published_at: item.publishedAt,
    status: item.status,
  }
}

function fromRow(row: NewsRow): NewsItem {
  return {
    slug: row.slug,
    hash: row.hash,
    title: row.title,
    subtitle: row.subtitle,
    summary: row.summary,
    dropcap: row.dropcap,
    note: row.note,
    category: row.category as NewsCategory,
    subcategory: row.subcategory,
    tags: row.tags ?? [],
    image: row.image ?? { src: null, alt: "", caption: "" },
    designer: row.designer ?? undefined,
    publisher: row.publisher ?? undefined,
    mechanics: row.mechanics ?? undefined,
    playerCount: row.player_count ?? undefined,
    playTime: row.play_time ?? undefined,
    complexity: row.complexity ?? undefined,
    year: row.year ?? undefined,
    seoTitle: row.seo_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    keywords: row.keywords ?? undefined,
    hashtags: row.hashtags ?? undefined,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    publishedAt: new Date(row.published_at).toISOString(),
    status: row.status as NewsStatus,
  }
}

export class FirestoreNewsRepository implements NewsRepository {
  async save(item: NewsItem): Promise<NewsItem> {
    const row = toRow(item)
    await getDb().collection(COLECAO).doc(item.slug).set(row, { merge: true })
    return fromRow(row)
  }

  async remove(slug: string): Promise<void> {
    await getDb().collection(COLECAO).doc(slug).delete()
  }

  async findByHash(hash: string): Promise<NewsItem | null> {
    const snap = await getDb().collection(COLECAO).where("hash", "==", hash).limit(1).get()
    const doc = snap.docs[0]
    if (!doc) return null
    return fromRow(doc.data() as NewsRow)
  }

  async findBySlug(slug: string): Promise<NewsItem | null> {
    const doc = await getDb().collection(COLECAO).doc(slug).get()
    if (!doc.exists) return null
    return fromRow(doc.data() as NewsRow)
  }

  async listPublished(limit?: number): Promise<NewsItem[]> {
    return this.list("publicado", limit)
  }

  async listDrafts(limit?: number): Promise<NewsItem[]> {
    return this.list("rascunho", limit)
  }

  async count(): Promise<number> {
    try {
      const snap = await getDb().collection(COLECAO).count().get()
      return snap.data().count
    } catch {
      return 0
    }
  }

  private async list(status: NewsStatus, limit?: number): Promise<NewsItem[]> {
    try {
      let query = getDb()
        .collection(COLECAO)
        .where("status", "==", status)
        .orderBy("published_at", "desc")
      if (typeof limit === "number") query = query.limit(limit)
      const snap = await query.get()
      return snap.docs.map((d) => fromRow(d.data() as NewsRow))
    } catch {
      return []
    }
  }
}
