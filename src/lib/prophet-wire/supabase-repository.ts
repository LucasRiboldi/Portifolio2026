import "server-only"

/**
 * PROPHET WIRE — implementação Supabase de `NewsRepository` (Parte 10).
 *
 * Mesma interface que `InMemoryNewsRepository`; troca de impl não toca em
 * quem consome (pipeline, painel admin, landing). Usa o cliente service-role
 * porque quem escreve é o cron (sem sessão de usuário — `is_admin()` via RLS
 * não se aplicaria) e quem lê inclui a landing pública; a filtragem por
 * `status` já é feita na query, então o bypass de RLS não vaza rascunho.
 */

import { createAdminClient } from "@/lib/supabase/admin"
import type { NewsRepository } from "./repository"
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

export class SupabaseNewsRepository implements NewsRepository {
  async save(item: NewsItem): Promise<NewsItem> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("prophet_wire_news")
      .upsert(toRow(item), { onConflict: "slug" })
      .select("*")
      .single()
    if (error || !data) throw new Error(`SupabaseNewsRepository.save: ${error?.message ?? "sem dados"}`)
    return fromRow(data as NewsRow)
  }

  async findByHash(hash: string): Promise<NewsItem | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("prophet_wire_news")
      .select("*")
      .eq("hash", hash)
      .maybeSingle()
    if (error || !data) return null
    return fromRow(data as NewsRow)
  }

  async findBySlug(slug: string): Promise<NewsItem | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("prophet_wire_news")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
    if (error || !data) return null
    return fromRow(data as NewsRow)
  }

  async listPublished(limit?: number): Promise<NewsItem[]> {
    return this.list("publicado", limit)
  }

  async listDrafts(limit?: number): Promise<NewsItem[]> {
    return this.list("rascunho", limit)
  }

  async count(): Promise<number> {
    const supabase = createAdminClient()
    const { count, error } = await supabase
      .from("prophet_wire_news")
      .select("slug", { count: "exact", head: true })
    if (error || count === null) return 0
    return count
  }

  private async list(status: NewsStatus, limit?: number): Promise<NewsItem[]> {
    const supabase = createAdminClient()
    let query = supabase
      .from("prophet_wire_news")
      .select("*")
      .eq("status", status)
      .order("published_at", { ascending: false })
    if (typeof limit === "number") query = query.limit(limit)
    const { data, error } = await query
    if (error || !data) return []
    return (data as NewsRow[]).map(fromRow)
  }
}
