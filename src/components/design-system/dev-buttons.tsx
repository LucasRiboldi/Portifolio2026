/* ------------------------------------------------------------------
   09.1 · Botões — o gabarito completo de um componente.
   ------------------------------------------------------------------
   Este é o modelo de profundidade que os outros componentes deste realm
   ainda não têm. Antes o capítulo mostrava cinco botões numa fila e uma
   linha de classes: dava para ver que existiam, não para usá-los sem
   adivinhar. Faltava o que um design system precisa entregar — anatomia,
   estados, tamanhos, quando NÃO usar, acessibilidade e o código real.

   A ordem abaixo é a do gabarito: papel → anatomia → estados → tamanhos →
   ícone → quando não usar → acessibilidade → código.
   ------------------------------------------------------------------ */
import { SubChapter, Surface } from "./dev-chapters"

type Tone = "primary" | "secondary" | "ghost" | "danger"

const BASE =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors"

const TONES: Record<Tone, string> = {
  primary: "bg-[var(--d-purple)] text-[var(--d-bg)] hover:brightness-110",
  secondary: "border border-[var(--d-current)] text-[var(--d-fg)] hover:border-[var(--d-comment)]",
  ghost: "text-[var(--d-pink)] hover:underline",
  danger: "border border-[var(--d-red)] text-[var(--d-red)] hover:bg-[var(--d-red)]/10",
}

function Btn({
  children,
  tone = "primary",
  className = "",
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <button type="button" className={`${BASE} ${TONES[tone]} ${className}`}>
      {children}
    </button>
  )
}

/** Rótulo de coluna nas grades de demonstração. */
function Cap({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
      {"// "}
      {children}
    </p>
  )
}

const PAPEIS: { tone: Tone; nome: string; quando: string; quantos: string }[] = [
  {
    tone: "primary",
    nome: "primary",
    quando: "A ação que a tela existe para realizar — deploy, salvar, confirmar.",
    quantos: "Uma por tela. Duas primárias competindo é o mesmo que nenhuma.",
  },
  {
    tone: "secondary",
    nome: "secondary",
    quando: "Ação de apoio legítima, que o usuário faz com frequência mas não é o objetivo.",
    quantos: "Quantas fizerem sentido, lado a lado.",
  },
  {
    tone: "ghost",
    nome: "ghost",
    quando: "Navegação disfarçada de botão: ver docs, abrir repositório, cancelar.",
    quantos: "Se leva para outro lugar, considere um link de verdade.",
  },
  {
    tone: "danger",
    nome: "danger",
    quando: "Destrutivo e irreversível — apagar, revogar, forçar push.",
    quantos: "Nunca como primária. O vermelho pede confirmação, não convida.",
  },
]

