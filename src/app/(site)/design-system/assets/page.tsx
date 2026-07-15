import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { SOCIAL_ICONS } from "@/components/ui/social-icons"
import { SV_ICONS } from "@/components/ui/sv-icons"
import { LogoGrid } from "@/components/design-system/logos"
import { PUNK_ILLUSTRATIONS } from "@/components/design-system/punk-illustrations"
import { STYLE_ILLUSTRATIONS } from "@/components/design-system/illustrations-styles"

const GRADS = ["bg-grad-sunset", "bg-grad-vapor", "bg-grad-toxic", "bg-grad-galaxy", "bg-grad-inferno"]
const TEXS = ["art-tex-concrete", "art-tex-crosshatch", "art-tex-dots-grid", "art-tex-scratch", "art-tex-canvas"]
const COLOR3D = ["fx-3dc-cyan", "fx-3dc-magenta", "fx-3dc-rainbow", "fx-3dc-deep", "fx-3dc-emboss"]
const GLITCHES = ["fx-gl-slice", "fx-gl-rgb", "fx-gl-jitter", "fx-gl-scan", "fx-gl-blocks"]

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
      <DsLead>Marca, ícones e texturas que compõem a identidade Design System.</DsLead>

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

      <DsSectionTitle id="logos">Logos — 10 lockups</DsSectionTitle>
      <LogoGrid />

      <DsSectionTitle id="punk">Ilustrações punk</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {PUNK_ILLUSTRATIONS.map(({ name, Comp }) => (
          <div key={name} className="flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-2)]">
            <Comp className="h-14 w-14" />
            <span className="text-center text-[0.55rem] uppercase tracking-wide text-white/45">{name}</span>
          </div>
        ))}
      </div>

      <DsSectionTitle id="icons">Ícones próprios</DsSectionTitle>
      <p className="mb-3 text-xs text-white/50">Set comic autoral (traço 2.5px, currentColor, variante <code className="text-[var(--sv-cyan)]">rough</code>).</p>
      <div className="flex flex-wrap gap-3">
        {SV_ICONS.map(({ name, Comp }) => (
          <div key={name} className="flex flex-col items-center gap-1.5 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-1)]">
            <Comp className="text-2xl text-[var(--sv-cyan)]" />
            <span className="text-[0.6rem] uppercase tracking-wide text-white/45">{name}</span>
          </div>
        ))}
      </div>

      <DsSectionTitle id="social">Ícones Sociais</DsSectionTitle>
      <div className="flex flex-wrap gap-3">
        {SOCIAL_ICONS.map(({ name, Comp }) => (
          <div key={name} className="grid size-14 place-items-center rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] text-white shadow-[var(--elevation-1)] transition-transform hover:-translate-y-1 hover:text-[var(--sv-cyan)]" title={name}>
            <Comp className="size-6" />
          </div>
        ))}
      </div>

      <DsSectionTitle id="style-illos">Ilustrações — outros estilos</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {STYLE_ILLUSTRATIONS.map(({ name, Comp }) => (
          <div key={name} className="flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-2)]">
            <Comp className="h-16 w-16" />
            <span className="text-[0.6rem] uppercase tracking-wide text-white/45">{name}</span>
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
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <Swatch label="accent"><div className="h-full w-full" style={{ background: "var(--gradient-accent)" }} /></Swatch>
        <Swatch label="rainbow"><div className="h-full w-full" style={{ background: "var(--gradient-rainbow)" }} /></Swatch>
        {GRADS.map((g) => (
          <Swatch key={g} label={g.replace("bg-grad-", "")}><div className={`${g} h-full w-full`} /></Swatch>
        ))}
        <Swatch label="canvas ink"><div className="h-full w-full" style={{ background: "linear-gradient(160deg, var(--sv-ink), var(--sv-ink-2))" }} /></Swatch>
      </div>

      <DsSectionTitle id="textures2">Texturas de superfície</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TEXS.map((t) => (
          <Swatch key={t} label={t.replace("art-tex-", "")}>
            <div className={`${t} relative h-full w-full bg-[var(--sv-ink-2)]`} />
          </Swatch>
        ))}
      </div>

      <DsSectionTitle id="color3d">3D de cor</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {COLOR3D.map((c) => (
          <div key={c} className="flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5">
            <span className={`${c} font-[family-name:var(--font-display)] text-3xl uppercase`}>AA</span>
            <code className="font-mono text-[0.6rem] text-[var(--sv-cyan)]">{c}</code>
          </div>
        ))}
      </div>

      <DsSectionTitle id="glitches">Glitches</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {GLITCHES.map((g) => (
          <div key={g} className="flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5">
            <span className={`${g} font-[family-name:var(--font-display)] text-2xl uppercase text-white`} data-text="GLI">GLI</span>
            <code className="font-mono text-[0.6rem] text-[var(--sv-cyan)]">{g}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
