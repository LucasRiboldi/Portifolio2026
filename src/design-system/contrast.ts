/** Cálculo de razão de contraste WCAG 2.x a partir de hex. */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance([r, g, b]: [number, number, number]) {
  const chan = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
}

/** Razão de contraste entre duas cores hex (1–21). */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(hexToRgb(fg))
  const l2 = luminance(hexToRgb(bg))
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail"

/** Classifica a razão para texto normal (WCAG 1.4.3). */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA"
  if (ratio >= 4.5) return "AA"
  if (ratio >= 3) return "AA Large"
  return "Fail"
}
