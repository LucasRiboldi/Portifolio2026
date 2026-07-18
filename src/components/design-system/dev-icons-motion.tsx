/* ------------------------------------------------------------------
   07 · Iconografia e 08.2 · o inventário de movimento do _Dev.
   ------------------------------------------------------------------
   Ambos existiam como amostra: a iconografia listava oito glifos sem dizer
   como dimensioná-los ou alinhá-los, e o motion mostrava dois gestos e uma
   tabela de tokens sem dizer o que de fato anima nesta folha de estilo.

   O inventário abaixo NÃO é inventado: saiu de `@keyframes` e `animation:`
   em dracula.css e dev-mode.css. Se alguém acrescentar uma animação e não
   registrar aqui, a divergência é detectável — basta contar de novo.
   ------------------------------------------------------------------ */
import { Chapter, SubChapter, Surface } from "./dev-chapters"

/* ══════════════ 07 · ICONOGRAFIA ══════════════ */

const GLIFOS = [
  { g: "➜", nome: "prompt", papel: "início de comando", cor: "var(--d-green)" },
  { g: "✓", nome: "ok", papel: "sucesso / exit 0", cor: "var(--d-green)" },
  { g: "✗", nome: "fail", papel: "erro / exit ≠ 0", cor: "var(--d-red)" },
  { g: "▍", nome: "caret", papel: "cursor, marcador de seção", cor: "var(--d-purple)" },
  { g: "●", nome: "dot", papel: "nó de timeline / status", cor: "var(--d-cyan)" },
  { g: "▲", nome: "build", papel: "ferramenta / framework", cor: "var(--d-fg)" },
  { g: "±", nome: "diff", papel: "adição e remoção", cor: "var(--d-orange)" },
  { g: "⧉", nome: "copy", papel: "copiar para a área de transferência", cor: "var(--d-comment)" },
  { g: "⌘", nome: "meta", papel: "atalho de teclado", cor: "var(--d-comment)" },
  { g: "⏎", nome: "enter", papel: "confirmar, executar", cor: "var(--d-comment)" },
  { g: "…", nome: "pending", papel: "em andamento, indeterminado", cor: "var(--d-orange)" },
  { g: "//", nome: "comment", papel: "ruído, nota de fundo", cor: "var(--d-comment)" },
]

