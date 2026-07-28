import { describe, expect, it } from "vitest"

import { parseDailyCron, nextRunAt, nextRunFromCron } from "@/lib/prophet-wire/schedule"
import { config } from "@/lib/prophet-wire/config"

/**
 * O painel mostra "próxima execução". Um cálculo errado aqui faz o painel
 * mentir — e o mais importante é que expressões NÃO suportadas devolvam null,
 * para o painel admitir que não sabe em vez de chutar.
 */

describe("parseDailyCron", () => {
  it("interpreta o formato diário M H * * *", () => {
    expect(parseDailyCron("0 6 * * *")).toEqual({ hourUtc: 6, minuteUtc: 0 })
    expect(parseDailyCron("30 23 * * *")).toEqual({ hourUtc: 23, minuteUtc: 30 })
  })

  it("tolera espaços extras", () => {
    expect(parseDailyCron("  0   6  *  *  *  ")).toEqual({ hourUtc: 6, minuteUtc: 0 })
  })

  it("recusa expressões fora do subconjunto suportado", () => {
    expect(parseDailyCron("0 6 * * 1")).toBeNull() // dia da semana
    expect(parseDailyCron("0 6 1 * *")).toBeNull() // dia do mês
    expect(parseDailyCron("*/15 * * * *")).toBeNull() // passo
    expect(parseDailyCron("0 6 * *")).toBeNull() // campos faltando
    expect(parseDailyCron("0 6 * * * *")).toBeNull() // campos demais
    expect(parseDailyCron("")).toBeNull()
  })

  it("recusa valores fora de faixa", () => {
    expect(parseDailyCron("60 6 * * *")).toBeNull()
    expect(parseDailyCron("0 24 * * *")).toBeNull()
    expect(parseDailyCron("-1 6 * * *")).toBeNull()
    expect(parseDailyCron("a b * * *")).toBeNull()
  })
})

describe("nextRunAt", () => {
  const schedule = { hourUtc: 6, minuteUtc: 0 }

  it("devolve hoje quando o horário ainda não passou", () => {
    const from = new Date("2026-07-28T03:00:00.000Z")
    expect(nextRunAt(schedule, from).toISOString()).toBe("2026-07-28T06:00:00.000Z")
  })

  it("devolve amanhã quando o horário já passou", () => {
    const from = new Date("2026-07-28T09:00:00.000Z")
    expect(nextRunAt(schedule, from).toISOString()).toBe("2026-07-29T06:00:00.000Z")
  })

  it("trata o instante exato como já ocorrido", () => {
    const from = new Date("2026-07-28T06:00:00.000Z")
    expect(nextRunAt(schedule, from).toISOString()).toBe("2026-07-29T06:00:00.000Z")
  })

  it("vira o mês corretamente", () => {
    const from = new Date("2026-07-31T09:00:00.000Z")
    expect(nextRunAt(schedule, from).toISOString()).toBe("2026-08-01T06:00:00.000Z")
  })

  it("vira o ano corretamente", () => {
    const from = new Date("2026-12-31T09:00:00.000Z")
    expect(nextRunAt(schedule, from).toISOString()).toBe("2027-01-01T06:00:00.000Z")
  })
})

describe("nextRunFromCron", () => {
  it("calcula a partir da expressão configurada no projeto", () => {
    const next = nextRunFromCron(config.cron, new Date("2026-07-28T03:00:00.000Z"))
    expect(next).toBeInstanceOf(Date)
  })

  it("devolve null para expressão não suportada", () => {
    expect(nextRunFromCron("*/5 * * * *", new Date())).toBeNull()
  })
})
