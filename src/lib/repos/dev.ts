import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
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
export interface SnippetRow {
  id: string
  title: string
  language: string
  description: string
  code: string
  tags: string[]
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
      const data = await buscarLinhas<T>(table, {
        where: [{ campo: "published", valor: true }],
        orderBy: [{ campo: order, asc }],
      })
      return data ?? []
    },
    [table],
    { tags: [tag] },
  )
}

export const getDevlogs = publishedReader<DevlogRow>("devlogs", CACHE_TAGS.devlogs, "date", false)
export const getSnippets = publishedReader<SnippetRow>("snippets", CACHE_TAGS.snippets, "sort", true)
export const getLab = publishedReader<LabRow>("lab_experiments", CACHE_TAGS.lab, "sort", true)
