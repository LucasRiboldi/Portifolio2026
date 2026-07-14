import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { RealmRow } from "@/lib/supabase/types"
import { REALMS, REALM_ORDER, DEFAULT_REALM, type RealmId } from "@/lib/realms"
import { CACHE_TAGS } from "./tags"

export interface RealmSettings {
  /** ids habilitados, na ordem do ciclo */
  enabled: RealmId[]
  /** realm inicial */
  defaultRealm: RealmId
  /** conteúdo do Arcane (masthead + artigos), quando editado no admin */
  arcaneContent: unknown | null
}

/** Config default derivada do código (fallback quando sem Supabase). */
function seedSettings(): RealmSettings {
  return {
    enabled: [...REALM_ORDER],
    defaultRealm: DEFAULT_REALM,
    arcaneContent: null,
  }
}

/** Configuração dos realms controlada pelo admin (cacheado, com fallback). */
export const getRealmSettings = unstable_cache(
  async (): Promise<RealmSettings> => {
    const supabase = createPublicClient()
    if (!supabase) return seedSettings()

    const { data, error } = await supabase
      .from("realms")
      .select("*")
      .order("sort", { ascending: true })

    if (error || !data || data.length === 0) return seedSettings()

    const enabled = data
      .filter((r) => r.enabled && r.id in REALMS)
      .map((r) => r.id as RealmId)
    const def = data.find((r) => r.is_default && r.enabled)?.id as RealmId | undefined
    const arcane = (data as RealmRow[]).find((r) => r.id === "arcane")?.arcane_content ?? null

    return {
      enabled: enabled.length ? enabled : [...REALM_ORDER],
      defaultRealm: def ?? (enabled[0] ?? DEFAULT_REALM),
      arcaneContent: arcane,
    }
  },
  ["realms"],
  { tags: [CACHE_TAGS.realms] },
)
