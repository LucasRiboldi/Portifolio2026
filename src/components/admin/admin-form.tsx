"use client"

import { useState, useTransition, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import type { ActionResult } from "@/lib/admin/action-helpers"

interface AdminFormProps {
  action: (formData: FormData) => Promise<ActionResult>
  children: ReactNode
  submitLabel?: string
}

export function AdminForm({ action, children, submitLabel = "Salvar" }: AdminFormProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [state, setState] = useState<{ ok: boolean; msg: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setState(null)
    start(async () => {
      const res = await action(formData)
      if (res.ok) {
        setState({ ok: true, msg: "Salvo com sucesso." })
        router.refresh()
      } else {
        setState({ ok: false, msg: res.error })
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {children}
      {state && (
        <p
          className={`rounded-lg border p-3 text-sm ${
            state.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {state.msg}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Salvando…" : submitLabel}
      </button>
    </form>
  )
}

/** Input rotulado reutilizável para as seções bespoke. */
export function Field({
  name,
  label,
  defaultValue,
  textarea,
  placeholder,
}: {
  name: string
  label: string
  defaultValue?: string
  textarea?: boolean
  placeholder?: string
}) {
  const cls =
    "w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-white/80">
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={3} className={cls} placeholder={placeholder} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className={cls} placeholder={placeholder} />
      )}
    </div>
  )
}
