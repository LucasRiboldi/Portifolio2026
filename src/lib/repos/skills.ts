import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { SkillRow } from "@/lib/supabase/types"
import { skills as seed, type Skill } from "@/data/skills"
import { CACHE_TAGS } from "./tags"

function rowToSkill(r: SkillRow): Skill {
  return {
    name: r.name,
    command: r.command,
    description: r.description,
    category: r.category,
  }
}

/** Skills (cacheado, com fallback ao seed). */
export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const supabase = createPublicClient()
    if (!supabase) return seed

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort", { ascending: true })
      .order("name", { ascending: true })

    if (error || !data) return seed
    return data.map(rowToSkill)
  },
  ["skills"],
  { tags: [CACHE_TAGS.skills] },
)
