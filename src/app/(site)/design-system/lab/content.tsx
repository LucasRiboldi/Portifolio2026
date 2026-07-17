import { DsSectionTitle } from "@/design-system/ds-ui"
import { ILLUSTRATIONS } from "@/components/design-system/illustrations"
import { PUNK_ILLUSTRATIONS, MohawkSpider, Guitar, BoltCluster } from "@/components/design-system/punk-illustrations"
import { LOGOS } from "@/components/design-system/logos"


const FONTS = [
  { cls: "fx-font-nabla", name: "Nabla", note: "cromática COLRv1", sample: "MULTI" },
  { cls: "fx-font-monoton fx-neon", name: "Monoton", note: "neon retrô", sample: "NEON" },
  { cls: "fx-font-glitch", name: "Rubik Glitch", note: "corrompida", sample: "GLITCH" },
  { cls: "fx-font-shade", name: "Bungee Shade", note: "3D sombra", sample: "SHADE" },
]

const TEXT_FX = [
  { cls: "fx-3d", label: "fx-3d" },
  { cls: "fx-chroma", label: "fx-chroma" },
  { cls: "fx-holo", label: "fx-holo" },
  { cls: "fx-neon fx-font-monoton", label: "fx-neon" },
  { cls: "fx-riso", label: "fx-riso" },
  { cls: "fx-marker text-[var(--sv-lime)]", label: "fx-marker" },
  { cls: "fx-chroma-punk", label: "fx-chroma-punk" },
  { cls: "art-ghost text-[var(--sv-cyan)]", label: "art-ghost" },
]

const ALL_ILLOS = [...ILLUSTRATIONS, ...PUNK_ILLUSTRATIONS]

const RANSOM = [
  ["A", "magenta", "-4deg"], ["N", "cyan", "3deg"], ["O", "yellow", "-2deg"],
  ["M", "lime", "4deg"], ["A", "violet", "-3deg"], ["L", "orange", "2deg"],
  ["I", "cyan", "-5deg"], ["A", "magenta", "3deg"], ["S", "yellow", "-2deg"],
] as const

