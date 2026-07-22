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
    expect(idDaCarta("/poke-holo/138_hires.avif")).toBe("138")
    expect(idDaCarta("/poke-holo/TG17_hires.avif")).toBe("TG17")
    expect(idDaCarta("/poke-holo/SWSH181_hires.avif")).toBe("SWSH181")
  })

  it("extrai o ID seja qual for a extensão da face", () => {
    // Regressão: `idDaCarta` casava `.png` fixo. Quando as faces migraram para
    // AVIF, ela passou a devolver "138_hires.avif" em vez de "138" — sem erro
    // nenhum, só o foil sumindo de todas as cartas. Se alguém trocar de
    // formato outra vez, é aqui que estoura.
    for (const ext of ["png", "avif", "webp", "jpg"]) {
      expect(idDaCarta(`/poke-holo/138_hires.${ext}`), ext).toBe("138")
    }
    expect(foilDaCarta("/poke-holo/138_hires.png", "rare holo v")).toBe(
      foilDaCarta("/poke-holo/138_hires.avif", "rare holo v")
    )
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
    expect(foilDaCarta("/poke-holo/138_hires.avif", "rare holo v")).toBe(
      "/poke-holo/138_foil_holo_sunpillar_2x.webp"
    )
    expect(foilDaCarta("/poke-holo/160_hires.avif", "rare secret")).toBe(
      "/poke-holo/160_foil_etched_swsecret_2x.webp"
    )
    expect(foilDaCarta("/poke-holo/TG17_hires.avif", "rare holo vmax")).toBe(
      "/poke-holo/tg17_foil_etched_sunpillar_2x.webp"
    )
  })

  it("não aplica foil quando a variante não corresponde à raridade", () => {
    // 116 só tem foil de reverse holo; como comum, não deve receber nada
    expect(foilDaCarta("/poke-holo/116_hires.avif", "common")).toBeUndefined()
    // 029 tem foil etched (full art); como holo clássica, não corresponde
    expect(foilDaCarta("/poke-holo/29_hires.avif", "rare holo")).toBeUndefined()
  })

  it("devolve undefined para carta sem foil no repositório", () => {
    expect(foilDaCarta("/poke-holo/33_hires.avif", "common")).toBeUndefined()
    expect(foilDaCarta("/poke-holo/21_hires.avif", "amazing rare")).toBeUndefined()
  })

  it("todo caminho devolvido existe mesmo em /public", () => {
    const casos: [string, string][] = [
      ["/poke-holo/138_hires.avif", "rare holo v"],
      ["/poke-holo/160_hires.avif", "rare secret"],
      ["/poke-holo/250_hires.avif", "rare ultra"],
      ["/poke-holo/SWSH181_hires.avif", "rare ultra"],
      ["/poke-holo/271_hires.avif", "rare holo vmax"],
      ["/poke-holo/TG05_hires.avif", "trainer gallery rare holo"],
      ["/poke-holo/TG17_hires.avif", "rare holo vmax"],
      ["/poke-holo/49_hires.avif", "reverse holo"],
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
