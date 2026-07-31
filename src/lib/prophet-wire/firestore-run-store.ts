import "server-only"

/**
 * PROPHET WIRE — implementação Firestore de `RunStore`.
 *
 * Mesma interface que `InMemoryRunStore`; troca de impl não toca em quem
 * consome (endpoint do cron, painel admin). Usa o cliente service-role pelo
 * mesmo motivo do `FirestoreNewsRepository`: quem escreve é o cron, sem sessão.
 */

import { getDb } from "@/lib/firebase/admin"

const COLECAO = "prophet_wire_runs"
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

export class FirestoreRunStore implements RunStore {
  async record(report: RunReport): Promise<StoredRun> {
    const row: RunRow = {
      id: report.startedAt,
      started_at: report.startedAt,
      finished_at: report.finishedAt,
      duration_ms: report.durationMs,
      counters: report.counters,
      entries: report.entries,
    }
    // O id da execução é o ISO do início — mesma chave do upsert anterior.
    await getDb().collection(COLECAO).doc(row.id).set(row, { merge: true })
    return fromRow(row)
  }

  async last(): Promise<StoredRun | null> {
    const runs = await this.list(1)
    return runs[0] ?? null
  }

  async list(limit?: number): Promise<StoredRun[]> {
    try {
      let query = getDb().collection(COLECAO).orderBy("started_at", "desc")
      if (typeof limit === "number") query = query.limit(limit)
      const snap = await query.get()
      return snap.docs.map((d) => fromRow(d.data() as RunRow))
    } catch {
      return []
    }
  }
}
