import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest"

/**
 * `lib/firebase/collection.ts` contra um Firestore de verdade (emulador).
 *
 * Item 8 do NEXT_STEPS. A suíte unitária mocka `lib/firebase/query`, então
 * nenhum dos 542 testes executava uma escrita real: `criarDoc`,
 * `atualizarOnde`, `gravarLote` e o envelope de arrays aninhados eram código
 * que compilava e nunca rodava.
 *
 * O caso que mais justifica isto é o array dentro de array. O Firestore o
 * REJEITA, e `nested.ts` existe só para contornar. Um mock nunca pega esse
 * defeito, porque o mock não tem a restrição que motiva o código — só o motor
 * real recusa.
 *
 * Exige o emulador no ar. `npm run test:integration` cuida disso.
 */

const PROJETO = "portifolio-testes"

// O Admin SDK dispensa credencial quando FIRESTORE_EMULATOR_HOST está definido;
// basta o projectId. É o que permite testar sem serviceAccountKey.json — a
// regra do projeto é que teste não dependa de credencial.
process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080"
process.env.GCLOUD_PROJECT = PROJETO

const { initializeApp, getApps } = await import("firebase-admin/app")
const { getFirestore } = await import("firebase-admin/firestore")

const app = getApps()[0] ?? initializeApp({ projectId: PROJETO })
const db = getFirestore(app)

// `collection.ts` e `query.ts` puxam o banco daqui. Trocar só esta porta mantém
// TODO o resto sob teste — que é justamente o ponto.
vi.mock("@/lib/firebase/admin", () => ({
  getDb: () => db,
  getDbOrNull: () => db,
  isFirebaseAdminConfigured: true,
}))

const { criarDoc, atualizarDoc, atualizarOnde, removerDoc, gravarLote, contarDocs, listarCampos, incrementarCampo } =
  await import("@/lib/firebase/collection")
const { buscarLinhas, buscarPorId } = await import("@/lib/firebase/query")

const COLECAO = "testes_collection"

async function limpar() {
  const snap = await db.collection(COLECAO).get()
  await Promise.all(snap.docs.map((d) => d.ref.delete()))
}

beforeAll(async () => {
  // Falha cedo e com mensagem clara se o emulador não subiu — senão o SDK fica
  // tentando reconectar e o erro sai como timeout, que não diz nada.
  try {
    await db.collection(COLECAO).limit(1).get()
  } catch (e) {
    throw new Error(
      `Emulador do Firestore inacessível em ${process.env.FIRESTORE_EMULATOR_HOST}. ` +
        `Rode 'npm run test:integration', que o sobe. Causa: ${(e as Error).message}`,
    )
  }
})

beforeEach(limpar)
afterAll(limpar)

describe("criarDoc", () => {
  it("preenche created_at sozinho", async () => {
    // Sem isto o documento some de qualquer query com orderBy('created_at') —
    // o Firestore omite do resultado quem não tem o campo ordenado.
    const id = await criarDoc(COLECAO, { title: "sem data" })

    const doc = await buscarPorId<{ created_at?: unknown }>(COLECAO, id)
    expect(doc?.created_at).toBeTruthy()
  })

  it("respeita o created_at informado", async () => {
    const id = await criarDoc(COLECAO, { title: "com data", created_at: "2020-01-01" })

    const doc = await buscarPorId<{ created_at?: string }>(COLECAO, id)
    expect(doc?.created_at).toBe("2020-01-01")
  })

  it("o documento criado é encontrável por orderBy('created_at')", async () => {
    await criarDoc(COLECAO, { title: "a" })
    await criarDoc(COLECAO, { title: "b" })

    const linhas = await buscarLinhas<{ title: string }>(COLECAO, {
      orderBy: [{ campo: "created_at" }],
    })
    expect(linhas?.map((l) => l.title).sort()).toEqual(["a", "b"])
  })
})

describe("array dentro de array", () => {
  /**
   * O caso real é `prophet_materias.boxes[].rows`. Escrever isso cru no
   * Firestore lança "Cannot convert an array value in an array value";
   * `nested.ts` envelopa na gravação e desenvelopa na leitura.
   */
  const boxes = [
    { titulo: "Caixa 1", rows: ["linha A", "linha B"] },
    { titulo: "Caixa 2", rows: [] as string[] },
  ]

  it("sobrevive ao ciclo de gravação e leitura", async () => {
    const id = await criarDoc(COLECAO, { title: "materia", boxes })

    const doc = await buscarPorId<{ boxes: typeof boxes }>(COLECAO, id)
    expect(doc?.boxes).toEqual(boxes)
  })

  it("também pelo gravarLote", async () => {
    await gravarLote(COLECAO, [{ id: "lote-1", dados: { title: "m", boxes } }])

    const doc = await buscarPorId<{ boxes: typeof boxes }>(COLECAO, "lote-1")
    expect(doc?.boxes).toEqual(boxes)
  })

  it("o Firestore de fato recusa a forma crua — o envelope não é decorativo", async () => {
    // Guarda contra alguém "simplificar" o nested.ts achando que não faz nada.
    await expect(
      db.collection(COLECAO).doc("cru").set({ boxes: [["a", "b"]] }),
    ).rejects.toThrow()
  })
})

