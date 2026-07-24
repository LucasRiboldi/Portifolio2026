import { describe, expect, it } from "vitest"

import { analyze, analyzeBatch } from "@/lib/prophet-wire/analyzer"
import { FallbackAIClient, type AIClient } from "@/lib/prophet-wire/ai-client"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * O Analyzer tem de enriquecer quando a IA responde e degradar sem quebrar
 * quando não responde. Também precisa recusar categoria inválida e não
 * sobrescrever campos bons com vazio. Os testes injetam AIClients fake.
 */

function item(over: Partial<NewsItem> = {}): NewsItem {
  return {
    slug: "s",
    hash: "sha256:a",
    title: "Nova expansão de Wingspan",
    subtitle: "",
    summary: "A Stonemaier anunciou expansão para 1 a 5 jogadores.",
    dropcap: "A",
    note: "",
    category: "Notícias",
    subcategory: "",
    tags: [],
    image: { src: null, alt: "a", caption: "" },
    sourceName: "BGG",
    sourceUrl: "https://bgg.test/1",
    publishedAt: "2026-07-23",
    status: "publicado",
    ...over,
  }
}

/** AIClient que devolve um texto fixo. */
function fakeAI(text: string | null): AIClient {
  return { async complete() { return text } }
}

const silent = () => new RunLogger({ echo: false })

describe("analyze", () => {
  it("enriquece com os campos válidos da IA", async () => {
    const ai = fakeAI(
      JSON.stringify({
        category: "Expansões",
        subcategory: "Nórdica",
        designer: "Elizabeth Hargrave",
        publisher: "Stonemaier Games",
        mechanics: ["coleção de conjuntos", "motor de recursos"],
        playerCount: "1-5",
        playTime: "40-70 min",
        complexity: "média",
        year: 2026,
      }),
    )
    const out = await analyze(item(), { ai, logger: silent() })
    expect(out).toMatchObject({
      category: "Expansões",
      designer: "Elizabeth Hargrave",
      publisher: "Stonemaier Games",
      playerCount: "1-5",
      year: 2026,
    })
    expect(out.mechanics).toEqual(["coleção de conjuntos", "motor de recursos"])
  })

  it("mantém o item bruto quando a IA está indisponível (null)", async () => {
    const out = await analyze(item(), { ai: new FallbackAIClient(), logger: silent() })
    expect(out.category).toBe("Notícias")
    expect(out.designer).toBeUndefined()
  })

  it("mantém o item bruto quando a resposta é ilegível", async () => {
    const out = await analyze(item(), { ai: fakeAI("desculpe, não sei"), logger: silent() })
    expect(out.category).toBe("Notícias")
  })

  it("recusa categoria fora da lista e preserva a palpite", async () => {
    const ai = fakeAI(JSON.stringify({ category: "Categoria Inventada", designer: "X" }))
    const out = await analyze(item({ category: "Lançamentos" }), { ai, logger: silent() })
    expect(out.category).toBe("Lançamentos")
    expect(out.designer).toBe("X")
  })

  it("aceita JSON embrulhado em prosa", async () => {
    const ai = fakeAI('Claro! Aqui: {"category":"Prêmios"} — espero ajudar.')
    const out = await analyze(item(), { ai, logger: silent() })
    expect(out.category).toBe("Prêmios")
  })

  it("não sobrescreve campo existente com vazio", async () => {
    const ai = fakeAI(JSON.stringify({ subcategory: "", designer: null }))
    const out = await analyze(item({ subcategory: "Solo", designer: "Ana" }), { ai, logger: silent() })
    expect(out.subcategory).toBe("Solo")
    expect(out.designer).toBe("Ana")
  })
})

describe("analyzeBatch", () => {
  it("processa todos os itens", async () => {
    const ai = fakeAI(JSON.stringify({ category: "Reviews" }))
    const out = await analyzeBatch([item({ slug: "a" }), item({ slug: "b" })], { ai, logger: silent() })
    expect(out.map((n) => n.category)).toEqual(["Reviews", "Reviews"])
  })
})
