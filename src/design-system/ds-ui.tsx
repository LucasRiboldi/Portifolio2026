/**
 * ds-ui.tsx — apresentacionais compartilhados das páginas do
 * Design System. Server Components puros (sem estado).
 */
import type { ItemStatus } from "./registry"

const STATUS_STYLE: Record<ItemStatus, { label: string; className: string }> = {
  ready: { label: "Pronto", className: "border-[var(--c-success-400)] text-[var(--c-success-300)] bg-[var(--c-success-900)]/40" },
  wip: { label: "Em obra", className: "border-[var(--c-warning-300)] text-[var(--c-warning-200)] bg-[var(--c-warning-900)]/40" },
  planned: { label: "Planejado", className: "border-white/25 text-white/55 bg-white/5" },
}

export function StatusPill({ status }: { status: ItemStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${s.className}`}>
      {s.label}
    </span>
  )
}

export function DsSectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="sv-display art-chroma-soft mb-4 mt-10 text-2xl uppercase tracking-wide">
      <span className="art-ghost opacity-50 text-[var(--sv-cyan)]">{"//"}</span> {children}
    </h2>
  )
}

export function DsCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`art-paper rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)] ${className}`}>
      {children}
    </div>
  )
}

export function DsLead({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-sm leading-relaxed text-white/70">{children}</p>
}
