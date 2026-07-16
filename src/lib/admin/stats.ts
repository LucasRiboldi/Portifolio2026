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

  // Em paralelo: eram 5 idas ao banco em fila, e o dashboard esperava a soma
  // de todas para pintar.
  const [tableCounts, { count: unread }] = await Promise.all([
    Promise.all(
      TABLES.map(async (table) => {
        const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
        return [table, count ?? 0] as const
      }),
    ),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("read", false),
  ])

  const counts: Record<string, number> = Object.fromEntries(tableCounts)
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return {
    configured: true,
    counts,
    unreadMessages: unread ?? 0,
    empty: total === 0,
  }
}
