import "server-only"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

const TABLES = ["projects", "posts", "skills", "tools"] as const

export interface AdminStats {
  configured: boolean
  counts: Record<string, number>
  unreadMessages: number
  empty: boolean
}

/** Contadores do dashboard (admin, RLS aplicada). */
export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured) {
    return { configured: false, counts: {}, unreadMessages: 0, empty: true }
  }
  const supabase = await createClient()

  const counts: Record<string, number> = {}
  for (const table of TABLES) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
    counts[table] = count ?? 0
  }

  const { count: unread } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false)

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return {
    configured: true,
    counts,
    unreadMessages: unread ?? 0,
    empty: total === 0,
  }
}
