"use server"

import { revalidatePath } from "next/cache"

import { atualizarDoc, removerDoc } from "@/lib/firebase/collection"
import { adminContext, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await adminContext()
  try {
    await atualizarDoc("contact_messages", id, { read })
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao marcar.")
  }
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return ok()
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await adminContext()
  try {
    await removerDoc("contact_messages", id)
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Falha ao apagar.")
  }
  revalidatePath("/admin/messages")
  return ok()
}
