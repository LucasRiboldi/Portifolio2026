/**
 * check-tokens.mjs — garante que tokens.ts e tokens.css estão em sincronia.
 *
 * Verifica se cada valor de COR primitivo declarado em src/design-system/tokens.ts
 * aparece em src/styles/tokens.css. Sai com código 1 se algum estiver faltando.
 *
 * Uso: npm run tokens:check  (rodável no CI)
 */

import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const { default: tokens } = await import(pathToFileURL(resolve(root, "src/design-system/tokens.ts")).href)
const css = readFileSync(resolve(root, "src/styles/tokens.css"), "utf8").toLowerCase()

const missing = []
for (const [scale, steps] of Object.entries(tokens.color)) {
  for (const [step, hex] of Object.entries(steps)) {
    if (!css.includes(String(hex).toLowerCase())) {
      missing.push(`color.${scale}.${step} = ${hex}`)
    }
  }
}

if (missing.length) {
  console.error(`\n[check-tokens] ✗ ${missing.length} valor(es) em tokens.ts ausente(s) em tokens.css:`)
  for (const m of missing) console.error("  - " + m)
  console.error("\nAtualize src/styles/tokens.css para casar com tokens.ts.\n")
  process.exit(1)
}

console.log("[check-tokens] ✓ tokens.ts e tokens.css estão sincronizados (cores).")