export function DevIconography() {
  return (
    <Chapter
      id="iconography"
      n="07"
      title="Iconography"
      lead={
        <>
          O ícone do _Dev é <strong>glifo de terminal</strong>, não pictograma desenhado: o mesmo
          caractere que sai no build. A decisão tem consequência técnica, não só estética — glifo
          herda cor, peso e tamanho do texto ao redor, não tem viewBox, não precisa de sprite e não
          adiciona um único byte de rede. Nada de biblioteca de SVG para dizer o que{" "}
          <code className="text-[var(--d-green)]">✓</code> já diz.
        </>
      }
    >
      <Surface>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GLIFOS.map((it) => (
            <div
              key={it.nome}
              className="flex items-center gap-3 rounded border border-[var(--d-current)] bg-[var(--d-bg-2)] px-3 py-2"
            >
              <span
                className="grid size-8 shrink-0 place-items-center rounded font-mono text-lg"
                style={{ color: it.cor, background: "var(--d-bg)" }}
              >
                {it.g}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[11px] text-[var(--d-fg)]">{it.nome}</span>
                <span className="block text-[10px] text-[var(--d-comment)]">{it.papel}</span>
              </span>
            </div>
          ))}
        </div>
      </Surface>

      {/* ---- grade e alinhamento ---- */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
            {"// "}a grade é a caixa do mono, não 24×24
          </p>
          <div className="flex items-end gap-4" style={{ color: "var(--d-green)" }}>
            {["text-xs", "text-sm", "text-base", "text-xl", "text-3xl"].map((c) => (
              <span key={c} className={`font-mono ${c} leading-none`}>
                ✓
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
            Não há grade de 16/20/24px como numa biblioteca de SVG: o glifo ocupa uma célula da
            fonte monoespaçada e escala com{" "}
            <code className="font-mono text-[var(--d-cyan)]">font-size</code>. Isso é uma vantagem —
            ele nunca desalinha com o texto — e uma limitação: você não controla o peso do traço
            independentemente do corpo.
          </p>
        </Surface>

        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
            {"// "}alinhamento óptico com o rótulo
          </p>
          <div className="space-y-2 font-mono text-xs">
            <p className="flex items-center gap-2">
              <span className="text-[var(--d-green)]">✓</span>
              <span className="text-[var(--d-fg)]">items-center — o correto</span>
            </p>
            <p className="flex items-baseline gap-2">
              <span className="text-[var(--d-red)]">✗</span>
              <span className="text-[var(--d-comment)] line-through">items-baseline — afunda</span>
            </p>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
            Glifos geométricos (✓ ✗ ● ▲) têm altura óptica diferente das letras: alinhados pela
            linha de base, parecem afundados. Use{" "}
            <code className="font-mono text-[var(--d-cyan)]">items-center</code> e um{" "}
            <code className="font-mono text-[var(--d-cyan)]">gap</code> fixo — nunca espaço em
            branco no texto, que não é ajustável.
          </p>
        </Surface>
      </div>

      {/* ---- regras ---- */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-green)]">{"// "}sempre</p>
          <div className="space-y-1.5 text-[11px] leading-snug text-[var(--d-comment)]">
            <p>
              <span className="text-[var(--d-fg)]">Decorativo → </span>
              <code className="font-mono text-[var(--d-cyan)]">aria-hidden=&quot;true&quot;</code>. Um
              ✓ ao lado da palavra &quot;sucesso&quot; é redundância sonora.
            </p>
            <p>
              <span className="text-[var(--d-fg)]">Sozinho → </span> precisa de rótulo acessível. O
              glifo é a única informação, e leitor de tela lê &quot;seta preta para a direita&quot;.
            </p>
            <p>
              <span className="text-[var(--d-fg)]">Cor com significado → </span> repita em texto.
              Vermelho + ✗ é reforço; vermelho sozinho exclui daltônicos.
            </p>
          </div>
        </Surface>

        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-red)]">{"// "}nunca</p>
          <div className="space-y-1.5 text-[11px] leading-snug text-[var(--d-comment)]">
            <p>
              <span className="text-[var(--d-fg)]">Emoji colorido.</span> 🚀 quebra a paleta, muda de
              desenho por sistema operacional e não herda a tinta.
            </p>
            <p>
              <span className="text-[var(--d-fg)]">Glifo raro.</span> Se a fonte mono do usuário não
              tiver o caractere, ele vira ▯. Fique no conjunto acima, que é testado.
            </p>
            <p>
              <span className="text-[var(--d-fg)]">Dois glifos no mesmo rótulo.</span> ➜ ✓ deploy não
              diz duas coisas — diz que ninguém decidiu qual.
            </p>
          </div>
        </Surface>
      </div>

      <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">
        glifos Unicode · sem dependência · herdam color e font-size
      </p>
    </Chapter>
  )
}

/* ══════════════ 08.2 · O INVENTÁRIO DE MOVIMENTO ══════════════ */

/**
 * Extraído de `@keyframes` + `animation:` em dracula.css e dev-mode.css.
 * A coluna "curva" é o que mais diz sobre o realm: quase tudo é `steps()`.
 */
const ANIMACOES = [
  {
    nome: "dv-blink",
    onde: ".dv-caret",
    dur: "1.1s",
    curva: "steps(2)",
    o: "O cursor. Liga/desliga sem meio-termo — cursor de terminal não desvanece.",
    css: "dracula",
  },
  {
    nome: "learn-flow",
    onde: ".learn-edge",
    dur: "2.4s",
    curva: "linear",
    o: "Fluxo ao longo de uma aresta de grafo. Linear porque representa transporte, não gesto.",
    css: "dracula",
  },
  {
    nome: "learn-pulse",
    onde: ".learn-node",
    dur: "1.8s",
    curva: "ease-in-out",
    o: "Nó ativo respirando. A única curva suave do realm — e é por ser estado, não transição.",
    css: "dracula",
  },
  {
    nome: "vibe-sweep",
    onde: ".vibe-morph",
    dur: "0.82s",
    curva: "cubic-bezier(.7,0,.3,1)",
    o: "A varredura que troca o modo. Entrada e saída rápidas, meio lento: parece corte, não deslize.",
    css: "dev-mode",
  },
  {
    nome: "vibe-flick",
    onde: ".vibe-morph-label",
    dur: "0.82s",
    curva: "steps(6)",
    o: "O rótulo piscando durante a troca — seis quadros, como fluorescente ao acender.",
    css: "dev-mode",
  },
  {
    nome: "crt-scan",
    onde: ".crt::before",
    dur: "6s",
    curva: "linear",
    o: "A linha de varredura descendo pelo tubo. Lenta o bastante para não competir com a leitura.",
    css: "dev-mode",
  },
  {
    nome: "crt-flicker",
    onde: ".crt::after",
    dur: "0.15s",
    curva: "steps(2)",
    o: "Instabilidade do fósforo. Dois estados, sem interpolação.",
    css: "dev-mode",
  },
  {
    nome: "crt-blink",
    onde: ".crt-cursor",
    dur: "1s",
    curva: "steps(1)",
    o: "O cursor do modo CRT — um passo só: aparece, some.",
    css: "dev-mode",
  },
]

