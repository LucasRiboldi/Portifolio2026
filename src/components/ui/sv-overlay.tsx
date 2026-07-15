"use client"

/**
 * SvOverlay — camadas flutuantes do Design System (Design System).
 * ------------------------------------------------------------------------
 * SvModal · SvDrawer · SvTooltip · SvPopover · SvDropdown · SvContextMenu
 *
 * Criatividade: painéis comic com hard-shadow, entrada em pop spring,
 * backdrop halftone. Acessível: Esc fecha, role=dialog/aria-modal, foco
 * inicial, fechar por clique-fora, retorno de foco básico.
 */

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---- hook: fecha no Esc e no clique-fora ---- */
function useDismiss(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [open, onClose, ref])
}

/* ---------------- Modal ---------------- */
export function SvModal({
  open, onClose, title, children, footer,
}: {
  open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; footer?: React.ReactNode
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  useDismiss(open, onClose, panelRef)
  React.useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-modal grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm sv-dots" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative w-[min(92vw,480px)] rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-5)] outline-none animate-[sv-toast-in_0.3s_var(--ease-spring)]"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          {title && <h2 className="sv-display text-2xl uppercase text-white">{title}</h2>}
          <button onClick={onClose} aria-label="Fechar" className="text-white/50 hover:text-white"><X className="size-5" /></button>
        </div>
        <div className="text-sm text-white/75">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

/* ---------------- Drawer ---------------- */
export function SvDrawer({
  open, onClose, side = "right", title, children,
}: {
  open: boolean; onClose: () => void; side?: "left" | "right"; title?: string; children?: React.ReactNode
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  useDismiss(open, onClose, panelRef)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-modal">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute top-0 h-full w-[min(88vw,340px)] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-5)]",
          side === "right" ? "right-0 border-l-[3px] animate-[sv-drawer-r_0.3s_var(--ease-spring)]" : "left-0 border-r-[3px] animate-[sv-drawer-l_0.3s_var(--ease-spring)]"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="sv-display text-xl uppercase text-white">{title}</h2>}
          <button onClick={onClose} aria-label="Fechar" className="text-white/50 hover:text-white"><X className="size-5" /></button>
        </div>
        <div className="text-sm text-white/75">{children}</div>
      </div>
    </div>
  )
}

/* ---------------- Tooltip (hover/focus, CSS) ---------------- */
export function SvTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group/tt relative inline-flex">
      <span tabIndex={0} className="outline-none" aria-describedby="tt">{children}</span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-90 whitespace-nowrap rounded border-2 border-black bg-[var(--sv-yellow)] px-2 py-1 text-xs font-bold text-black opacity-0 shadow-[var(--elevation-1)] transition-all group-hover/tt:scale-100 group-hover/tt:opacity-100 group-focus-within/tt:scale-100 group-focus-within/tt:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}

/* ---------------- Popover / Dropdown (click) ---------------- */
export function SvPopover({
  trigger, children, align = "start",
}: {
  trigger: (p: { open: boolean; toggle: () => void }) => React.ReactNode
  children: React.ReactNode
  align?: "start" | "end"
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useDismiss(open, () => setOpen(false), ref)
  return (
    <div ref={ref} className="relative inline-block">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-popover mt-2 min-w-[180px] rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-1.5 shadow-[var(--elevation-3)] animate-[sv-toast-in_0.2s_var(--ease-spring)]",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function SvMenuItem({ children, onSelect, danger }: { children: React.ReactNode; onSelect?: () => void; danger?: boolean }) {
  return (
    <button
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-sm transition-colors",
        danger ? "text-[var(--sv-orange)] hover:bg-[var(--sv-orange)]/15" : "text-white/80 hover:bg-[var(--sv-cyan)]/15 hover:text-[var(--sv-cyan)]"
      )}
    >
      {children}
    </button>
  )
}

/* ---------------- Context Menu (right-click) ---------------- */
export function SvContextMenu({ children, items }: { children: React.ReactNode; items: { label: string; onSelect?: () => void; danger?: boolean }[] }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  useDismiss(!!pos, () => setPos(null), ref)
  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          setPos({ x: e.clientX, y: e.clientY })
        }}
      >
        {children}
      </div>
      {pos && (
        <div
          ref={ref}
          role="menu"
          style={{ top: pos.y, left: pos.x }}
          className="fixed z-popover min-w-[180px] rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-1.5 shadow-[var(--elevation-3)] animate-[sv-toast-in_0.15s_var(--ease-spring)]"
        >
          {items.map((it) => (
            <SvMenuItem key={it.label} danger={it.danger} onSelect={() => { it.onSelect?.(); setPos(null) }}>
              {it.label}
            </SvMenuItem>
          ))}
        </div>
      )}
    </>
  )
}
