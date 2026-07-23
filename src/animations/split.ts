/**
 * Split de texto para reveals (por palavra ou caractere), SSR-safe.
 *
 * Determinístico e puro: o mesmo texto dá o mesmo array no servidor e no
 * cliente, então o markup casa e a hidratação não reclama. Devolver os espaços
 * como tokens (em `toWords`) preserva a quebra de linha natural quando cada
 * palavra vira um `inline-block` animável.
 *
 * A responsabilidade de acessibilidade fica em quem renderiza: os pedaços são
 * decorativos (`aria-hidden`) dentro de um elemento com o texto real no
 * `aria-label` — senão o leitor de tela soletra caractere a caractere.
 */

/** Palavras + espaços como tokens separados (o espaço é `" "`). */
export function toWords(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0)
}

/** Caracteres, incluindo espaços (renderizar com `white-space: pre`). */
export function toChars(text: string): string[] {
  return Array.from(text)
}

/** `true` se o token é só espaço em branco — não anima, só ocupa. */
export function isSpace(token: string): boolean {
  return /^\s+$/.test(token)
}
