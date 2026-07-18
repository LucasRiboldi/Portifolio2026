/* ------------------------------------------------------------------
   A biblioteca de componentes do _Dev, em Dracula — um capítulo por
   grupo, equiparando os 6 grupos do Criativo (Botões, Inputs, Seleção,
   Data Display, Overlays, Feedback) + Seções de página.

   Tudo estático e escopado no `.dracula` do guia: são amostras reais das
   classes de dracula.css, não capturas.
   ------------------------------------------------------------------ */
import { Chapter, Surface } from "./dev-chapters"

/** Botão Dracula — variantes por papel de cor, não por enfeite. */
function Btn({
  children,
  tone = "primary",
}: {
  children: React.ReactNode
  tone?: "primary" | "secondary" | "ghost" | "danger"
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors"
  const tones: Record<string, string> = {
    primary: "bg-[var(--d-purple)] text-[var(--d-bg)] hover:brightness-110",
    secondary:
      "border border-[var(--d-current)] text-[var(--d-fg)] hover:border-[var(--d-comment)]",
    ghost: "text-[var(--d-pink)] hover:underline",
    danger: "border border-[var(--d-red)] text-[var(--d-red)] hover:bg-[var(--d-red)]/10",
  }
  return <button type="button" className={`${base} ${tones[tone]}`}>{children}</button>
}

/** 05 · Botões */
export function DevButtons() {
  return (
    <Chapter
      id="botoes"
      n="05"
      title="Componentes · Botões"
      lead="Quatro papéis, quatro tintas: roxo é a ação primária, borda é a de apoio, rosa é o link, vermelho é destrutivo. A cor diz o que o botão faz."
    >
      <Surface>
        <div className="flex flex-wrap items-center gap-2">
          <Btn tone="primary">➜ deploy</Btn>
          <Btn tone="secondary">git diff</Btn>
          <Btn tone="ghost">ver docs</Btn>
          <Btn tone="danger">rm -rf</Btn>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[var(--d-current)] px-3 py-1.5 font-mono text-xs text-[var(--d-comment)] opacity-60"
          >
            building…
          </button>
        </div>
        <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">
          .btn primary · secondary · ghost · danger · [disabled]
        </p>
      </Surface>
    </Chapter>
  )
}

/** 06 · Inputs & Forms */
export function DevInputs() {
  return (
    <Chapter
      id="inputs"
      n="06"
      title="Componentes · Inputs & Forms"
      lead="Campo é terminal: fundo recuado, borda que acende no foco (--d-purple/--d-cyan), texto mono. Rótulo em comentário, ajuda em cinza."
    >
      <Surface>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] text-[var(--d-comment)]">{"// "}nome do projeto</span>
            <input
              readOnly
              defaultValue="portfolio-2026"
              className="dv-search w-full font-mono text-xs"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] text-[var(--d-comment)]">{"// "}stack</span>
            <input readOnly placeholder="next, ts, supabase…" className="dv-search w-full font-mono text-xs" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block font-mono text-[10px] text-[var(--d-comment)]">{"// "}descrição</span>
            <textarea readOnly rows={2} className="dv-tool-field" defaultValue="Portfólio multiverso — 3 realms." />
          </label>
        </div>
        <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">.dv-search · .dv-tool-field</p>
      </Surface>
    </Chapter>
  )
}

/** 07 · Seleção */
export function DevSelection() {
  return (
    <Chapter
      id="selecao"
      n="07"
      title="Componentes · Seleção"
      lead="Filtro é estado, não enfeite: data-on liga, e a cor confirma. Abas com borda e raio 9px, checkbox que vira ✓ preenchido."
    >
      <Surface>
        <div className="dv-tabs">
          <button type="button" className="dv-tab" data-on="true">todos</button>
          <button type="button" className="dv-tab">web</button>
          <button type="button" className="dv-tab">cli</button>
          <button type="button" className="dv-tab">lab</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="dv-filter font-mono text-[10px]" data-on="true">next</button>
          <button type="button" className="dv-filter font-mono text-[10px]">rust</button>
          <button type="button" className="dv-filter font-mono text-[10px]">python</button>
        </div>
        <div className="mt-4 space-y-1.5 font-mono text-xs">
          {[["rsc", true], ["ssr", true], ["ssg", false]].map(([lbl, on]) => (
            <label key={lbl as string} className="flex items-center gap-2 text-[var(--d-fg)]">
              <span
                className="grid size-4 place-items-center rounded border text-[10px]"
                style={{
                  borderColor: on ? "var(--d-green)" : "var(--d-comment)",
                  background: on ? "var(--d-green)" : "transparent",
                  color: "var(--d-bg)",
                }}
              >
                {on ? "✓" : ""}
              </span>
              {lbl as string}
            </label>
          ))}
        </div>
        <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">.dv-tab · .dv-filter · checkbox</p>
      </Surface>
    </Chapter>
  )
}

