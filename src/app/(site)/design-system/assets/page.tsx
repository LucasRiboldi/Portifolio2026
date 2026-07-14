import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid h-28 place-items-center overflow-hidden rounded-lg border-[3px] border-black shadow-[var(--elevation-2)]">
        {children}
      </div>
      <span className="text-center text-xs uppercase tracking-wide text-white/50">{label}</span>
    </div>
  )
}

export default function AssetsPage() {
  return (
    <div>
      <ComicHeader kicker="Fase 5 · Assets" title="Biblioteca de" highlight="assets" />
      <DsLead>Marca, ícones e texturas que compõem a identidade Aranhaverso.</DsLead>

      <DsSectionTitle id="logo">Logo & Marca</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Swatch label="Logo · dark">
          <span className="font-[family-name:var(--font-display)] text-4xl uppercase text-white">
            LR<span className="sv-rainbow">.</span>
          </span>
        </Swatch>
        <Swatch label="Logo · sobre cor">
          <span className="grid h-full w-full place-items-center bg-[var(--sv-magenta)] font-[family-name:var(--font-display)] text-4xl uppercase text-white [-webkit-text-stroke:1px_#000]">
            LR.
          </span>
        </Swatch>
        <Swatch label="Símbolo">
          <span className="grid size-16 place-items-center rounded-full border-[3px] border-black bg-[var(--sv-yellow)] font-[family-name:var(--font-display)] text-2xl text-black">
            LR
          </span>
        </Swatch>
      </div>

      <DsSectionTitle id="social">Ícones Sociais</DsSectionTitle>
      <div className="flex flex-wrap gap-3">
        {[GithubIcon, LinkedinIcon].map((Icon, i) => (
          <div key={i} className="grid size-14 place-items-center rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] text-white shadow-[var(--elevation-1)] transition-transform hover:-translate-y-1 hover:text-[var(--sv-cyan)]">
            <Icon className="size-6" />
          </div>
        ))}
      </div>

      <DsSectionTitle id="textures">Texturas</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Swatch label="Halftone (Ben-Day)">
          <div className="h-full w-full bg-[var(--sv-ink-2)] [background-image:radial-gradient(var(--sv-magenta)_1.4px,transparent_1.6px)] [background-size:10px_10px]" />
        </Swatch>
        <Swatch label="Halftone cyan">
          <div className="h-full w-full bg-[var(--sv-ink-2)] [background-image:radial-gradient(var(--sv-cyan)_1.4px,transparent_1.6px)] [background-size:12px_12px]" />
        </Swatch>
        <Swatch label="Speedlines">
          <div className="h-full w-full bg-[var(--sv-ink)] [background:repeating-conic-gradient(from_0deg_at_50%_50%,rgba(255,230,0,0.15)_0deg_2deg,transparent_2deg_8deg)]" />
        </Swatch>
      </div>

      <DsSectionTitle id="backgrounds">Backgrounds & Gradientes</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Swatch label="gradient-accent">
          <div className="h-full w-full" style={{ background: "var(--gradient-accent)" }} />
        </Swatch>
        <Swatch label="gradient-rainbow">
          <div className="h-full w-full" style={{ background: "var(--gradient-rainbow)" }} />
        </Swatch>
        <Swatch label="Canvas ink">
          <div className="h-full w-full" style={{ background: "linear-gradient(160deg, var(--sv-ink), var(--sv-ink-2))" }} />
        </Swatch>
      </div>
    </div>
  )
}