describe("gravarLote", () => {
  it("é idempotente — rodar duas vezes não duplica", async () => {
    const docs = [
      { id: "x", dados: { title: "X" } },
      { id: "y", dados: { title: "Y" } },
    ]
    await gravarLote(COLECAO, docs)
    await gravarLote(COLECAO, docs)

    expect(await contarDocs(COLECAO)).toBe(2)
  })

  it("sem id, o Firestore gera um", async () => {
    await gravarLote(COLECAO, [{ dados: { title: "anonimo" } }, { dados: { title: "outro" } }])

    expect(await contarDocs(COLECAO)).toBe(2)
  })

  it("faz merge, não substitui", async () => {
    await gravarLote(COLECAO, [{ id: "m", dados: { title: "T", extra: 1 } }])
    await gravarLote(COLECAO, [{ id: "m", dados: { title: "T2" } }])

    const doc = await buscarPorId<{ title: string; extra?: number }>(COLECAO, "m")
    expect(doc?.title).toBe("T2")
    expect(doc?.extra).toBe(1)
  })
})

describe("atualizarOnde", () => {
  it("atinge todos os que casam com o filtro", async () => {
    await gravarLote(COLECAO, [
      { id: "a", dados: { featured: true } },
      { id: "b", dados: { featured: true } },
      { id: "c", dados: { featured: false } },
    ])

    const tocados = await atualizarOnde(COLECAO, { campo: "featured", valor: true }, { featured: false })

    expect(tocados).toBe(2)
    const todos = await listarCampos<{ featured: boolean }>(COLECAO, ["featured"])
    expect(todos.every((d) => d.featured === false)).toBe(true)
  })

  it("nenhum casando é no-op", async () => {
    await gravarLote(COLECAO, [{ id: "a", dados: { featured: false } }])

    expect(await atualizarOnde(COLECAO, { campo: "featured", valor: true }, { featured: false })).toBe(0)
  })
})

describe("atualizarDoc, removerDoc e incrementarCampo", () => {
  it("atualiza sem apagar os outros campos", async () => {
    const id = await criarDoc(COLECAO, { title: "antes", outro: "fica" })
    await atualizarDoc(COLECAO, id, { title: "depois" })

    const doc = await buscarPorId<{ title: string; outro: string }>(COLECAO, id)
    expect(doc?.title).toBe("depois")
    expect(doc?.outro).toBe("fica")
  })

  it("remove", async () => {
    const id = await criarDoc(COLECAO, { title: "efêmero" })
    await removerDoc(COLECAO, id)

    expect(await buscarPorId(COLECAO, id)).toBeNull()
  })

  it("incrementa de forma atômica", async () => {
    const id = await criarDoc(COLECAO, { views: 0 })
    await Promise.all([
      incrementarCampo(COLECAO, id, "views", 1),
      incrementarCampo(COLECAO, id, "views", 1),
      incrementarCampo(COLECAO, id, "views", 1),
    ])

    const doc = await buscarPorId<{ views: number }>(COLECAO, id)
    expect(doc?.views).toBe(3)
  })
})

describe("listarCampos", () => {
  it("traz só os campos pedidos", async () => {
    await gravarLote(COLECAO, [{ id: "a", dados: { title: "T", peso: 999, sort: 1 } }])

    const linhas = await listarCampos<Record<string, unknown>>(COLECAO, ["title", "sort"])

    expect(linhas[0]).toMatchObject({ title: "T", sort: 1 })
    expect(linhas[0]).not.toHaveProperty("peso")
  })
})

describe("a armadilha do orderBy", () => {
  it("documento sem o campo ordenado some do resultado", async () => {
    // A razão de `criarDoc` sempre gravar `created_at`. O documento não é
    // filtrado por engano nosso: o Firestore simplesmente não o inclui. Como a
    // query não falha, o efeito é um sumiço silencioso — e é por isso que este
    // teste existe contra o motor real, onde a regra mora.
    await gravarLote(COLECAO, [
      { id: "com", dados: { title: "tem sort", sort: 1 } },
      { id: "sem", dados: { title: "não tem sort" } },
    ])

    const ordenadas = await buscarLinhas<{ title: string }>(COLECAO, {
      orderBy: [{ campo: "sort" }],
    })
    const todas = await buscarLinhas<{ title: string }>(COLECAO, {})

    expect(ordenadas?.map((l) => l.title)).toEqual(["tem sort"])
    expect(todas).toHaveLength(2)
  })
})
