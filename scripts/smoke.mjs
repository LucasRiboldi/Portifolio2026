/**
 * Sobe o Next em produção numa porta própria, roda a suíte de fumaça e derruba.
 *
 * Por que um script e não `start-server-and-test`: evita uma dependência a mais
 * para algo que são 40 linhas, e o encerramento de processo no Windows precisa
 * de tratamento próprio de qualquer jeito (`tree-kill` do filho do npm).
 *
 * Porta 3100 de propósito: a 3000 costuma estar ocupada pelo `next dev`, e
 * subir um build por cima do dev server é justamente a armadilha que quebra o
 * `.next/` (ver CLAUDE.md).
 */
import { spawn, spawnSync } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"

const PORTA = 3100
const BASE = `http://127.0.0.1:${PORTA}`
const LIMITE_MS = 90_000

const ehWindows = process.platform === "win32"

function rodar(cmd, args, opts = {}) {
  return spawn(cmd, args, { stdio: "inherit", shell: ehWindows, ...opts })
}

/**
 * Mata o processo e os filhos — `next start` deixa órfão se matar só o pai.
 *
 * SÍNCRONO de propósito: com `spawn`, o `process.exit()` logo abaixo encerrava
 * este script antes de o taskkill rodar, e o servidor sobrevivia segurando a
 * porta 3100 — a próxima execução então subia contra um servidor velho, com
 * build antigo, e testaria a coisa errada.
 */
function derrubar(proc) {
  if (!proc || proc.killed) return
  if (ehWindows) {
    spawnSync("taskkill", ["/pid", String(proc.pid), "/T", "/F"], { stdio: "ignore", shell: true })
  } else {
    proc.kill("SIGTERM")
  }
}

async function esperarSubir() {
  const limite = Date.now() + LIMITE_MS
  while (Date.now() < limite) {
    try {
      await fetch(BASE, { redirect: "manual" })
      return true
    } catch {
      await sleep(500)
    }
  }
  return false
}

/**
 * Porta ocupada é motivo para PARAR, não para seguir.
 *
 * Se algo já escuta na 3100, o `next start` novo não consegue ligar — mas a
 * espera abaixo encontraria o servidor VELHO respondendo, e a suíte passaria
 * testando um build antigo. Falso verde é pior que falha: o teste existe
 * justamente para não deixar regressão passar.
 */
async function portaOcupada() {
  try {
    await fetch(BASE, { redirect: "manual", signal: AbortSignal.timeout(2000) })
    return true
  } catch {
    return false
  }
}

if (await portaOcupada()) {
  console.error(
    `
Já há algo escutando em ${BASE}.
` +
      `Provavelmente um servidor de execução anterior que não morreu.
` +
      `Derrube-o antes de rodar de novo — seguir daqui testaria o build errado.
`,
  )
  process.exit(1)
}

const servidor = rodar("npx", ["next", "start", "-p", String(PORTA)])

// Garante que o servidor cai mesmo se este script for interrompido no meio.
const encerrar = () => derrubar(servidor)
process.on("SIGINT", encerrar)
process.on("SIGTERM", encerrar)
process.on("exit", encerrar)

if (!(await esperarSubir())) {
  console.error(
    `\nO servidor não subiu em ${LIMITE_MS / 1000}s.\n` +
      `Falta rodar "npm run build" antes? A suíte de fumaça precisa de um build pronto.\n`,
  )
  derrubar(servidor)
  process.exit(1)
}

const testes = rodar("npx", ["vitest", "run", "--config", "vitest.smoke.config.ts"], {
  env: { ...process.env, SMOKE_BASE_URL: BASE },
})

testes.on("exit", (codigo) => {
  derrubar(servidor)
  process.exit(codigo ?? 1)
})
