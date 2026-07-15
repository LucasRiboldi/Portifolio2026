"use client"

import { useMemo, useState } from "react"

import type { WikiRow } from "@/lib/repos/dev"

function plain(md: string) {
  return md.replace(/[#*`>_[\]-]/g, "").replace(/\s+/g, " ").trim()
}

export function WikiView({ pages }: { pages: WikiRow[] }) {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return pages
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.body.toLowerCase().includes(term),
    )
  }, [q, pages])

  const byCategory = useMemo(() => {
    return filtered.reduce<Record<string, WikiRow[]>>((acc, p) => {
      ;(acc[p.category] ??= []).push(p)
      return acc
    }, {})
  }, [filtered])

  return (
    <div>
      <div className="dv-controls">
        <input
          className="dv-search"
          placeholder="buscar na wiki…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="dv-count">{filtered.length} página(s)</span>
      </div>

      <div className="mt-6 space-y-8">
        {Object.entries(byCategory).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--d-orange)" }}>
              {category}
            </h2>
            <div className="dv-grid" style={{ marginTop: 0 }}>
              {items.map((w) => (
                <article key={w.id} className="dv-card">
                  <h3>{w.title}</h3>
                  <p>{plain(w.body).slice(0, 160)}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
        {filtered.length === 0 && <p className="dv-empty">Nada encontrado para “{q}”.</p>}
      </div>
    </div>
  )
}
