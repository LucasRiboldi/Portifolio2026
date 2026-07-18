import { notFound } from "next/navigation"

import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"
import { REALM_DESIGN, REALM_DESIGN_IDS, type Swatch } from "@/design-system/realms"
import { isRealmId, REALMS } from "@/lib/realms"
import { RealmKitPreview } from "./kit-preview"
import { RealmMotionLab } from "@/components/design-system/realm-motion-lab"
import { RealmVariantSwitcher } from "@/components/design-system/realm-variant-switcher"
import { CreativeChapters } from "@/components/design-system/creative-chapters"
import { DsRealmNav } from "@/components/design-system/ds-realm-nav"
import { DsIntroduction } from "@/components/design-system/ds-introduction"
import { DsTokenTables, DsColors } from "@/components/design-system/ds-token-tables"
import { SpecTable, RealmTokenGrid } from "@/components/design-system/realm-specs"
import { DeveloperGuide } from "@/components/design-system/developer-guide"
import { ArcaneGuide } from "@/components/design-system/arcane-guide"

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

export default async function RealmDesignPage({ params }: { params: Promise<{ realm: string }> }) {
  const { realm } = await params
  if (!isRealmId(realm)) notFound()

  const d = REALM_DESIGN[realm]
  if (!d) notFound()

  const nav = REALMS[realm]

  return (
    <div
      className={`lg:flex lg:gap-10 ${
        // .dracula resolve as vars --d-*; bg-transparent deixa o ds-canvas--dev
        // (fixo, atrás) aparecer em vez de a classe pintar uma caixa sólida.
        d.id === "developer" ? "dracula bg-transparent" : ""
      }`}
    >
      {/* Índice do documento — sumário, não menu de rotas. */}
      <DsRealmNav realm={d.id} />

      <div className="min-w-0 flex-1">
      {/* _Dev e Anfitrião têm chrome próprio — terminal Dracula e folha de
          jornal — sem ComicHeader nem sv-canvas: a página inteira é o realm. Só
          o Criativo usa o scaffold comic. O kit vai por prop porque o preview
          vive na pasta da rota. */}
      {d.id === "developer" ? (
        <DeveloperGuide
          d={d}
          kit={
            <RealmVariantSwitcher realm={d.id}>
              <RealmKitPreview realm={d.id} scope={d.scope} />
            </RealmVariantSwitcher>
          }
        />
      ) : d.id === "arcane" ? (
        <ArcaneGuide
          d={d}
          kit={
            <RealmVariantSwitcher realm={d.id}>
              <RealmKitPreview realm={d.id} scope={d.scope} />
            </RealmVariantSwitcher>
          }
        />
      ) : (
        <>
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

      {/* ---------- 01 · Introduction ----------
          Absorveu os "Princípios" que antes flutuavam soltos: princípio sem
          objetivo e sem como-usar é frase de efeito. */}
      <DsIntroduction d={d} />

      {/* ---------- 03 · Design Tokens · 05 · Colors ----------
          O SwatchGrid antigo saiu: mostrava só nome e hex. As tabelas novas
          derivam RGB, HSL e contraste do mesmo hex, por função testada. */}
      <div className="mt-16">
        <DsTokenTables d={d} />
      </div>
      <DsColors d={d} />

      {/* ---------- Tokens de realm ---------- */}
      {/* id distinto de `tokens` (o capítulo 03): dois elementos com o mesmo
          id são HTML inválido e a âncora salta para o primeiro. */}
      <DsSectionTitle id="tokens-realm">Tokens de realm</DsSectionTitle>
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
      <DsSectionTitle id="typography">Typography</DsSectionTitle>
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

      {/* id distinto de `grid` (o capítulo 06): a grelha do realm são as specs;
          o capítulo é o sistema de grid completo. */}
      <DsSectionTitle id="grid-realm">Grelha do realm</DsSectionTitle>
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
      <DsSectionTitle id="brand">Brand</DsSectionTitle>
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

      {/* Só o Criativo chega aqui (o _Dev e o Anfitrião têm guia próprio acima).
          O corpo comic — capa, painel, templates de página. */}
      <CreativeChapters />
        </>
      )}
      </div>
    </div>
  )
}
