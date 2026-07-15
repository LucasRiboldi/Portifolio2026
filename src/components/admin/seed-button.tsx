"use client"

import { useState, useTransition } from "react"

import { runSeedAction } from "@/app/admin/actions"

export function SeedButton() {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  function seed() {
    setMsg(null)
    setErr(null)
    start(async () => {
      const res = await runSeedAction()
      if (res.ok) {
        setMsg("Seed concluído: " + JSON.stringify(res.report))
      } else {
        setErr(res.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={seed} disabled={pending} className="mm-btn mm-btn-primary w-fit">
        {pending ? "Populando…" : "Popular banco com o conteúdo atual"}
      </button>
      {msg && <p className="text-sm" style={{ color: "var(--mm-success)" }}>{msg}</p>}
      {err && <p className="text-sm" style={{ color: "var(--mm-error)" }}>{err}</p>}
    </div>
  )
}
