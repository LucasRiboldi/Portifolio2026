"use server"

import { z } from "zod"

import { atualizarDoc } from "@/lib/firebase/collection"
import { adminContext, revalidate, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"

const schema = z.object({
  author: z.string().default(""),
  intro: z.string().default(""),
  passion: z.string().default(""),
  proposal: z.string().default(""),
})

export async function saveProphetAbout(formData: FormData): Promise<ActionResult> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return fail(parsed.error.issues.map((i) => i.message).join(" · "))

  await adminContext()
  try {
    await atualizarDoc("prophet_about", "default", parsed.data)
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao gravar.")
  }

  revalidate(CACHE_TAGS.prophetAbout)
  return ok()
}
