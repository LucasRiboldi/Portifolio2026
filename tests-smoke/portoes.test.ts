import { describe, it, expect, beforeAll } from "vitest"

/**
 * Fumaça: os PORTÕES do app, contra o servidor de verdade.
 *
 * Por que esta suíte existe, sendo que já há 580 unitários e 21 de integração:
 * nenhuma das outras duas sobe o Next. Elas provam funções; esta prova que a
 * função certa está ligada na rota certa. Um `requireAdmin()` removido por
 * engano de um layout, uma rota nova esquecida fora do middleware, um endpoint
 * que passa a responder 200 onde respondia 401 — nada disso aparece em teste
 * unitário, e todos são falha de segurança, não de lógica.
 *
 * O foco é deliberadamente estreito: **quem entra e quem não entra**. Não
 * testa aparência nem conteúdo, que mudam toda semana e produziriam teste
 * quebradiço.
 *
 * Uso: `npm run test:smoke` (faz build, sobe o servidor, roda e derruba).
 */

const BASE = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3100"

async function head(path: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" })
  return res.status
}

beforeAll(async () => {
  // Falha cedo e com mensagem clara se o servidor não subiu — senão todos os
  // casos falham com ECONNREFUSED, que não diz o que fazer.
  try {
    await fetch(BASE, { redirect: "manual" })
  } catch {
    throw new Error(`Servidor não respondeu em ${BASE}. Rode com "npm run test:smoke".`)
  }
}, 30_000)

describe("rotas públicas respondem", () => {
  it.each(["/", "/login", "/anfitriao", "/portfolio", "/desenvolvedor", "/design-system"])(
    "%s → 200",
    async (rota) => {
      expect(await head(rota)).toBe(200)
    },
  )
})

describe("portão do /admin", () => {
  // O middleware só checa presença de cookie; a autorização real é o
  // requireAdmin() de cada página. Qualquer um dos dois barra o anônimo, e é
  // isso que este teste prende — se ambos sumirem, aqui vira 200.
  it.each(["/admin", "/admin/media", "/admin/messages", "/admin/prophet-wire"])(
    "%s redireciona anônimo",
    async (rota) => {
      const status = await head(rota)
      expect([301, 302, 307, 308]).toContain(status)
    },
  )
})

describe("endpoints que precisam de segredo ou sessão", () => {
  it("gatilho do Prophet Wire recusa sem Authorization", async () => {
    const res = await fetch(`${BASE}/api/prophet-wire/run`, { method: "POST" })
    expect(res.status).toBe(401)
  })

  it("gatilho recusa segredo errado, e sem dizer por quê", async () => {
    const res = await fetch(`${BASE}/api/prophet-wire/run`, {
      method: "POST",
      headers: { authorization: "Bearer segredo-errado" },
    })
    expect(res.status).toBe(401)
    const corpo = await res.json()
    // Resposta genérica de propósito: não revela se o segredo existe.
    expect(JSON.stringify(corpo)).not.toMatch(/CRON_SECRET|configurad|inválid/i)
  })

  it("handshake de upload recusa quem não tem sessão de admin", async () => {
    const res = await fetch(`${BASE}/api/admin/blob-upload`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: { pathname: "public-media/x.mp4", callbackUrl: BASE },
      }),
    })
    // 401 e não 503: a autorização vem ANTES do diagnóstico de ambiente, para
    // não contar a anônimo qual variável falta neste deploy.
    expect(res.status).toBe(401)
  })
})
