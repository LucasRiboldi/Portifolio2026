import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Repos de configuração/edição do site. Ao contrário dos leitores de lista
 * (cobertos em repos-readers), aqui a lógica interessante é o MERGE: DB por
 * cima de um default, campo a campo — e a distinção sutil entre `||` (string
 * vazia cai no default) e `??` (só null/undefined cai). É aí que mora o bug,
 * e é isso que estes testes fixam.
 *
 * next/cache vira passthrough e createPublicClient é controlado por teste.
 */
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: T) => fn,
}))

const createPublicClient = vi.fn()
vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: () => createPublicClient(),
}))

/**
 * Fake do query builder: encadeável e "thenable". `maybeSingle()` também
 * resolve para {data, error} — o mesmo objeto serve para list e single.
 */
function fakeClient(result: { data: unknown; error: unknown }) {
  const builder = {
    from: () => builder,
    select: () => builder,
    eq: () => builder,
    order: () => builder,
    maybeSingle: () => builder,
    then: (resolve: (r: typeof result) => unknown) => resolve(result),
  }
  return builder
}

const { getSiteConfig } = await import("@/lib/repos/site-config")
const { getRealmSettings } = await import("@/lib/repos/realms")
const { getPageContent } = await import("@/lib/repos/page-content")
const { getProphetAbout } = await import("@/lib/repos/prophet")
const { siteConfig: siteSeed } = await import("@/constants/site")
const { REALM_ORDER, DEFAULT_REALM } = await import("@/lib/realms")
const { pageDefaults } = await import("@/lib/admin/pages-catalog")

beforeEach(() => createPublicClient.mockReset())

describe("repos/site-config", () => {
  it("sem Supabase → seed estático", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getSiteConfig()).toEqual(siteSeed)
  })

  it("erro → seed", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: null, error: { message: "x" } }))
    expect(await getSiteConfig()).toEqual(siteSeed)
  })

  it("mapeia a linha (og_* nulos viram undefined)", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: {
          name: "N", title: "T", description: "D", github: "g", linkedin: "l",
          email: "e", location: "loc", og_title: null, og_description: "od",
        },
        error: null,
      }),
    )
    expect(await getSiteConfig()).toEqual({
      name: "N", title: "T", description: "D", github: "g", linkedin: "l",
      email: "e", location: "loc", ogTitle: undefined, ogDescription: "od",
    })
  })
})

describe("repos/realms — derivação de enabled/default", () => {
  it("sem Supabase → seed (todos na ordem do código)", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getRealmSettings()).toEqual({
      enabled: [...REALM_ORDER],
      defaultRealm: DEFAULT_REALM,
      arcaneContent: null,
    })
  })

  it("data vazio → seed", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: [], error: null }))
    expect((await getRealmSettings()).enabled).toEqual([...REALM_ORDER])
  })

  it("filtra desabilitados e ids desconhecidos; default vem da flag is_default", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [
          { id: "creative", enabled: true, is_default: false, sort: 0 },
          { id: "developer", enabled: false, is_default: false, sort: 1 },
          { id: "arcane", enabled: true, is_default: true, sort: 2, arcane_content: { m: 1 } },
          { id: "fantasma", enabled: true, is_default: false, sort: 3 },
        ],
        error: null,
      }),
    )
    const s = await getRealmSettings()
    expect(s.enabled).toEqual(["creative", "arcane"]) // developer off, fantasma inexistente
    expect(s.defaultRealm).toBe("arcane")
    expect(s.arcaneContent).toEqual({ m: 1 })
  })

  it("sem is_default marcado, o default cai no primeiro habilitado", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [
          { id: "developer", enabled: true, is_default: false, sort: 0 },
          { id: "creative", enabled: true, is_default: false, sort: 1 },
        ],
        error: null,
      }),
    )
    expect((await getRealmSettings()).defaultRealm).toBe("developer")
  })
})

describe("repos/page-content — || vs ?? no merge sobre os defaults", () => {
  const KEY = "portfolio"
  const def = pageDefaults(KEY)

  it("sem linha no banco → defaults do catálogo", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: [], error: null }))
    expect(await getPageContent(KEY)).toEqual(def)
  })

  it("title vazio cai no default (||); highlight vazio é MANTIDO (??)", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [{ key: KEY, kicker: "K novo", title: "", highlight: "", subtitle: "S nova" }],
        error: null,
      }),
    )
    const c = await getPageContent(KEY)
    expect(c.kicker).toBe("K novo") // preenchido → usa o banco
    expect(c.title).toBe(def.title) // vazio + || → default
    expect(c.highlight).toBe("") // vazio + ?? → mantém o vazio do banco
    expect(c.subtitle).toBe("S nova")
  })

  it("highlight null cai no default (??)", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [{ key: KEY, kicker: "K", title: "T", highlight: null, subtitle: "S" }],
        error: null,
      }),
    )
    expect((await getPageContent(KEY)).highlight).toBe(def.highlight)
  })
})

describe("repos/prophet — getProphetAbout (merge campo a campo com ||)", () => {
  it("sem Supabase → FALLBACK", async () => {
    createPublicClient.mockReturnValue(null)
    const a = await getProphetAbout()
    expect(a.author).toBe("Lucas Riboldi")
    expect(a.intro.length).toBeGreaterThan(0)
  })

  it("campos vazios do banco caem no FALLBACK; preenchidos são usados", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: { author: "Outro Autor", intro: "", passion: "", proposal: "Proposta X" },
        error: null,
      }),
    )
    const a = await getProphetAbout()
    expect(a.author).toBe("Outro Autor") // preenchido
    expect(a.proposal).toBe("Proposta X") // preenchido
    expect(a.intro).not.toBe("") // vazio → fallback
    expect(a.passion).not.toBe("") // vazio → fallback
  })
})
