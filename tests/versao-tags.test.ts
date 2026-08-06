import { describe, it, expect, vi } from "vitest"

/**
 * A ORDENAÇÃO DAS TAGS — e o defeito que ela existe para impedir.
 *
 * O selo de versão do `/desenvolvedor` anuncia publicamente qual corte está no
 * ar. Em 06/08/2026 ele mentiu: havia release da v0.2.0 e tag da v0.3.0, a
 * release ganhava, e o site mostrou v0.2.0 com a v0.3.0 em produção. A ordem
 * passou a ser tag → release → package.json, porque a tag acompanha todo push
 * por regra e a release é passo manual.
 *
 * Trocada a ordem, o risco mudou de lugar: passou a depender de "a tag mais
 * recente", e a API do GitHub **não documenta a ordem** de `/tags`. Por isso a
 * escolha é por comparação numérica aqui, e por isso este arquivo existe.
 *
 * `next/cache` vira passthrough — o módulo só é importado pela comparação, mas
 * arrasta o `unstable_cache` no topo.
 */
vi.mock("next/cache", () => ({ unstable_cache: <T>(fn: T) => fn }))

const { maisAlta, partesSemver } = await import("@/lib/repos/tech-feed")

/** Ordena como o leitor real ordena: descarta o que não é semver, depois compara. */
const escolher = (tags: string[]) =>
  tags.filter((t) => partesSemver(t)[0] >= 0).sort(maisAlta)[0]

describe("qual tag o selo escolhe", () => {
  it("a maior vence, independentemente da ordem em que a API devolver", () => {
    expect(escolher(["v0.2.0", "v0.3.0"])).toBe("v0.3.0")
    expect(escolher(["v0.3.0", "v0.2.0"])).toBe("v0.3.0")
  })

  it("0.10.0 ganha de 0.9.0 — o caso que a comparação por texto erra", () => {
    // Em ordem alfabética "0.10.0" < "0.9.0", e o selo regrediria sozinho na
    // décima versão menor. É o motivo de a comparação ser número a número.
    expect(escolher(["v0.9.0", "v0.10.0"])).toBe("v0.10.0")
    expect(escolher(["v0.9.9", "v0.10.1"])).toBe("v0.10.1")
    expect(escolher(["v1.9.0", "v1.10.0", "v1.2.0"])).toBe("v1.10.0")
  })

  it("compara os três níveis, não só o primeiro", () => {
    expect(escolher(["v1.0.0", "v1.0.1"])).toBe("v1.0.1")
    expect(escolher(["v1.0.9", "v1.1.0"])).toBe("v1.1.0")
    expect(escolher(["v2.0.0", "v1.99.99"])).toBe("v2.0.0")
  })

  it("tag solta nunca ganha de uma versão", () => {
    // Uma tag de trabalho no repositório não pode virar o número que o site
    // anuncia ao público.
    expect(escolher(["backup-antes-da-migracao", "v0.3.0"])).toBe("v0.3.0")
    expect(escolher(["preview", "v0.1.0", "wip"])).toBe("v0.1.0")
  })

  it("sem nenhuma tag de versão, não escolhe nada — quem decide é o leitor", () => {
    // Devolver `undefined` é o que faz o leitor cair na release e depois no
    // package.json, em vez de mostrar "preview" no hero.
    expect(escolher(["preview", "wip"])).toBeUndefined()
    expect(escolher([])).toBeUndefined()
  })

  it("aceita a tag com e sem o `v`", () => {
    expect(partesSemver("v1.2.3")).toEqual([1, 2, 3])
    expect(partesSemver("1.2.3")).toEqual([1, 2, 3])
    expect(partesSemver("naoEhVersao")).toEqual([-1, -1, -1])
  })
})
