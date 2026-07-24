import { describe, expect, it } from "vitest"

import { generate, generateBatch } from "@/lib/prophet-wire/generator"
import { FallbackAIClient, type AIClient } from "@/lib/prophet-wire/ai-client"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * O Generator produz a peça publicável. Com IA, reescreve título/resumo e
 * preenche SEO; sem IA, deriva SEO do conteúdo bruto — mas nos dois casos o
 * item volta com slug, seoTitle e metaDescription. Os testes injetam AIClients
 * fake e checam os limites de tamanho do SEO.
 */

function item(over: Partial<NewsItem> = {}): NewsItem {
  return {
    slug: "orig-slug",
    hash: "sha256:a",
    title: "Stonemaier anuncia expansão nórdica para Wingspan",
    subtitle: "",
    summary: "A editora confirmou uma expansão ambientada na Escandinávia, com novas aves e módulos.",
    dropcap: "A",
    note: "",
    category: "Expansões",
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

function fakeAI(text: string | null): AIClient {
  return { async complete() { return text } }
}

const silent = () => new RunLogger({ echo: false })

describe("generate — com IA", () => {
  it("aplica título, resumo e SEO reescritos", async () => {
    const ai = fakeAI(
      JSON.stringify({
        title: "A REVOADA DO NORTE CHEGA ÀS MESAS",
        seoTitle: "Wingspan: expansão nórdica anunciada",
        subtitle: "Novas aves escandinavas pousam no aviário",
        summary: "Reescrita original sobre a expansão nórdica.",
        metaDescription: "A expansão nórdica de Wingspan traz aves escandinavas e novos módulos.",
        keywords: ["wingspan", "expansão", "nórdica"],
        hashtags: ["#wingspan", "#boardgames"],
      }),
    )
    const out = await generate(item(), { ai, logger: silent() })
    expect(out.title).toBe("A REVOADA DO NORTE CHEGA ÀS MESAS")
    expect(out.subtitle).toContain("escandinavas")
    expect(out.slug).toBe("a-revoada-do-norte-chega-as-mesas")
    expect(out.keywords).toContain("wingspan")
    expect(out.hashtags).toContain("#boardgames")
  })

  it("deriva slug do título quando a IA não manda slug", async () => {
    const ai = fakeAI(JSON.stringify({ title: "Título Novo Aqui" }))
    const out = await generate(item(), { ai, logger: silent() })
    expect(out.slug).toBe("titulo-novo-aqui")
  })
})

describe("generate — fallback sem IA", () => {
  it("deriva SEO do conteúdo bruto quando a IA está indisponível", async () => {
    const out = await generate(item(), { ai: new FallbackAIClient(), logger: silent() })
    expect(out.slug).toBe("stonemaier-anuncia-expansao-nordica-para-wingspan")
    expect(out.seoTitle).toBeTruthy()
    expect(out.metaDescription).toBeTruthy()
    expect(out.keywords?.length).toBeGreaterThan(0)
    // não inventou título novo
    expect(out.title).toBe(item().title)
  })

  it("respeita os limites de tamanho de SEO", async () => {
    const longTitle = "Palavra ".repeat(20).trim()
    const out = await generate(item({ title: longTitle, summary: "Frase. ".repeat(60) }), {
      ai: new FallbackAIClient(),
      logger: silent(),
    })
    expect(out.seoTitle!.length).toBeLessThanOrEqual(61)
    expect(out.metaDescription!.length).toBeLessThanOrEqual(156)
  })

  it("keywords descartam stopwords e curtas", async () => {
    const out = await generate(item({ title: "A e o de um jogo raro para todos" }), {
      ai: new FallbackAIClient(),
      logger: silent(),
    })
    expect(out.keywords).not.toContain("de")
    expect(out.keywords).toContain("jogo")
  })
})

describe("generateBatch", () => {
  it("gera todos os itens", async () => {
    const out = await generateBatch([item({ slug: "a" }), item({ slug: "b" })], {
      ai: new FallbackAIClient(),
      logger: silent(),
    })
    expect(out).toHaveLength(2)
    expect(out.every((n) => n.seoTitle && n.metaDescription)).toBe(true)
  })
})
