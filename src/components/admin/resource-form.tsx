"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import type { FieldConfig } from "@/lib/admin/resources"
import { saveResource } from "@/app/admin/crud-actions"
import { MediaPicker } from "@/components/admin/media-picker"
import { blocosParaTexto, jsonParaTexto } from "@/lib/admin/materia-format"

interface ResourceFormProps {
  slug: string
  singular: string
  fields: FieldConfig[]
  id: string | null
  initial: Record<string, unknown>
}

function toInputValue(field: FieldConfig, raw: unknown): string {
  if (field.type === "tags") return Array.isArray(raw) ? raw.join(", ") : ""
  // Os dois tipos abaixo guardam jsonb no banco e texto no formulário. A
  // serialização vem do mesmo módulo que a validação usa no servidor — é o
  // que impede as duas pontas de divergirem.
  if (field.type === "prose") return blocosParaTexto(raw)
  if (field.type === "json") return jsonParaTexto(raw)
  if (raw == null) return ""
  return String(raw)
}

const inputCls = "mm-input"

export function ResourceForm({ slug, singular, fields, id, initial }: ResourceFormProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    start(async () => {
      const res = await saveResource(slug, id, formData)
      if (res.ok) {
        router.push(`/admin/${slug}`)
        router.refresh()
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="mm-card max-w-2xl space-y-5 p-6">
      {fields.map((field) => {
        const value = toInputValue(field, initial[field.name])
        return (
          <div key={field.name} className="space-y-1.5">
            <label htmlFor={field.name} className="mm-label">
              {field.label}
              {field.required && <span style={{ color: "var(--mm-error)" }}> *</span>}
            </label>

            {field.type === "textarea" && (
              <textarea id={field.name} name={field.name} defaultValue={value} rows={3} className={inputCls} />
            )}

            {field.type === "markdown" && (
              <textarea id={field.name} name={field.name} defaultValue={value} rows={12} className={`${inputCls} font-mono`} />
            )}

            {/* Prosa longa: a caixa é alta porque o corpo de uma matéria tem
                dezenas de linhas, e rolar dentro de uma janelinha de três
                linhas é o que faz quem escreve desistir do painel. */}
            {field.type === "prose" && (
              <textarea
                id={field.name}
                name={field.name}
                defaultValue={value}
                rows={20}
                spellCheck
                className={inputCls}
              />
            )}

            {field.type === "json" && (
              <textarea
                id={field.name}
                name={field.name}
                defaultValue={value}
                rows={8}
                spellCheck={false}
                className={`${inputCls} font-mono text-xs`}
              />
            )}

            {field.type === "select" && (
              <select id={field.name} name={field.name} defaultValue={value} className={inputCls}>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "boolean" && (
              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--mm-text-2)" }}>
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={initial[field.name] === true}
                  className="size-4 accent-[var(--mm-primary)]"
                />
                {field.label}
              </label>
            )}

            {field.type === "media" && (
              <MediaPicker
                name={field.name}
                defaultValue={value}
                inputClassName={inputCls}
                accept={field.accept}
              />
            )}

            {(field.type === "text" || field.type === "tags" || field.type === "number") && (
              <input
                id={field.name}
                name={field.name}
                type={field.type === "number" ? "number" : "text"}
                defaultValue={value}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )}

            {field.help && <p className="text-xs" style={{ color: "var(--mm-text-2)" }}>{field.help}</p>}
          </div>
        )
      })}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "var(--mm-light-error)", color: "var(--mm-error)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="mm-btn mm-btn-primary">
          {pending ? "Salvando…" : `Salvar ${singular.toLowerCase()}`}
        </button>
        <button type="button" onClick={() => router.push(`/admin/${slug}`)} className="mm-btn mm-btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  )
}
