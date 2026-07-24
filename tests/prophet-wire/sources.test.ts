import { describe, expect, it } from "vitest"

import { SOURCES, activeSources, findSource } from "@/lib/prophet-wire/sources"

/**
 * O registry de fontes erra em silêncio: um id duplicado faz o Collector
 * processar a mesma fonte duas vezes; uma url http:// vaza dado em claro.
 * Estes testes prendem os invariantes que o pipeline assume.
 */

const KINDS = new Set(["rss", "html", "api"])

describe("SOURCES", () => {
  it("tem ao menos as fontes prioritárias do spec", () => {
    // BGG News/Hotness, Dice Tower, ICv2, Gamefound, Kickstarter…
    expect(SOURCES.length).toBeGreaterThanOrEqual(20)
  })

  it("não repete id", () => {
    const ids = SOURCES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("não repete url", () => {
    const urls = SOURCES.map((s) => s.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("toda url é https", () => {
    for (const s of SOURCES) {
      expect(s.url, `${s.id}`).toMatch(/^https:\/\//)
    }
  })

  it("todo id é kebab-case e todo kind é válido", () => {
    for (const s of SOURCES) {
      expect(s.id, `${s.id} não é kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(KINDS.has(s.kind), `${s.id}: kind ${s.kind}`).toBe(true)
      expect(s.name, `${s.id}: name`).toBeTruthy()
      expect(s.defaultCategory, `${s.id}: defaultCategory`).toBeTruthy()
    }
  })
})

describe("activeSources / findSource", () => {
  it("activeSources devolve só as habilitadas", () => {
    expect(activeSources().every((s) => s.enabled)).toBe(true)
  })

  it("findSource localiza por id e devolve undefined para inexistente", () => {
    expect(findSource("bgg-news")?.name).toBe("BoardGameGeek News")
    expect(findSource("nao-existe")).toBeUndefined()
  })
})
