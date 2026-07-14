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
          <p className="text-sm text-white/50">{rows.length} item(s)</p>
        </div>
        <Link
          href={`/admin/${slug}/new`}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          + Novo
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/50">
          Nenhum item ainda. Clique em “+ Novo” para criar.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] text-left text-white/50">
              <tr>
                {columns.map((c) => (
                  <th key={c.name} className="px-4 py-2 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = String(row.id)
                return (
                  <tr key={id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    {columns.map((c) => (
                      <td key={c.name} className="px-4 py-2.5 text-white/80">
                        {renderCell(row[c.name])}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/${slug}/${id}`}
                        className="mr-3 text-white/60 hover:text-white"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        disabled={pending && busyId === id}
                        className="text-red-400 hover:text-red-300 disabled:opacity-50"
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
