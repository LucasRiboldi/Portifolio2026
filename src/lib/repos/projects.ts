import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
import type { ProjectRow } from "@/lib/firebase/types"
import { projects as seed, type Project } from "@/data/projects"
import { CACHE_TAGS } from "./tags"

type ProjectRowExt = ProjectRow & { slug?: string | null; readme?: string | null }

function rowToProject(r: ProjectRowExt): Project {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags ?? [],
    coverImage: r.cover_image ?? "",
    href: r.href ?? undefined,
    featured: r.featured,
    slug: r.slug ?? undefined,
    readme: r.readme ?? undefined,
  }
}

/** Projetos publicados para o site público (cacheado, com fallback ao seed). */
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const data = await buscarLinhas<ProjectRowExt>("projects", {
      where: [{ campo: "published", valor: true }],
      orderBy: [{ campo: "sort" }, { campo: "created_at" }],
    })

    if (!data) return seed
    return data.map(rowToProject)
  },
  ["projects"],
  { tags: [CACHE_TAGS.projects] },
)

/** Um projeto pelo slug (usa a lista cacheada). */
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects()
  return all.find((p) => p.slug === slug)
}
