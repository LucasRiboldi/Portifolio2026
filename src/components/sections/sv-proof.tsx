"use client"

/**
 * Seções de prova social (Aranhaverso) — Stats · Testimonials · LogosGrid/Partners.
 */

import * as React from "react"
import { Quote } from "lucide-react"

/* ---------------- Statistics ---------------- */
export interface Stat { value: string; label: string; color?: string }
export function SvStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 text-center shadow-[var(--elevation-2)] transition-transform hover:-translate-y-1 hover:rotate-[-1deg]">
          <div className="font-[family-name:var(--font-display)] text-4xl [-webkit-text-stroke:1px_#000]" style={{ color: s.color ?? "var(--sv-magenta)" }}>
            {s.value}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-white/55">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Testimonials ---------------- */
export interface Testimonial { quote: string; name: string; role?: string; color?: string }
export function SvTestimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <figure key={t.name} className="relative flex flex-col rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-2)]">
          <Quote className="absolute -top-3 right-4 size-8 rotate-6" style={{ color: t.color ?? "var(--sv-cyan)" }} fill="currentColor" />
          <blockquote className="flex-1 text-sm italic leading-relaxed text-white/80">“{t.quote}”</blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-black font-[family-name:var(--font-heavy)] text-sm text-black"
              style={{ background: t.color ?? "var(--sv-cyan)" }}
            >
              {t.name.charAt(0)}
            </span>
            <div>
              <div className="sv-heavy text-xs uppercase tracking-wide text-white">{t.name}</div>
              {t.role && <div className="text-[0.7rem] text-white/45">{t.role}</div>}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------------- Logos Grid / Partners ---------------- */
export function SvLogosGrid({ logos, title }: { logos: string[]; title?: string }) {
  return (
    <div>
      {title && <p className="mb-4 text-center text-xs uppercase tracking-widest text-white/40">{title}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {logos.map((l) => (
          <div key={l} className="grid h-16 place-items-center rounded-md border-2 border-white/15 bg-white/5 text-sm font-bold uppercase tracking-wide text-white/50 transition-colors hover:border-[var(--sv-cyan)] hover:text-[var(--sv-cyan)]">
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
