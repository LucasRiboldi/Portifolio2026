import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { CACHE_TAGS } from "./tags"
import { posts as postsSeed, type Post } from "@/data/posts"

/**
 * Leitor dos posts.
 *
 * Este repositório não existia. A tabela `posts` era povoada pelo seed e pelo
 * sync, o painel tinha a tela "Blog" — e nenhuma linha de código jamais leu o
 * que ali se escrevia. Conteúdo entrava e não saía em lugar nenhum.
 *
 * Cai no seed quando não há Supabase, como `repos/projects.ts` já fazia: em
 * ambiente novo o blog abre com os artigos versionados em vez de vazio.
 */

/** A linha como o banco a devolve — snake_case nas duas colunas compostas. */
interface PostRow {
  slug: string
  title: string
  excerpt: string
  date: string
  reading_minutes: number
  tags: string[]
  accent: Post["accent"]
  body: string
}

function daLinha(r: PostRow): Post {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    date: r.date,
    readingMinutes: r.reading_minutes,
    tags: r.tags ?? [],
    accent: r.accent,
    body: r.body,
  }
}

export const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const supabase = createPublicClient()
    if (!supabase) return postsSeed

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      // Mais recente primeiro: é um blog, a ordem é cronológica invertida.
      .order("date", { ascending: false })

    if (error || !data || data.length === 0) return postsSeed
    return (data as PostRow[]).map(daLinha)
  },
  ["posts"],
  { tags: [CACHE_TAGS.posts] },
)

/** Um post pelo slug, a partir da lista já cacheada. */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const todos = await getPosts()
  return todos.find((p) => p.slug === slug)
}

export type { Post }
