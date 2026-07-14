"use client"

/**
 * Seções de marketing (Aranhaverso) — Pricing · CTA · Newsletter.
 * Data-driven, responsivas, identidade comic.
 */

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SvButton } from "@/components/ui/sv-button"
import { SvInput } from "@/components/ui/sv-input"

/* ---------------- Pricing ---------------- */
export interface PricingPlan {
  name: string
  price: string
  period?: string
  features: string[]
  featured?: boolean
  cta?: string
}
export function SvPricing({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={cn(
            "relative flex flex-col rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 transition-transform hover:-translate-y-1",
            p.featured ? "shadow-[var(--elevation-4)] lg:-translate-y-3 lg:scale-105" : "shadow-[var(--elevation-2)]"
          )}
          style={p.featured ? { borderColor: "var(--sv-magenta)" } : undefined}
        >
          {p.featured && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg] rounded-full border-2 border-black bg-[var(--sv-yellow)] px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-black shadow-[var(--elevation-1)]">
              Popular
            </span>
          )}
          <h3 className="sv-heavy text-sm uppercase tracking-wide text-[var(--sv-cyan)]">{p.name}</h3>
          <div className="mt-3 flex items-end gap-1">
            <span className="font-[family-name:var(--font-display)] text-4xl text-white [-webkit-text-stroke:1px_#000]">{p.price}</span>
            {p.period && <span className="mb-1 text-xs text-white/40">/{p.period}</span>}
          </div>
          <ul className="mt-4 flex flex-1 flex-col gap-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--sv-lime)]" strokeWidth={3} />
                {f}
              </li>
            ))}
          </ul>
          <SvButton className="mt-6 w-full" color={p.featured ? "magenta" : "cyan"} variant={p.featured ? "primary" : "secondary"}>
            {p.cta ?? "Escolher"}
          </SvButton>
        </div>
      ))}
    </div>
  )
}

/* ---------------- CTA ---------------- */
export function SvCTA({ title, subtitle, primary, secondary }: { title: string; subtitle?: string; primary?: string; secondary?: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border-[3px] border-black p-8 text-center shadow-[var(--elevation-3)]" style={{ background: "var(--gradient-accent)" }}>
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(#000_1.4px,transparent_1.6px)] [background-size:10px_10px]" aria-hidden />
      <div className="relative">
        <h2 className="font-[family-name:var(--font-display)] text-3xl uppercase text-black sm:text-4xl [-webkit-text-stroke:1px_#fff]">{title}</h2>
        {subtitle && <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-black/80">{subtitle}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {primary && <SvButton color="violet" pop="GO!">{primary}</SvButton>}
          {secondary && <SvButton variant="secondary" color="cyan" className="!border-black !text-black">{secondary}</SvButton>}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Newsletter ---------------- */
export function SvNewsletter({ title = "Assine o multiverso", subtitle }: { title?: string; subtitle?: string }) {
  const [sent, setSent] = React.useState(false)
  return (
    <div className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-2)]">
      <h3 className="sv-display text-2xl uppercase text-white">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start"
        onSubmit={(e) => { e.preventDefault(); setSent(true) }}
      >
        <div className="flex-1">
          <SvInput type="email" placeholder="voce@dominio.com" required aria-label="E-mail" success={sent ? "Inscrito! 🎉" : undefined} />
        </div>
        <SvButton type="submit" color="lime">{sent ? "Feito!" : "Assinar"}</SvButton>
      </form>
    </div>
  )
}
