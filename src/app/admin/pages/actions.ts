"use server"

import { z } from "zod"

import { atualizarDoc } from "@/lib/firebase/collection"
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

  await adminContext()
  try {
    // `key` é a chave natural do documento: o upsert do Postgres vira um
    // set(merge) no id, com a mesma semântica de "cria ou atualiza".
    await atualizarDoc("page_content", key, { key, ...parsed.data })
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao gravar.")
  }

  revalidate(CACHE_TAGS.pages)
  return ok()
}
