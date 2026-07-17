/**
 * Conversão e medida de cor — funções puras.
 *
 * As tabelas de token precisam mostrar cada cor em HEX, RGB e HSL, mais o
 * contraste sobre o fundo do realm. Digitar isso à mão em dezenas de linhas
 * é como a documentação começa a mentir: muda-se o HEX e o RGB ao lado
 * continua o antigo, para sempre. Aqui deriva-se tudo da única fonte — o HEX
 * do token — e o que estiver errado, está errado em todo lugar ao mesmo tempo.
 */

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface Hsl {
  h: number
  s: number
  l: number
}

/** Aceita #rgb e #rrggbb. Devolve null em entrada inválida, em vez de NaN silencioso. */
export function hexToRgb(hex: string): Rgb | null {
  const s = hex.trim().replace(/^#/, "")
  const full = s.length === 3 ? s.split("").map(c => c + c).join("") : s
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  const l = (max + min) / 2

  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) }

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hexToHsl(hex: string): Hsl | null {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHsl(rgb) : null
}

/** Luminância relativa (WCAG 2). */
export function luminance(hex: string): number | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const chan = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * chan(rgb.r) + 0.7152 * chan(rgb.g) + 0.0722 * chan(rgb.b)
}

/** Razão de contraste WCAG 2 entre duas cores. 1 = idênticas, 21 = preto/branco. */
export function contrastRatio(a: string, b: string): number | null {
  const la = luminance(a)
  const lb = luminance(b)
  if (la === null || lb === null) return null
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type WcagLevel = "AAA" | "AA" | "AA-large" | "fail"

/**
 * Veredito WCAG 2 para texto.
 * ≥7 AAA · ≥4.5 AA · ≥3 só título grande (≥24px, ou ≥18.66px bold) · resto reprova.
 */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA-large"
  return "fail"
}

/** Formatações prontas para as tabelas de token. */
export function formatRgb(hex: string): string {
  const c = hexToRgb(hex)
  return c ? `${c.r}, ${c.g}, ${c.b}` : "—"
}

export function formatHsl(hex: string): string {
  const c = hexToHsl(hex)
  return c ? `${c.h}, ${c.s}%, ${c.l}%` : "—"
}
