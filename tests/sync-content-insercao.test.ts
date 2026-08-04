import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Comportamento de `syncNewContent`, exercitado de verdade.
 *
 * `conteudo-publicavel.test.ts` cobre a ESTRUTURA do arquivo — que toda tabela
 * está no sync e dentro do isolamento por `tentar`. Ele lê o fonte como texto,
 * então continuaria verde se a lógica de inserção fosse trocada por outra
 * errada. Este arquivo cobre o que aquele não pode: o que é gravado.
 *
 * Escrito junto da refatoração que dobrou `projects` e `tools` dentro
 * de `inserirFaltantes` (31/07/2026). Sem ele o refactor teria como única
 * evidência "os 535 testes continuam passando" — e nenhum deles tocava nisto.
 */

const { listarCampos, gravarLote, atualizarOnde } = vi.hoisted(() => ({
  listarCampos: vi.fn(),
  gravarLote: vi.fn(),
  atualizarOnde: vi.fn(),
}))

vi.mock("@/lib/firebase/collection", async () => {
  // `idNatural` é lógica pura e faz parte do que se quer verificar (o id do
  // documento precisa sair do slug), então usa-se o real.
  const real = await vi.importActual<typeof import("@/lib/firebase/collection")>(
    "@/lib/firebase/collection",
  )
  return { ...real, listarCampos, gravarLote, atualizarOnde }
})

const { syncNewContent } = await import("@/lib/admin/sync-content")
const { projects } = await import("@/data/projects")
const { prophetTutorials } = await import("@/data/prophet-arcano")

/** Captura o que foi gravado numa tabela específica. */
function gravadosEm(tabela: string) {
  const chamada = gravarLote.mock.calls.find((c) => c[0] === tabela)
  return chamada ? (chamada[1] as { id?: string; dados: Record<string, unknown> }[]) : []
}

beforeEach(() => {
  listarCampos.mockReset()
  gravarLote.mockReset()
  atualizarOnde.mockReset()
  // Banco vazio: tudo do seed conta como faltante.
  listarCampos.mockResolvedValue([])
  gravarLote.mockResolvedValue(0)
  atualizarOnde.mockResolvedValue(0)
})

describe("syncNewContent — destaque da home", () => {
  it("desmarca os destaques antigos quando um featured entra", async () => {
    await syncNewContent()

    const temFeatured = projects.some((p) => p.featured)
    expect(temFeatured).toBe(true) // guarda: o seed precisa ter um destaque
    expect(atualizarOnde).toHaveBeenCalledWith(
      "projects",
      { campo: "featured", valor: true },
      { featured: false },
    )
  })

  it("o destaque vai para o topo com sort -1; o resto entra em fila", async () => {
    await syncNewContent()

    const gravados = gravadosEm("projects")
    const destaque = gravados.find((d) => d.dados.featured === true)
    expect(destaque?.dados.sort).toBe(-1)

    const comuns = gravados.filter((d) => d.dados.featured !== true)
    expect(comuns.length).toBeGreaterThan(0)
    for (const c of comuns) expect(c.dados.sort as number).toBeGreaterThanOrEqual(1)
  })

  it("não mexe em destaque quando nada de featured entra", async () => {
    // Todos os projetos já existem → nada a inserir → nenhum efeito colateral.
    listarCampos.mockImplementation(async (tabela: string) =>
      tabela === "projects" ? projects.map((p) => ({ title: p.title, sort: 0 })) : [],
    )

    await syncNewContent()

    expect(atualizarOnde).not.toHaveBeenCalled()
    expect(gravadosEm("projects")).toHaveLength(0)
  })
})

describe("syncNewContent — identidade dos documentos", () => {
  it("tutorial é gravado com o slug como id", async () => {
    await syncNewContent()

    const gravados = gravadosEm("prophet_tutorials")
    expect(gravados.length).toBe(prophetTutorials.length)
    for (const g of gravados) expect(g.id).toBe(g.dados.slug)
  })

  it("tool não recebe id natural — o Firestore gera", async () => {
    await syncNewContent()

    for (const g of gravadosEm("tools")) expect(g.id).toBeUndefined()
  })
})

describe("syncNewContent — relatório", () => {
  it("tutoriais aparecem pelo título, não pelo slug", async () => {
    const r = await syncNewContent()

    const titulos = prophetTutorials.map((t) => t.title)
    expect(r.inseridos.prophet_tutorials).toEqual(titulos)
    // O slug seria o valor "natural" a vazar aqui se o rótulo se perdesse.
    for (const t of prophetTutorials) expect(r.inseridos.prophet_tutorials).not.toContain(t.slug)
  })

  it("uma tabela quebrada não impede as outras", async () => {
    listarCampos.mockImplementation(async (tabela: string) => {
      if (tabela === "projects") throw new Error("índice ausente")
      return []
    })

    const r = await syncNewContent()

    expect(r.falhas.projects).toContain("índice ausente")
    expect(r.inseridos.projects).toEqual([])
    expect(r.inseridos.tools?.length ?? 0).toBeGreaterThan(0)
  })
})
