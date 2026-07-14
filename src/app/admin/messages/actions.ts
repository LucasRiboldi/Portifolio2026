"use server"

import { revalidatePath } from "next/cache"

import { adminContext, ok, fail, type ActionResult } from "@/lib/admin/action-helpers"

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  const { supabase } = await adminContext()
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id)
  if (error) return fail(error.message)
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
  return ok()
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await adminContext()
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)
  if (error) return fail(error.message)
  revalidatePath("/admin/messages")
  return ok()
}
