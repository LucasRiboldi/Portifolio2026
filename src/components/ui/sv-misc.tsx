"use client"

/**
 * SvMisc — componentes utilitários que faltavam na biblioteca.
 * SvAvatar · SvKbd · SvCallout · SvDivider · SvSpinner
 */
import * as React from "react"
import { cn } from "@/lib/utils"
import type { SvColor } from "@/components/ui/sv-button"

const BG: Record<SvColor, string> = {
  magenta: "var(--sv-magenta)", cyan: "var(--sv-cyan)", yellow: "var(--sv-yellow)",
  lime: "var(--sv-lime)", violet: "var(--sv-violet)", orange: "var(--sv-orange)",
}

/* Avatar comic (iniciais ou imagem) */
export function SvAvatar({ name, src, size = 44, color = "magenta" }: { name: string; src?: string; size?: number; color?: SvColor }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-black font-[family-name:var(--font-heavy)] text-black shadow-[var(--elevation-1)]"
      style={{ width: size, height: size, background: BG[color], fontSize: size * 0.36 }}
      aria-label={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  )
}

/* Tecla (kbd) */
export function SvKbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.6em] items-center justify-center rounded border-2 border-black bg-[var(--sv-ink-2)] px-1.5 py-0.5 font-mono text-xs text-white shadow-[2px_2px_0_0_#000]">
      {children}
    </kbd>
  )
}

/* Callout (destaque de nota) */
export function SvCallout({ color = "cyan", title, children }: { color?: SvColor; title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-4" style={{ borderLeftWidth: 8, borderLeftColor: BG[color] }}>
      {title && <p className="sv-heavy mb-1 text-xs uppercase tracking-wide" style={{ color: BG[color] }}>{title}</p>}
      <div className="text-sm text-white/75">{children}</div>
    </div>
  )
}

/* Divisor com onomatopeia opcional */
export function SvDivider({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-[3px] flex-1 rounded" style={{ background: "var(--gradient-accent)" }} />
      {label && <span className="font-[family-name:var(--font-display)] text-sm uppercase text-white/60">{label}</span>}
      <span className="h-[3px] flex-1 rounded" style={{ background: "var(--gradient-accent)" }} />
    </div>
  )
}

/* Spinner comic reutilizável */
export function SvSpinner({ size = 24, color = "cyan" }: { size?: number; color?: SvColor }) {
  return (
    <span role="status" aria-label="Carregando" className="inline-block" style={{ width: size, height: size, color: BG[color] }}>
      <span className="block h-full w-full animate-spin rounded-full border-[3px] border-black/25 border-t-current" />
    </span>
  )
}
