import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * Fecha a cobertura de lib/repos: tools (leitor cacheado com fallback ao
 * seed + mapeamento próprio) e messages (leitura do inbox do admin, sem
 * cache, com guarda de configuração).
 */

// ---- controle compartilhado dos mocks ----
const { cfg, createClient, createPublicClient } = vi.hoisted(() => ({
  cfg: { configured: true },
  createClient: vi.fn(),
  createPublicClient: vi.fn(),
}))

vi.mock("next/cache", () => ({ unstable_cache: <T>(fn: T) => fn }))
vi.mock("@/lib/supabase/public", () => ({ createPublicClient }))
vi.mock("@/lib/supabase/server", () => ({ createClient }))
vi.mock("@/lib/supabase/config", () => ({
  // getter: o binding vivo em messages.ts lê o valor atual a cada chamada
  get isSupabaseConfigured() {
    return cfg.configured
  },
}))

/**
 * Fake do client. O client NÃO é thenable (senão `mockResolvedValue`, que faz
 * Promise.resolve(client), o adotaria como thenable e resolveria para o result
 * em vez do próprio client). Só o query builder de `.from()` é thenable — é ele
 * que o `await` da consulta consome.
 */
function fakeClient(result: { data: unknown; error: unknown }) {
  const q = {
    select: () => q,
    eq: () => q,
    order: () => q,
    then: (resolve: (r: typeof result) => unknown) => resolve(result),
  }
  return { from: () => q }
}

const { getTools } = await import("@/lib/repos/tools")
const { listContactMessages } = await import("@/lib/repos/messages")
const { tools: toolsSeed } = await import("@/data/tools")

beforeEach(() => {
  createPublicClient.mockReset()
  createClient.mockReset()
  cfg.configured = true
})

describe("repos/tools", () => {
  it("sem Supabase → seed", async () => {
    createPublicClient.mockReturnValue(null)
    expect(await getTools()).toEqual(toolsSeed)
  })

  it("erro → seed", async () => {
    createPublicClient.mockReturnValue(fakeClient({ data: null, error: { message: "x" } }))
    expect(await getTools()).toEqual(toolsSeed)
  })

  it("mapeia a linha (snake→camel; stack null → []; urls nulas → undefined)", async () => {
    createPublicClient.mockReturnValue(
      fakeClient({
        data: [
          {
            id: "9", name: "CLI", description: "d", type: "cli",
            stack: null, emoji: "🛠", demo_url: null, github_url: "gh",
          },
        ],
        error: null,
      }),
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
  it("sem Supabase configurado → [] (nem cria client)", async () => {
    cfg.configured = false
    expect(await listContactMessages()).toEqual([])
    expect(createClient).not.toHaveBeenCalled()
  })

  it("erro na consulta → []", async () => {
    createClient.mockResolvedValue(fakeClient({ data: null, error: { message: "rls" } }))
    expect(await listContactMessages()).toEqual([])
  })

  it("sucesso devolve as linhas como estão", async () => {
    const rows = [
      { id: "2", name: "B", email: "b@x", message: "oi", created_at: "2026-02-01" },
      { id: "1", name: "A", email: "a@x", message: "olá", created_at: "2026-01-01" },
    ]
    createClient.mockResolvedValue(fakeClient({ data: rows, error: null }))
    expect(await listContactMessages()).toEqual(rows)
  })
})
