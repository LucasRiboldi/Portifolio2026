"use server"

import { z } from "zod"

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

  const { supabase } = await adminContext()
  const { error } = await supabase.from("prophet_about").upsert({ id: "default", ...parsed.data })
  if (error) return fail(error.message)

  revalidate(CACHE_TAGS.prophetAbout)
  return ok()
}
