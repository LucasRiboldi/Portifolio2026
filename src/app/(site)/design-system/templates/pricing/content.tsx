"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvPricing } from "@/components/sections/sv-marketing"
import { SvSwitch } from "@/components/ui/sv-choice"

export function PricingTemplateContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [annual, setAnnual] = useState(false)
  const mult = annual ? 10 : 1 // 12 meses com 2 grátis
  const period = annual ? "ano" : "mês"

  return (
    <div className="fx-grain relative">
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader as={headingAs} kicker="06 · Template" title="Pricing" highlight="& planos" />

      <div className="mb-6 flex items-center justify-center gap-3 text-xs uppercase tracking-wide text-white/70">
        <span className={annual ? "text-white/40" : "text-[var(--sv-cyan)]"}>Mensal</span>
        <SvSwitch checked={annual} onChange={(e) => setAnnual(e.target.checked)} aria-label="Cobrança anual" />
        <span className={annual ? "text-[var(--sv-lime)]" : "text-white/40"}>Anual <span className="art-stamp ml-1 text-[0.6rem]" style={{ color: "var(--sv-lime)" }}>-17%</span></span>
      </div>

      <SvPricing plans={[
        { name: "Origem", price: "R$0", period, features: ["1 dimensão", "Tokens base", "Comunidade"], cta: "Começar" },
        { name: "Multiverso", price: `R$${49 * mult}`, period, featured: true, features: ["Dimensões ilimitadas", "Todos os componentes", "Export Figma", "Suporte prioritário"], cta: "Assinar" },
        { name: "Corporativo", price: `R$${199 * mult}`, period, features: ["SSO & auditoria", "SLA dedicado", "Onboarding"], cta: "Falar com vendas" },
      ]} />

      <p className="mt-6 text-center text-xs text-white/40">Todos os planos incluem atualizações do Design System.</p>
    </div>
  )
}
