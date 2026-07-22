/* ------------------------------------------------------------------
   Caderno 12 (As tintas sobre o papel) da folha "O Anfitrião" —
   extraído de arcane-chapters.tsx para manter cada arquivo sob 500
   linhas. É o capítulo mais longo do guia: a tabela de contraste WCAG
   sobre os dois papéis, o foco, o leitor de tela, motion e impressão.
   Reusa Chapter/Folha/Nota das primitivas em ./arcane-chapters.
   ------------------------------------------------------------------ */
import { Chapter, Folha, Nota } from "./arcane-chapters"

/**
 * Medido pela fórmula do WCAG 2 sobre os dois papéis. O detalhe que importa:
 * três tintas passam no papel claro e caem no escuro — a folha tem duas
 * superfícies, e quem escolhe a tinta precisa saber sobre qual vai imprimir.
 */
const TINTAS = [
  { nome: "--dp-ink", hex: "#1c1710", papel: 13.07, papel2: 11.64 },
  { nome: "--dp-rule", hex: "#2a2216", papel: 11.51, papel2: 10.25 },
  { nome: "--dp-ink-2", hex: "#43382a", papel: 8.39, papel2: 7.47 },
  { nome: "--dp-ink-3", hex: "#6b5c45", papel: 4.75, papel2: 4.23 },
  { nome: "--dp-sepia", hex: "#7a5c34", papel: 4.52, papel2: 4.03 },
  { nome: "--dp-ocre", hex: "#8a6a2f", papel: 3.68, papel2: 3.28 },
  { nome: "--dp-gold", hex: "#9a7b28", papel: 2.94, papel2: 2.62 },
]

function veredito(r: number) {
  if (r >= 4.5) return { txt: "AA", cor: "#50fa7b" }
  if (r >= 3) return { txt: "só título grande", cor: "#ffb86c" }
  return { txt: "reprova", cor: "#ff5555" }
}

