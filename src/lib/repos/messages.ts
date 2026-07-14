import "server-only"

/**
 * Mensagens de contato. Escrita anônima (formulário público) via server client;
 * leitura só no admin. Sem cache — é dado transacional do inbox.
 */
import type { ContactMessageRow } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export interface NewMessage {
  name: string
  email: string
  message: string
}

/** Grava uma mensagem do formulário público. Retorna true se persistiu. */
export async function saveContactMessage(msg: NewMessage): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name: msg.name,
    email: msg.email,
    message: msg.message,
  })
  return !error
}

/** Lista mensagens (admin). Requer sessão admin válida (RLS). */
export async function listContactMessages(): Promise<ContactMessageRow[]> {
  if (!isSupabaseConfigured) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
  if (error || !data) return []
  return data
}
