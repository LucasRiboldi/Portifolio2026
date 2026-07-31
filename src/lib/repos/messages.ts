import "server-only"

/**
 * Mensagens de contato — somente leitura, para o inbox do admin.
 *
 * A escrita saiu junto com a página /contact e o endpoint /api/contact: não há
 * mais formulário público, então nenhuma mensagem nova é criada. O que resta
 * aqui é o histórico já gravado. Sem cache — é dado transacional do inbox.
 */
import type { ContactMessageRow } from "@/lib/firebase/types"
import { buscarLinhas } from "@/lib/firebase/query"

/**
 * Lista mensagens (admin).
 *
 * Antes a proteção era a RLS: a query rodava com a sessão do usuário e o
 * Postgres decidia. Aqui a leitura usa o Admin SDK, que ignora Security Rules —
 * então quem chama precisa ter passado por `requireAdmin()`. A única chamada
 * (`/admin/messages`) roda dentro do layout do painel, que já o faz.
 */
export async function listContactMessages(): Promise<ContactMessageRow[]> {
  const data = await buscarLinhas<ContactMessageRow>("contact_messages", {
    orderBy: [{ campo: "created_at", asc: false }],
  })
  return data ?? []
}
