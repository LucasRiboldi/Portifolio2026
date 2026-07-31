import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { seedNews, getFrontNews, setDefaultRepository } from "@/data/prophet-wire"
import { InMemoryNewsRepository } from "@/lib/prophet-wire/repository"
import { config } from "@/lib/prophet-wire/config"

/**
 * Os 6 campos de notícia da primeira página do Anfitrião são hoje alimentados
 * pela semente estática. Estes testes prendem os invariantes que a landing
 * assume — se um campo obrigatório sumir, o card renderiza vazio em silêncio.
 *
 * O repositório é injetado explicitamente. Sem isso o teste consultaria o
 * Firestore de verdade quando houvesse credencial na máquina (o
 * `serviceAccountKey.json` da raiz basta) e ficaria vazio — passando em CI e
 * falhando no laptop de quem tem acesso. O assunto aqui é a semente estática,
 * então é ela que precisa estar no lugar.
 */
beforeAll(() => setDefaultRepository(new InMemoryNewsRepository(seedNews)))
afterAll(() => setDefaultRepository(null))

describe("getFrontNews", () => {
  it("devolve exatamente o número de campos configurado", async () => {
    expect(await getFrontNews()).toHaveLength(config.newsFields)
  })

  it("só devolve notícias publicadas", async () => {
    expect((await getFrontNews()).every((n) => n.status === "publicado")).toBe(true)
  })

  it("não repete slug nem hash (deduplicação)", () => {
    const slugs = seedNews.map((n) => n.slug)
    const hashes = seedNews.map((n) => n.hash)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(hashes).size).toBe(hashes.length)
  })
})

describe("cada NewsItem da semente", () => {
  it("preenche os campos que o card renderiza", () => {
    for (const n of seedNews) {
      expect(n.title, `${n.slug}: title`).toBeTruthy()
      expect(n.subtitle, `${n.slug}: subtitle`).toBeTruthy()
      expect(n.summary, `${n.slug}: summary`).toBeTruthy()
      expect(n.category, `${n.slug}: category`).toBeTruthy()
      expect(n.dropcap.length, `${n.slug}: dropcap 1 letra`).toBe(1)
      expect(n.image.alt, `${n.slug}: image ALT obrigatório`).toBeTruthy()
      expect(n.image.caption, `${n.slug}: legenda`).toBeTruthy()
      expect(n.sourceName, `${n.slug}: fonte`).toBeTruthy()
      expect(n.sourceUrl, `${n.slug}: URL`).toMatch(/^https?:\/\//)
    }
  })
})
