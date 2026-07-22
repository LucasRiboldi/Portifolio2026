import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Os leitores públicos (`repos/projects`, `repos/criativo`, `repos/dev`)
 * partilham o padrão `publishedReader`: sem Supabase → fallback; erro → fallback;
 * sucesso → dados. O que MUDA entre eles é o fallback (seed vs. []) e o que
 * fazem com uma tabela vazia — e é justamente isso que estes testes fixam.
 *
 * `next/cache` vira passthrough (o unstable_cache só devolve a própria função)
 * e `createPublicClient` é controlado por teste para simular cada ramo.
 */
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}))

const createPublicClient = vi.fn()
vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: () => createPublicClient(),
}))

/**
 * Fake do query builder do Supabase: `from().select().eq().order().order()`
 * é encadeável e "thenable" — o `await` no fim resolve para {data, error}.
 */
function fakeClient(result: { data: unknown; error: unknown }) {
  const builder = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    then: (resolve: (r: typeof result) => unknown) => resolve(result),
  }
  return builder
}

const { getProjects, getProjectBySlug } = await import("@/lib/repos/projects")
const { getArtworks } = await import("@/lib/repos/criativo")
const { getDevlogs } = await import("@/lib/repos/dev")
const { projects: projectsSeed } = await import("@/data/projects")
const { artworks: artworksSeed } = await import("@/data/criativo-zones")

beforeEach(() => createPublicClient.mockReset())

describe("repos/projects — fallback e mapeamento", () => {
  it("sem Supabase configurado, cai no seed", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getProjects()).toEqual(projectsSeed)
  })

  it("em erro de consulta, cai no seed", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: null, error: { message: "boom" } }))
    expect(await getProjects()).toEqual(projectsSeed)
  })

  it("mapeia a linha do banco para o shape do domínio (snake → camel, nulos → default)", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [
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
        error: null,
      }),
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
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [
          { id: "1", title: "A", description: "", category: "code", tags: [], cover_image: "", featured: false, slug: "alvo" },
          { id: "2", title: "B", description: "", category: "code", tags: [], cover_image: "", featured: false, slug: "outro" },
        ],
        error: null,
      }),
    )
    expect((await getProjectBySlug("alvo"))?.id).toBe("1")
  })

  it("devolve undefined quando o slug não existe", async () => {
    createPublicClient.mockReturnValue(null) // usa o seed
    expect(await getProjectBySlug("__inexistente__")).toBeUndefined()
  })
})

describe("repos/criativo — tabela vazia cai no seed (a zona faz parte da narrativa)", () => {
  it("data vazio → seed, não lista vazia", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: [], error: null }))
    expect(await getArtworks()).toEqual(artworksSeed)
  })

  it("sem Supabase → seed", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getArtworks()).toEqual(artworksSeed)
  })
})

describe("repos/dev — sem seed: ausência esvazia a seção", () => {
  it("sem Supabase → [] (a seção some inteira)", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getDevlogs()).toEqual([])
  })

  it("erro → []", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: null, error: { message: "x" } }))
    expect(await getDevlogs()).toEqual([])
  })

  it("sucesso devolve as linhas como estão", async () => {
    const rows = [{ id: "1", slug: "s", title: "t", date: "2026-01-01", summary: "", body: "", tags: [] }]
    createPublicClient.mockReturnValue(fakeClient({ data: rows, error: null }))
    expect(await getDevlogs()).toEqual(rows)
  })
})
