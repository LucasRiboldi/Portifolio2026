import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Fecha a cobertura de lib/repos: tools (leitor cacheado com fallback ao
 * seed + mapeamento próprio) e messages (leitura do inbox do admin, sem
 * cache, com guarda de configuração).
 */

// ---- controle compartilhado dos mocks ----
const { buscarLinhas } = vi.hoisted(() => ({ buscarLinhas: vi.fn() }))

vi.mock("next/cache", () => ({ unstable_cache: <T>(fn: T) => fn }))
vi.mock("@/lib/firebase/query", () => ({ buscarLinhas, buscarPorId: vi.fn() }))

const { getTools } = await import("@/lib/repos/tools")
const { listContactMessages } = await import("@/lib/repos/messages")
const { tools: toolsSeed } = await import("@/data/tools")

beforeEach(() => {
  buscarLinhas.mockReset()
})

describe("repos/tools", () => {
  it("sem Firestore → seed", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getTools()).toEqual(toolsSeed)
  })

  it("erro → seed", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await getTools()).toEqual(toolsSeed)
  })

  it("mapeia a linha (snake→camel; stack null → []; urls nulas → undefined)", async () => {
    buscarLinhas.mockResolvedValue(
      [
          {
            id: "9", name: "CLI", description: "d", type: "cli",
            stack: null, emoji: "🛠", demo_url: null, github_url: "gh",
          },
        ],
    )
    expect(await getTools()).toEqual([
      {
        id: "9", name: "CLI", description: "d", type: "cli",
        stack: [], emoji: "🛠", demoUrl: undefined, githubUrl: "gh",
      },
    ])
  })
})

describe("repos/messages — inbox do admin", () => {
  it("sem Firestore configurado → []", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await listContactMessages()).toEqual([])
  })

  it("erro na consulta → []", async () => {
    buscarLinhas.mockResolvedValue(null)
    expect(await listContactMessages()).toEqual([])
  })

  it("sucesso devolve as linhas como estão", async () => {
    const rows = [
      { id: "2", name: "B", email: "b@x", message: "oi", created_at: "2026-02-01" },
      { id: "1", name: "A", email: "a@x", message: "olá", created_at: "2026-01-01" },
    ]
    buscarLinhas.mockResolvedValue(rows)
    expect(await listContactMessages()).toEqual(rows)
  })
})
