import "server-only"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getResource } from "@/lib/admin/resources"

/** Todas as linhas de um recurso (admin — inclui não publicados). */
export async function listRows(slug: string): Promise<Record<string, unknown>[]> {
  const res = getResource(slug)
  if (!res || !isSupabaseConfigured) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(slug)
    .select("*")
    .order(res.orderBy.column, { ascending: res.orderBy.ascending })
  if (error || !data) return []
  return data
}

/** Uma linha por id. */
export async function getRow(slug: string, id: string): Promise<Record<string, unknown> | null> {
  if (!getResource(slug) || !isSupabaseConfigured) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from(slug).select("*").eq("id", id).maybeSingle()
  if (error || !data) return null
  return data
}
