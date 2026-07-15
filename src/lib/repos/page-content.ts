import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { pageDefaults, type PageDefaults } from "@/lib/admin/pages-catalog"
import { CACHE_TAGS } from "./tags"

/** Todas as linhas de page_content (cacheado, uma query só). */
const loadAll = unstable_cache(
  async (): Promise<Record<string, Partial<PageDefaults>>> => {
    const supabase = createPublicClient()
    if (!supabase) return {}
    const { data, error } = await supabase.from("page_content").select("*")
    if (error || !data) return {}
    const map: Record<string, Partial<PageDefaults>> = {}
    for (const row of data as Array<{ key: string } & Partial<PageDefaults>>) {
      map[row.key] = {
        kicker: row.kicker,
        title: row.title,
        highlight: row.highlight,
        subtitle: row.subtitle,
      }
    }
    return map
  },
  ["page-content"],
  { tags: [CACHE_TAGS.pages] },
)

/** Conteúdo editorial de uma página: DB sobre os defaults do catálogo. */
export async function getPageContent(key: string): Promise<PageDefaults> {
  const defaults = pageDefaults(key)
  const all = await loadAll()
  const row = all[key]
  if (!row) return defaults
  // usa o valor do banco quando preenchido; senão mantém o default
  return {
    kicker: row.kicker || defaults.kicker,
    title: row.title || defaults.title,
    highlight: row.highlight ?? defaults.highlight,
    subtitle: row.subtitle ?? defaults.subtitle,
  }
}
