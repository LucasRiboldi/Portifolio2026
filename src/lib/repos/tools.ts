import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
import type { ToolRow } from "@/lib/firebase/types"
import { tools as seed, type Tool } from "@/data/tools"
import { CACHE_TAGS } from "./tags"

function rowToTool(r: ToolRow): Tool {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    type: r.type,
    stack: r.stack ?? [],
    emoji: r.emoji,
    demoUrl: r.demo_url ?? undefined,
    githubUrl: r.github_url ?? undefined,
  }
}

/** Ferramentas (cacheado, com fallback ao seed). */
export const getTools = unstable_cache(
  async (): Promise<Tool[]> => {
    const data = await buscarLinhas<ToolRow>("tools", {
      orderBy: [{ campo: "sort" }, { campo: "name" }],
    })

    if (!data) return seed
    return data.map(rowToTool)
  },
  ["tools"],
  { tags: [CACHE_TAGS.tools] },
)