/* ══════════════ 12 · ACCESSIBILITY ══════════════ */
export function ArcaneAccessibility() {
  return (
    <Chapter
      id="accessibility"
      n="12"
      title="As tintas sobre o papel"
      lead={
        <>
          Medido pela fórmula do WCAG 2 sobre os <strong>dois</strong> papéis, e é aí que está a
          armadilha: a folha tem duas superfícies. <code className="text-[var(--dp-sepia)]">--dp-ink-3</code>{" "}
          e <code className="text-[var(--dp-sepia)]">--dp-sepia</code> passam no papel claro e{" "}
          <strong>caem no escuro</strong> — escolher a tinta sem saber sobre qual papel vai
          imprimir é como aprovar contraste no Figma e reprovar no site. Já o{" "}
          <code className="text-[var(--dp-sepia)]">--dp-gold</code> reprova nos dois (2.94:1): é
          ornamento, nunca texto.
        </>
      }
    >
      <Folha>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr style={{ color: "var(--dp-ink-3)" }}>
                <th className="py-1 pr-3 font-normal">tinta</th>
                <th className="py-1 pr-3 font-normal">hex</th>
                <th className="py-1 pr-3 font-normal">papel</th>
                <th className="py-1 pr-3 font-normal">papel-2</th>
                <th className="py-1 font-normal">veredito</th>
              </tr>
            </thead>
            <tbody>
              {TINTAS.map((t) => {
                const v = veredito(t.papel)
                const cai = t.papel >= 4.5 && t.papel2 < 4.5
                return (
                  <tr key={t.nome} style={{ borderTop: "1px solid var(--dp-rule)" }}>
                    <td className="py-1.5 pr-3" style={{ color: t.hex }}>
                      {t.nome}
                    </td>
                    <td className="py-1.5 pr-3" style={{ color: "var(--dp-ink-3)" }}>
                      {t.hex}
                    </td>
                    <td className="py-1.5 pr-3" style={{ color: "var(--dp-ink)" }}>
                      {t.papel.toFixed(2)}
                    </td>
                    <td
                      className="py-1.5 pr-3"
                      style={{ color: cai ? "#a33" : "var(--dp-ink)", fontWeight: cai ? 700 : 400 }}
                    >
                      {t.papel2.toFixed(2)}
                      {cai && " ↓"}
                    </td>
                    <td className="py-1.5" style={{ color: v.cor === "#50fa7b" ? "#2d6a3f" : v.cor === "#ffb86c" ? "#8a5a10" : "#a33" }}>
                      {cai ? "cai no papel-2" : v.txt}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Folha>

      {/* ---- o resto do que a seção 12 promete e faltava ---- */}
      <p className="mb-2 mt-6 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        O foco — e a lacuna que ele expõe
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            A folha inteira declara <strong>um</strong> estilo de foco, no verbete do expediente:{" "}
            <code className="font-mono">outline: 1px dotted var(--dp-sepia)</code> com{" "}
            <code className="font-mono">outline-offset: 2px</code>. Pontilhado porque é o que a
            prensa sabia fazer — e a mesma tinta do link, para o foco parecer parte da composição.
          </p>
          <div className="my-3 dp-rule dp-rule--hair" />
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <span style={{ color: "#8a3020" }}>✕</span> <strong>A lacuna:</strong> as outras peças
            clicáveis — <code className="font-mono">.dp-more</code>,{" "}
            <code className="font-mono">.dp-index-item</code>,{" "}
            <code className="font-mono">.dp-sections a</code> — não declaram foco nenhum e caem no
            anel padrão do navegador. Ele funciona, mas é azul de sistema sobre papel sépia: quem
            navega por teclado vê a folha quebrar de estilo a cada tabulação. Está registrado como
            dívida, não como decisão.
          </p>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Experimente com o teclado
          </p>
          <p className="mb-3 text-[11px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
            Tabule pelos três abaixo: o primeiro tem o foco da casa, os outros dois mostram o que a
            lacuna acima significa na prática.
          </p>
          <div className="space-y-2">
            <p className="text-xs" style={{ color: "var(--dp-ink-2)" }}>
              Tipografia &amp;{" "}
              <a href="#accessibility" className="dp-press">
                Prelo
              </a>{" "}
              <span style={{ color: "var(--dp-ink-3)" }}>· foco da casa</span>
            </p>
            <a href="#accessibility" className="dp-more">
              Continua <b>pág. 4</b>
            </a>
            <p className="dp-index-item !inline-flex">
              <a href="#accessibility" style={{ color: "inherit", textDecoration: "none" }}>
                Item de índice
              </a>
            </p>
          </div>
        </Folha>
      </div>

      <p className="mb-2 mt-6 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        Leitor de tela, movimento e impressão
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Folha>
          <p className="mb-1.5 text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            O que a tinta não diz
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Metade das peças desta folha é ornamento puro e precisa sumir para quem ouve a página: o
            fleurão de fecho, a vinheta, as marcas de registro no pé. Todas levam{" "}
            <code className="font-mono">aria-hidden</code>. O contrário também vale — a gravura de
            dados (09.7) é invisível sem <code className="font-mono">role=&quot;img&quot;</code> e um
            rótulo que leia a série por extenso.
          </p>
          <Nota>Regra: se o elemento é uma peça de metal fundido, esconda. Se carrega dado, rotule.</Nota>
        </Folha>

        <Folha>
          <p className="mb-1.5 text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            Movimento reduzido
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            Este é o único realm dos três em que{" "}
            <code className="font-mono">prefers-reduced-motion</code> não muda absolutamente nada — e
            isso é uma conquista de arquitetura, não um esquecimento. Papel não anima (ver 08.1), então
            não há o que desligar. As únicas transições da folha são de <em>cor</em>, em links, que a
            preferência não pede para remover.
          </p>
          <Nota>Quem compõe uma peça nova neste realm herda essa garantia — desde que não traga spring de fora.</Nota>
        </Folha>

        <Folha>
          <p className="mb-1.5 text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            No papel de verdade
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            A folha tem <code className="font-mono">@media print</code>: ao imprimir, o ruído de
            impressão sobreposto (<code className="font-mono">.dp::after</code>) é removido — a
            textura que simula tinta velha na tela viraria sujeira real no papel. É o raro caso de um
            site cuja versão impressa fica <em>mais</em> limpa que a original.
          </p>
          <Nota>Teste com Ctrl+P antes de dar por fechada qualquer página deste realm.</Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
          Corpo de texto — o risco desta estética
        </p>
        <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          Jornal antigo é denso por natureza, e densidade é o inimigo natural da legibilidade. Três
          números desta folha merecem vigilância: o corpo base é <strong>15px</strong> (acima do
          mínimo confortável, bom), mas peças como <code className="font-mono">.dp-figcaption</code>{" "}
          (0.62rem), <code className="font-mono">.dp-ad-sign</code> (0.6rem) e{" "}
          <code className="font-mono">.dp-foot</code> (0.58rem) descem a ~9px. Elas passam porque são{" "}
          <em>metadados</em> — legenda, assinatura, fólio. Nenhuma informação que o leitor precise
          para agir pode viver nesse corpo. E o texto justificado com{" "}
          <code className="font-mono">hyphens: auto</code> exige a coluna estreita de 28–36ch: numa
          medida larga, a justificação abre rios brancos que dificultam a leitura de quem tem
          dislexia.
        </p>
      </Folha>
    </Chapter>
  )
}
