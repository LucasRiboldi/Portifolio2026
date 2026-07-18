/* ------------------------------------------------------------------
   09.7 · As dimensões — o sistema de temas do Criativo.
   ------------------------------------------------------------------
   A medição que faltava: o Criativo define 198 classes entre spiderverse,
   sv-artdirection, sv-effects, sv-punk, sv-surfaces, comic-cover, retro-os e
   spiderverse-dimensions. O guia mostrava 70 — 35%, o pior dos três realms,
   e sobre o CSS mais rico dos três.

   Dentro desse buraco estava a peça mais central do conceito: 616 linhas
   descrevendo dezenove linguagens visuais completas, cada uma amarrada a uma
   referência canônica do filme, e nenhuma delas documentada. A rota
   /dimensoes exibe os portais como vitrine; o que não existia era o
   contrato — o que uma dimensão pode sobrescrever, e como se escreve a
   vigésima sem ler as dezenove.
   ------------------------------------------------------------------ */
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { DIMENSIONS, dimClass } from "@/design-system/dimensions"

/** Rótulo de bloco no tom do guia comic. */
function Cap({ children }: { children: React.ReactNode }) {
  return (
    <p className="sv-heavy mb-2 text-[11px] uppercase tracking-wide text-[var(--sv-yellow)]">
      {children}
    </p>
  )
}

function Painel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)] ${className}`}
    >
      {children}
    </div>
  )
}

/** O contrato: o que a dimensão declara e o canvas consome. */
const CONTRATO = [
  { v: "--c-bg", o: "O fundo base. Cor chapada ou gradiente — é a última camada." },
  { v: "--c-glow1", o: "Primeira luz, empilhada sobre o fundo. Geralmente radial." },
  { v: "--c-glow2", o: "Segunda luz, no canto oposto. Cria a diagonal do ambiente." },
  { v: "--c-glow3", o: "Terceira luz, opcional. `none` quando a dimensão é seca." },
  { v: "--c-ink", o: "A tinta do texto sobre esse fundo. 16 das 19 redefinem." },
  { v: "--c-dot", o: "A cor da retícula de meio-tom que cobre o canvas." },
  { v: "--c-dot-opacity", o: "Quanto a retícula aparece. É o botão de volume da textura." },
  { v: "--c-dot-blend", o: "Como a retícula se mistura. Só 8 das 19 precisam mexer." },
  { v: "--c-speedlines", o: "As linhas de velocidade do fundo, quando a dimensão as tem." },
]

export function CreativeDimensions() {
  return (
    <section
      id="dimensoes"
      aria-label="09.7 · As dimensões"
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">09.7</span>
        As dimensões
      </p>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
        Dezenove linguagens visuais completas — mais o Multiverso, que é o hub e não tem classe
        própria, somando as vinte entradas do catálogo. Cada uma cita uma referência canônica do
        filme, e nenhuma é apenas tema de cor: a dimensão troca o fundo, a tinta, a retícula, as
        linhas de velocidade e a maneira como o painel reage ao ponteiro — o Noir inverte a sombra
        para branco, o Punk entorta os painéis alternadamente, o Portal é a única que gira. É o
        sistema mais elaborado deste design system e estava inteiramente fora do guia.
      </p>

      {/* ---- o contrato ---- */}
      <Cap>o contrato — as nove variáveis que uma dimensão declara</Cap>
      <Painel>
        <p className="mb-3 text-xs leading-relaxed text-white/70">
          Uma dimensão não estiliza componentes um a um: ela declara variáveis no wrapper, e o{" "}
          <code className="text-[var(--sv-cyan)]">.sv-canvas</code> as consome. É isso que permite
          escrever um componente uma vez e vê-lo atravessar as dezenove sem um{" "}
          <code className="text-[var(--sv-cyan)]">if</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] text-left text-xs">
            <tbody>
              {CONTRATO.map((c) => (
                <tr key={c.v} className="border-b border-white/10 last:border-0">
                  <td className="whitespace-nowrap py-1.5 pr-4 font-mono text-[11px] text-[var(--sv-cyan)]">
                    {c.v}
                  </td>
                  <td className="py-1.5 text-white/60">{c.o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[10px] text-white/40">
          {"background: var(--c-glow1), var(--c-glow2), var(--c-glow3), var(--c-bg)"}
        </p>
      </Painel>

      {/* ---- as dezenove, ao vivo ---- */}
      <div className="mt-8">
        <Cap>as vinte — cada uma renderizando de verdade</Cap>
        {/* Lista vinda de `src/design-system/dimensions.ts`, que já é a fonte
            única do switcher e dos cards. Repetir os nomes aqui criaria a
            segunda fonte que este design system passa o tempo a eliminar. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((d) => (
            <div key={d.id} className="overflow-hidden rounded-lg border-[3px] border-black">
              {/* O canvas real da dimensão, em miniatura. Não é captura: se a
                  dimensão quebrar, quebra aqui. */}
              <SvCanvas dimension={d.id} className="!min-h-0 !p-4">
                <p className="sv-display text-lg uppercase leading-none">{d.label}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide opacity-70">
                  Terra-{d.earth}
                </p>
                <div className="sv-panel mt-3 !p-2">
                  <p className="text-[10px] leading-snug">{d.desc}</p>
                </div>
              </SvCanvas>
              <p className="bg-[var(--sv-ink-2)] px-3 py-1.5 font-mono text-[10px] text-[var(--sv-cyan)]">
                {dimClass[d.id] || "(sem classe — é o hub)"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- como se compõe ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Painel>
          <Cap>como se usa</Cap>
          <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
            <code>
              {`<SvCanvas dimension="noir">
  <h2 className="sv-display">Manchete</h2>
  <div className="sv-panel">…</div>
