import "server-only"

/**
 * Acesso de leitura ao Firestore para os repositórios.
 *
 * Camada fina de propósito: a superfície que os repos usavam do Supabase era
 * pequena e uniforme (`select("*")` + `eq` + `order` + `maybeSingle`), então
 * cabe atrás de duas funções. Isso manteve a conversão dos 13 repositórios
 * contida — cada um trocou a chamada, não a lógica.
 *
 * Os documentos guardam os campos em **snake_case**, iguais às colunas antigas.
 * Não é descuido: os mapeadores `daLinha()` de cada repo já traduziam
 * snake_case→camelCase, e preservar o formato manteve-os intactos. A fronteira
 * de tradução continua exatamente onde estava.
 *
 * Todas as funções devolvem `null` quando o Firebase não está configurado —
 * é o sinal para o repo cair no seed de `src/data`.
 */
import type { Query } from "firebase-admin/firestore"

import { getDbOrNull } from "./admin"
import { doFirestore } from "./nested"

export interface Filtro {
  campo: string
  valor: unknown
}

export interface Ordem {
  campo: string
  asc?: boolean
}

export interface Opcoes {
  where?: Filtro[]
  orderBy?: Ordem[]
  limit?: number
}

function montar(colecao: string, opts: Opcoes): Query | null {
  const db = getDbOrNull()
  if (!db) return null

  let q: Query = db.collection(colecao)
  for (const f of opts.where ?? []) q = q.where(f.campo, "==", f.valor)
  for (const o of opts.orderBy ?? []) q = q.orderBy(o.campo, o.asc === false ? "desc" : "asc")
  if (opts.limit) q = q.limit(opts.limit)
  return q
}

/**
 * Linhas de uma coleção. Devolve `null` em falta de configuração **ou em erro**
 * — os repos tratam os dois como "use o seed", que era o comportamento anterior
 * (o Supabase devolvia `{ error }` e eles caíam no seed do mesmo jeito).
 *
 * Atenção ao `orderBy`: no Firestore, documentos sem o campo ordenado ficam
 * fora do resultado. O seed grava todos os campos justamente por isso.
 */
export async function buscarLinhas<T>(colecao: string, opts: Opcoes = {}): Promise<T[] | null> {
  const q = montar(colecao, opts)
  if (!q) return null
  try {
    const snap = await q.get()
    // O id do documento vem por último de propósito: se um campo `id` sobrou
    // dentro do data (herança do schema antigo), o id real prevalece.
    return snap.docs.map((d) => doFirestore({ ...d.data(), id: d.id }) as T)
  } catch {
    return null
  }
}

/** Uma linha só, ou `null`. */
export async function buscarLinha<T>(colecao: string, opts: Opcoes = {}): Promise<T | null> {
  const linhas = await buscarLinhas<T>(colecao, { ...opts, limit: 1 })
  return linhas?.[0] ?? null
}

/** Documento por id. */
export async function buscarPorId<T>(colecao: string, id: string): Promise<T | null> {
  const db = getDbOrNull()
  if (!db) return null
  try {
    const doc = await db.collection(colecao).doc(id).get()
    if (!doc.exists) return null
    return doFirestore({ ...doc.data(), id: doc.id }) as T
  } catch {
    return null
  }
}
