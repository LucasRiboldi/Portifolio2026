"use client"

import Link from "next/link"
import { useState } from "react"

import type { TutorialRow } from "@/lib/repos/prophet"

const DIFF: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}
const ORDER = ["all", "iniciante", "intermediario", "avancado"]

export function TutorialsView({ tutorials }: { tutorials: TutorialRow[] }) {
  const [diff, setDiff] = useState("all")
  const present = new Set(tutorials.map((t) => t.difficulty))
  const filters = ORDER.filter((d) => d === "all" || present.has(d))
  const filtered = diff === "all" ? tutorials : tutorials.filter((t) => t.difficulty === diff)

  return (
    <div>
      <div className="pr-controls">
        {filters.map((d) => (
          <button key={d} className="pr-filter" data-on={d === diff} onClick={() => setDiff(d)}>
            {d === "all" ? "Todos" : DIFF[d] ?? d}
          </button>
        ))}
      </div>

      <div className="pr-grid">
        {filtered.map((t) => (
          <Link key={t.id} href={`/prophet/oficina/${t.slug}`} className="pr-card pr-card-link">
            <span className="pr-badge">{DIFF[t.difficulty] ?? t.difficulty}</span>
            <h3 className="mt-2">{t.title}</h3>
            <p>{t.summary}</p>
            <span className="pr-link mt-2 inline-block">ler tutorial →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
