"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { deleteResource } from "@/app/admin/crud-actions"

interface Column {
  name: string
  label: string
}

interface ResourceListProps {
  slug: string
  label: string
  singular: string
  columns: Column[]
  rows: Record<string, unknown>[]
}

function renderCell(value: unknown): string {
  if (typeof value === "boolean") return value ? "✓" : "—"
  if (Array.isArray(value)) return value.join(", ")
  if (value == null) return "—"
  return String(value)
}

export function ResourceList({ slug, label, singular, columns, rows }: ResourceListProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  function onDelete(id: string) {
    if (!confirm(`Excluir este ${singular.toLowerCase()}?`)) return
    setBusyId(id)
    start(async () => {
      await deleteResource(slug, id)
      setBusyId(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{label}</h1>
          <p className="text-sm" style={{ color: "var(--mm-text-2)" }}>{rows.length} item(s)</p>
        </div>
        <Link href={`/admin/${slug}/new`} className="mm-btn mm-btn-primary">
          + Novo
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="mm-card p-6 text-sm" style={{ color: "var(--mm-text-2)" }}>
          Nenhum item ainda. Clique em “+ Novo” para criar.
        </p>
      ) : (
        <div className="mm-card overflow-hidden">
          <table className="mm-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.name}>{c.label}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = String(row.id)
                return (
                  <tr key={id}>
                    {columns.map((c) => (
                      <td key={c.name}>{renderCell(row[c.name])}</td>
                    ))}
                    <td className="text-right whitespace-nowrap">
                      <Link
                        href={`/admin/${slug}/${id}`}
                        className="mr-4 font-medium hover:underline"
                        style={{ color: "var(--mm-primary)" }}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        disabled={pending && busyId === id}
                        className="font-medium hover:underline disabled:opacity-50"
                        style={{ color: "var(--mm-error)" }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