/** 08 · Data Display */
export function DevDataDisplay() {
  return (
    <Chapter
      id="data-display"
      n="08"
      title="Componentes · Data Display"
      lead="Como o _Dev mostra dado: card sem sombra, contadores ligados a rotas, tags de stack, tabela mono e linha do tempo. Nada salta — lê-se."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Surface>
          <div className="dv-card">
            <p className="dv-title text-sm">portfolio-2026</p>
            <p className="dv-sub mt-1 text-xs">Next.js · TypeScript · Supabase</p>
            <div className="dv-chip-row mt-3">
              <span className="dv-tag">next</span>
              <span className="dv-tag">ts</span>
              <span className="dv-tag">rsc</span>
            </div>
          </div>
        </Surface>
        <Surface>
          <div className="dv-stats !mt-0">
            <div className="dv-stat">
              <span className="n text-[var(--d-green)]">31</span>
              <span className="l">testes</span>
            </div>
            <div className="dv-stat">
              <span className="n text-[var(--d-cyan)]">7</span>
              <span className="l">projetos</span>
            </div>
          </div>
        </Surface>
      </div>
      <Surface className="mt-3">
        <table className="w-full text-left font-mono text-[11px]">
          <thead>
            <tr className="text-[var(--d-comment)]">
              <th className="py-1 pr-3 font-normal">rota</th>
              <th className="py-1 pr-3 font-normal">status</th>
              <th className="py-1 font-normal">build</th>
            </tr>
          </thead>
          <tbody>
            {[["/", "done", "12kb"], ["/portal", "done", "8kb"], ["/lab", "wip", "—"]].map((r) => (
              <tr key={r[0]} className="border-t border-[var(--d-current)]">
                <td className="py-1.5 pr-3 text-[var(--d-cyan)]">{r[0]}</td>
                <td className="py-1.5 pr-3"><span className={`dv-status ${r[1]}`}>{r[1]}</span></td>
                <td className="py-1.5 text-[var(--d-fg)]">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </Chapter>
  )
}

/** 09 · Overlays */
export function DevOverlays() {
  return (
    <Chapter
      id="overlays"
      n="09"
      title="Componentes · Overlays"
      lead="O que flutua — e só aqui a sombra aparece (dock/overlay). Modal centrado, tooltip mono, dropdown que é uma lista de comandos."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">{"// "}modal</p>
          <div className="mx-auto max-w-xs rounded-[10px] border border-[var(--d-current)] bg-[var(--d-bg)] p-3 shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
            <p className="font-mono text-xs text-[var(--d-fg)]">descartar alterações?</p>
            <p className="mt-1 font-mono text-[10px] text-[var(--d-comment)]">3 arquivos não commitados</p>
            <div className="mt-3 flex justify-end gap-2 font-mono text-[10px]">
              <span className="text-[var(--d-comment)]">cancelar</span>
              <span className="text-[var(--d-red)]">descartar</span>
            </div>
          </div>
        </Surface>
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">{"// "}dropdown / tooltip</p>
          <div className="rounded-lg border border-[var(--d-current)] bg-[var(--d-bg)] p-1 font-mono text-xs">
            {["abrir", "duplicar", "excluir"].map((o, i) => (
              <div
                key={o}
                className={`rounded px-2 py-1 ${i === 0 ? "bg-[var(--d-current)] text-[var(--d-fg)]" : "text-[var(--d-comment)]"}`}
              >
                {o}
              </div>
            ))}
          </div>
          <span className="mt-3 inline-block rounded bg-[var(--d-current)] px-2 py-1 font-mono text-[10px] text-[var(--d-fg)]">
            ⌘S — salvar
          </span>
        </Surface>
      </div>
    </Chapter>
  )
}

/** 10 · Feedback */
export function DevFeedback() {
  return (
    <Chapter
      id="feedback"
      n="10"
      title="Componentes · Feedback"
      lead="O feedback do _Dev fala como o processo: exit code, barra de progresso, estado (idea→done) e o vazio como linha de comentário."
    >
      <Surface>
        <div className="flex flex-wrap gap-2">
          {["idea", "mvp", "building", "done", "paused"].map((s) => (
            <span key={s} className={`dv-status ${s} font-mono text-[10px]`}>{s}</span>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 font-mono text-[10px] text-[var(--d-comment)]">{"// "}progresso</p>
            <div className="learn-bar"><span style={{ width: "72%", background: "var(--d-green)" }} /></div>
          </div>
          <div>
            <p className="mb-1 font-mono text-[10px] text-[var(--d-comment)]">{"// "}exit code</p>
            <p className="font-mono text-xs text-[var(--d-green)]">✓ exit 0 — tudo passou</p>
            <p className="font-mono text-xs text-[var(--d-red)]">✗ exit 1 — 2 testes falharam</p>
          </div>
        </div>
        <div className="dv-empty mt-4">
          <p className="font-mono text-xs text-[var(--d-comment)]">{"// "}nenhum resultado</p>
          <p className="mt-1 font-mono text-xs text-[var(--d-fg)]">
            <span className="text-[var(--d-green)]">➜</span> tente <span className="text-[var(--d-cyan)]">todos</span>
          </p>
        </div>
      </Surface>
    </Chapter>
  )
}

/** 11 · Seções de página */
export function DevSections() {
  return (
    <Chapter
      id="secoes"
      n="11"
      title="Seções de página"
      lead="Os blocos que montam uma página do _Dev: hero com prompt, faixa de contadores e um CTA que é um comando."
    >
      <Surface>
        <div className="dv-hero !mt-0">
          <p className="term font-mono"><span className="tok-fn">build</span>(<span className="tok-str">&quot;portfolio&quot;</span>)</p>
          {/* p.dv-hero-title, não h1: isto é demo dentro do guia, que já tem seu h1 */}
          <p className="dv-hero-title font-mono"><span className="g">deploy</span> <span className="c">rápido</span>.</p>
          <p className="font-mono">Do commit ao ar em 21.9s.</p>
        </div>
        <div className="dv-stats">
          <div className="dv-stat"><span className="n text-[var(--d-green)]">21.9s</span><span className="l">build</span></div>
          <div className="dv-stat"><span className="n text-[var(--d-cyan)]">2090</span><span className="l">módulos</span></div>
          <div className="dv-stat"><span className="n text-[var(--d-purple)]">3</span><span className="l">realms</span></div>
          <div className="dv-stat"><span className="n text-[var(--d-orange)]">100</span><span className="l">lighthouse</span></div>
        </div>
      </Surface>
    </Chapter>
  )
}
