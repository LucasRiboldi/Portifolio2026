/* ------------------------------------------------------------------
   Os capítulos "extras" do _Dev, em Dracula — equivalentes aos do
   Criativo que ficam fora dos 16 do índice: Retro OS → Temas de
   terminal, Lab, Documentação.
   ------------------------------------------------------------------ */
import { Chapter, Surface } from "./dev-chapters"

/* `DevThemes` mudou-se para `dev-os.tsx` e virou `DevOsThemes`: a seção 18
   deixou de listar amostras de cor e passou a renderizar o mesmo código em
   cada tema, mais as três eras de janela de sistema transpostas do Criativo. */

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
