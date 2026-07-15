"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import type { MechanicRow } from "@/lib/repos/prophet"

export function MechanicsView({ mechanics }: { mechanics: MechanicRow[] }) {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return mechanics
    return mechanics.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.summary.toLowerCase().includes(term) ||
        m.tags.some((t) => t.toLowerCase().includes(term)),
    )
  }, [q, mechanics])

  return (
    <div>
      <div className="pr-controls">
        <input
          className="pr-searchbox"
          placeholder="buscar mecânica…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        {filtered.map((m) => (
          <article key={m.id}>
            <Link href={`/prophet/mecanicas/${m.slug}`} className="pr-link">
              <h3 className="pr-headline" style={{ fontSize: "1.3rem" }}>
                {m.title}
              </h3>
            </Link>
            <p className="pr-stand">{m.summary}</p>
            <div className="mt-1">
              {m.tags.map((tag) => (
                <span key={tag} className="pr-tag">
                  {tag}
                </span>
              ))}
            </div>
            <hr className="pr-rule" />
          </article>
        ))}
        {filtered.length === 0 && <p className="pr-empty">Nada encontrado para “{q}”.</p>}
      </div>
    </div>
  )
}
