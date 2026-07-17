import {
  contrastRatio,
  formatHsl,
  formatRgb,
  wcagLevel,
  type WcagLevel,
} from "@/design-system/color-utils"
import tokens from "@/design-system/tokens"
import type { RealmDesign, Swatch } from "@/design-system/realms"

/**
 * 03 · Design Tokens — as tabelas.
 *
 * RGB, HSL e contraste são DERIVADOS do hex do token, nunca digitados: uma
 * tabela onde o hex muda e o RGB ao lado continua o antigo é pior que tabela
 * nenhuma, porque tem a autoridade de um número. Ver src/design-system/
 * color-utils.ts (com testes).
 */

const NIVEL_COR: Record<WcagLevel, string> = {
  AAA: "var(--sv-lime)",
  AA: "var(--sv-lime)",
  "AA-large": "var(--sv-yellow)",
  fail: "var(--sv-orange)",
}

const NIVEL_TXT: Record<WcagLevel, string> = {
  AAA: "AAA",
  AA: "AA",
  "AA-large": "só título grande",
  fail: "reprova",
}

/** Classe utilitária equivalente — o atalho que o dev realmente digita. */
function tailwindFor(token: string): string {
  return `bg-[var(${token})] · text-[var(${token})]`
}

/**
 * As escalas semânticas compartilhadas (tokens.ts → tokens.css → tailwind.config).
 * Estas atravessam os três realms: são a camada de significado (perigo é
 * vermelho em qualquer universo), enquanto as paletas de realm são a de
 * identidade. Confundir as duas é o erro clássico.
 */
const FAMILIAS = [
  { id: "primary", label: "Primary", papel: "Ação principal, marca, destaque" },
  { id: "secondary", label: "Secondary", papel: "Ação de apoio, foco, links" },
  { id: "accent", label: "Accent", papel: "Profundidade, gradientes" },
  { id: "neutral", label: "Neutral", papel: "Texto, superfície, borda" },
  { id: "success", label: "Success", papel: "Confirmação, estado saudável" },
  { id: "warning", label: "Warning", papel: "Atenção, ação reversível" },
  { id: "danger", label: "Danger", papel: "Erro, ação destrutiva" },
  { id: "info", label: "Info", papel: "Informação neutra" },
] as const

type Escala = Record<string, string>

