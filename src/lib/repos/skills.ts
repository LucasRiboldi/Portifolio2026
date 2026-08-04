import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
import { CACHE_TAGS } from "./tags"
import { skills as skillsSeed, type Skill } from "@/data/skills"

/**
 * Leitor das skills.
 *
 * Tabela povoada pelo seed, tela no painel, e por muito tempo nenhum
 * leitor no site inteiro. O conteúdo existia só no banco.
 */
export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const data = await buscarLinhas<Skill>("skills", {
      orderBy: [{ campo: "sort" }],
    })

    if (!data || data.length === 0) return skillsSeed
    return data
  },
  ["skills"],
  { tags: [CACHE_TAGS.skills] },
)

export type { Skill }
