/**
 * export-tokens.mjs — gera os tokens exportáveis a partir da
 * fonte única `src/design-system/tokens.ts`.
 *
 * Saídas em /public:
 *   - design-tokens.json         → formato W3C DTCG ($value/$type)
 *   - design-tokens.figma.json   → formato Figma Tokens Studio
 *
 * Uso: npm run tokens:export
 * (usa tsx-free import via data-URI transpile simples: lemos o TS
 *  e reexecutamos os literais — como o tokens.ts é só objetos const,
 *  importamos via jiti-less: usamos regex-free `import()` com loader.)
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

// Importa a fonte TS. Node 20+ não roda .ts direto; então mantemos
// um espelho .mjs mínimo NÃO — em vez disso lemos o módulo compilado
// se existir, senão usamos import dinâmico com --experimental-strip-types
// (Node 22.6+). Fallback: instrua o usuário a rodar com tsx.
let tokens
try {
  const mod = await import(pathToFileURL(resolve(root, "src/design-system/tokens.ts")).href)
  tokens = mod.default ?? mod.tokens
} catch (err) {
  console.error(
    "\n[export-tokens] Não foi possível importar tokens.ts diretamente.\n" +
    "Rode com Node 22.6+ (strip types) ou via tsx:\n" +
    "  npx tsx scripts/export-tokens.mjs\n"
  )
  throw err
}

/* ---------- W3C DTCG ---------- */
const isColorGroup = (v) => typeof v === "object" && v !== null
function toDTCG(node, type) {
  if (typeof node === "string") return { $value: node, $type: type }
  const out = {}
  for (const [k, v] of Object.entries(node)) out[k] = toDTCG(v, type)
  return out
}

const dtcg = {
  color: toDTCG(tokens.color, "color"),
  spacing: toDTCG(tokens.spacing, "dimension"),
  radius: toDTCG(tokens.radius, "dimension"),
  borderWidth: toDTCG(tokens.borderWidth, "dimension"),
  shadow: toDTCG(tokens.shadow, "shadow"),
  elevation: toDTCG(tokens.elevation, "shadow"),
  opacity: toDTCG(tokens.opacity, "number"),
  blur: toDTCG(tokens.blur, "dimension"),
  zIndex: toDTCG(tokens.zIndex, "number"),
  fontFamily: toDTCG(tokens.typography.family, "fontFamily"),
  fontSize: toDTCG(tokens.typography.size, "dimension"),
  lineHeight: toDTCG(tokens.typography.lineHeight, "number"),
  fontWeight: toDTCG(tokens.typography.weight, "fontWeight"),
  letterSpacing: toDTCG(tokens.typography.tracking, "dimension"),
  duration: toDTCG(tokens.motion.duration, "duration"),
  easing: toDTCG(tokens.motion.ease, "cubicBezier"),
  breakpoint: toDTCG(tokens.breakpoint, "dimension"),
}

/* ---------- Figma Tokens Studio ---------- */
function toFigma(node, type) {
  if (typeof node === "string") return { value: node, type }
  const out = {}
  for (const [k, v] of Object.entries(node)) out[k] = toFigma(v, type)
  return out
}
const figma = {
  color: toFigma(tokens.color, "color"),
  spacing: toFigma(tokens.spacing, "spacing"),
  borderRadius: toFigma(tokens.radius, "borderRadius"),
  borderWidth: toFigma(tokens.borderWidth, "borderWidth"),
  boxShadow: toFigma(tokens.shadow, "boxShadow"),
  opacity: toFigma(tokens.opacity, "opacity"),
  fontSizes: toFigma(tokens.typography.size, "fontSizes"),
  fontFamilies: toFigma(tokens.typography.family, "fontFamilies"),
  fontWeights: toFigma(tokens.typography.weight, "fontWeights"),
  lineHeights: toFigma(tokens.typography.lineHeight, "lineHeights"),
  letterSpacing: toFigma(tokens.typography.tracking, "letterSpacing"),
}

const outDir = resolve(root, "public")
mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, "design-tokens.json"), JSON.stringify(dtcg, null, 2))
writeFileSync(resolve(outDir, "design-tokens.figma.json"), JSON.stringify(figma, null, 2))

console.log("[export-tokens] ✓ public/design-tokens.json (W3C DTCG)")
console.log("[export-tokens] ✓ public/design-tokens.figma.json (Figma Tokens Studio)")
