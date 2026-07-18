/* ------------------------------------------------------------------
   Os capítulos "extras" do _Dev, em Dracula — equivalentes aos do
   Criativo que ficam fora dos 16 do índice: Retro OS → Temas de
   terminal, Lab, Documentação.
   ------------------------------------------------------------------ */
import { Chapter, Surface } from "./dev-chapters"

/** 25 · Temas de terminal — o equivalente dev do "Retro OS" do Criativo. */
export function DevThemes() {
  const themes = [
    { name: "Dracula", on: true, cols: ["#282a36", "#bd93f9", "#50fa7b", "#ff79c6", "#8be9fd"] },
    { name: "Nord", on: false, cols: ["#2e3440", "#88c0d0", "#a3be8c", "#b48ead", "#81a1c1"] },
    { name: "Gruvbox", on: false, cols: ["#282828", "#d3869b", "#b8bb26", "#fe8019", "#83a598"] },
  ]
  return (
    <Chapter
      id="retro-os"
      n="18"
      title="Temas de terminal"
      lead="O _Dev não tem 'Retro OS' — tem temas de editor. Dracula é o canônico do realm; os outros existem para mostrar que a estrutura é a mesma, só as cores trocam."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {themes.map((t) => (
          <Surface key={t.name} className={t.on ? "ring-1 ring-[var(--d-purple)]" : ""}>
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-[var(--d-fg)]">{t.name}</p>
              {t.on && <span className="font-mono text-[9px] text-[var(--d-green)]">● ativo</span>}
            </div>
            <div className="mt-2 flex gap-1">
              {t.cols.map((c) => (
                <span key={c} className="h-6 flex-1 rounded" style={{ background: c }} />
              ))}
            </div>
          </Surface>
        ))}
      </div>
    </Chapter>
  )
}

/** 26 · Lab — experimentos. Uma ferramenta viva (toolbox estático). */
export function DevLab() {
  return (
    <Chapter
      id="lab"
      n="19"
      title="Lab"
      lead="Onde o realm testa ideias antes de virarem componente: uma ferramentinha interna, entrada e saída, sem sair da página."
    >
      <div className="dv-toolbox !mt-0">
        <div className="dv-tabs">
          <button type="button" className="dv-tab" data-on="true">base64</button>
          <button type="button" className="dv-tab">jwt</button>
          <button type="button" className="dv-tab">uuid</button>
        </div>
        <textarea readOnly rows={2} className="dv-tool-field" defaultValue="portfolio 2026" />
        <div className="dv-tool-out">cG9ydGZvbGlvIDIwMjY=</div>
      </div>
    </Chapter>
  )
}

/** 28 · Documentação — ponteiros para o código real, não prosa duplicada. */
export function DevDocs() {
  const links = [
    ["README.md", "visão geral do projeto"],
    ["DESIGN_SYSTEM.md", "arquitetura dos 3 realms"],
    ["src/design-system/realms.ts", "fonte única dos tokens de realm"],
    ["docs/design-system/", "roadmap, naming, responsividade"],
  ]
  return (
    <Chapter
      id="documentacao"
      n="20"
      title="Documentação"
      lead="A doc do _Dev aponta para o código, não o reescreve: cada linha é um arquivo que existe. Prosa duplicada envelhece calada."
    >
      <Surface>
        <div className="space-y-1.5 font-mono text-xs">
          {links.map(([path, note]) => (
            <div key={path} className="flex flex-wrap items-baseline gap-x-3 border-t border-[var(--d-current)] py-1.5 first:border-0">
              <span className="text-[var(--d-cyan)]">{path}</span>
              <span className="text-[var(--d-comment)]">{"// "}{note}</span>
            </div>
          ))}
        </div>
      </Surface>
    </Chapter>
  )
}
