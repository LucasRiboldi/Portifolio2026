"use client"

import { useMemo, useState } from "react"
import { highlight } from "sugar-high"

import type { SnippetRow } from "@/lib/repos/dev"
import { CopyButton } from "./copy-button"

export function SnippetsView({ snippets }: { snippets: SnippetRow[] }) {
  const [lang, setLang] = useState<string>("all")
  const languages = useMemo(
    () => ["all", ...Array.from(new Set(snippets.map((s) => s.language)))],
    [snippets],
  )
  const filtered = lang === "all" ? snippets : snippets.filter((s) => s.language === lang)

  return (
    <div>
      <div className="dv-controls">
        {languages.map((l) => (
          <button key={l} className="dv-filter" data-on={l === lang} onClick={() => setLang(l)}>
            {l === "all" ? "todas" : l}
          </button>
        ))}
        <span className="dv-count">{filtered.length} snippet(s)</span>
      </div>

      <div className="mt-6 space-y-5">
        {filtered.map((s) => (
          <article key={s.id} className="dv-card dv-snippet">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3>{s.title}</h3>
              <div className="flex items-center gap-2">
                <span className="dv-tag">{s.language}</span>
                <CopyButton text={s.code} label="copiar código" />
              </div>
            </div>
            {s.description && <p>{s.description}</p>}
            {s.code && (
              <pre className="dv-code mt-3">
                <code dangerouslySetInnerHTML={{ __html: highlight(s.code) }} />
              </pre>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
