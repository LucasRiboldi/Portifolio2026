import { describe, expect, it } from "vitest"

import {
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToHsl,
  hexToRgb,
  luminance,
  wcagLevel,
} from "@/design-system/color-utils"

describe("hexToRgb", () => {
  it("converte #rrggbb", () => {
    expect(hexToRgb("#ff2d95")).toEqual({ r: 255, g: 45, b: 149 })
    expect(hexToRgb("#282a36")).toEqual({ r: 40, g: 42, b: 54 })
  })

  it("expande a forma curta #rgb", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb("#08f")).toEqual({ r: 0, g: 136, b: 255 })
  })

  it("aceita sem # e com espaços", () => {
    expect(hexToRgb("  ff2d95 ")).toEqual({ r: 255, g: 45, b: 149 })
  })

  it("devolve null em entrada inválida, sem NaN silencioso", () => {
    // O ponto: uma tabela de token com NaN é pior que uma com traço.
    expect(hexToRgb("#zzzzzz")).toBeNull()
    expect(hexToRgb("#ff")).toBeNull()
    expect(hexToRgb("")).toBeNull()
    expect(hexToRgb("var(--sv-magenta)")).toBeNull()
  })
})

describe("hexToHsl", () => {
  it("acerta as âncoras conhecidas", () => {
    expect(hexToHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 100 })
    expect(hexToHsl("#000000")).toEqual({ h: 0, s: 0, l: 0 })
    expect(hexToHsl("#ff0000")).toEqual({ h: 0, s: 100, l: 50 })
    expect(hexToHsl("#00ff00")).toEqual({ h: 120, s: 100, l: 50 })
    expect(hexToHsl("#0000ff")).toEqual({ h: 240, s: 100, l: 50 })
  })

  it("trata cinza (saturação zero) sem dividir por zero", () => {
    expect(hexToHsl("#808080")).toEqual({ h: 0, s: 0, l: 50 })
  })

  it("converte um acento real do projeto", () => {
    // --sv-cyan #00e5ff
    expect(hexToHsl("#00e5ff")).toEqual({ h: 186, s: 100, l: 50 })
  })
})

describe("luminance / contrastRatio", () => {
  it("dá 21:1 entre preto e branco — o teto da escala", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5)
  })

  it("dá 1:1 para a mesma cor", () => {
    expect(contrastRatio("#ff2d95", "#ff2d95")).toBeCloseTo(1, 5)
  })

  it("é simétrico — a ordem dos argumentos não importa", () => {
    const a = contrastRatio("#282a36", "#f8f8f2")
    const b = contrastRatio("#f8f8f2", "#282a36")
    expect(a).toBeCloseTo(b!, 10)
  })

  it("confirma o achado documentado no guia do _Dev", () => {
    // --d-comment sobre --d-bg reprova em texto normal: é o que o guia afirma.
    const r = contrastRatio("#6272a4", "#282a36")!
    expect(r).toBeCloseTo(3.03, 2)
    expect(wcagLevel(r)).toBe("AA-large")
  })

  it("confirma o achado documentado no guia do Anfitrião", () => {
    // --dp-gold sobre --dp-paper reprova; --dp-sepia passa no papel claro e cai no escuro.
    expect(wcagLevel(contrastRatio("#9a7b28", "#e8dcbe")!)).toBe("fail")
    expect(wcagLevel(contrastRatio("#7a5c34", "#e8dcbe")!)).toBe("AA")
    expect(wcagLevel(contrastRatio("#7a5c34", "#ded0ac")!)).toBe("AA-large")
  })

  it("devolve null se alguma cor for inválida", () => {
    expect(contrastRatio("#zzz", "#fff")).toBeNull()
    expect(luminance("nope")).toBeNull()
  })
})

describe("wcagLevel", () => {
  it("respeita os limiares do WCAG 2", () => {
    expect(wcagLevel(21)).toBe("AAA")
    expect(wcagLevel(7)).toBe("AAA")
    expect(wcagLevel(6.99)).toBe("AA")
    expect(wcagLevel(4.5)).toBe("AA")
    expect(wcagLevel(4.49)).toBe("AA-large")
    expect(wcagLevel(3)).toBe("AA-large")
    expect(wcagLevel(2.99)).toBe("fail")
    expect(wcagLevel(1)).toBe("fail")
  })
})

describe("formatação para as tabelas", () => {
  it("formata RGB e HSL", () => {
    expect(formatRgb("#ff2d95")).toBe("255, 45, 149")
    expect(formatHsl("#00e5ff")).toBe("186, 100%, 50%")
  })

  it("degrada para traço em vez de quebrar a tabela", () => {
    expect(formatRgb("var(--x)")).toBe("—")
    expect(formatHsl("")).toBe("—")
  })
})