export function DevMotionInventory() {
  return (
    <SubChapter
      id="motion-inventario"
      n="08.2"
      title="O inventário do movimento"
      lead="Toda animação que este realm executa, extraída dos @keyframes reais das duas folhas de estilo. Documentar movimento em prosa é o jeito mais fácil de a documentação mentir — o easing muda no código e a tabela continua igual. Esta lista existe para ser conferível: são oito, e dá para contar."
    >
      <Surface>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left font-mono text-[11px]">
            <thead>
              <tr className="text-[var(--d-comment)]">
                <th className="py-1 pr-3 font-normal">@keyframes</th>
                <th className="py-1 pr-3 font-normal">aplica em</th>
                <th className="py-1 pr-3 font-normal">dur.</th>
                <th className="py-1 pr-3 font-normal">curva</th>
                <th className="py-1 font-normal">papel</th>
              </tr>
            </thead>
            <tbody>
              {ANIMACOES.map((a) => (
                <tr key={a.nome} className="border-t border-[var(--d-current)]">
                  <td className="py-2 pr-3 text-[var(--d-green)]">{a.nome}</td>
                  <td className="py-2 pr-3 text-[var(--d-cyan)]">{a.onde}</td>
                  <td className="py-2 pr-3 text-[var(--d-fg)]">{a.dur}</td>
                  <td className="whitespace-nowrap py-2 pr-3 text-[var(--d-orange)]">{a.curva}</td>
                  <td className="py-2 font-sans text-[11px] leading-snug text-[var(--d-comment)]">
                    {a.o}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
            {"// "}a assinatura do realm: steps(), não ease
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm text-[var(--d-green)]">
              ➜ <span className="dv-caret" />
            </span>
            <span className="text-[11px] leading-snug text-[var(--d-comment)]">
              Cinco das oito animações usam{" "}
              <code className="text-[var(--d-orange)]">steps()</code>. Não é limitação: hardware de
              terminal comuta, não interpola. Um cursor com{" "}
              <code className="text-[var(--d-orange)]">ease-in-out</code> parece um respirador — e
              denuncia na hora que a peça foi desenhada por quem nunca olhou um terminal de verdade.
            </span>
          </div>
        </Surface>

        <Surface>
          <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
            {"// "}o que NÃO anima, de propósito
          </p>
          <div className="dv-card">
            <p className="dv-title text-xs">passe o ponteiro</p>
            <p className="dv-sub mt-1 text-[10px]">só a borda acende — sem transform</p>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
            Nenhum card sobe, inclina ou escala. As dez{" "}
            <code className="font-mono text-[var(--d-cyan)]">transition</code> da folha são de{" "}
            <strong className="text-[var(--d-fg)]">cor e borda</strong>, nada de layout. Movimento
            que desloca conteúdo custa leitura — e este realm existe para ser lido.
          </p>
        </Surface>
      </div>

      <Surface className="mt-3">
        <p className="mb-2 font-mono text-[10px] text-[var(--d-green)]">
          {"// "}prefers-reduced-motion — tratado, e verificável
        </p>
        <p className="text-[11px] leading-snug text-[var(--d-comment)]">
          As duas folhas declaram{" "}
          <code className="font-mono text-[var(--d-cyan)]">@media (prefers-reduced-motion: reduce)</code>{" "}
          em três blocos, com{" "}
          <code className="font-mono text-[var(--d-orange)]">animation: none !important</code>. Ligue
          a preferência no sistema e recarregue: o caret para de piscar, a varredura do CRT some, o
          rótulo do morph aparece estático em{" "}
          <code className="font-mono text-[var(--d-cyan)]">opacity: 1</code> — nenhum conteúdo some
          junto, que é o erro comum de quem desliga animação sem pensar no estado final. Compare com
          o Anfitrião, onde a preferência não muda nada porque não há o que desligar: dois realms,
          duas maneiras honestas de chegar ao mesmo lugar.
        </p>
      </Surface>
    </SubChapter>
  )
}
