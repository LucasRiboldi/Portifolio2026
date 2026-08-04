import "server-only"

import { contarDocs } from "@/lib/firebase/collection"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"

const TABLES = ["projects", "skills", "tools"] as const

export interface AdminStats {
  configured: boolean
  counts: Record<string, number>
  unreadMessages: number
  empty: boolean
}

/**
 * Contadores do dashboard.
 *
 * Usa a agregação `count()` do Firestore, que roda no servidor e não traz os
 * documentos — o equivalente ao `head: true` do Supabase, e igualmente barato.
 */
export async function getAdminStats(): Promise<AdminStats> {
  if (!isFirebaseAdminConfigured) {
    return { configured: false, counts: {}, unreadMessages: 0, empty: true }
  }

  try {
    // Em paralelo: eram 5 idas ao banco em fila, e o dashboard esperava a soma
    // de todas para pintar.
    const [tableCounts, unread] = await Promise.all([
      Promise.all(
        TABLES.map(async (table) => [table, await contarDocs(table)] as const),
      ),
      contarDocs("contact_messages", { campo: "read", valor: false }),
    ])

    const counts: Record<string, number> = Object.fromEntries(tableCounts)
    const total = Object.values(counts).reduce((a, b) => a + b, 0)

    return { configured: true, counts, unreadMessages: unread, empty: total === 0 }
  } catch {
    // Banco ainda sem coleções (projeto novo) não é erro digno de derrubar o
    // dashboard — é o estado "vazio", que a UI já sabe representar.
    return { configured: true, counts: {}, unreadMessages: 0, empty: true }
  }
}
