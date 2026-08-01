import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest"

/**
 * O gatilho do Prophet Wire contra um Firestore de verdade (emulador).
 *
 * Item 4 do NEXT_STEPS. O critério de pronto daquele item é "o acervo e o
 * histórico persistem ENTRE execuções" — e era exatamente o que nenhum teste
 * cobria: `pipeline.test.ts` prova a deduplicação, mas contra o
 * `InMemoryNewsRepository`, onde persistir é trivial porque nada sai da
 * memória do processo.
 *
 * A diferença importa. Em produção cada execução do cron é uma invocação
 * serverless nova, sem memória da anterior: a dedup só funciona se o `hash` for
 * reencontrado NO BANCO. É essa consulta — `findByHash` contra o Firestore, com
 * o dado gravado por outra execução — que só o motor real exercita.
 *
 * Exige o emulador no ar. `npm run test:integration` cuida disso.
 */

const PROJETO = "portifolio-testes"

process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080"
process.env.GCLOUD_PROJECT = PROJETO

const { initializeApp, getApps } = await import("firebase-admin/app")
const { getFirestore } = await import("firebase-admin/firestore")

const app = getApps()[0] ?? initializeApp({ projectId: PROJETO })
const db = getFirestore(app)

vi.mock("@/lib/firebase/admin", () => ({
  getDb: () => db,
  getDbOrNull: () => db,
  isFirebaseAdminConfigured: true,
}))

const { runPipeline } = await import("@/lib/prophet-wire/pipeline")
const { FallbackAIClient } = await import("@/lib/prophet-wire/ai-client")
const { FirestoreNewsRepository } = await import("@/lib/prophet-wire/firestore-repository")
const { FirestoreRunStore } = await import("@/lib/prophet-wire/firestore-run-store")
const { authorizeCron } = await import("@/lib/prophet-wire/cron-auth")
const { config } = await import("@/lib/prophet-wire/config")

type HttpClient = import("@/lib/prophet-wire/http-client").HttpClient
type Source = import("@/lib/prophet-wire/types").Source

const here = dirname(fileURLToPath(import.meta.url))
const rss = readFileSync(
  join(here, "..", "tests", "prophet-wire", "fixtures", "sample-rss.xml"),
  "utf-8",
)

const NOTICIAS = "prophet_wire_news"
const EXECUCOES = "prophet_wire_runs"

/** Data da fixture + janela larga o bastante para abraçar os dois itens. */
const NOW = new Date("2026-07-24T00:00:00.000Z")
const WINDOW = 72

const fonte: Source = {
  id: "feed",
  name: "Feed",
  url: "https://feed.test/rss",
  kind: "rss",
  defaultCategory: "Notícias",
  enabled: true,
}

/** Nenhuma rede: o "feed" é sempre a mesma fixture. */
const http: HttpClient = { async get() { return { status: 200, body: rss } } }

function executar(repo: InstanceType<typeof FirestoreNewsRepository>) {
  return runPipeline({
    http,
    ai: new FallbackAIClient(),
    repo,
    sources: [fonte],
    windowHours: WINDOW,
    now: () => NOW,
    logging: { echo: false },
  })
}

async function limpar(colecao: string) {
  const snap = await db.collection(colecao).get()
  await Promise.all(snap.docs.map((d) => d.ref.delete()))
}

beforeAll(async () => {
  // Falha cedo e com mensagem clara se o emulador não subiu — senão o SDK fica
  // tentando reconectar e o erro sai como timeout, que não diz nada.
  try {
    await db.collection("ping").limit(1).get()
  } catch {
    throw new Error(
      `Emulador do Firestore não respondeu em ${process.env.FIRESTORE_EMULATOR_HOST}. ` +
        `Rode com "npm run test:integration".`,
    )
  }
})

beforeEach(async () => {
  await Promise.all([limpar(NOTICIAS), limpar(EXECUCOES)])
})

