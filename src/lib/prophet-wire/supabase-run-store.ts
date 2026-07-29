import "server-only"

/**
 * PROPHET WIRE — implementação Supabase de `RunStore` (Parte 10).
 *
 * Mesma interface que `InMemoryRunStore`; troca de impl não toca em quem
 * consome (endpoint do cron, painel admin). Usa o cliente service-role pelo
 * mesmo motivo do `SupabaseNewsRepository`: quem escreve é o cron, sem sessão.
 */

import { createAdminClient } from "@/lib/supabase/admin"
import type { LogEntry, RunReport } from "./logger"
import type { RunStore, StoredRun } from "./run-store"

interface RunRow {
  id: string
  started_at: string
  finished_at: string
  duration_ms: number
  counters: RunReport["counters"]
  entries: LogEntry[]
}

function problemsOf(entries: LogEntry[]): LogEntry[] {
  return entries.filter((e) => e.level === "error" || e.level === "warn")
}

function fromRow(row: RunRow): StoredRun {
  return {
    id: row.id,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationMs: row.duration_ms,
    counters: row.counters,
    entries: row.entries ?? [],
    problems: problemsOf(row.entries ?? []),
  }
}

export class SupabaseRunStore implements RunStore {
  async record(report: RunReport): Promise<StoredRun> {
    const supabase = createAdminClient()
    const row = {
      id: report.startedAt,
      started_at: report.startedAt,
      finished_at: report.finishedAt,
      duration_ms: report.durationMs,
      counters: report.counters,
      entries: report.entries,
    }
    const { data, error } = await supabase
      .from("prophet_wire_runs")
      .upsert(row, { onConflict: "id" })
      .select("*")
      .single()
    if (error || !data) throw new Error(`SupabaseRunStore.record: ${error?.message ?? "sem dados"}`)
    return fromRow(data as RunRow)
  }

  async last(): Promise<StoredRun | null> {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("prophet_wire_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error || !data) return null
    return fromRow(data as RunRow)
  }

  async list(limit?: number): Promise<StoredRun[]> {
    const supabase = createAdminClient()
    let query = supabase.from("prophet_wire_runs").select("*").order("started_at", { ascending: false })
    if (typeof limit === "number") query = query.limit(limit)
    const { data, error } = await query
    if (error || !data) return []
    return (data as RunRow[]).map(fromRow)
  }
}
