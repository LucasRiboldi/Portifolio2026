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
      <button
        type="button"
        onClick={seed}
        disabled={pending}
        className="w-fit rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-400 disabled:opacity-60"
      >
        {pending ? "Populando…" : "Popular banco com o conteúdo atual"}
      </button>
      {msg && <p className="text-sm text-emerald-400">{msg}</p>}
      {err && <p className="text-sm text-red-400">{err}</p>}
    </div>
  )
}