export function LabContent({ headingAs: Title = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <div className="fx-grain relative">
      {/* HERO PUNK */}
      <div className="fx-vhs fx-bolts relative overflow-hidden rounded-xl border-[3px] border-black bg-[radial-gradient(circle_at_25%_20%,rgba(123,47,247,0.5),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(255,45,149,0.45),transparent_45%),linear-gradient(160deg,#241019,#0a0612)] p-8">
        <div className="fx-screentone pointer-events-none absolute inset-0 opacity-20" style={{ ["--st-color" as string]: "rgba(0,229,255,0.6)" } as React.CSSProperties} />
        <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="fx-font-monoton fx-neon mb-2 text-xs uppercase tracking-[0.4em]">terra-138 · punk</p>
            <Title className="fx-glitch fx-font-glitch text-5xl uppercase leading-none sm:text-7xl" data-text="ANOMALIAS">ANOMALIAS</Title>
            <p className="mt-3 max-w-md text-sm text-white/70">
              A ala experimental onde o Design System rompe as próprias regras.
              Colagem, spray, ransom note, screentone e energia punk.
            </p>
          </div>
          <div className="flex shrink-0 items-end gap-1">
            <BoltCluster className="h-16 w-16 fx-float" />
            <MohawkSpider className="h-28 w-28" />
            <Guitar className="h-16 w-16 fx-float" />
          </div>
        </div>
      </div>

      {/* RANSOM NOTE */}
      <DsSectionTitle id="ransom">Letras de resgate</DsSectionTitle>
      <div className="fx-ransom text-3xl uppercase">
        {RANSOM.map(([ch, color, rot], i) => (
          <span key={i} className="fx-ransom-piece" style={{ background: `var(--sv-${color})`, color: color === "magenta" || color === "violet" || color === "orange" ? "#fff" : "#000", transform: `rotate(${rot})` }}>
            {ch}
          </span>
        ))}
      </div>

      {/* FONTES */}
      <DsSectionTitle id="fonts">Fontes adversas</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FONTS.map((f) => (
          <div key={f.name} className="fx-sticker flex flex-col items-center gap-2 rounded-lg bg-[var(--sv-ink-2)] p-6">
            <span className={`${f.cls} text-3xl`}>{f.sample}</span>
            <div className="text-center">
              <p className="sv-heavy text-[0.65rem] uppercase tracking-wide text-white">{f.name}</p>
              <p className="text-[0.6rem] text-white/40">{f.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* EFEITOS DE TEXTO (8) */}
      <DsSectionTitle id="textfx">Efeitos de texto</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TEXT_FX.map((e) => (
          <div key={e.label} className="flex flex-col items-center gap-3 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5">
            <span className={`${e.cls} text-3xl font-[family-name:var(--font-display)] uppercase`} data-text="AA">AA</span>
            <code className="font-mono text-[0.65rem] text-[var(--sv-cyan)]">{e.label}</code>
          </div>
        ))}
      </div>

      {/* SPRAY & SCREENTONE & BOLTS */}
      <DsSectionTitle id="surfaces">Superfícies: spray · screentone · raios</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile label="fx-spray"><div className="fx-spray h-full w-full" style={{ color: "var(--sv-magenta)" }} /></Tile>
        <Tile label="fx-screentone"><div className="fx-screentone h-full w-full" style={{ ["--st-color" as string]: "rgba(182,255,0,0.7)" } as React.CSSProperties} /></Tile>
        <Tile label="fx-bolts"><div className="fx-bolts h-full w-full bg-[var(--sv-ink-2)]" /></Tile>
      </div>

      {/* COLAGEM / SLAP / TAPE */}
      <DsSectionTitle id="collage">Colagem & adesivos</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="fx-collage grid h-28 place-items-center bg-[var(--sv-magenta)] font-[family-name:var(--font-display)] text-2xl uppercase text-black">Papel rasgado</div>
        <div className="fx-slap grid h-28 place-items-center bg-[var(--sv-cyan)] font-[family-name:var(--font-heavy)] text-lg uppercase text-black">Sticker slap</div>
        <div className="fx-tape-x grid h-28 place-items-center rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] text-sm uppercase text-white/70">Fita cruzada</div>
      </div>

      {/* ILUSTRAÇÕES (14) */}
      <DsSectionTitle id="illustrations">Ilustrações vivas ({ALL_ILLOS.length})</DsSectionTitle>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-7">
        {ALL_ILLOS.map(({ name, Comp }) => (
          <div key={name} className="fx-float flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-2)]">
            <Comp className="h-12 w-12" />
            <span className="text-center text-[0.55rem] uppercase tracking-wide text-white/45">{name}</span>
          </div>
        ))}
      </div>

      {/* LOGOS */}
      <DsSectionTitle id="logos">Logos anômalos</DsSectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {LOGOS.map((l) => (
          <div key={l.name} className="grid h-20 place-items-center rounded-md border-[3px] border-black bg-[var(--sv-ink-2)]">{l.node}</div>
        ))}
      </div>

      {/* PORTAL + EXTRAPOLADOS */}
      <DsSectionTitle id="portal">Portal & componentes extrapolados</DsSectionTitle>
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="fx-portal mx-auto h-40 w-40" aria-hidden />
        <div className="flex flex-col items-start gap-4">
          <button className="fx-sticker rounded-full bg-black px-6 py-3 text-lg font-[family-name:var(--font-heavy)] uppercase">
            <span className="fx-holo">Botão holográfico</span>
          </button>
          <div className="fx-vhs w-full max-w-sm rounded-lg border-[3px] border-[var(--sv-magenta)] bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-3)]">
            <p className="fx-glitch fx-font-glitch text-xl uppercase" data-text="CARD.EXE">CARD.EXE</p>
            <p className="mt-2 text-sm text-white/60">Componente instável entre dimensões.</p>
          </div>
          <span className="fx-3d font-[family-name:var(--font-display)] text-4xl uppercase">Extrapolado!</span>
        </div>
      </div>

      <p className="mt-10 rounded-md border-2 border-dashed border-white/20 p-4 text-center text-xs text-white/40">
        Todas as anomalias respeitam <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code>.
      </p>
    </div>
  )
}

function Tile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-28 overflow-hidden rounded-lg border-[3px] border-black">{children}</div>
      <code className="text-center font-mono text-[0.65rem] text-[var(--sv-cyan)]">{label}</code>
    </div>
  )
}
