import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { ToolRow } from "@/lib/supabase/types"
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
    const supabase = createPublicClient()
    if (!supabase) return seed

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("sort", { ascending: true })
      .order("name", { ascending: true })

    if (error || !data) return seed
    return data.map(rowToTool)
  },
  ["tools"],
  { tags: [CACHE_TAGS.tools] },
)
