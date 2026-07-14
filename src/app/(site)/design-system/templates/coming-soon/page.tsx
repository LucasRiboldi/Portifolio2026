import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SvNewsletter } from "@/components/sections/sv-marketing"
import { BoltCluster, MohawkSpider } from "@/components/design-system/punk-illustrations"

export const metadata = { title: "Template · Coming soon" }

const WORD = [["S", "magenta"], ["O", "cyan"], ["O", "yellow"], ["N", "lime"]] as const

export default function ComingSoonTemplatePage() {
  return (
    <div className="fx-bolts fx-grain relative overflow-hidden rounded-xl border-[3px] border-black bg-[radial-gradient(circle_at_70%_30%,rgba(255,45,149,0.4),transparent_45%),linear-gradient(160deg,#241019,#0a0612)] p-8">
      <div className="fx-screentone pointer-events-none absolute inset-0 opacity-15" style={{ ["--st-color" as string]: "rgba(0,229,255,0.6)" } as React.CSSProperties} />
      <Link href="/design-system/templates" className="relative mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>

      <div className="relative mx-auto max-w-lg text-center">
        <MohawkSpider className="mx-auto h-28 w-28 fx-float" />
        <p className="fx-font-monoton fx-neon mt-4 text-sm uppercase tracking-[0.4em]">em breve</p>

        <div className="fx-ransom mt-3 justify-center text-5xl uppercase sm:text-7xl">
          {WORD.map(([ch, color], i) => (
            <span key={i} className="fx-ransom-piece" style={{ background: `var(--sv-${color})`, color: color === "magenta" ? "#fff" : "#000", transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>{ch}</span>
          ))}
        </div>

        <p className="mt-5 text-sm text-white/70">
          Uma nova dimensão está sendo desenhada. Deixe seu e-mail e seja o primeiro a saber.
        </p>

        <div className="mx-auto mt-6 max-w-sm text-left">
          <SvNewsletter title="Avise-me" subtitle="Sem spam. Só o salto." />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 opacity-60">
          <BoltCluster className="h-6 w-6" /><span className="text-xs uppercase tracking-widest text-white/40">Terra-2026</span><BoltCluster className="h-6 w-6 -scale-x-100" />
        </div>
      </div>
    </div>
  )
}
