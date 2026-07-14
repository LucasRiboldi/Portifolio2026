"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import type { ContactMessageRow } from "@/lib/supabase/types"
import { markMessageRead, deleteMessage } from "@/app/admin/messages/actions"

export function MessageList({ messages }: { messages: ContactMessageRow[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  function toggle(id: string, read: boolean) {
    start(async () => {
      await markMessageRead(id, read)
      router.refresh()
    })
  }

  function remove(id: string) {
    if (!confirm("Excluir esta mensagem?")) return
    start(async () => {
      await deleteMessage(id)
      router.refresh()
    })
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
        Nenhuma mensagem ainda.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`rounded-xl border p-4 ${
            m.read ? "border-white/10 bg-white/[0.02]" : "border-emerald-500/30 bg-emerald-500/[0.05]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {m.name} <span className="font-normal text-white/40">· {m.email}</span>
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{m.message}</p>
              <p className="mt-2 text-xs text-white/30">
                {new Date(m.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggle(m.id, !m.read)}
                disabled={pending}
                className="text-white/60 hover:text-white disabled:opacity-50"
              >
                {m.read ? "Marcar não lida" : "Marcar lida"}
              </button>
              <a href={`mailto:${m.email}`} className="text-white/60 hover:text-white">
                Responder
              </a>
              <button
                type="button"
                onClick={() => remove(m.id)}
                disabled={pending}
                className="text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                Excluir
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
