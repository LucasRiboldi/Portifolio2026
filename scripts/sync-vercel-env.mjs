#!/usr/bin/env node
/**
 * Sincroniza as variáveis do .env.local para o Vercel (production, preview e
 * development). Só envia as que têm valor; pula vazias. Reaplica (remove+add)
 * as que já existem, para manter o Vercel espelhando o .env.local.
 *
 * Uso:
 *   node scripts/sync-vercel-env.mjs            # todos os ambientes
 *   node scripts/sync-vercel-env.mjs production # só um ambiente
 *
 * Requisitos: Vercel CLI logado (`vercel login`) e projeto linkado (.vercel/).
 */
import { readFileSync } from "node:fs"
import { spawnSync } from "node:child_process"

const ENVIRONMENTS = process.argv[2]
  ? [process.argv[2]]
  : ["production", "preview", "development"]

// Variáveis que fazem sentido no Vercel (SUPABASE_SERVICE_ROLE_KEY e afins).
const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_GITHUB_LOGIN",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
]

function parseEnv(path) {
  const out = {}
  let raw
  try {
    raw = readFileSync(path, "utf8")
  } catch {
    console.error(`✗ Não achei ${path}. Copie .env.example para .env.local e preencha.`)
    process.exit(1)
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    out[m[1]] = m[2].replace(/^["']|["']$/g, "")
  }
  return out
}

function run(args, input) {
  const r = spawnSync("vercel", args, {
    input,
    encoding: "utf8",
    shell: process.platform === "win32",
  })
  return r
}

const env = parseEnv(".env.local")
let sent = 0
let skipped = 0

for (const key of KEYS) {
  const value = env[key]
  if (!value) {
    skipped++
    console.log(`· pulei ${key} (vazio)`)
    continue
  }
  for (const target of ENVIRONMENTS) {
    // remove silenciosamente se já existir, depois adiciona
    run(["env", "rm", key, target, "-y"])
    const add = run(["env", "add", key, target], value)
    if (add.status === 0) {
      console.log(`✓ ${key} → ${target}`)
      sent++
    } else {
      console.error(`✗ ${key} → ${target}: ${(add.stderr || "").trim()}`)
    }
  }
}

console.log(`\nConcluído: ${sent} definição(ões), ${skipped} vazia(s) pulada(s).`)
console.log("Faça um novo deploy para aplicar: vercel --prod")
