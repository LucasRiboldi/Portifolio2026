"use server"

/**
 * Server Actions genéricas de CRUD para os recursos de conteúdo. Validam com
 * zod, exigem admin, escrevem via Admin SDK e revalidam a tag de cache do
 * recurso.
 */
import { revalidatePath } from "next/cache"

import { criarDoc, atualizarDoc, removerDoc } from "@/lib/firebase/collection"
import { getResource, resourceTable } from "@/lib/admin/resources"
import { adminContext, revalidate, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"

/** Constrói o objeto a validar a partir do FormData, respeitando os campos. */
function readForm(slug: string, formData: FormData): Record<string, unknown> {
  const res = getResource(slug)!
  const obj: Record<string, unknown> = {}
  for (const f of res.fields) {
    if (f.type === "boolean") {
      obj[f.name] = formData.get(f.name) != null // presente = marcado
    } else {
      obj[f.name] = formData.get(f.name) ?? ""
    }
  }
  return obj
}

export async function saveResource(
  slug: string,
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const res = getResource(slug)
  if (!res) return fail("Recurso inválido.")

  const parsed = res.schema.safeParse(readForm(slug, formData))
  if (!parsed.success) {
    return fail(parsed.error.issues.map((i) => i.message).join(" · "))
  }

  await adminContext()
  const payload = parsed.data as Record<string, unknown>
  const table = resourceTable(slug)

  try {
    if (id) await atualizarDoc(table, id, payload)
    else await criarDoc(table, payload)
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao gravar.")
  }

  revalidate(res.tag)
  revalidatePath(`/admin/${slug}`)
  return ok()
}

export async function deleteResource(slug: string, id: string): Promise<ActionResult> {
  const res = getResource(slug)
  if (!res) return fail("Recurso inválido.")

  await adminContext()
  try {
    await removerDoc(resourceTable(slug), id)
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao apagar.")
  }

  revalidate(res.tag)
  revalidatePath(`/admin/${slug}`)
  return ok()
}
