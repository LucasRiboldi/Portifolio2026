import "server-only"

import { buscarLinhas, buscarPorId } from "@/lib/firebase/query"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { getResource, resourceTable } from "@/lib/admin/resources"

/** Todas as linhas de um recurso (admin — inclui não publicados). */
export async function listRows(slug: string): Promise<Record<string, unknown>[]> {
  const res = getResource(slug)
  if (!res || !isFirebaseAdminConfigured) return []
  const linhas = await buscarLinhas<Record<string, unknown>>(resourceTable(slug), {
    orderBy: [{ campo: res.orderBy.column, asc: res.orderBy.ascending }],
  })
  return linhas ?? []
}

/** Uma linha por id. */
export async function getRow(slug: string, id: string): Promise<Record<string, unknown> | null> {
  if (!getResource(slug) || !isFirebaseAdminConfigured) return null
  return buscarPorId<Record<string, unknown>>(resourceTable(slug), id)
}