afterAll(async () => {
  await Promise.all([limpar(NOTICIAS), limpar(EXECUCOES)])
})

describe("gatilho do Prophet Wire — acervo persiste entre execuções", () => {
  it("primeira execução grava a fixture no Firestore", async () => {
    const repo = new FirestoreNewsRepository()
    const report = await executar(repo)

    expect(report.counters.fetched).toBe(1)
    // A fixture traz 2 itens dentro da janela.
    expect(await repo.count()).toBe(2)

    // Confere no banco, não só pelo repo — é o dado que a próxima invocação vai
    // encontrar.
    const snap = await db.collection(NOTICIAS).get()
    expect(snap.size).toBe(2)
  })

  it("segunda execução não duplica: a dedup reencontra o hash NO BANCO", async () => {
    // Duas instâncias diferentes de repositório de propósito: é o que a
    // realidade faz — cada execução do cron é um processo novo, sem estado
    // compartilhado. Se a dedup dependesse de memória, isto duplicaria.
    const primeira = await executar(new FirestoreNewsRepository())
    const segunda = await executar(new FirestoreNewsRepository())

    // ARMADILHA DE LEITURA, e ela vale para o painel: `counters.published` só
    // conta o que saiu com status "publicado". Com `publishMode: "rascunho"`
    // ele é 0 mesmo numa execução perfeita — não é sinal de falha, e o painel
    // mostra esse mesmo número. O observável honesto é o banco.
    expect(primeira.counters.published).toBe(0)
    expect(primeira.counters.errors).toBe(0)

    // A prova da dedup: a segunda passada descartou o que a primeira gravou…
    expect(segunda.counters.discarded).toBeGreaterThanOrEqual(2)
    expect(segunda.counters.errors).toBe(0)

    // …e o acervo continua com dois documentos, não quatro.
    const snap = await db.collection(NOTICIAS).get()
    expect(snap.size).toBe(2)
  })

  it("grava conforme o publishMode — hoje rascunho, fora da vista do público", async () => {
    const repo = new FirestoreNewsRepository()
    await executar(repo)

    const esperado = config.publishMode === "automatico" ? "publicado" : "rascunho"
    const snap = await db.collection(NOTICIAS).get()
    expect(snap.docs.map((d) => d.data().status)).toEqual([esperado, esperado])

    // Consequência prática, e é o que torna seguro disparar em produção:
    // em modo rascunho a landing não enxerga nada do que a execução trouxe.
    expect(await repo.listPublished()).toHaveLength(0)
    expect(await repo.listDrafts()).toHaveLength(2)
  })
})

describe("gatilho do Prophet Wire — histórico persiste entre execuções", () => {
  it("registra cada execução e devolve a mais recente primeiro", async () => {
    const store = new FirestoreRunStore()

    const primeira = await executar(new FirestoreNewsRepository())
    await store.record(primeira)
    const segunda = await executar(new FirestoreNewsRepository())
    await store.record({ ...segunda, startedAt: "2026-07-25T00:00:00.000Z" })

    // Store novo: lê do banco, não de memória — é o que o painel faz a cada
    // request.
    const lido = new FirestoreRunStore()
    const runs = await lido.list()
    expect(runs).toHaveLength(2)
    expect(runs[0]?.startedAt).toBe("2026-07-25T00:00:00.000Z")

    const ultima = await lido.last()
    expect(ultima?.startedAt).toBe("2026-07-25T00:00:00.000Z")
  })
})

describe("gatilho do Prophet Wire — o portão", () => {
  it("sem CRON_SECRET no ambiente, nada roda — nem com header plausível", () => {
    // Repetido aqui de propósito: é a razão de o item 4 estar bloqueado, e
    // ficar visível junto do teste que exercita o que vem depois do portão.
    expect(authorizeCron("Bearer qualquer-coisa", undefined)).toEqual({
      authorized: false,
      reason: "sem-segredo-configurado",
    })
  })
})
