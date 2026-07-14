"use server"

import { adminContext, revalidate, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"
import { REALM_ORDER } from "@/lib/realms"

export async function saveRealms(formData: FormData): Promise<ActionResult> {
  const { supabase } = await adminContext()
  const defaultRealm = String(formData.get("default") ?? "")

  // valida JSON do Arcane, se enviado
  let arcaneContent: unknown = undefined
  const rawArcane = formData.get("arcane_content")
  if (typeof rawArcane === "string" && rawArcane.trim()) {
    try {
      arcaneContent = JSON.parse(rawArcane)
    } catch {
      return fail("JSON do Arcane inválido.")
    }
  }

  for (const id of REALM_ORDER) {
    const enabled = formData.get(`enabled_${id}`) != null
    const morph = String(formData.get(`morph_${id}`) ?? "")
    const patch: Record<string, unknown> = {
      enabled,
      is_default: id === defaultRealm,
      morph_label: morph,
    }
    if (id === "arcane" && arcaneContent !== undefined) {
      patch.arcane_content = arcaneContent
    }
    const { error } = await supabase.from("realms").update(patch).eq("id", id)
    if (error) return fail(`${id}: ${error.message}`)
  }

  revalidate(CACHE_TAGS.realms)
  return ok()
}
