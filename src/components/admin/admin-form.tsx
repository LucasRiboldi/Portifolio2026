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
    <form onSubmit={onSubmit} className="mm-card max-w-2xl space-y-5 p-6">
      {children}
      {state && (
        <p
          className="rounded-lg p-3 text-sm"
          style={
            state.ok
              ? { background: "var(--mm-light-success)", color: "var(--mm-success)" }
              : { background: "var(--mm-light-error)", color: "var(--mm-error)" }
          }
        >
          {state.msg}
        </p>
      )}
      <button type="submit" disabled={pending} className="mm-btn mm-btn-primary">
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
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="mm-label">
        {label}
      </label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={3} className="mm-textarea" placeholder={placeholder} />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} className="mm-input" placeholder={placeholder} />
      )}
    </div>
  )
}
