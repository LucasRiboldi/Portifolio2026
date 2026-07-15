"use client"

import { useState } from "react"

import type { IdeaRow } from "@/lib/repos/dev"

const STATUS_LABEL: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  building: "Em construção",
  paused: "Pausado",
  done: "Concluído",
}
const ORDER = ["all", "idea", "mvp", "building", "paused", "done"]

export function IdeasView({ ideas }: { ideas: IdeaRow[] }) {
  const [status, setStatus] = useState("all")
  const present = new Set(ideas.map((i) => i.status))
  const filters = ORDER.filter((s) => s === "all" || present.has(s))
  const filtered = status === "all" ? ideas : ideas.filter((i) => i.status === status)

  return (
    <div>
      <div className="dv-controls">
        {filters.map((s) => (
          <button key={s} className="dv-filter" data-on={s === status} onClick={() => setStatus(s)}>
            {s === "all" ? "todas" : STATUS_LABEL[s] ?? s}
          </button>
        ))}
        <span className="dv-count">{filtered.length} ideia(s)</span>
      </div>

      <div className="dv-grid">
        {filtered.map((i) => (
          <article key={i.id} className="dv-card">
            <div className="flex items-center justify-between gap-2">
              <h3>{i.title}</h3>
              <span className={`dv-status ${i.status}`}>{STATUS_LABEL[i.status] ?? i.status}</span>
            </div>
            <p>{i.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {i.tags.map((t) => (
                <span key={t} className="dv-tag">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
