"use client"

/**
 * SvData — exibição de dados & navegação (Design System).
 * ------------------------------------------------------------------------
 * SvChip · SvTag · SvPagination · SvBreadcrumb · SvTabs · SvAccordion
 *
 * Criatividade: pílulas comic, tabs com "sticker" ativo, accordion com
 * disclosure spring. Acessível: aria-current, role=tablist/tab, aria-expanded.
 */

import * as React from "react"
import { X, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SvColor } from "@/components/ui/sv-button"

const BG: Record<SvColor, string> = {
  magenta: "var(--sv-magenta)", cyan: "var(--sv-cyan)", yellow: "var(--sv-yellow)",
  lime: "var(--sv-lime)", violet: "var(--sv-violet)", orange: "var(--sv-orange)",
}

/* ---------------- Chip (dismissível) ---------------- */
export function SvChip({ children, onRemove, color = "cyan" }: { children: React.ReactNode; onRemove?: () => void; color?: SvColor }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black px-3 py-1 text-xs font-bold text-black shadow-[var(--elevation-1)]" style={{ background: BG[color] }}>
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remover" className="grid size-4 place-items-center rounded-full transition-colors hover:bg-black/20">
          <X className="size-3" />
        </button>
      )}
    </span>
  )
}

/* ---------------- Tag (rótulo estático) ---------------- */
export function SvTag({ children, color = "violet" }: { children: React.ReactNode; color?: SvColor }) {
  return (
    <span className="inline-flex items-center rounded border-2 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide" style={{ borderColor: BG[color], color: BG[color] }}>
      {children}
    </span>
  )
}

/* ---------------- Pagination ---------------- */
export function SvPagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center gap-1.5">
      <PageBtn disabled={page === 1} onClick={() => onChange(page - 1)}>‹</PageBtn>
      {pages.map((p) => (
        <PageBtn key={p} active={p === page} onClick={() => onChange(p)} current={p === page}>{p}</PageBtn>
      ))}
      <PageBtn disabled={page === total} onClick={() => onChange(page + 1)}>›</PageBtn>
    </nav>
  )
}
function PageBtn({ children, active, disabled, current, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; current?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-current={current ? "page" : undefined}
      className={cn(
        "grid size-9 place-items-center rounded-md border-[3px] border-black text-sm font-bold transition-all disabled:opacity-30",
        active ? "bg-[var(--sv-magenta)] text-white shadow-[var(--elevation-2)]" : "bg-[var(--sv-ink-2)] text-white/70 hover:-translate-y-0.5 hover:text-[var(--sv-cyan)]"
      )}
    >
      {children}
    </button>
  )
}

/* ---------------- Breadcrumb ---------------- */
export function SvBreadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <li key={it.label} className="flex items-center gap-1.5">
              {it.href && !last ? (
                <a href={it.href} className="text-white/50 transition-colors hover:text-[var(--sv-cyan)]">{it.label}</a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-bold text-[var(--sv-yellow)]" : "text-white/50"}>{it.label}</span>
              )}
              {!last && <ChevronRight className="size-3 text-white/30" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ---------------- Tabs ---------------- */
export function SvTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id)
  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b-[3px] border-black pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "sv-heavy rounded-md px-3 py-1.5 text-xs uppercase tracking-wide transition-all",
              active === t.id ? "border-2 border-black bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]" : "text-white/60 hover:text-[var(--sv-cyan)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id} className="pt-4 text-sm text-white/75">
          {t.content}
        </div>
      ))}
    </div>
  )
}

/* ---------------- Accordion ---------------- */
export function SvAccordion({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null)
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => {
        const isOpen = open === it.id
        return (
          <div key={it.id} className="overflow-hidden rounded-md border-[3px] border-black bg-[var(--sv-ink-2)]">
            <button
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : it.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="sv-heavy text-sm uppercase tracking-wide text-white">{it.title}</span>
              <ChevronDown className={cn("size-4 shrink-0 text-[var(--sv-cyan)] transition-transform", isOpen && "rotate-180")} />
            </button>
            <div className={cn("grid transition-all duration-[var(--duration-normal)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-sm text-white/70">{it.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