function ScaleTable({ familia, escala }: { familia: (typeof FAMILIAS)[number]; escala: Escala }) {
  const passos = Object.entries(escala)
  return (
    <div className="mb-5">
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="sv-heavy text-[11px] uppercase tracking-wide text-white/80">
          {familia.label}
          <span className="ml-2 font-normal normal-case tracking-normal text-white/40">
            {familia.papel}
          </span>
        </p>
        <code className="font-mono text-[10px] text-white/30">
          --c-{familia.id}-* · bg-{familia.id}-*
        </code>
      </div>

      {/* a escala inteira de relance — é assim que se escolhe um passo */}
      <div className="mb-2 flex overflow-hidden rounded border-2 border-black">
        {passos.map(([passo, hex]) => (
          <div key={passo} className="flex-1" title={`${familia.id}-${passo} · ${hex}`}>
            <div className="h-8 w-full" style={{ background: hex }} />
            <span className="block bg-black/60 py-0.5 text-center font-mono text-[8px] text-white/60">
              {passo}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border-2 border-black">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[var(--sv-ink-2)] text-white/40">
              <th className="px-3 py-1.5 font-normal">Passo</th>
              <th className="px-3 py-1.5 font-normal">HEX</th>
              <th className="px-3 py-1.5 font-normal">RGB</th>
              <th className="px-3 py-1.5 font-normal">HSL</th>
              <th className="px-3 py-1.5 font-normal">CSS Variable</th>
              <th className="px-3 py-1.5 font-normal">Tailwind</th>
            </tr>
          </thead>
          <tbody>
            {passos.map(([passo, hex]) => (
              <tr key={passo} className="border-t border-white/10">
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-white/70">
                  <span className="mr-2 inline-block size-3 translate-y-0.5 rounded-sm border border-black" style={{ background: hex }} aria-hidden />
                  {passo}
                </td>
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-white/60">{hex}</td>
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-white/40">{formatRgb(hex)}</td>
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-white/40">{formatHsl(hex)}</td>
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-[var(--sv-cyan)]">
                  --c-{familia.id}-{passo}
                </td>
                <td className="whitespace-nowrap px-3 py-1 font-mono text-[10px] text-[var(--sv-lime)]">
                  bg-{familia.id}-{passo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ColorTable({ items, fundo }: { items: Swatch[]; fundo: string }) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[var(--sv-ink-2)] text-white/40">
            <th className="px-3 py-2 font-normal">Amostra</th>
            <th className="px-3 py-2 font-normal">Nome</th>
            <th className="px-3 py-2 font-normal">Token</th>
            <th className="px-3 py-2 font-normal">HEX</th>
            <th className="px-3 py-2 font-normal">RGB</th>
            <th className="px-3 py-2 font-normal">HSL</th>
            <th className="px-3 py-2 font-normal">Contraste</th>
            <th className="px-3 py-2 font-normal">Papel</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => {
            const r = contrastRatio(s.value, fundo)
            const nivel = r ? wcagLevel(r) : null
            return (
              <tr key={s.token} className="border-t border-white/10 align-middle">
                <td className="px-3 py-2">
                  <span
                    className="block size-7 rounded border-2 border-black"
                    style={{ background: s.value }}
                    aria-hidden
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-white/85">{s.name}</td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-[var(--sv-cyan)]">
                  {s.token}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/60">
                  {s.value}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/45">
                  {formatRgb(s.value)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/45">
                  {formatHsl(s.value)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px]">
                  {r && nivel ? (
                    <span style={{ color: NIVEL_COR[nivel] }}>
                      {r.toFixed(2)}:1 · {NIVEL_TXT[nivel]}
                    </span>
                  ) : (
                    <span className="text-white/25">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-[11px] leading-snug text-white/50">{s.role}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SpecTable({
  head,
  rows,
}: {
  head: string[]
  rows: { k: string; v: string; extra?: string; demo?: React.ReactNode }[]
}) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-[var(--sv-ink-2)] text-white/40">
            {head.map(h => (
              <th key={h} className="px-3 py-2 font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.k} className="border-t border-white/10 align-middle">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-[var(--sv-cyan)]">
                {r.k}
              </td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/70">
                {r.v}
              </td>
              {r.extra !== undefined && (
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/40">
                  {r.extra}
                </td>
              )}
              {r.demo !== undefined && <td className="px-3 py-2">{r.demo}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DsTokenTables({ d }: { d: RealmDesign }) {
  // O fundo real do realm — é sobre ele que o contraste tem de ser medido,
  // não sobre um branco imaginário.
  const fundo = d.surfaces[0]?.value ?? "#0a0612"

  const spacing = Object.entries(tokens.spacing ?? {})
  const radius = Object.entries(tokens.radius ?? {})

  return (
    <section id="tokens" aria-label="03 · Design Tokens" className="scroll-mt-24">
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">03</span>
        Design Tokens
      </p>

      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/70">
        Token é o contrato: o nome dura, o valor pode mudar. Abaixo, cada cor deste realm em todas
        as notações que alguém pode precisar copiar — e o contraste medido sobre{" "}
        <code className="text-[var(--sv-cyan)]">{fundo}</code>, o fundo real desta interface. RGB,
        HSL e razão são derivados do hex por função testada, nunca digitados: número escrito à mão
        envelhece calado.
      </p>

      {/* ---- Escalas semânticas (compartilhadas) ---- */}
      <h3 className="sv-heavy mb-1 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Color Tokens · escalas semânticas
      </h3>
      <p className="mb-4 max-w-3xl text-xs leading-relaxed text-white/55">
        Duas camadas, e confundi-las é o erro clássico. Estas escalas são de{" "}
        <strong>significado</strong> e atravessam os três universos: perigo é vermelho no comic, no
        terminal e no jornal. As paletas de realm, mais abaixo, são de{" "}
        <strong>identidade</strong> — é ali que os três divergem. Fonte em{" "}
        <code className="text-[var(--sv-cyan)]">src/design-system/tokens.ts</code>, espelhada em{" "}
        <code className="text-[var(--sv-cyan)]">tokens.css</code> e mapeada no{" "}
        <code className="text-[var(--sv-cyan)]">tailwind.config.ts</code>.
      </p>
      {FAMILIAS.map(f => {
        const escala = (tokens.color as Record<string, Escala>)[f.id]
        if (!escala) return null
        return <ScaleTable key={f.id} familia={f} escala={escala} />
      })}

      {spacing.length > 0 && (
        <>
          <h3 className="sv-heavy mb-2 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
            Espaçamento
          </h3>
          <p className="mb-2 max-w-3xl text-xs leading-relaxed text-white/55">
            Escala compartilhada pelos três realms — repetir três vezes é como a inconsistência
            começa. Fonte em <code className="text-[var(--sv-cyan)]">src/design-system/tokens.ts</code>.
          </p>
          <SpecTable
            head={["Token", "Valor", "Tailwind", "Demonstração"]}
            rows={spacing.map(([k, v]) => ({
              k: `--space-${k}`,
              v: String(v),
              extra: `p-${k} · m-${k} · gap-${k}`,
              demo: (
                <span
                  className="block bg-[var(--sv-cyan)]"
                  style={{ width: String(v), height: 8 }}
                  aria-hidden
                />
              ),
            }))}
          />
        </>
      )}

      {radius.length > 0 && (
        <>
          <h3 className="sv-heavy mb-2 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
            Raio
          </h3>
          <SpecTable
            head={["Token", "Valor", "Tailwind", "Demonstração"]}
            rows={radius.map(([k, v]) => ({
              k: `--radius-${k}`,
              v: String(v),
              extra: `rounded-${k}`,
              demo: (
                <span
                  className="block size-8 border-2 border-black bg-[var(--sv-violet)]"
                  style={{ borderRadius: String(v) }}
                  aria-hidden
                />
              ),
            }))}
          />
        </>
      )}

      <h3 className="sv-heavy mb-2 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Elevação
      </h3>
      <SpecTable
        head={["Token", "Valor", "Uso", "Demonstração"]}
        rows={d.elevation.map(e => ({
          k: e.name,
          v: e.value,
          extra: e.use,
          demo: (
            <span
              className="block size-8 rounded border-[3px] border-black bg-[var(--sv-ink-2)]"
              style={{ boxShadow: e.value }}
              aria-hidden
            />
          ),
        }))}
      />

      <p className="mt-4 text-[11px] leading-relaxed text-white/40">
        Atalho de classe: os tokens deste realm são consumidos como{" "}
        <code className="text-[var(--sv-cyan)]">{tailwindFor(d.palette[0]?.token ?? "--sv-magenta")}</code>
        . A camada semântica <code className="text-[var(--sv-cyan)]">--r-*</code> (ver Tokens de
        realm) é a que atravessa os três universos com o mesmo nome.
      </p>
    </section>
  )
}

/**
 * 05 · Colors — a paleta de identidade do realm, com contraste medido sobre o
 * fundo real. Separada de 03 porque respondem perguntas diferentes: Tokens é
 * "que valores existem"; Colors é "que cor eu uso aqui, e ela é legível?".
 */
export function DsColors({ d }: { d: RealmDesign }) {
  const fundo = d.surfaces[0]?.value ?? "#0a0612"

  return (
    <section id="colors" aria-label="05 · Colors" className="mt-16 scroll-mt-24">
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">05</span>
        Colors
      </p>

      <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/70">
        A camada de identidade: o que faz este realm parecer ele mesmo. Cada linha traz o contraste
        real sobre <code className="text-[var(--sv-cyan)]">{fundo}</code> — não sobre um branco
        imaginário —, porque contraste aprovado no fundo errado é contraste reprovado no site.
      </p>

      <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Acentos
      </h3>
      <ColorTable items={d.palette} fundo={fundo} />

      <h3 className="sv-heavy mb-2 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Superfícies
      </h3>
      <ColorTable items={d.surfaces} fundo={fundo} />

      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Leitura da coluna de contraste: <strong>AA</strong> serve texto normal;{" "}
        <strong>só título grande</strong> exige ≥24px (ou ≥18.66px em peso bold);{" "}
        <strong>reprova</strong> é ornamento, nunca texto. Razões calculadas pela fórmula do WCAG 2
        em <code className="text-[var(--sv-cyan)]">color-utils.ts</code>.
      </p>
    </section>
  )
}
