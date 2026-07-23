export type Treatment =
  | "glitch"
  | "rainbow"
  | "letter"
  | "3d"
  | "3d-deep"
  | "chrome"
  | "neon"
  | "offset"
  | "outline"

/**
 * Mapeamento treatment → classe(s) do {@link GlitchTitle}.
 *
 * Vive num módulo puro (sem JSX) de propósito: é a lógica que um typo silencioso
 * — trocar `kfx-neon` por `kfx-neom` — quebraria sem erro, e assim pode ser
 * testada em Node sem transform de JSX (ver `tests/glitch-title.test.ts`).
 *
 * `letter` é o tratamento por omissão. Os `kfx-*` vêm do catálogo Comic FX
 * (comic-fx.css), escolhidos por dimensão.
 */
export const TREATMENT_CLASS: Record<Treatment, string> = {
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
