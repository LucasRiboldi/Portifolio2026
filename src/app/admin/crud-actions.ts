"use server"

/**
 * Server Actions genéricas de CRUD para os recursos de conteúdo. Validam com
 * zod, exigem admin, escrevem via client autenticado (RLS reforça) e revalidam
 * a tag de cache do recurso.
 */
import { revalidatePath } from "next/cache"

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

  const { supabase } = await adminContext()
  const payload = parsed.data as Record<string, unknown>
  const table = resourceTable(slug)

  const query = id
    ? supabase.from(table).update(payload).eq("id", id)
    : supabase.from(table).insert(payload)

  const { error } = await query
  if (error) return fail(error.message)

  revalidate(res.tag)
  revalidatePath(`/admin/${slug}`)
  return ok()
}

export async function deleteResource(slug: string, id: string): Promise<ActionResult> {
  const res = getResource(slug)
  if (!res) return fail("Recurso inválido.")

  const { supabase } = await adminContext()
  const { error } = await supabase.from(resourceTable(slug)).delete().eq("id", id)
  if (error) return fail(error.message)

  revalidate(res.tag)
  revalidatePath(`/admin/${slug}`)
  return ok()
}
