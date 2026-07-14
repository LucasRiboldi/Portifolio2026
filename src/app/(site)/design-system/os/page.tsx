import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { RetroWindow } from "@/components/design-system/retro-window"

export const metadata = { title: "Retro OS · Design System" }

export default function OsThemesPage() {
  return (
    <div>
      <ComicHeader kicker="Modo dev · Retro" title="Telas" highlight="retrô" />
      <DsLead>
        Homenagem estética a três eras de interface — recriadas com CSS original
        (sem logos ou ícones de marca). Combina com o modo dev do portfólio.
      </DsLead>

      {/* ---------- Windows 95 ---------- */}
      <DsSectionTitle id="win95">Windows 95</DsSectionTitle>
      <div className="max-w-md">
        <RetroWindow os="95" title="Sobre.txt — Bloco de Notas">
          <div className="os-inset">
            <p style={{ fontFamily: "monospace", fontSize: 13 }}>
              Lucas Riboldi<br />
              Product Designer &amp; Developer<br />
              --------------------------------<br />
              Interfaces, ferramentas e experimentos.<br />
              Do Figma ao deploy.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
            <button className="os-btn">OK</button>
            <button className="os-btn">Cancelar</button>
          </div>
        </RetroWindow>
      </div>

      {/* ---------- Windows XP ---------- */}
      <DsSectionTitle id="winxp">Windows XP</DsSectionTitle>
      <div className="max-w-lg">
        <RetroWindow os="xp" title="Meus Projetos">
          <div className="os-inset">
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#333", borderBottom: "1px solid #c9c2a8" }}>
                  <th style={{ padding: "4px 6px" }}>Nome</th>
                  <th style={{ padding: "4px 6px" }}>Tipo</th>
                  <th style={{ padding: "4px 6px" }}>Modificado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["portfolio-2026", "Next.js", "hoje"],
                  ["design-system", "Tokens", "hoje"],
                  ["sports-widget", "React", "ontem"],
                  ["skill-seekers", "CLI", "jul 2026"],
                ].map(([n, t, m]) => (
                  <tr key={n} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "4px 6px" }}>📁 {n}</td>
                    <td style={{ padding: "4px 6px" }}>{t}</td>
                    <td style={{ padding: "4px 6px", color: "#555" }}>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
            <button className="os-btn">Abrir</button>
            <button className="os-btn">Propriedades</button>
          </div>
        </RetroWindow>
      </div>

      {/* ---------- macOS ---------- */}
      <DsSectionTitle id="macos">macOS</DsSectionTitle>
      <div className="max-w-lg">
        <RetroWindow os="mac" title="lucas — zsh — 80×24">
          <div
            className="os-inset"
            style={{ background: "#1e1e1e", color: "#e6e6e6", fontFamily: "monospace", fontSize: 13, borderRadius: 8 }}
          >
            <p style={{ margin: 0 }}>
              <span style={{ color: "#28c840" }}>lucas@terra-2026</span>
              <span style={{ color: "#8b9299" }}>:</span>
              <span style={{ color: "#38bdf8" }}>~/portfolio</span>
              <span style={{ color: "#8b9299" }}>$</span> npm run build
            </p>
            <p style={{ margin: "6px 0 0", color: "#b7bdc4" }}>▲ Next.js 15 — Compiled successfully ✓</p>
            <p style={{ margin: "2px 0 0", color: "#b7bdc4" }}>◈ 60+ rotas · 0 erros</p>
            <p style={{ margin: "8px 0 0" }}>
              <span style={{ color: "#28c840" }}>lucas@terra-2026</span>
              <span style={{ color: "#8b9299" }}>:</span>
              <span style={{ color: "#38bdf8" }}>~/portfolio</span>
              <span style={{ color: "#8b9299" }}>$</span> <span style={{ background: "#e6e6e6", color: "#1e1e1e" }}>&nbsp;</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="os-btn">Deploy</button>
            <button className="os-btn os-btn-ghost">Cancelar</button>
          </div>
        </RetroWindow>
      </div>

      <p className="mt-8 text-xs text-white/40">
        Componente reutilizável: <code className="text-[var(--sv-cyan)]">
          &lt;RetroWindow os=&quot;95|xp|mac&quot; title=&quot;…&quot; /&gt;
        </code>
      </p>
    </div>
  )
}
