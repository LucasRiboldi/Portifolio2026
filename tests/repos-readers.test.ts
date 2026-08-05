import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Os leitores públicos (`repos/projects`, `repos/criativo`, `repos/dev`)
 * partilham o padrão `publishedReader`: sem Firestore → fallback; erro → fallback;
 * sucesso → dados. O que MUDA entre eles é o fallback (seed vs. []) e o que
 * fazem com uma tabela vazia — e é justamente isso que estes testes fixam.
 *
 * `next/cache` vira passthrough (o unstable_cache só devolve a própria função)
 * e `buscarLinhas` é controlado por teste para simular cada ramo.
 */
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}))

const buscarLinhas = vi.fn()
const buscarPorId = vi.fn()
vi.mock("@/lib/firebase/query", () => ({
  buscarLinhas: (...a: unknown[]) => buscarLinhas(...a),
  buscarPorId: (...a: unknown[]) => buscarPorId(...a),
}))

const { getProjects, getProjectBySlug } = await import("@/lib/repos/projects")
const { getArtworks } = await import("@/lib/repos/criativo")
const { getDevlogs, getDevlogBySlug, getSnippets } = await import("@/lib/repos/dev")
const { projects: projectsSeed } = await import("@/data/projects")
const { artworks: artworksSeed } = await import("@/data/criativo-zones")
const { devlogs: devlogsSeed } = await import("@/data/dev")

beforeEach(() => {
  buscarLinhas.mockReset()
  buscarPorId.mockReset()
})

describe("repos/projects — fallback e mapeamento", () => {
  it("sem Firestore configurado, cai no seed", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getProjects()).toEqual(projectsSeed)
  })

  it("em erro de consulta, cai no seed", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getProjects()).toEqual(projectsSeed)
  })

  it("mapeia a linha do banco para o shape do domínio (snake → camel, nulos → default)", async () => {
    buscarLinhas.mockResolvedValue(
      [
          {
            id: "42",
            title: "Teste",
            description: "d",
            category: "code",
            tags: null,
            cover_image: null,
            href: null,
            featured: true,
            slug: "teste",
            readme: null,
          },
        ],
    )
    const [p] = await getProjects()
    expect(p).toEqual({
      id: "42",
      title: "Teste",
      description: "d",
      category: "code",
      tags: [],
      coverImage: "",
      href: undefined,
      featured: true,
      slug: "teste",
      readme: undefined,
    })
  })
})

describe("repos/projects — getProjectBySlug", () => {
  it("encontra pelo slug na lista mapeada", async () => {
    buscarLinhas.mockResolvedValue(
      [
          { id: "1", title: "A", description: "", category: "code", tags: [], cover_image: "", featured: false, slug: "alvo" },
          { id: "2", title: "B", description: "", category: "code", tags: [], cover_image: "", featured: false, slug: "outro" },
        ],
    )
    expect((await getProjectBySlug("alvo"))?.id).toBe("1")
  })

  it("devolve undefined quando o slug não existe", async () => {
    buscarLinhas.mockResolvedValue(null) // usa o seed
    expect(await getProjectBySlug("__inexistente__")).toBeUndefined()
  })
})

describe("repos/criativo — tabela vazia cai no seed (a zona faz parte da narrativa)", () => {
  it("data vazio → seed, não lista vazia", async () => {
    buscarLinhas.mockResolvedValue([])
    expect(await getArtworks()).toEqual(artworksSeed)
  })

  it("sem Firestore → seed", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getArtworks()).toEqual(artworksSeed)
  })
})

describe("repos/dev — snippets e lab sem seed: ausência esvazia a seção", () => {
  /**
   * Contrato preservado para os dois que continuam sendo FAIXA de página: sem
   * dado, a seção some inteira e a página em volta segue de pé. Cada um tem
   * rota que trata o vazio com uma frase acionável ("adicione em /admin/…").
   */
  it("sem Firestore → [] (a seção some inteira)", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getSnippets()).toEqual([])
  })

  it("tabela vazia → [] (não inventa conteúdo)", async () => {
    buscarLinhas.mockResolvedValue([])
    expect(await getSnippets()).toEqual([])
  })
})

describe("repos/dev — devlogs cai no seed desde que ganhou rota própria", () => {
  /**
   * A exceção, e o motivo dela: com `/desenvolvedor/devlog`, ausência de dado
   * não some com uma faixa — deixa uma PÁGINA inteira vazia, o que quebra a
   * promessa de que o site funciona sem backend. O acervo versionado em
   * `src/data/dev/devlogs.ts` é o que sustenta a rota.
   *
   * O banco continua mandando: o seed só entra quando não há nada publicado.
   */
  const comoLinha = devlogsSeed.map((d) => ({ ...d, id: d.slug }))

  it("sem Firestore → seed (a rota continua de pé)", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getDevlogs()).toEqual(comoLinha)
  })

  it("tabela vazia → seed", async () => {
    buscarLinhas.mockResolvedValue([])
    expect(await getDevlogs()).toEqual(comoLinha)
  })

  it("o que está publicado ganha do arquivo — nunca se mistura", async () => {
    const rows = [{ id: "1", slug: "s", title: "t", date: "2026-01-01", summary: "", body: "", tags: [] }]
    buscarLinhas.mockResolvedValue(rows)
    expect(await getDevlogs()).toEqual(rows)
  })

  it("busca por slug atravessa o fallback", async () => {
    buscarLinhas.mockResolvedValue(null)
    const alvo = devlogsSeed[0]!
    expect((await getDevlogBySlug(alvo.slug))?.title).toBe(alvo.title)
    expect(await getDevlogBySlug("__inexistente__")).toBeUndefined()
  })
})
