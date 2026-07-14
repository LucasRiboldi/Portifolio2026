"use server"

import { z } from "zod"

import { adminContext, revalidate, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  title: z.string().default(""),
  description: z.string().default(""),
  github: z.string().default(""),
  linkedin: z.string().default(""),
  email: z.string().default(""),
  location: z.string().default(""),
  og_title: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  og_description: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
})

export async function saveSiteConfig(formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return fail(parsed.error.issues.map((i) => i.message).join(" · "))

  const { supabase } = await adminContext()
  const { error } = await supabase
    .from("site_config")
    .upsert({ id: "default", ...parsed.data })
  if (error) return fail(error.message)

  revalidate(CACHE_TAGS.site)
  return ok()
}