export function DevButtons() {
  return (
    <SubChapter
      id="botoes"
      n="09.1"
      title="Componentes · Botões"
      lead="Quatro papéis, quatro tintas: roxo é a ação primária, borda é a de apoio, rosa é o link, vermelho é destrutivo. A cor não decora — ela diz o que acontece ao clicar, coerente com a gramática da sintaxe (05.1), onde verde é sucesso e vermelho é erro."
    >
      {/* ---------- papel ---------- */}
      <Cap>papel — qual tinta, e quantas por tela</Cap>
      <div className="grid gap-2 sm:grid-cols-2">
        {PAPEIS.map((p) => (
          <Surface key={p.nome}>
            <div className="flex items-center justify-between gap-3">
              <Btn tone={p.tone}>{p.nome === "danger" ? "rm -rf" : p.nome}</Btn>
              <code className="font-mono text-[10px] text-[var(--d-comment)]">.{p.nome}</code>
            </div>
            <p className="mt-2.5 text-xs leading-snug text-[var(--d-fg)]">{p.quando}</p>
            <p className="mt-1 text-[11px] leading-snug text-[var(--d-comment)]">{p.quantos}</p>
          </Surface>
        ))}
      </div>

      {/* ---------- anatomia ---------- */}
      <Cap>anatomia — o que compõe a peça</Cap>
      <Surface>
        <div className="flex flex-wrap items-center gap-6">
          <Btn tone="primary" className="!px-3 !py-1.5">
            ➜ deploy
          </Btn>
          <div className="min-w-0 flex-1 space-y-1.5 font-mono text-[11px] text-[var(--d-comment)]">
            <p>
              <span className="text-[var(--d-purple)]">padding</span> 0.375rem 0.75rem — vertical
              menor que horizontal: o alvo cresce na direção da leitura
            </p>
            <p>
              <span className="text-[var(--d-purple)]">radius</span> 8px (
              <code>--d-radius</code>) — card e input usam o mesmo; nunca pill
            </p>
            <p>
              <span className="text-[var(--d-purple)]">gap</span> 0.375rem entre glifo e rótulo
            </p>
            <p>
              <span className="text-[var(--d-purple)]">fonte</span> mono, 0.75rem — o rótulo é
              comando, então lê-se como comando
            </p>
            <p>
              <span className="text-[var(--d-purple)]">borda</span> 1px só nos tons que não têm
              preenchimento
            </p>
          </div>
        </div>
      </Surface>

      {/* ---------- estados ---------- */}
      <Cap>estados — os seis, em cada tom</Cap>
      <Surface>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left">
            <thead>
              <tr className="font-mono text-[10px] text-[var(--d-comment)]">
                <th className="pb-2 pr-3 font-normal">tom</th>
                <th className="pb-2 pr-3 font-normal">default</th>
                <th className="pb-2 pr-3 font-normal">hover</th>
                <th className="pb-2 pr-3 font-normal">focus</th>
                <th className="pb-2 pr-3 font-normal">loading</th>
                <th className="pb-2 font-normal">disabled</th>
              </tr>
            </thead>
            <tbody>
              {(["primary", "secondary", "danger"] as Tone[]).map((t) => (
                <tr key={t} className="border-t border-[var(--d-current)]">
                  <td className="py-2.5 pr-3 font-mono text-[10px] text-[var(--d-comment)]">{t}</td>
                  <td className="py-2.5 pr-3">
                    <Btn tone={t}>ok</Btn>
                  </td>
                  <td className="py-2.5 pr-3">
                    {/* estado forçado, para ser visível sem o ponteiro */}
                    <Btn
                      tone={t}
                      className={
                        t === "primary"
                          ? "!brightness-110"
                          : t === "secondary"
                            ? "!border-[var(--d-comment)]"
                            : "!bg-[var(--d-red)]/10"
                      }
                    >
                      ok
                    </Btn>
                  </td>
                  <td className="py-2.5 pr-3">
                    <Btn tone={t} className="outline outline-2 outline-offset-2 outline-[var(--d-cyan)]">
                      ok
                    </Btn>
                  </td>
                  <td className="py-2.5 pr-3">
                    <Btn tone={t} className="!opacity-80">
                      <span className="dv-caret !bg-current" /> …
                    </Btn>
                  </td>
                  <td className="py-2.5">
                    <button
                      type="button"
                      disabled
                      className={`${BASE} cursor-not-allowed border border-[var(--d-current)] text-[var(--d-comment)] opacity-60`}
                    >
                      ok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
          <span className="text-[var(--d-orange)]">Nota sobre o foco:</span> o anel é{" "}
          <code className="font-mono">--d-cyan</code> com{" "}
          <code className="font-mono">outline-offset: 2px</code> — ciano porque é a única tinta da
          paleta que não carrega significado de estado (verde=ok, vermelho=erro, roxo=ação), então
          pode significar &quot;onde você está&quot; sem ambiguidade. Use{" "}
          <code className="font-mono">:focus-visible</code>, nunca{" "}
          <code className="font-mono">:focus</code>: o segundo acende também no clique de mouse e
          treina o usuário a ignorar o anel.
        </p>
      </Surface>

      {/* ---------- tamanhos e ícone ---------- */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Surface>
          <Cap>tamanhos</Cap>
          <div className="flex flex-wrap items-center gap-2">
            <Btn tone="secondary" className="!px-2 !py-1 !text-[10px]">
              sm
            </Btn>
            <Btn tone="secondary">md</Btn>
            <Btn tone="secondary" className="!px-4 !py-2 !text-sm">
              lg
            </Btn>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
            <strong className="text-[var(--d-fg)]">md é o padrão</strong> e resolve quase tudo. `sm`
            só dentro de tabela ou barra densa; `lg` só quando o botão é a única ação da tela. Três
            tamanhos na mesma tela é sinal de hierarquia mal resolvida.
          </p>
        </Surface>

        <Surface>
          <Cap>com glifo, e só glifo</Cap>
          <div className="flex flex-wrap items-center gap-2">
            <Btn tone="primary">➜ deploy</Btn>
            <Btn tone="secondary">✓ aprovar</Btn>
            <button
              type="button"
              aria-label="Copiar comando"
              title="Copiar comando"
              className={`${BASE} ${TONES.secondary} !px-2`}
            >
              ⧉
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
            O glifo vem <strong className="text-[var(--d-fg)]">antes</strong> do rótulo e reforça o
            que ele já diz — nunca o substitui. Botão só de glifo{" "}
            <strong className="text-[var(--d-fg)]">exige</strong>{" "}
            <code className="font-mono">aria-label</code> e{" "}
            <code className="font-mono">title</code>: sem eles a peça é muda para leitor de tela e
            adivinhação para todo mundo.
          </p>
        </Surface>
      </div>

      {/* ---------- quando não usar ---------- */}
      <Cap>quando NÃO usar</Cap>
      <Surface>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [
              "Para navegar",
              "Se leva a outra rota, é <a>. Botão que navega quebra abrir-em-nova-aba, o meio-clique e o histórico.",
            ],
            [
              "Duas primárias",
              "Se a tela tem duas ações igualmente importantes, o problema é a tela, não o botão.",
            ],
            [
              "Danger como padrão",
              "Ação destrutiva não é a ação principal de nada. Vermelho confirma; nunca convida.",
            ],
          ].map(([t, o]) => (
            <div key={t}>
              <p className="font-mono text-xs text-[var(--d-red)]">✗ {t}</p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--d-comment)]">{o}</p>
            </div>
          ))}
        </div>
      </Surface>

      {/* ---------- acessibilidade ---------- */}
      <Cap>acessibilidade</Cap>
      <Surface>
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            ["type", "Sempre explícito. Dentro de <form>, o padrão é submit e envia sem querer."],
            ["alvo", "Mínimo 24×24px de área clicável (WCAG 2.2 · 2.5.8). O `sm` chega no limite — não encolha mais."],
            ["disabled", "Não recebe foco e não é anunciado. Se o motivo importa, diga em texto ao lado."],
            ["loading", "Troque o rótulo, não só o ícone: leitor de tela não vê spinner. Use aria-busy."],
            ["contraste", "Roxo sobre --d-bg e o texto --d-bg sobre roxo passam AA. Ghost em --d-pink também."],
            ["teclado", "Enter e Espaço já funcionam em <button>. Em <div role=\"button\"> você teria de reimplementar os dois."],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[var(--d-current)] py-1.5">
              <p className="font-mono text-[11px] text-[var(--d-cyan)]">{k}</p>
              <p className="text-[11px] leading-snug text-[var(--d-comment)]">{v}</p>
            </div>
          ))}
        </div>
      </Surface>

      {/* ---------- código ---------- */}
      <Cap>código — o que realmente está no projeto</Cap>
      <div className="dv-snippet">
        <span className="lang">tsx</span>
        <pre className="dv-code">
          <code>
            <span className="text-[var(--d-comment)]">{"// base compartilhada por todos os tons"}</span>
            {"\n"}
            <span className="text-[var(--d-pink)]">const</span>{" "}
            <span className="text-[var(--d-fg)]">BASE</span>
            <span className="text-[var(--d-fg)]"> = </span>
            <span className="text-[var(--d-yellow)]">
              {'"inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-colors"'}
            </span>
            {"\n\n"}
            <span className="text-[var(--d-pink)]">const</span>{" "}
            <span className="text-[var(--d-fg)]">TONES</span>
            <span className="text-[var(--d-fg)]">{" = {"}</span>
            {"\n  "}
            <span className="text-[var(--d-green)]">primary</span>
            <span className="text-[var(--d-fg)]">: </span>
            <span className="text-[var(--d-yellow)]">
              {'"bg-[var(--d-purple)] text-[var(--d-bg)] hover:brightness-110"'}
            </span>
            <span className="text-[var(--d-fg)]">,</span>
            {"\n  "}
            <span className="text-[var(--d-green)]">secondary</span>
            <span className="text-[var(--d-fg)]">: </span>
            <span className="text-[var(--d-yellow)]">
              {'"border border-[var(--d-current)] text-[var(--d-fg)] …"'}
            </span>
            <span className="text-[var(--d-fg)]">,</span>
            {"\n  "}
            <span className="text-[var(--d-green)]">ghost</span>
            <span className="text-[var(--d-fg)]">: </span>
            <span className="text-[var(--d-yellow)]">{'"text-[var(--d-pink)] hover:underline"'}</span>
            <span className="text-[var(--d-fg)]">,</span>
            {"\n  "}
            <span className="text-[var(--d-green)]">danger</span>
            <span className="text-[var(--d-fg)]">: </span>
            <span className="text-[var(--d-yellow)]">
              {'"border border-[var(--d-red)] text-[var(--d-red)] …"'}
            </span>
            <span className="text-[var(--d-fg)]">,</span>
            {"\n"}
            <span className="text-[var(--d-fg)]">{"}"}</span>
            {"\n\n"}
            <span className="text-[var(--d-fg)]">{"<button "}</span>
            <span className="text-[var(--d-green)]">type</span>
            <span className="text-[var(--d-fg)]">=</span>
            <span className="text-[var(--d-yellow)]">{'"button"'}</span>
            <span className="text-[var(--d-fg)]">{" className={`${BASE} ${TONES[tone]}`}>"}</span>
            {"\n  ➜ deploy\n"}
            <span className="text-[var(--d-fg)]">{"</button>"}</span>
          </code>
        </pre>
      </div>

      <p className="mt-2 font-mono text-[10px] text-[var(--d-comment)]">
        .dv-snippet · .dv-code · --d-purple · --d-red · --d-pink · --d-current · --d-radius
      </p>
    </SubChapter>
  )
}
