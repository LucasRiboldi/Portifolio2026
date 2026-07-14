"use client"

/**
 * Seções de pessoas & processo (Aranhaverso) — Team · Timeline.
 */

import * as React from "react"

/* ---------------- Team ---------------- */
export interface Member { name: string; role: string; color?: string }
export function SvTeam({ members }: { members: Member[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((m) => (
        <div key={m.name} className="group rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 text-center shadow-[var(--elevation-2)] transition-transform hover:-translate-y-1">
          <div
            className="mx-auto grid size-20 place-items-center rounded-full border-[3px] border-black font-[family-name:var(--font-display)] text-2xl text-black transition-transform group-hover:rotate-6"
            style={{ background: m.color ?? "var(--sv-magenta)" }}
          >
            {m.name.split(" ").map((w) => w.charAt(0)).slice(0, 2).join("")}
          </div>
          <div className="sv-heavy mt-3 text-sm uppercase tracking-wide text-white">{m.name}</div>
          <div className="text-xs text-white/50">{m.role}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Timeline ---------------- */
export interface TimelineItem { time: string; title: string; description?: string; color?: string }
export function SvTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-3 border-l-[3px] border-white/15">
      {items.map((it, i) => (
        <li key={i} className="relative mb-6 pl-6 last:mb-0">
          <span
            className="absolute -left-[11px] top-1 size-5 rounded-full border-[3px] border-black shadow-[var(--elevation-1)]"
            style={{ background: it.color ?? "var(--sv-cyan)" }}
            aria-hidden
          />
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--sv-yellow)]">{it.time}</span>
          <h4 className="sv-heavy text-sm uppercase tracking-wide text-white">{it.title}</h4>
          {it.description && <p className="mt-0.5 text-sm text-white/60">{it.description}</p>}
        </li>
      ))}
    </ol>
  )
}
