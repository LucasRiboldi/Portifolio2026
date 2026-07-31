import "server-only"

/**
 * Escrita no Firestore — o lado admin do acesso a dados.
 *
 * Contraparte de `query.ts`. Aqui moram as operações que o Postgres oferecia em
 * SQL e que no Firestore viram chamadas explícitas: inserir, atualizar, apagar,
 * contar e gravar em lote.
 *
 * Duas diferenças herdadas do Postgres que vale enunciar:
 *
 *  - **`created_at` não existe de graça.** Lá era `default now()` na coluna;
 *    aqui, quem insere precisa gravar. Como vários repositórios ordenam por
 *    esse campo — e no Firestore documento sem o campo ordenado simplesmente
 *    não aparece no resultado —, `criarDoc` sempre o preenche.
 *
 *  - **Não há `count(*)` barato.** O Firestore cobra e demora por documento
 *    lido, então usamos a agregação `count()` do servidor, que não traz os
 *    documentos.
 */
import { FieldValue, type Firestore } from "firebase-admin/firestore"

import { getDb } from "./admin"
import { paraFirestore } from "./nested"

/** Limite de operações por batch no Firestore. */
const BATCH_MAX = 500

function db(): Firestore {
  return getDb()
}

/** Quantos documentos há na coleção (agregação server-side, sem ler documentos). */
export async function contarDocs(colecao: string, filtro?: { campo: string; valor: unknown }) {
  let q = db().collection(colecao) as FirebaseFirestore.Query
  if (filtro) q = q.where(filtro.campo, "==", filtro.valor)
  const snap = await q.count().get()
  return snap.data().count
}

/**
 * Cria um documento. `id` explícito quando o registro tem chave natural
 * (slug, key, "default"); auto-id caso contrário — equivalente ao uuid default.
 */
export async function criarDoc(
  colecao: string,
  dados: Record<string, unknown>,
  id?: string,
): Promise<string> {
  const payload = paraFirestore({ created_at: new Date().toISOString(), ...dados })
  if (id) {
    await db().collection(colecao).doc(id).set(payload)
    return id
  }
  const ref = await db().collection(colecao).add(payload)
  return ref.id
}

/** Atualiza campos de um documento existente. */
export async function atualizarDoc(
  colecao: string,
  id: string,
  dados: Record<string, unknown>,
): Promise<void> {
  await db()
    .collection(colecao)
    .doc(id)
    .set(paraFirestore({ ...dados, updated_at: new Date().toISOString() }), { merge: true })
}

/** Apaga um documento. */
export async function removerDoc(colecao: string, id: string): Promise<void> {
  await db().collection(colecao).doc(id).delete()
}

/** Incrementa/altera um campo numérico sem ler antes. */
export async function incrementarCampo(
  colecao: string,
  id: string,
  campo: string,
  delta: number,
): Promise<void> {
  await db()
    .collection(colecao)
    .doc(id)
    .set({ [campo]: FieldValue.increment(delta) }, { merge: true })
}

export interface DocParaGravar {
  /** Chave natural, quando existe. Sem ela o Firestore gera o id. */
  id?: string
  dados: Record<string, unknown>
}

/**
 * Descobre a chave natural de um registro.
 *
 * No Postgres cada tabela declarava sua PK — umas `id` uuid, outras `slug`,
 * `key` ou `name`. Aqui o id do documento faz esse papel, e usá-lo quando
 * existe é o que torna o seed idempotente: rodar duas vezes reescreve o mesmo
 * documento em vez de criar um irmão.
 */
export function idNatural(dados: Record<string, unknown>): string | undefined {
  for (const campo of ["id", "key", "slug"]) {
    const v = dados[campo]
    if (typeof v === "string" && v) return v
  }
  return undefined
}

/**
 * Grava vários documentos em lote, fatiando em blocos de 500 (teto do
 * Firestore). `merge: true` torna a operação idempotente — é o que permite
 * rodar o seed mais de uma vez sem duplicar conteúdo.
 */
export async function gravarLote(colecao: string, docs: DocParaGravar[]): Promise<number> {
  const base = db().collection(colecao)
  let gravados = 0

  for (let i = 0; i < docs.length; i += BATCH_MAX) {
    const fatia = docs.slice(i, i + BATCH_MAX)
    const batch = db().batch()
    for (const { id, dados } of fatia) {
      const ref = id ? base.doc(id) : base.doc()
      batch.set(ref, paraFirestore({ created_at: new Date().toISOString(), ...dados }), { merge: true })
    }
    await batch.commit()
    gravados += fatia.length
  }

  return gravados
}

/**
 * Aplica um patch a todos os documentos que casam com um filtro.
 *
 * O `UPDATE ... WHERE` do SQL não tem equivalente direto no Firestore: é
 * preciso achar os documentos e escrever um a um. O batch mantém a operação
 * atômica dentro de cada bloco de 500.
 */
export async function atualizarOnde(
  colecao: string,
  filtro: { campo: string; valor: unknown },
  patch: Record<string, unknown>,
): Promise<number> {
  const snap = await db().collection(colecao).where(filtro.campo, "==", filtro.valor).get()
  if (snap.empty) return 0

  for (let i = 0; i < snap.docs.length; i += BATCH_MAX) {
    const batch = db().batch()
    for (const doc of snap.docs.slice(i, i + BATCH_MAX))
      batch.set(doc.ref, paraFirestore(patch), { merge: true })
    await batch.commit()
  }
  return snap.size
}

/** Lê campos específicos de todos os documentos — usado pelo sync para deduplicar. */
export async function listarCampos<T>(colecao: string, campos: string[]): Promise<T[]> {
  const snap = await db().collection(colecao).select(...campos).get()
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as T)
}
