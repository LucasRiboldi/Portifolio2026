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
      <p className="rounded-xl border border-[color:var(--mm-border)] bg-[color:var(--mm-hover)] p-6 text-sm text-[color:var(--mm-text-2)]">
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
            m.read ? "border-[color:var(--mm-border)] bg-[color:var(--mm-surface)]" : "border-[color:var(--mm-success)] bg-[color:var(--mm-light-success)]"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {m.name} <span className="font-normal text-[color:var(--mm-text-2)]">· {m.email}</span>
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[color:var(--mm-text)]">{m.message}</p>
              <p className="mt-2 text-xs text-[color:var(--mm-text-2)]">
                {new Date(m.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggle(m.id, !m.read)}
                disabled={pending}
                className="text-[color:var(--mm-text-2)] hover:text-[color:var(--mm-text)] disabled:opacity-50"
              >
                {m.read ? "Marcar não lida" : "Marcar lida"}
              </button>
              <a href={`mailto:${m.email}`} className="text-[color:var(--mm-text-2)] hover:text-[color:var(--mm-text)]">
                Responder
              </a>
              <button
                type="button"
                onClick={() => remove(m.id)}
                disabled={pending}
                className="text-[color:var(--mm-error)] hover:opacity-70 disabled:opacity-50"
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
