import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { CACHE_TAGS } from "./tags"
import { skills as skillsSeed, type Skill } from "@/data/skills"

/**
 * Leitor das skills.
 *
 * Mesmo caso dos posts: tabela povoada pelo seed, tela no painel, e nenhum
 * leitor no site inteiro. O conteúdo existia só no banco.
 */
export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const supabase = createPublicClient()
    if (!supabase) return skillsSeed

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort", { ascending: true })

    if (error || !data || data.length === 0) return skillsSeed
    return data as Skill[]
  },
  ["skills"],
  { tags: [CACHE_TAGS.skills] },
)

export type { Skill }
