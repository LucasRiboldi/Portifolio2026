"use server"

import { z } from "zod"

import { adminContext, revalidate, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"
import { getPageEntry } from "@/lib/admin/pages-catalog"

const schema = z.object({
  kicker: z.string().default(""),
  title: z.string().default(""),
  highlight: z.string().default(""),
  subtitle: z.string().default(""),
})

export async function savePageContent(key: string, formData: FormData): Promise<ActionResult> {
  if (!getPageEntry(key)) return fail("Página inválida.")
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return fail(parsed.error.issues.map((i) => i.message).join(" · "))

  const { supabase } = await adminContext()
  const { error } = await supabase.from("page_content").upsert({ key, ...parsed.data })
  if (error) return fail(error.message)

  revalidate(CACHE_TAGS.pages)
  return ok()
}
