import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { CACHE_TAGS } from "./tags"

export interface DevlogRow {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  body: string
  tags: string[]
}
export interface IdeaRow {
  id: string
  title: string
  description: string
  status: string
  tags: string[]
}
export interface SnippetRow {
  id: string
  title: string
  language: string
  description: string
  code: string
  tags: string[]
}
export interface WikiRow {
  id: string
  slug: string
  title: string
  category: string
  body: string
}
export interface LabRow {
  id: string
  title: string
  description: string
  status: string
  stack: string[]
  demo_url: string | null
  repo_url: string | null
}

/** Cria um leitor público cacheado (published=true) para uma tabela. */
function publishedReader<T>(table: string, tag: string, order: string, asc: boolean) {
  return unstable_cache(
    async (): Promise<T[]> => {
      const supabase = createPublicClient()
      if (!supabase) return []
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("published", true)
        .order(order, { ascending: asc })
      if (error || !data) return []
      return data as T[]
    },
    [table],
    { tags: [tag] },
  )
}

export const getDevlogs = publishedReader<DevlogRow>("devlogs", CACHE_TAGS.devlogs, "date", false)
export const getIdeas = publishedReader<IdeaRow>("ideas", CACHE_TAGS.ideas, "sort", true)
export const getSnippets = publishedReader<SnippetRow>("snippets", CACHE_TAGS.snippets, "sort", true)
export const getWiki = publishedReader<WikiRow>("wiki", CACHE_TAGS.wiki, "sort", true)
export const getLab = publishedReader<LabRow>("lab_experiments", CACHE_TAGS.lab, "sort", true)
