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

// Variáveis que fazem sentido no Vercel.
//
// As `NEXT_PUBLIC_*` vão para o bundle do browser — são públicas por design no
// Firebase, quem protege são as Security Rules. As duas do Admin SDK são
// segredo de verdade e só existem no servidor.
const KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "ADMIN_GITHUB_LOGIN",
  "GITHUB_TOKEN",
  "CRON_SECRET",
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
  // A chave privada do Admin SDK tem quebras de linha. O parser acima lê uma
  // linha por vez: colada em várias linhas, só a primeira seria enviada — e o
  // erro apareceria em produção como "invalid PEM", longe daqui. Melhor parar.
  if (key === "FIREBASE_PRIVATE_KEY" && !value.includes("\\n")) {
    console.error(
      `✗ ${key} parece truncada (sem \\n escapado).\n` +
        "  Ela precisa estar em UMA linha no .env.local, entre aspas, com os\n" +
        '  \\n escapados: FIREBASE_PRIVATE_KEY="-----BEGIN...\\n...\\n-----END...\\n"',
    )
    process.exit(1)
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
