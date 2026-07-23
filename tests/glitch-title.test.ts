import { describe, it, expect } from "vitest"

import { TREATMENT_CLASS, type Treatment } from "@/components/comic/glitch-title-classes"

/**
 * Trava o mapeamento treatment→classe do GlitchTitle (CR-M7).
 *
 * O componente escolhe classes por `treatment`; um typo silencioso (ex.: trocar
 * `kfx-neon` por `kfx-neom`) perderia o efeito sem erro. Testamos o módulo puro
 * `glitch-title-classes` — o próprio componente o consome, então travar o mapa
 * trava o componente, sem precisar de transform de JSX no ambiente de nó.
 */
const EXPECTED: Record<Treatment, string> = {
  glitch: "k-glitch",
  rainbow: "k-letter-rainbow",
  letter: "k-letter",
  "3d": "k-3d",
  "3d-deep": "k-3d k-3d--deep",
  chrome: "kfx-chrome",
  neon: "kfx-neon",
  offset: "kfx-offset",
  outline: "kfx-outline-double",
}

describe("GlitchTitle · mapeamento treatment→classe", () => {
  it("cada tratamento mapeia para a classe esperada", () => {
    expect(TREATMENT_CLASS).toEqual(EXPECTED)
  })

  it("cobre todos os tratamentos, sem sobra nem falta", () => {
    expect(Object.keys(TREATMENT_CLASS).sort()).toEqual(Object.keys(EXPECTED).sort())
  })

  it("os efeitos do catálogo Comic FX usam o namespace kfx-", () => {
    for (const t of ["chrome", "neon", "offset", "outline"] as Treatment[]) {
      expect(TREATMENT_CLASS[t]).toMatch(/^kfx-/)
    }
  })
})
