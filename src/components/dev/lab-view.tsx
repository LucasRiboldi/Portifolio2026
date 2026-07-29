"use client"

import { useState } from "react"

import type { LabRow } from "@/lib/repos/dev"
import {
  DevPanel,
  DevPanelHead,
  DevPanelFoot,
  DevExternalLink,
  TagList,
} from "@/components/dev/ui/dev-primitives"

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
      {/* `role="group"` + `aria-pressed`: os filtros eram botões mudos — o
          estado ligado existia só como cor (`data-on`), invisível para quem
          não vê a tela. `type="button"` porque um <button> sem tipo submete o
          formulário mais próximo. */}
      <div className="dv-controls" role="group" aria-label="Filtrar por estado">
        {filters.map((s) => (
          <button
            key={s}
            type="button"
            className="dv-filter"
            data-on={s === status}
            aria-pressed={s === status}
            onClick={() => setStatus(s)}
          >
            {s === "all" ? "todos" : STATUS_LABEL[s] ?? s}
          </button>
        ))}
        {/* `aria-live`: a contagem muda por interação, e a mudança precisa ser
            anunciada — senão o filtro parece não ter feito nada. */}
        <span className="dv-count" aria-live="polite">
          {filtered.length} experimento(s)
        </span>
      </div>

      <div className="dv-objects mt-5">
        {filtered.map((x) => (
          <DevPanel key={x.id}>
            <DevPanelHead
              title={x.title}
              badge={<span className={`dv-status ${x.status}`}>{STATUS_LABEL[x.status] ?? x.status}</span>}
            />
            <p>{x.description}</p>
            <TagList items={x.stack} />
            {(x.demo_url || x.repo_url) && (
              <DevPanelFoot>
                {x.demo_url && <DevExternalLink href={x.demo_url}>demo</DevExternalLink>}
                {x.repo_url && <DevExternalLink href={x.repo_url}>repositório</DevExternalLink>}
              </DevPanelFoot>
            )}
          </DevPanel>
        ))}
      </div>
    </div>
  )
}
