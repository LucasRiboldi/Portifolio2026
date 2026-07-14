import { DsSectionTitle } from "@/design-system/ds-ui"
import { ILLUSTRATIONS } from "@/components/design-system/illustrations"

export const metadata = { title: "Lab · Anomalias do Aranhaverso" }

const FONTS = [
  { cls: "fx-font-nabla", name: "Nabla", note: "cromática COLRv1", sample: "MULTI" },
  { cls: "fx-font-monoton fx-neon", name: "Monoton", note: "neon retrô", sample: "NEON" },
  { cls: "fx-font-glitch", name: "Rubik Glitch", note: "corrompida", sample: "GLITCH" },
  { cls: "fx-font-shade", name: "Bungee Shade", note: "3D sombra", sample: "SHADE" },
]

const EFFECTS = [
  { cls: "fx-3d", label: "fx-3d" },
  { cls: "fx-chroma", label: "fx-chroma" },
  { cls: "fx-holo", label: "fx-holo" },
  { cls: "fx-neon fx-font-monoton", label: "fx-neon" },
]

export default function LabPage() {
  return (
    <div className="fx-grain relative">
      {/* HERO alucinado */}
      <div className="fx-vhs relative overflow-hidden rounded-xl border-[3px] border-black bg-[radial-gradient(circle_at_30%_20%,rgba(123,47,247,0.5),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(255,45,149,0.4),transparent_45%),linear-gradient(160deg,var(--sv-ink),var(--sv-ink-2))] p-10 text-center shadow-[var(--elevation-4)]">
        <p className="fx-font-monoton fx-neon mb-2 text-sm uppercase tracking-[0.4em]">terra-∞</p>
        <h1 className="fx-glitch fx-font-glitch text-5xl uppercase leading-none sm:text-7xl" data-text="ANOMALIAS">ANOMALIAS</h1>
        <p className="mt-4 text-sm text-white/70">
          A ala experimental onde o Design System rompe as próprias regras.
          Fontes cromáticas, glitch, holografia e portais dimensionais.
        </p>
      </div>

      {/* TIPOGRAFIA EXPERIMENTAL */}
      <DsSectionTitle id="fonts">Fontes adversas</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {FONTS.map((f) => (
          <div key={f.name} className="fx-sticker flex items-center justify-between gap-4 rounded-lg bg-[var(--sv-ink-2)] p-6">
            <span className={`${f.cls} text-4xl`}>{f.sample}</span>
            <div className="text-right">
              <p className="sv-heavy text-xs uppercase tracking-wide text-white">{f.name}</p>
              <p className="text-[0.7rem] text-white/40">{f.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EFEITOS DE TEXTO */}
      <DsSectionTitle id="effects">Efeitos de texto</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EFFECTS.map((e) => (
          <div key={e.label} className="flex flex-col items-center gap-3 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6">
            <span className={`${e.cls} text-3xl font-[family-name:var(--font-display)] uppercase`}>AA</span>
            <code className="font-mono text-[0.7rem] text-[var(--sv-cyan)]">{e.label}</code>
          </div>
        ))}
      </div>

      {/* ILUSTRAÇÕES SVG */}
      <DsSectionTitle id="illustrations">Ilustrações vivas</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {ILLUSTRATIONS.map(({ name, Comp }) => (
          <div key={name} className="fx-float flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)]">
            <Comp className="h-16 w-16" />
            <span className="text-center text-[0.6rem] uppercase tracking-wide text-white/45">{name}</span>
          </div>
        ))}
      </div>

      {/* PORTAL + VARIANTES EXTRAPOLADAS */}
      <DsSectionTitle id="portal">Portal & componentes extrapolados</DsSectionTitle>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="fx-portal mx-auto h-40 w-40" aria-hidden />
        <div className="flex flex-col items-start gap-4">
          {/* botão holográfico */}
          <button className="fx-sticker rounded-full bg-black px-6 py-3 text-lg font-[family-name:var(--font-heavy)] uppercase">
            <span className="fx-holo">Botão holográfico</span>
          </button>
          {/* card glitch */}
          <div className="fx-vhs w-full max-w-sm rounded-lg border-[3px] border-[var(--sv-magenta)] bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-3)]">
            <p className="fx-glitch fx-font-glitch text-xl uppercase" data-text="CARD.EXE">CARD.EXE</p>
            <p className="mt-2 text-sm text-white/60">Componente instável entre dimensões. Renderiza diferente a cada realidade.</p>
          </div>
          {/* badge 3D */}
          <span className="fx-3d font-[family-name:var(--font-display)] text-4xl uppercase">Extrapolado!</span>
        </div>
      </div>

      <p className="mt-10 rounded-md border-2 border-dashed border-white/20 p-4 text-center text-xs text-white/40">
        Todas as anomalias respeitam <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code> —
        criatividade sem custo de acessibilidade.
      </p>
    </div>
  )
}
