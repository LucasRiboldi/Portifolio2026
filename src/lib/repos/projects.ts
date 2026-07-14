import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { ProjectRow } from "@/lib/supabase/types"
import { projects as seed, type Project } from "@/data/projects"
import { CACHE_TAGS } from "./tags"

function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags ?? [],
    coverImage: r.cover_image ?? "",
    href: r.href ?? undefined,
    featured: r.featured,
  }
}

/** Projetos publicados para o site público (cacheado, com fallback ao seed). */
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const supabase = createPublicClient()
    if (!supabase) return seed

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true })

    if (error || !data) return seed
    return data.map(rowToProject)
  },
  ["projects"],
  { tags: [CACHE_TAGS.projects] },
)
