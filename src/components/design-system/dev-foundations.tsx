/* ------------------------------------------------------------------
   Versões _Dev (Dracula) das seções que antes vinham dos componentes
   comic compartilhados (Introduction, Tokens, Typography, Colors, Motion,
   Elevação/Raio). Mesmos dados de `realms.ts`, outra língua visual: mono,
   borda 1px, sem tinta preta nem halftone.
   ------------------------------------------------------------------ */
import type { RealmDesign, Spec, Swatch } from "@/design-system/realms"
import { Chapter, SubChapter, Surface } from "./dev-chapters"

/** Tabela de specs no tom do _Dev: chave = valor // uso. */
function DevSpecTable({ rows }: { rows: Spec[] }) {
  return (
    <Surface>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px]">
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-[var(--d-current)] first:border-0">
                <td className="whitespace-nowrap py-1.5 pr-4 text-[var(--d-cyan)]">{r.name}</td>
                <td className="whitespace-nowrap py-1.5 pr-4 text-[var(--d-yellow)]">{r.value}</td>
                <td className="py-1.5 text-[var(--d-comment)]">{"// "}{r.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  )
}

function SwatchRow({ s }: { s: Swatch }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--d-current)] py-2 first:border-0">
      <span
        className="size-8 shrink-0 rounded border border-[var(--d-current)]"
        style={{ background: s.value }}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] text-[var(--d-fg)]">{s.name}</span>
        <span className="block text-[10px] text-[var(--d-comment)]">{s.role}</span>
      </span>
      <code className="shrink-0 font-mono text-[10px] text-[var(--d-cyan)]">{s.token}</code>
      <code className="hidden shrink-0 font-mono text-[10px] text-[var(--d-comment)] sm:block">
        {s.value}
      </code>
    </div>
  )
}

/** 01 · Introduction — objetivo, filosofia, princípios, para quem, como usar. */
export function DevIntro({ d }: { d: RealmDesign }) {
  return (
    <section id="introduction" aria-label="01 · Introduction" className="scroll-mt-24">
      <div className="dv-hero">
        <p className="term font-mono">
          <span className="tok-fn">designSystem</span>(<span className="tok-str">&quot;developer&quot;</span>)
        </p>
        <h1 className="font-mono">
          <span className="g">O</span> <span className="p">_Dev</span>{" "}
          <span className="dv-caret" />
        </h1>
        <p className="font-mono">{d.tagline}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-[var(--d-orange)]">
            {"// objetivo"}
          </p>
          <p className="text-sm leading-relaxed text-[var(--d-fg)]/85">
            Dar a O _Dev uma linguagem visual aplicável sem adivinhação: as decisões já estão
            escritas, então quem constrói uma tela nova não recomeça do zero nem inventa mais uma
            variação do mesmo botão.
          </p>
        </Surface>
        <Surface>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-[var(--d-orange)]">
            {"// filosofia"}
          </p>
          <p className="text-sm leading-relaxed text-[var(--d-fg)]/85">
            Este guia documenta o que existe no código, não o que seria bom existir. Cada exemplo usa
            as classes reais de <code className="text-[var(--d-green)]">dracula.css</code> — se um
            quebrar, quebra aqui.
          </p>
        </Surface>
      </div>

      <Surface className="mt-3">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-[var(--d-orange)]">
          {"// princípios"}
        </p>
        <ol className="space-y-1.5">
          {d.principles.map((p, i) => (
            <li key={p} className="flex gap-3 font-mono text-xs leading-relaxed text-[var(--d-fg)]/85">
              <span className="text-[var(--d-purple)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </Surface>
    </section>
  )
}

/** 03 · Design Tokens — a paleta de acentos do Dracula. */
export function DevTokens({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="tokens"
      n="03"
      title="Design Tokens"
      lead={
        <>
          Token é o contrato: o nome dura, o valor muda. A paleta canônica do Dracula, cada cor com o
          papel gramatical que cumpre na sintaxe. Fonte em{" "}
          <code className="text-[var(--d-green)]">src/styles/dracula.css</code>.
        </>
      }
    >
      <Surface>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-[var(--d-comment)]">
          acentos
        </p>
        {d.palette.map((s) => (
          <SwatchRow key={s.token} s={s} />
        ))}
      </Surface>
    </Chapter>
  )
}

/** 05 · Colors — as superfícies: fundos, bordas e tintas de texto. */
export function DevColors({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="colors"
      n="05"
      title="Colors"
      lead="A camada de superfície: fundos, bordas e tintas de texto. É o que faz o realm parecer um editor — recuos por --d-bg-2, divisores por --d-current, ruído por --d-comment."
    >
      <Surface>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-[var(--d-comment)]">
          superfícies
        </p>
        {d.surfaces.map((s) => (
          <SwatchRow key={s.token} s={s} />
        ))}
      </Surface>
    </Chapter>
  )
}

/** 04 · Typography — o realm inteiro é monoespaçado. */
export function DevTypography({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="typography"
      n="04"
      title="Typography"
      lead="Uma família só, monoespaçada, para tudo. Título não é outra fonte — é peso. Se o texto não é código, ainda assim é lido por quem lê código."
    >
      <div className="grid gap-3">
        {d.typography.map((t) => (
          <Surface key={t.role}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className={`${t.className} text-2xl text-[var(--d-fg)]`}>{t.family}</p>
              <code className="font-mono text-[10px] text-[var(--d-cyan)]">
                {t.token} · .{t.className}
              </code>
            </div>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[var(--d-orange)]">
              {t.role}
            </p>
            <p className="mt-1 text-xs leading-snug text-[var(--d-comment)]">{t.usage}</p>
          </Surface>
        ))}
      </div>
    </Chapter>
  )
}

/** 08 · Motion — as curvas e gestos do realm (caret, hover discreto). */
export function DevMotion({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="motion"
      n="08"
      title="Motion"
      lead="Movimento discreto: nada salta. O caret pisca em passos (cursor não desvanece), o card só troca a cor da borda. Registro dos gestos e curvas do realm abaixo."
    >
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">{"// "}caret — a assinatura</p>
          <p className="font-mono text-sm text-[var(--d-green)]">
            ➜ ~/portfolio <span className="dv-caret" />
          </p>
        </Surface>
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">{"// "}hover de card</p>
          <div className="dv-card">
            <p className="dv-title text-xs">passe o mouse</p>
            <p className="dv-sub mt-1 text-[10px]">a borda acende — sem transform</p>
          </div>
        </Surface>
      </div>
      <DevSpecTable rows={d.motion} />
    </Chapter>
  )
}

/** Specs de forma: elevação, raio, grelha — separados por serem tabela, não galeria. */
export function DevShapeSpecs({ d }: { d: RealmDesign }) {
  return (
    <>
      <SubChapter
        id="elevacao"
        n="03.1"
        title="Elevação & Raio"
        lead="Profundidade sutil: o card não tem sombra, só borda. Sombra fica para o que flutua — dock e overlays."
      >
        <DevSpecTable rows={[...d.elevation, ...d.radius]} />
      </SubChapter>
    </>
  )
}
