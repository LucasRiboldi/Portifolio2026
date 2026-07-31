/**
 * PROPHET WIRE — logger estruturado do pipeline.
 *
 * O Scheduler (Parte 12) e o painel admin (Parte 13) precisam do resumo de
 * cada execução: início, fim, tempo, quantos itens foram pesquisados,
 * descartados e publicados, e os erros. Este módulo define a interface `Logger`
 * (para injeção de dependência) e uma impl de console + um coletor em memória
 * que vira o registro `RunReport` persistido depois.
 *
 * Nenhum módulo do pipeline importa `console` direto: todos recebem um `Logger`.
 * Isso mantém os testes silenciosos e deixa a Parte 10 trocar a saída por
 * Firestore sem tocar em quem loga.
 */

export type LogLevel = "debug" | "info" | "warn" | "error"

/** Uma linha de log com carimbo de tempo e contexto opcional. */
export interface LogEntry {
  ts: string
  level: LogLevel
  message: string
  /** Contexto estruturado (id da fonte, url, etc.). */
  context?: Record<string, unknown>
}

/** Contadores que o pipeline acumula ao longo de uma execução. */
export interface RunCounters {
  fetched: number
  discarded: number
  published: number
  errors: number
}

/** O relatório fechado de uma execução — o que o admin exibe. */
export interface RunReport {
  startedAt: string
  finishedAt: string
  /** Duração em milissegundos. */
  durationMs: number
  counters: RunCounters
  entries: LogEntry[]
}

/** Contrato de logging injetado em cada módulo. */
export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void
  info(message: string, context?: Record<string, unknown>): void
  warn(message: string, context?: Record<string, unknown>): void
  error(message: string, context?: Record<string, unknown>): void
  /** Incrementa um contador (fetched/discarded/published/errors). */
  count(key: keyof RunCounters, by?: number): void
  /** Fecha a execução e devolve o relatório. */
  finish(): RunReport
}

/** Relógio injetável — nos testes, um relógio fixo torna o tempo determinístico. */
export interface Clock {
  now(): Date
}

const systemClock: Clock = { now: () => new Date() }

/** Ordem de severidade para o filtro `minLevel`. */
const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }

export interface RunLoggerOptions {
  /** Não emite entradas abaixo deste nível. Default: "debug". */
  minLevel?: LogLevel
  /** Também imprime no console. Default: true. */
  echo?: boolean
  /** Relógio (injetável para testes). */
  clock?: Clock
}

/**
 * Logger de uma execução: acumula entradas e contadores em memória e, ao
 * `finish()`, devolve o `RunReport`. `echo` liga a saída no console.
 */
export class RunLogger implements Logger {
  private readonly entries: LogEntry[] = []
  private readonly counters: RunCounters = { fetched: 0, discarded: 0, published: 0, errors: 0 }
  private readonly startedAt: Date
  private readonly minLevel: LogLevel
  private readonly echo: boolean
  private readonly clock: Clock
  private closed = false

  constructor(options: RunLoggerOptions = {}) {
    this.minLevel = options.minLevel ?? "debug"
    this.echo = options.echo ?? true
    this.clock = options.clock ?? systemClock
    this.startedAt = this.clock.now()
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (this.closed) throw new Error("RunLogger: log após finish()")
    if (LEVEL_ORDER[level] < LEVEL_ORDER[this.minLevel]) return

    const entry: LogEntry = { ts: this.clock.now().toISOString(), level, message }
    if (context) entry.context = context
    this.entries.push(entry)
    if (level === "error") this.counters.errors += 1

    if (this.echo) {
      const line = `[${entry.ts}] ${level.toUpperCase()} ${message}`
      const sink = level === "error" ? console.error : level === "warn" ? console.warn : console.log
      context ? sink(line, context) : sink(line)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context)
  }
  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context)
  }
  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context)
  }
  error(message: string, context?: Record<string, unknown>): void {
    this.log("error", message, context)
  }

  count(key: keyof RunCounters, by = 1): void {
    if (this.closed) throw new Error("RunLogger: count após finish()")
    this.counters[key] += by
  }

  finish(): RunReport {
    if (this.closed) throw new Error("RunLogger: finish() chamado duas vezes")
    this.closed = true
    const finishedAt = this.clock.now()
    return {
      startedAt: this.startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - this.startedAt.getTime(),
      counters: { ...this.counters },
      entries: [...this.entries],
    }
  }
}

/** Logger que descarta tudo — útil como default em testes de outros módulos. */
export const silentLogger: Logger = {
  debug() {},
  info() {},
  warn() {},
  error() {},
  count() {},
  finish() {
    const ts = new Date(0).toISOString()
    return {
      startedAt: ts,
      finishedAt: ts,
      durationMs: 0,
      counters: { fetched: 0, discarded: 0, published: 0, errors: 0 },
      entries: [],
    }
  },
}
