"use client"

import { useState, useTransition } from "react"

import { runSyncContentAction } from "@/app/admin/actions"

/**
 * Publica no banco o conteúdo novo vindo do código (`src/data/*`).
 * Só insere o que falta — nada que você editou pelo painel é sobrescrito.
 */
export function SyncContentButton() {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  function sync() {
    setMsg(null)
    setErr(null)
    start(async () => {
      const res = await runSyncContentAction()
      if (!res.ok) {
        setErr(res.error)
        return
      }
      const added = Object.entries(res.report)
        .filter(([, items]) => items.length > 0)
        .map(([table, items]) => `${table}: ${items.join(", ")}`)
      setMsg(added.length ? `Publicado — ${added.join(" · ")}` : "Nada novo a publicar: o banco já está em dia.")
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={sync} disabled={pending} className="mm-btn w-fit">
        {pending ? "Publicando…" : "Publicar conteúdo novo do código"}
      </button>
      {msg && (
        <p className="text-sm" style={{ color: "var(--mm-success)" }}>
          {msg}
        </p>
      )}
      {err && (
        <p className="text-sm" style={{ color: "var(--mm-error)" }}>
          {err}
        </p>
      )}
    </div>
  )
}
