import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvButton } from "@/components/ui/sv-button"
import { SvStats, SvLogosGrid } from "@/components/sections/sv-proof"
import { SvPricing, SvCTA } from "@/components/sections/sv-marketing"
import { BoltCluster, StarBurst } from "@/components/design-system/punk-illustrations"

export const metadata = { title: "Template · Landing" }

export default function LandingTemplatePage() {
  return (
    <div>
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader kicker="06 · Template" title="Landing" highlight="page" />

      {/* HERO com bolts + screentone */}
      <section className="fx-bolts relative overflow-hidden rounded-xl border-[3px] border-black bg-[radial-gradient(circle_at_20%_10%,rgba(123,47,247,0.5),transparent_45%),linear-gradient(160deg,#140a24,#0a0612)] p-8 shadow-[var(--elevation-4)]">
        <div className="fx-screentone pointer-events-none absolute inset-0 opacity-15" style={{ ["--st-color" as string]: "rgba(255,45,149,0.6)" } as React.CSSProperties} />
        <StarBurst className="absolute -right-6 -top-6 hidden h-28 w-28 fx-float sm:block" />
        <div className="relative max-w-xl">
          <span className="sv-sticker sv-sticker-cyan text-xs">Novo · Terra-2026</span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl uppercase leading-[0.9] text-white sm:text-6xl [-webkit-text-stroke:1.5px_#000]">
            Construa em <span className="sv-rainbow art-bloom">outra dimensão</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/70">
            Um layout de landing pronto, montado com componentes e efeitos do Design System.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <SvButton color="magenta" pop="GO!">Começar grátis</SvButton>
            <SvButton variant="outline" color="cyan">Ver demo</SvButton>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <SvStats stats={[
          { value: "20+", label: "Dimensões", color: "var(--sv-magenta)" },
          { value: "40+", label: "Componentes", color: "var(--sv-cyan)" },
          { value: "16", label: "Motions", color: "var(--sv-lime)" },
          { value: "98%", label: "Acessível", color: "var(--sv-yellow)" },
        ]} />
      </div>

      <div className="mt-10 flex items-center justify-center gap-3">
        <BoltCluster className="h-8 w-8" />
        <p className="text-center text-xs uppercase tracking-[0.3em] text-white/40">Planos</p>
        <BoltCluster className="h-8 w-8 -scale-x-100" />
      </div>
      <div className="mt-4">
        <SvPricing plans={[
          { name: "Origem", price: "R$0", period: "mês", features: ["1 dimensão", "Tokens base"], cta: "Começar" },
          { name: "Multiverso", price: "R$49", period: "mês", featured: true, features: ["Tudo ilimitado", "Export Figma", "Suporte"], cta: "Assinar" },
          { name: "Corp", price: "Custom", features: ["SSO", "SLA"], cta: "Contato" },
        ]} />
      </div>

      <div className="mt-10"><SvLogosGrid title="Confiado por realidades do multiverso" logos={["Oscorp", "Alchemax", "Horizon", "Stark", "Wayne", "Bugle"]} /></div>

      <div className="mt-10"><SvCTA title="Pronto para saltar?" subtitle="Comece hoje no Design System." primary="Começar agora" secondary="Ver docs" /></div>
    </div>
  )
}
