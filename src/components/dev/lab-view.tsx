"use client"

import { useState } from "react"

import type { LabRow } from "@/lib/repos/dev"

const STATUS_LABEL: Record<string, string> = {
  wip: "WIP",
  playtest: "Playtest",
  stable: "Estável",
  archived: "Arquivado",
}
const ORDER = ["all", "wip", "playtest", "stable", "archived"]

export function LabView({ items }: { items: LabRow[] }) {
  const [status, setStatus] = useState("all")
  const present = new Set(items.map((i) => i.status))
  const filters = ORDER.filter((s) => s === "all" || present.has(s))
  const filtered = status === "all" ? items : items.filter((i) => i.status === status)

  return (
    <div>
      <div className="dv-controls">
        {filters.map((s) => (
          <button key={s} className="dv-filter" data-on={s === status} onClick={() => setStatus(s)}>
            {s === "all" ? "todos" : STATUS_LABEL[s] ?? s}
          </button>
        ))}
        <span className="dv-count">{filtered.length} experimento(s)</span>
      </div>

      <div className="dv-grid">
        {filtered.map((x) => (
          <article key={x.id} className="dv-card">
            <div className="flex items-center justify-between gap-2">
              <h3>{x.title}</h3>
              <span className={`dv-status ${x.status}`}>{STATUS_LABEL[x.status] ?? x.status}</span>
            </div>
            <p>{x.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {x.stack.map((t) => (
                <span key={t} className="dv-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              {x.demo_url && (
                <a href={x.demo_url} target="_blank" rel="noreferrer" className="dv-link">
                  ❯ demo
                </a>
              )}
              {x.repo_url && (
                <a href={x.repo_url} target="_blank" rel="noreferrer" className="dv-link">
                  ❯ repo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
