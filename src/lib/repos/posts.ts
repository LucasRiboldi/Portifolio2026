import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { PostRow } from "@/lib/supabase/types"
import { posts as seed, type Post } from "@/data/posts"
import { CACHE_TAGS } from "./tags"

function rowToPost(r: PostRow): Post {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    date: typeof r.date === "string" ? r.date : new Date(r.date).toISOString(),
    readingMinutes: r.reading_minutes,
    tags: r.tags ?? [],
    accent: r.accent,
    body: r.body,
  }
}

/** Posts publicados (cacheado, com fallback ao seed). */
export const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const supabase = createPublicClient()
    if (!supabase) return seed

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false })

    if (error || !data) return seed
    return data.map(rowToPost)
  },
  ["posts"],
  { tags: [CACHE_TAGS.posts] },
)

/** Um post pelo slug (usa a lista cacheada). */
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const all = await getPosts()
  return all.find((p) => p.slug === slug)
}
