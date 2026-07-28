import { describe, expect, it } from "vitest"

import { InMemoryRunStore } from "@/lib/prophet-wire/run-store"
import { RunLogger } from "@/lib/prophet-wire/logger"

/**
 * O histórico alimenta o painel admin. Se `last()` não devolver a execução mais
 * recente, o painel mostra dado velho; se `problems` não filtrar, despeja o log
 * inteiro na tela.
 */

/** Produz um RunReport real, passando pelo próprio logger. */
function report(opts: { errors?: number; warns?: number; infos?: number } = {}) {
  const log = new RunLogger({ echo: false })
  for (let i = 0; i < (opts.infos ?? 1); i++) log.info(`info ${i}`)
  for (let i = 0; i < (opts.warns ?? 0); i++) log.warn(`warn ${i}`)
  for (let i = 0; i < (opts.errors ?? 0); i++) log.error(`erro ${i}`)
  return log.finish()
}

describe("InMemoryRunStore", () => {
  it("começa vazio", async () => {
    const store = new InMemoryRunStore()
    expect(await store.last()).toBeNull()
    expect(await store.list()).toEqual([])
  })

  it("registra e devolve a execução como última", async () => {
    const store = new InMemoryRunStore()
    const stored = await store.record(report())
    expect((await store.last())?.id).toBe(stored.id)
  })

  it("guarda a mais recente primeiro", async () => {
    const store = new InMemoryRunStore()
    const primeira = await store.record(report())
    // Segundo relatório com início posterior garante ids distintos.
    await new Promise((r) => setTimeout(r, 2))
    const segunda = await store.record(report())

    const list = await store.list()
    expect(list[0]?.id).toBe(segunda.id)
    expect(list[1]?.id).toBe(primeira.id)
  })

  it("filtra só warn e error em `problems`", async () => {
    const store = new InMemoryRunStore()
    const stored = await store.record(report({ infos: 3, warns: 2, errors: 1 }))
    expect(stored.problems).toHaveLength(3)
    expect(stored.problems.every((p) => p.level === "warn" || p.level === "error")).toBe(true)
  })

  it("respeita o teto de execuções guardadas", async () => {
    const store = new InMemoryRunStore(2)
    await store.record(report())
    await new Promise((r) => setTimeout(r, 2))
    await store.record(report())
    await new Promise((r) => setTimeout(r, 2))
    const ultima = await store.record(report())

    const list = await store.list()
    expect(list).toHaveLength(2)
    expect(list[0]?.id).toBe(ultima.id)
  })

  it("list respeita o limit", async () => {
    const store = new InMemoryRunStore()
    await store.record(report())
    await new Promise((r) => setTimeout(r, 2))
    await store.record(report())
    expect(await store.list(1)).toHaveLength(1)
  })
})
