import { describe, expect, it } from "vitest"

import { InMemoryNewsRepository } from "@/lib/prophet-wire/repository"
import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * O repositório é o único ponto de acesso ao acervo. Se `save` não sobrescrever
 * por slug, o pipeline duplica; se `listPublished` vazar rascunhos, a landing
 * publica o que não devia. Estes testes prendem esses contratos.
 */

function item(over: Partial<NewsItem> = {}): NewsItem {
  return {
    slug: "x",
    hash: "h:x",
    title: "T",
    subtitle: "S",
    summary: "corpo",
    dropcap: "T",
    note: "nota",
    category: "Notícias",
    subcategory: "sub",
    tags: [],
    image: { src: null, alt: "alt", caption: "cap" },
    sourceName: "Fonte",
    sourceUrl: "https://exemplo.test/x",
    publishedAt: "2026-07-01",
    status: "publicado",
    ...over,
  }
}

describe("InMemoryNewsRepository", () => {
  it("semeia a partir do construtor e conta", async () => {
    const repo = new InMemoryNewsRepository([item({ slug: "a", hash: "h:a" })])
    expect(await repo.count()).toBe(1)
  })

  it("save insere e atualiza por slug (sem duplicar)", async () => {
    const repo = new InMemoryNewsRepository()
    await repo.save(item({ slug: "a", hash: "h:a", title: "v1" }))
    await repo.save(item({ slug: "a", hash: "h:a", title: "v2" }))
    expect(await repo.count()).toBe(1)
    expect((await repo.findBySlug("a"))?.title).toBe("v2")
  })

  it("findByHash localiza pela chave de deduplicação", async () => {
    const repo = new InMemoryNewsRepository([item({ slug: "a", hash: "h:unico" })])
    expect((await repo.findByHash("h:unico"))?.slug).toBe("a")
    expect(await repo.findByHash("nao-existe")).toBeNull()
  })

  it("listPublished não vaza rascunhos e ordena por data desc", async () => {
    const repo = new InMemoryNewsRepository([
      item({ slug: "velho", hash: "h:1", publishedAt: "2026-01-01" }),
      item({ slug: "novo", hash: "h:2", publishedAt: "2026-07-01" }),
      item({ slug: "draft", hash: "h:3", status: "rascunho" }),
    ])
    const pub = await repo.listPublished()
    expect(pub.map((n) => n.slug)).toEqual(["novo", "velho"])
    expect(await repo.listDrafts()).toHaveLength(1)
  })

  it("listPublished respeita o limit", async () => {
    const repo = new InMemoryNewsRepository([
      item({ slug: "a", hash: "h:a", publishedAt: "2026-03-01" }),
      item({ slug: "b", hash: "h:b", publishedAt: "2026-02-01" }),
    ])
    expect(await repo.listPublished(1)).toHaveLength(1)
  })

  it("devolve cópias — mutar o retorno não altera o acervo", async () => {
    const repo = new InMemoryNewsRepository([item({ slug: "a", hash: "h:a", title: "orig" })])
    const got = await repo.findBySlug("a")
    got!.title = "mutado"
    expect((await repo.findBySlug("a"))?.title).toBe("orig")
  })
})