</SvCanvas>`}
            </code>
          </pre>
          <p className="mt-3 text-xs leading-snug text-white/60">
            O wrapper é a única coisa que muda. Os componentes lá dentro —{" "}
            <code className="text-[var(--sv-cyan)]">.sv-panel</code>,{" "}
            <code className="text-[var(--sv-cyan)]">.sv-display</code>,{" "}
            <code className="text-[var(--sv-cyan)]">.sv-glitch</code>,{" "}
            <code className="text-[var(--sv-cyan)]">.sv-sticker</code> — não sabem em que dimensão
            estão, e é justamente isso que faz o sistema escalar.
          </p>
        </Painel>

        <Painel>
          <Cap>como se escreve a vigésima</Cap>
          <ol className="space-y-2 text-xs leading-snug text-white/60">
            <li>
              <span className="sv-heavy text-[var(--sv-yellow)]">01</span> — Declare as nove
              variáveis no seletor <code className="text-[var(--sv-cyan)]">.sv-dim-nome</code>.
              Só isso já entrega uma dimensão funcional.
            </li>
            <li>
              <span className="sv-heavy text-[var(--sv-yellow)]">02</span> — Re-vista{" "}
              <code className="text-[var(--sv-cyan)]">.sv-panel</code> se o material exigir. É o que
              todas as 19 fazem, porque o painel é a superfície que mais fala.
            </li>
            <li>
              <span className="sv-heavy text-[var(--sv-yellow)]">03</span> — Ajuste{" "}
              <code className="text-[var(--sv-cyan)]">.sv-display</code> quando a tinta do título
              precisar destoar do corpo (13 das 19 ajustam).
            </li>
            <li>
              <span className="sv-heavy text-[var(--sv-yellow)]">04</span> — Só então mexa em{" "}
              <code className="text-[var(--sv-cyan)]">.sv-glitch</code>,{" "}
              <code className="text-[var(--sv-cyan)]">.sv-sticker</code> ou{" "}
              <code className="text-[var(--sv-cyan)]">.sv-rainbow</code> — são exceções, não rotina.
            </li>
          </ol>
          <p className="mt-3 text-xs leading-snug text-white/50">
            Registre em{" "}
            <code className="text-[var(--sv-cyan)]">src/design-system/realm-variants.ts</code> para
            a dimensão aparecer no seletor do kit.
          </p>
        </Painel>
      </div>

      {/* ---- quando não usar ---- */}
      <div className="mt-4">
        <Painel>
          <Cap>quando NÃO trocar de dimensão</Cap>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "Por variedade",
                "Dimensão não é enfeite de seção. Ela diz onde o leitor está — trocar sem motivo é ruído com cara de riqueza.",
              ],
              [
                "Em fluxo de leitura",
                "Trocar no meio de um artigo destrói a continuidade. Portal se atravessa entre páginas, não entre parágrafos.",
              ],
              [
                "Horror e Glitch em rotina",
                "As duas são deliberadamente agressivas. Servem a 404 e a estados de anomalia; em página comum, cansam em três segundos.",
              ],
            ].map(([t, o]) => (
              <div key={t}>
                <p className="sv-heavy text-xs uppercase text-[var(--sv-magenta)]">✕ {t}</p>
                <p className="mt-1 text-[11px] leading-snug text-white/55">{o}</p>
              </div>
            ))}
          </div>
        </Painel>
      </div>

      {/* ---- acessibilidade ---- */}
      <div className="mt-4">
        <Painel>
          <Cap>acessibilidade — o preço de dezenove paletas</Cap>
          <p className="text-xs leading-relaxed text-white/60">
            Dezenove fundos significam dezenove contextos de contraste, e a mesma tinta não passa em
            todos. <code className="text-[var(--sv-cyan)]">--c-ink</code> existe exatamente por
            isso: é a tinta que a dimensão declara <em>sabendo</em> sobre qual fundo vai cair. Ao
            escrever a vigésima, meça o par{" "}
            <code className="text-[var(--sv-cyan)]">--c-ink</code> ×{" "}
            <code className="text-[var(--sv-cyan)]">--c-bg</code> com{" "}
            <code className="text-[var(--sv-cyan)]">src/design-system/color-utils.ts</code> antes de
            aprovar no olho — o Noir e o Society são quase brancos, o Prowler e o Horror são quase
            pretos, e o mesmo cinza que serve a um reprova no outro.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            A retícula (<code className="text-[var(--sv-cyan)]">--c-dot</code>) some com{" "}
            <code className="text-[var(--sv-cyan)]">--c-dot-opacity: 0</code>, e várias dimensões
            têm movimento no hover do painel. Ambos respondem a{" "}
            <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code> pelo bloco global
            de <code className="text-[var(--sv-cyan)]">animations.css</code> — mas o transform de
            hover não: quem precisa de movimento reduzido ainda recebe o deslocamento do painel.{" "}
            <span className="text-[var(--sv-yellow)]">Lacuna conhecida</span>, registrada aqui em vez
            de escondida.
          </p>
        </Painel>
      </div>

      <p className="mt-4 font-mono text-[10px] text-white/40">
        .sv-dim-* (19) · --c-bg · --c-glow1..3 · --c-ink · --c-dot · --c-dot-opacity ·
        --c-dot-blend · --c-speedlines
      </p>
    </section>
  )
}
