/**
 * PROPHET WIRE — histórico de execuções (Parte 13).
 *
 * O `RunReport` que o pipeline devolve morria na resposta HTTP. O painel admin
 * precisa dele para mostrar "última execução", contagens e erros — então este
 * módulo guarda os últimos relatórios.
 *
 * MESMA LIMITAÇÃO DO REPOSITÓRIO, declarada: a impl é em memória, viva apenas
 * enquanto a instância serverless existir. Um cold start zera o histórico, e
 * instâncias diferentes não compartilham nada. É honesto para o estágio atual
 * (o acervo também é in-memory) e some quando há Firestore configurado:
 * basta uma segunda impl desta mesma interface.
 */

import type { LogEntry, RunReport } from "./logger"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { FirestoreRunStore } from "./firestore-run-store"

/** Uma execução registrada, com id e recorte dos erros para o painel. */
export interface StoredRun extends RunReport {
  /** Id da execução (ISO do início — único o bastante e já ordenável). */
  id: string
  /** Só as entradas de nível error/warn, para o painel não carregar tudo. */
  problems: LogEntry[]
}

/** Contrato de histórico — o Firestore implementa este mesmo shape. */
export interface RunStore {
  /** Registra uma execução concluída. */
  record(report: RunReport): Promise<StoredRun>
  /** Última execução, ou `null` se nenhuma foi registrada nesta instância. */
  last(): Promise<StoredRun | null>
  /** Execuções mais recentes primeiro. */
  list(limit?: number): Promise<StoredRun[]>
}

/** Extrai as entradas que interessam ao painel (problemas). */
function problemsOf(report: RunReport): LogEntry[] {
  return report.entries.filter((e) => e.level === "error" || e.level === "warn")
}

/**
 * Histórico em memória, com teto de tamanho para não crescer sem limite numa
 * instância de vida longa.
 */
export class InMemoryRunStore implements RunStore {
  private readonly runs: StoredRun[] = []

  constructor(private readonly maxRuns = 20) {}

  async record(report: RunReport): Promise<StoredRun> {
    const stored: StoredRun = { ...report, id: report.startedAt, problems: problemsOf(report) }
    // Mais recente primeiro; corta o excedente pela cauda.
    this.runs.unshift(stored)
    if (this.runs.length > this.maxRuns) this.runs.length = this.maxRuns
    return stored
  }

  async last(): Promise<StoredRun | null> {
    return this.runs[0] ?? null
  }

  async list(limit?: number): Promise<StoredRun[]> {
    return typeof limit === "number" ? this.runs.slice(0, limit) : [...this.runs]
  }
}

/** Store padrão da aplicação (trocável em testes; Firestore quando configurado). */
let store: RunStore | null = null

export function defaultRunStore(): RunStore {
  if (!store) {
    store = isFirebaseAdminConfigured ? new FirestoreRunStore() : new InMemoryRunStore()
  }
  return store
}

/** Redefine o store — usado em testes. */
export function setDefaultRunStore(next: RunStore | null): void {
  store = next
}
