import { describe, expect, it, vi } from "vitest"

import { RunLogger, silentLogger, type Clock } from "@/lib/prophet-wire/logger"

/**
 * O logger alimenta o RunReport que o admin (Parte 13) exibe. Se um contador
 * não somar, ou o tempo não fechar, o painel mente. Estes testes prendem esses
 * invariantes usando um relógio fixo para tornar o tempo determinístico.
 */

/** Relógio que avança 1s a cada leitura, começando numa base fixa. */
function steppingClock(startMs = 1_000_000): Clock {
  let t = startMs
  return {
    now() {
      const d = new Date(t)
      t += 1000
      return d
    },
  }
}

describe("RunLogger", () => {
  it("registra entradas e conta errors automaticamente", () => {
    const log = new RunLogger({ echo: false, clock: steppingClock() })
    log.info("coletando")
    log.error("fonte caiu", { source: "bgg-news" })

    const report = log.finish()
    expect(report.entries).toHaveLength(2)
    expect(report.entries[1]?.context).toEqual({ source: "bgg-news" })
    expect(report.counters.errors).toBe(1)
  })

  it("acumula contadores explícitos", () => {
    const log = new RunLogger({ echo: false, clock: steppingClock() })
    log.count("fetched", 10)
    log.count("discarded", 3)
    log.count("published")

    const report = log.finish()
    expect(report.counters).toMatchObject({ fetched: 10, discarded: 3, published: 1 })
  })

  it("respeita minLevel", () => {
    const log = new RunLogger({ echo: false, minLevel: "warn", clock: steppingClock() })
    log.debug("ignorado")
    log.info("ignorado")
    log.warn("mantido")

    expect(log.finish().entries).toHaveLength(1)
  })

  it("calcula durationMs a partir do relógio", () => {
    // startedAt lê o relógio (t=1_000_000); finish lê de novo (t=1_001_000).
    const log = new RunLogger({ echo: false, clock: steppingClock(1_000_000) })
    expect(log.finish().durationMs).toBe(1000)
  })

  it("bloqueia uso após finish()", () => {
    const log = new RunLogger({ echo: false, clock: steppingClock() })
    log.finish()
    expect(() => log.info("tarde demais")).toThrow()
    expect(() => log.finish()).toThrow()
  })

  it("echo imprime no console quando ligado", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    const log = new RunLogger({ echo: true, clock: steppingClock() })
    log.info("linha")
    log.finish()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe("silentLogger", () => {
  it("descarta tudo e devolve report zerado", () => {
    silentLogger.info("nada")
    silentLogger.count("fetched", 99)
    const report = silentLogger.finish()
    expect(report.entries).toHaveLength(0)
    expect(report.counters.fetched).toBe(0)
  })
})
