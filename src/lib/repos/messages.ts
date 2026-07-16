import "server-only"

/**
 * Mensagens de contato — somente leitura, para o inbox do admin.
 *
 * A escrita saiu junto com a página /contact e o endpoint /api/contact: não há
 * mais formulário público, então nenhuma mensagem nova é criada. O que resta
 * aqui é o histórico já gravado. Sem cache — é dado transacional do inbox.
 */
import type { ContactMessageRow } from "@/lib/supabase/types"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"

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
