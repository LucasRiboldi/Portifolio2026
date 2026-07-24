import { describe, expect, it } from "vitest"

import { slugify, contentHash, normalize, normalizeBatch } from "@/lib/prophet-wire/normalizer"
import type { ParsedItem } from "@/lib/prophet-wire/parser"
import type { Source } from "@/lib/prophet-wire/types"
import { config } from "@/lib/prophet-wire/config"

/**
 * O Normalizer produz a forma canônica que o resto do pipeline assume. Se o
 * slug não for único, o repositório sobrescreve notícias distintas; se o hash
 * não for estável, o Dedup deixa passar repetidos. Estes testes prendem isso.
 */

function source(over: Partial<Source> = {}): Source {
  return { id: "bgg", name: "BoardGameGeek", url: "https://bgg.test", kind: "rss", defaultCategory: "Lançamentos", enabled: true, ...over }
}

function parsed(over: Partial<ParsedItem> = {}): ParsedItem {
  return {
    sourceId: "bgg",
    title: "Nova Expansão Anunciada",
    link: "https://bgg.test/n/1",
    publishedAt: "2026-07-23T10:00:00.000Z",
    summary: "A editora confirmou a expansão.",
    imageUrl: null,
    ...over,
  }
}

describe("slugify", () => {
  it("remove acentos e normaliza para kebab-case", () => {
    expect(slugify("Coleção de Miniaturas Épicas!")).toBe("colecao-de-miniaturas-epicas")
  })

  it("limita o comprimento e apara hífens das pontas", () => {
    expect(slugify("  ---Olá---  ")).toBe("ola")
    expect(slugify("a".repeat(200)).length).toBeLessThanOrEqual(80)
  })
})

describe("contentHash", () => {
  it("é estável para o mesmo link", () => {
    expect(contentHash({ link: "https://x.test/a", title: "T" })).toBe(
      contentHash({ link: "https://x.test/a", title: "outro título" }),
    )
  })

  it("difere entre links diferentes e usa título quando não há link", () => {
    expect(contentHash({ link: "https://x.test/a", title: "T" })).not.toBe(
      contentHash({ link: "https://x.test/b", title: "T" }),
    )
    expect(contentHash({ link: "", title: "Só Título" })).toMatch(/^sha256:/)
  })
})

describe("normalize", () => {
  it("mapeia ParsedItem + Source para NewsItem bruto", () => {
    const news = normalize(parsed(), source())
    expect(news).toMatchObject({
      slug: "nova-expansao-anunciada",
      title: "Nova Expansão Anunciada",
      category: "Lançamentos",
      sourceName: "BoardGameGeek",
      sourceUrl: "https://bgg.test/n/1",
      publishedAt: "2026-07-23T10:00:00.000Z",
    })
    expect(news.hash).toMatch(/^sha256:/)
    expect(news.status).toBe(config.publishMode === "automatico" ? "publicado" : "rascunho")
  })

  it("deriva a capitular da primeira letra do resumo", () => {
    expect(normalize(parsed({ summary: "Ótima notícia" }), source()).dropcap).toBe("Ó")
  })

  it("deixa campos de IA vazios (sem inventar)", () => {
    const news = normalize(parsed(), source())
    expect(news.subtitle).toBe("")
    expect(news.tags).toEqual([])
    expect(news.designer).toBeUndefined()
    expect(news.seoTitle).toBeUndefined()
  })

  it("usa a imagem quando o parser a encontrou", () => {
    const news = normalize(parsed({ imageUrl: "https://img.test/a.jpg" }), source())
    expect(news.image.src).toBe("https://img.test/a.jpg")
    expect(news.image.alt).toBe(news.title)
  })

  it("cai para `now` quando não há data", () => {
    const now = new Date("2026-07-24T00:00:00.000Z")
    expect(normalize(parsed({ publishedAt: null }), source(), { now }).publishedAt).toBe(now.toISOString())
  })
})

describe("normalizeBatch", () => {
  it("garante slugs únicos para títulos iguais no lote", () => {
    const items = normalizeBatch([
      { item: parsed({ title: "Igual", link: "https://x.test/1" }), source: source() },
      { item: parsed({ title: "Igual", link: "https://x.test/2" }), source: source() },
    ])
    expect(items[0]?.slug).toBe("igual")
    expect(items[1]?.slug).toBe("igual-2")
  })
})
