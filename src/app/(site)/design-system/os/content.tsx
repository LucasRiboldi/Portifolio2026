import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { RetroWindow } from "@/components/design-system/retro-window"
import { TypingTerminal } from "@/components/design-system/typing-terminal"


const CRT_LINES = [
  "$ ssh lucas@terra-2026",
  "conectado. bem-vindo ao multiverso dev.",
  "$ ls ~/portfolio",
  "portfolio-2026/  design-system/  tools/  blog/",
  "$ npm run build",
  "▲ Next.js 15 — compilando…",
  "✓ compilado com sucesso · 0 erros",
  "$ deploy --prod",
  "◈ deploy pronto: https://portifolio2026-two.vercel.app",
  "$ _",
]

export function OsThemesContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <div>
      <ComicHeader as={headingAs} kicker="Modo dev · Retro" title="Telas" highlight="retrô" />
      <DsLead>
        Homenagem estética a três eras de interface — recriadas com CSS original
        (sem logos/ícones de marca). No modo dev, um <strong>dock flutuante</strong> aparece
        no rodapé e a troca de tema faz uma <strong>metamorfose animada</strong>.
      </DsLead>

      {/* ---------- Área de trabalho arrastável ---------- */}
      <DsSectionTitle id="desktop">Área de trabalho (arraste as janelas)</DsSectionTitle>
      <div className="relative h-[560px] overflow-hidden rounded-lg border-[3px] border-black bg-[repeating-linear-gradient(45deg,#0e1113_0_12px,#0c0f11_12px_24px)]">
        <RetroWindow os="95" title="Sobre.txt — Bloco de Notas" draggable initial={{ x: 20, y: 20 }} className="w-[300px]">
          <div className="os-inset" style={{ fontFamily: "monospace", fontSize: 13 }}>
            Lucas Riboldi<br />Product Designer &amp; Developer<br />---------------------<br />Do Figma ao deploy.
          </div>
        </RetroWindow>

        <RetroWindow os="xp" title="Meus Projetos" draggable initial={{ x: 220, y: 130 }} className="w-[360px]">
          <div className="os-inset">
            <ul style={{ fontSize: 13, listStyle: "none", margin: 0, padding: 0 }}>
              <li>📁 portfolio-2026 — Next.js</li>
              <li>📁 design-system — Tokens</li>
              <li>📁 sports-widget — React</li>
              <li>📁 skill-seekers — CLI</li>
            </ul>
          </div>
        </RetroWindow>

        <RetroWindow os="mac" title="lucas — zsh" draggable initial={{ x: 120, y: 300 }} className="w-[380px]">
          <div className="os-inset" style={{ background: "#1e1e1e", color: "#e6e6e6", fontFamily: "monospace", fontSize: 12, borderRadius: 8 }}>
            <span style={{ color: "#28c840" }}>➜</span> <span style={{ color: "#38bdf8" }}>~/portfolio</span> git status<br />
            <span style={{ color: "#b7bdc4" }}>nada a commitar, tudo limpo ✓</span>
          </div>
        </RetroWindow>
      </div>
      <p className="mt-2 text-xs text-white/40">Dica: segure a barra de título e arraste. A janela ativa vem para a frente.</p>

      {/* ---------- Tela CRT que emite mensagens ---------- */}
      <DsSectionTitle id="crt">Tela que emite mensagens</DsSectionTitle>
      <div className="max-w-xl">
        <RetroWindow os="mac" title="terminal — lucas@terra-2026">
          <TypingTerminal lines={CRT_LINES} />
        </RetroWindow>
      </div>

      {/* ---------- Referência ---------- */}
      <DsSectionTitle id="ref">Componentes</DsSectionTitle>
      <pre className="overflow-x-auto rounded-md border-2 border-black bg-black/50 p-4 text-xs text-white/80">
        <code>{`<RetroWindow os="95|xp|mac" title="…" draggable initial={{x,y}} />
<TypingTerminal lines={["$ npm run build", "✓ ok"]} />
// dock flutuante e metamorfose ativam no modo dev (botão ❯_ DEV no topo)`}</code>
      </pre>
    </div>
  )
}
