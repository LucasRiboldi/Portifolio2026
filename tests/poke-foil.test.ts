import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  foilDaCarta,
  idDaCarta,
  normalizaId,
} from "@/components/spiderverse/poke-foil"

const PUBLIC_POKE = join(process.cwd(), "public", "poke-holo")

describe("nomenclatura dos foils do poke-holo", () => {
  it("extrai o ID do caminho da carta", () => {
    expect(idDaCarta("/poke-holo/138_hires.png")).toBe("138")
    expect(idDaCarta("/poke-holo/TG17_hires.png")).toBe("TG17")
    expect(idDaCarta("/poke-holo/SWSH181_hires.png")).toBe("SWSH181")
  })

  it("regra 1: id numérico é preenchido com zeros até 3 dígitos", () => {
    expect(normalizaId("49")).toBe("049")
    expect(normalizaId("29")).toBe("029")
    expect(normalizaId("138")).toBe("138")
  })

  it("regra 2: prefixo TG/SV é mantido, em minúsculo", () => {
    expect(normalizaId("TG17")).toBe("tg17")
    expect(normalizaId("SV023")).toBe("sv023")
  })

  it("regra 3: prefixo SWSH é descartado", () => {
    expect(normalizaId("SWSH181")).toBe("181")
    expect(normalizaId("SWSH214")).toBe("214")
  })

  it("casa os exemplos citados na especificação", () => {
    expect(foilDaCarta("/poke-holo/138_hires.png", "rare holo v")).toBe(
      "/poke-holo/138_foil_holo_sunpillar_2x.webp"
    )
    expect(foilDaCarta("/poke-holo/160_hires.png", "rare secret")).toBe(
      "/poke-holo/160_foil_etched_swsecret_2x.webp"
    )
    expect(foilDaCarta("/poke-holo/TG17_hires.png", "rare holo vmax")).toBe(
      "/poke-holo/tg17_foil_etched_sunpillar_2x.webp"
    )
  })

  it("não aplica foil quando a variante não corresponde à raridade", () => {
    // 116 só tem foil de reverse holo; como comum, não deve receber nada
    expect(foilDaCarta("/poke-holo/116_hires.png", "common")).toBeUndefined()
    // 029 tem foil etched (full art); como holo clássica, não corresponde
    expect(foilDaCarta("/poke-holo/29_hires.png", "rare holo")).toBeUndefined()
  })

  it("devolve undefined para carta sem foil no repositório", () => {
    expect(foilDaCarta("/poke-holo/33_hires.png", "common")).toBeUndefined()
    expect(foilDaCarta("/poke-holo/21_hires.png", "amazing rare")).toBeUndefined()
  })

  it("todo caminho devolvido existe mesmo em /public", () => {
    const casos: [string, string][] = [
      ["/poke-holo/138_hires.png", "rare holo v"],
      ["/poke-holo/160_hires.png", "rare secret"],
      ["/poke-holo/250_hires.png", "rare ultra"],
      ["/poke-holo/SWSH181_hires.png", "rare ultra"],
      ["/poke-holo/271_hires.png", "rare holo vmax"],
      ["/poke-holo/TG05_hires.png", "trainer gallery rare holo"],
      ["/poke-holo/TG17_hires.png", "rare holo vmax"],
      ["/poke-holo/49_hires.png", "reverse holo"],
    ]
    for (const [img, raridade] of casos) {
      const foil = foilDaCarta(img, raridade)
      expect(foil, `${img} (${raridade}) devia ter foil`).toBeDefined()
      expect(
        existsSync(join(process.cwd(), "public", foil!.replace(/^\/poke-holo\//, "poke-holo/"))),
        `arquivo ausente: ${foil}`
      ).toBe(true)
    }
  })

  it("o manifesto não inventa arquivos: todo foil derivável existe no disco", () => {
    // varre os .webp reais e confirma que o padrão os descreve
    const arquivos = readdirSync(PUBLIC_POKE).filter(
      (f) => f.includes("_foil_") && f.endsWith("_2x.webp") && !f.includes("(1)")
    )
    expect(arquivos.length).toBeGreaterThan(30)
    for (const f of arquivos) {
      expect(f, `fora do padrão: ${f}`).toMatch(
        /^[a-z0-9]+_foil_(etched|holo)_(sunpillar|swsecret|reverse|rainbow)_2x\.webp$/
      )
    }
  })
})
