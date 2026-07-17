import { notFound } from "next/navigation"

import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"
import { REALM_DESIGN, REALM_DESIGN_IDS, type Spec, type Swatch } from "@/design-system/realms"
import { isRealmId, REALMS } from "@/lib/realms"
import { RealmKitPreview } from "./kit-preview"
import { RealmMotionLab } from "@/components/design-system/realm-motion-lab"
import { RealmVariantSwitcher } from "@/components/design-system/realm-variant-switcher"
import { CreativeChapters } from "@/components/design-system/creative-chapters"
import { DevChapters } from "@/components/design-system/dev-chapters"
import { ArcaneChapters } from "@/components/design-system/arcane-chapters"

export function generateStaticParams() {
  return REALM_DESIGN_IDS.map((realm) => ({ realm }))
}

export async function generateMetadata({ params }: { params: Promise<{ realm: string }> }) {
  const { realm } = await params
  const d = isRealmId(realm) ? REALM_DESIGN[realm] : undefined
  return { title: d ? `Design System · ${d.label}` : "Design System" }
}

function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((s) => (
        <div key={s.token} className="overflow-hidden rounded-md border-2 border-black">
          <div style={{ background: s.value }} className="h-16 w-full" />
          <div className="bg-[var(--sv-ink-2)] p-2">
            <p className="sv-heavy text-[11px] uppercase text-white">{s.name}</p>
            <p className="font-mono text-[10px] text-[var(--sv-cyan)]">{s.token}</p>
            <p className="font-mono text-[10px] text-white/40">{s.value}</p>
            <p className="mt-1 text-[10px] leading-snug text-white/60">{s.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** O contrato --r-*: mesmo nome nos três realms, valor resolvido por escopo. */
const REALM_TOKENS = [
  { token: "--r-bg", role: "Fundo da página" },
  { token: "--r-bg-2", role: "Fundo de painel" },
  { token: "--r-ink", role: "Tinta" },
  { token: "--r-ink-mut", role: "Tinta secundária" },
  { token: "--r-accent", role: "Ação primária" },
  { token: "--r-accent-2", role: "Ação secundária" },
  { token: "--r-accent-3", role: "Chamada" },
  { token: "--r-border", role: "Traço" },
]

/**
 * As amostras vivem DENTRO do `scope`, então cada var resolve no valor real
 * daquele realm — não há hex copiado aqui. Se realm-tokens.css mudar, muda aqui.
 */
function RealmTokenGrid({ scope }: { scope: string }) {
  return (
    <div className={scope}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {REALM_TOKENS.map((t) => (
          <div key={t.token} className="overflow-hidden rounded-md border-2 border-black">
            <div className="h-12 w-full" style={{ background: `var(${t.token})` }} />
            <div className="bg-[var(--sv-ink-2)] p-2">
              <p className="font-mono text-[10px] text-[var(--sv-cyan)]">{t.token}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/60">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecTable({ rows }: { rows: Spec[] }) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-white/10 last:border-0">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--sv-cyan)]">{r.name}</td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-white/70">{r.value}</td>
              <td className="px-3 py-2 text-white/60">{r.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function RealmDesignPage({ params }: { params: Promise<{ realm: string }> }) {
  const { realm } = await params
  if (!isRealmId(realm)) notFound()

  const d = REALM_DESIGN[realm]
  if (!d) notFound()

  const nav = REALMS[realm]

  return (
    <div>
      <ComicHeader
        kicker={`Design System · Realm ${nav.glyph}`}
        title={d.label.replace(/^O /, "")}
        highlight="design system"
        subtitle={d.tagline}
      />

      <DsLead>
        Fonte única em <code className="text-[var(--sv-cyan)]">src/design-system/realms.ts</code>. A
        escala compartilhada (spacing, z-index, breakpoints, durações) vive em{" "}
        <code className="text-[var(--sv-cyan)]">tokens.ts</code> e não é repetida por realm — repetir
        três vezes é como a inconsistência começa. Rota do realm:{" "}
        <code className="text-[var(--sv-cyan)]">{nav.route}</code>.
      </DsLead>

      {/* ---------- Style guide em prosa ---------- */}
      <DsSectionTitle id="principios">Princípios</DsSectionTitle>
      <ol className="space-y-2">
        {d.principles.map((p, i) => (
          <li key={p} className="flex gap-3">
            <span className="sv-display shrink-0 text-2xl leading-none text-[var(--sv-yellow)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="pt-1 text-sm leading-snug text-white/75">{p}</p>
          </li>
        ))}
      </ol>

      {/* ---------- Cor ---------- */}
      <DsSectionTitle id="cor">Sistema de cor</DsSectionTitle>
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-wide text-white/50">Acentos</p>
      <SwatchGrid items={d.palette} />
      <p className="sv-heavy mb-3 mt-6 text-[11px] uppercase tracking-wide text-white/50">Superfícies</p>
      <SwatchGrid items={d.surfaces} />

      {/* ---------- Tokens de realm ---------- */}
      <DsSectionTitle id="tokens">Tokens de realm</DsSectionTitle>
      <DsLead>
        Acima estão as primitivas deste realm. Aqui está a camada semântica:{" "}
        <code className="text-[var(--sv-cyan)]">--r-*</code> tem o mesmo nome nos três universos e
        resolve no valor de cada um, escopado pela classe do realm em{" "}
        <code className="text-[var(--sv-cyan)]">src/styles/realm-tokens.css</code>. É o que permite
        escrever um componente que atravessa os três sem um <code>if</code>.
      </DsLead>
      <div className="mt-4">
        <RealmTokenGrid scope={d.scope} />
      </div>

      {/* ---------- Tipografia ---------- */}
      <DsSectionTitle id="tipografia">Tipografia</DsSectionTitle>
      <div className="space-y-3">
        {d.typography.map((t) => (
          <DsCard key={t.role}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className={`${t.className} text-3xl`}>{t.family}</p>
              <p className="font-mono text-[10px] text-[var(--sv-cyan)]">
                {t.token} · .{t.className}
              </p>
            </div>
            <p className="sv-heavy mt-1 text-[11px] uppercase tracking-wide text-[var(--sv-magenta)]">
              {t.role}
            </p>
            <p className="mt-1 text-xs leading-snug text-white/60">{t.usage}</p>
          </DsCard>
        ))}
      </div>

      {/* ---------- Elevação / raio / grelha / motion ---------- */}
      <DsSectionTitle id="elevacao">Elevação</DsSectionTitle>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {d.elevation.map((e) => (
          <div key={e.name} className="text-center">
            <div
              style={{ boxShadow: e.value }}
              className="mx-auto h-14 w-14 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)]"
            />
            <span className="mt-2 block font-mono text-[0.6rem] text-white/50">{e.name}</span>
          </div>
        ))}
      </div>
      <SpecTable rows={d.elevation} />

      <DsSectionTitle id="raio">Raio</DsSectionTitle>
      <SpecTable rows={d.radius} />

      <DsSectionTitle id="grelha">Grelha</DsSectionTitle>
      <SpecTable rows={d.grid} />

      <DsSectionTitle id="motion">Motion</DsSectionTitle>
      <DsLead>
        Cada gesto abaixo toca de verdade, com as mesmas curvas do realm. Documentar movimento em
        texto é o jeito mais fácil de a documentação mentir — o easing muda no código e a tabela
        continua igual. Registro em{" "}
        <code className="text-[var(--sv-cyan)]">src/design-system/realm-motion.ts</code>.
      </DsLead>
      <div className="mt-4">
        <RealmMotionLab realm={d.id} />
      </div>

      {/* ---------- Kit vivo, por versão ---------- */}
      <DsSectionTitle id="kit">UI Kit</DsSectionTitle>
      <DsLead>
        Os componentes reais, não capturas — se um quebrar, quebra aqui também, que é o ponto.
        Troque a versão para reimprimir o kit inteiro noutra chapa.
      </DsLead>
      <div className="mt-4">
        <RealmVariantSwitcher realm={d.id}>
          <RealmKitPreview realm={d.id} scope={d.scope} />
        </RealmVariantSwitcher>
      </div>

      <DsSectionTitle id="catalogo">Catálogo</DsSectionTitle>
      <div className="space-y-5">
        {d.kit.map((g) => (
          <div key={g.group}>
            <p className="sv-heavy mb-2 text-[11px] uppercase tracking-wide text-[var(--sv-yellow)]">
              {g.group}
            </p>
            <div className="overflow-x-auto rounded-md border-2 border-black">
              <table className="w-full text-left text-xs">
                <tbody>
                  {g.items.map((it) => (
                    <tr key={it.name} className="border-b border-white/10 last:border-0">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--sv-cyan)]">
                        {it.name}
                      </td>
                      <td className="px-3 py-2">
                        {it.variants && (
                          <p className="font-mono text-[10px] text-white/50">{it.variants}</p>
                        )}
                        <p className="text-white/60">{it.note}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/35">
                        {it.from ?? "css"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Logo ---------- */}
      <DsSectionTitle id="logo">Logo</DsSectionTitle>
      <DsCard>
        <p className="text-sm leading-snug text-white/70">{d.logo}</p>
      </DsCard>

      {/* ---------- CSS ---------- */}
      <DsSectionTitle id="css">Folhas deste realm</DsSectionTitle>
      <div className="flex flex-wrap gap-2">
        {d.css.map((f) => (
          <code
            key={f}
            className="rounded border-2 border-black bg-[var(--sv-ink-2)] px-2 py-1 font-mono text-[11px] text-[var(--sv-cyan)]"
          >
            src/styles/{f}
          </code>
        ))}
      </div>

      {/* ---------- Guia completo, na língua de cada realm ----------
          Cada realm tem o corpo que o seu universo comporta, não uma lista
          comum repintada: o Criativo é uma revista (capa, painel, template
          de página); o _Dev é um editor (sintaxe, prompt, diff, devlog).
          Por isso não há "template de pricing" no _Dev nem "realce de
          sintaxe" no Criativo. */}
      {d.id === "creative" && <CreativeChapters />}
      {d.id === "developer" && <DevChapters />}
      {d.id === "arcane" && <ArcaneChapters />}
    </div>
  )
}
