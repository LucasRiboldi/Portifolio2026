import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import tokens from "@/design-system/tokens"

function ColorScale({ name, scale }: { name: string; scale: Record<string, string> }) {
  return (
    <div className="mb-5">
      <p className="sv-heavy mb-1.5 text-xs uppercase tracking-wide text-white/70">{name}</p>
      <div className="flex overflow-hidden rounded-md border-2 border-black">
        {Object.entries(scale).map(([step, hex]) => (
          <div key={step} className="group relative flex-1" title={`${name}-${step} · ${hex}`}>
            <div style={{ background: hex }} className="h-12 w-full" />
            <span className="block bg-black/60 py-0.5 text-center text-[0.6rem] text-white/70">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TokenTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-white/10 last:border-0">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--sv-cyan)]">{k}</td>
              <td className="px-3 py-2 font-mono text-white/70">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TokensPage() {
  return (
    <div>
      <ComicHeader kicker="02 · Design Tokens" title="Valores" highlight="atômicos" />
      <DsLead>
        Fonte única em <code className="text-[var(--sv-cyan)]">src/styles/tokens.css</code> +{" "}
        <code className="text-[var(--sv-cyan)]">src/design-system/tokens.ts</code>. Exportáveis para
        Figma e código via <code className="text-[var(--sv-cyan)]">npm run tokens:export</code> →{" "}
        <code>public/design-tokens.json</code> (W3C DTCG) e <code>design-tokens.figma.json</code>.
      </DsLead>

      <DsSectionTitle id="colors">Colors</DsSectionTitle>
      {Object.entries(tokens.color).map(([name, scale]) => (
        <ColorScale key={name} name={name} scale={scale as Record<string, string>} />
      ))}

      <DsSectionTitle id="typography">Typography</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <TokenTable rows={Object.entries(tokens.typography.size).map(([k, v]) => [`size.${k}`, v])} />
        <TokenTable rows={Object.entries(tokens.typography.weight).map(([k, v]) => [`weight.${k}`, v])} />
      </div>

      <DsSectionTitle id="spacing">Spacing</DsSectionTitle>
      <div className="flex flex-wrap items-end gap-2">
        {Object.entries(tokens.spacing).map(([k, v]) => (
          <div key={k} className="text-center">
            <div style={{ width: v, height: v }} className="mx-auto min-h-[4px] min-w-[4px] bg-[var(--sv-magenta)]" />
            <span className="mt-1 block font-mono text-[0.6rem] text-white/50">{k}</span>
          </div>
        ))}
      </div>

      <DsSectionTitle id="radius">Radius</DsSectionTitle>
      <div className="flex flex-wrap gap-3">
        {Object.entries(tokens.radius).map(([k, v]) => (
          <div key={k} className="text-center">
            <div style={{ borderRadius: v }} className="h-16 w-16 border-2 border-[var(--sv-cyan)] bg-[var(--sv-cyan)]/10" />
            <span className="mt-1 block font-mono text-[0.6rem] text-white/50">{k}</span>
          </div>
        ))}
      </div>

      <DsSectionTitle id="shadow">Shadow &amp; Elevation</DsSectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Object.entries(tokens.elevation).filter(([, v]) => v !== "none").map(([k, v]) => (
          <div key={k} className="text-center">
            <div style={{ boxShadow: v }} className="mx-auto h-16 w-16 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)]" />
            <span className="mt-2 block font-mono text-[0.6rem] text-white/50">elevation.{k}</span>
          </div>
        ))}
      </div>

      <DsSectionTitle id="motion">Motion</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <TokenTable rows={Object.entries(tokens.motion.duration).map(([k, v]) => [`duration.${k}`, v])} />
        <TokenTable rows={Object.entries(tokens.motion.ease).map(([k, v]) => [`ease.${k}`, v])} />
      </div>

      <DsSectionTitle id="misc">Opacity · Blur · Z-index · Breakpoints</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <TokenTable rows={Object.entries(tokens.zIndex).map(([k, v]) => [`z.${k}`, v])} />
        <TokenTable rows={Object.entries(tokens.breakpoint).map(([k, v]) => [`bp.${k}`, v])} />
        <TokenTable rows={Object.entries(tokens.blur).map(([k, v]) => [`blur.${k}`, v])} />
        <TokenTable rows={Object.entries(tokens.opacity).map(([k, v]) => [`opacity.${k}`, v])} />
      </div>
    </div>
  )
}
