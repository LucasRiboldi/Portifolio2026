import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import type { SiteConfigRow } from "@/lib/supabase/types"
import { siteConfig as seed } from "@/constants/site"
import { CACHE_TAGS } from "./tags"

export interface SiteConfig {
  name: string
  title: string
  description: string
  github: string
  linkedin: string
  email: string
  location: string
  ogTitle?: string
  ogDescription?: string
}

function rowToConfig(r: SiteConfigRow): SiteConfig {
  return {
    name: r.name,
    title: r.title,
    description: r.description,
    github: r.github,
    linkedin: r.linkedin,
    email: r.email,
    location: r.location,
    ogTitle: r.og_title ?? undefined,
    ogDescription: r.og_description ?? undefined,
  }
}

/** Config do site (cacheado, com fallback ao seed estático). */
export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    const supabase = createPublicClient()
    if (!supabase) return seed

    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle()

    if (error || !data) return seed
    return rowToConfig(data)
  },
  ["site-config"],
  { tags: [CACHE_TAGS.site] },
)
