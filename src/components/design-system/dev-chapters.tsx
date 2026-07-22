/* ------------------------------------------------------------------
   O corpo do style guide do perfil "O _Dev".
   ------------------------------------------------------------------
   Não é a lista do Criativo repintada de roxo. O Criativo é uma revista:
   fala em capa, painel, onomatopeia. O _Dev é um editor de código: fala
   em sintaxe, prompt, diff, exit code, devlog. Os capítulos abaixo são o
   vocabulário QUE ESTE UNIVERSO TEM — por isso não há "template de
   pricing" aqui, e há um capítulo sobre realce de sintaxe.

   Tudo usa as classes e tokens reais de `dracula.css`, dentro do escopo
   `.dracula`. Se uma delas quebrar, quebra aqui — que é o ponto.
   ------------------------------------------------------------------ */

/**
 * Superfície do realm — um painel Dracula.
 *
 * Não leva mais a classe `dracula` (que reescrevia vars + bg + min-height:100vh
 * a cada painel): o guia inteiro já vive dentro de um único escopo `.dracula`,
 * então aqui basta referenciar as vars. Borda 1px --d-current, sem tinta preta
 * de comic — a separação do _Dev é a borda, não a sombra.
 */
export function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[10px] border border-[var(--d-current)] bg-[var(--d-bg-2)] p-4 ${className}`}
    >
      {children}
    </div>
  )
}

export function Chapter({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-14 scroll-mt-24 border-t border-[var(--d-current)] pt-9"
    >
      <p className="mb-3 flex items-baseline gap-2 font-mono text-sm font-bold text-[var(--d-orange)]">
        <span className="text-[var(--d-purple)]">▍</span>
        <span className="text-[var(--d-comment)]">{n}</span>
        {title}
      </p>
      {lead && (
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-[var(--d-comment)]">{lead}</p>
      )}
      {children}
    </section>
  )
}

/**
 * Um capítulo pendurado noutro — o segundo nível do índice.
 *
 * O número vem de `architecture.ts` com o prefixo da mãe (09 → 09.7); este
 * arquivo não inventa mais numeração própria. Antes ele rodava uma sequência
 * 01–08 em paralelo à canônica, colidindo com as galerias de dev-library
 * (dois "05", dois "06", dois "07", dois "08").
 *
 * A marca visual é `└─`, a notação de árvore do próprio terminal: no _Dev a
 * hierarquia se desenha como `tree` desenha, assim como no Anfitrião ela se
 * desenha com filete. Cada realm indica profundidade na própria língua.
 */
export function SubChapter({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-8 scroll-mt-24 border-l-2 border-[var(--d-current)] pl-4"
    >
      <p className="mb-2 flex items-baseline gap-2 font-mono text-xs font-bold text-[var(--d-cyan)]">
        <span className="text-[var(--d-comment)]">└─</span>
        <span className="text-[var(--d-comment)]">{n}</span>
        {title}
      </p>
      {lead && (
        <p className="mb-4 max-w-3xl text-[13px] leading-relaxed text-[var(--d-comment)]">{lead}</p>
      )}
      {children}
    </section>
  )
}

/* ---------------- 01 · sintaxe ---------------- */

/**
 * A paleta Dracula não é decoração: nasceu como tema de sintaxe. Cada cor
 * tem um papel gramatical no código — é o que a torna sistema, e não gosto.
 */
const SYNTAX_ROLES = [
  { token: "--d-pink", papel: "Palavra-chave", exemplo: "const · return · if", hex: "#ff79c6" },
  { token: "--d-green", papel: "Função / declaração", exemplo: "render() · build()", hex: "#50fa7b" },
  { token: "--d-yellow", papel: "String", exemplo: '"portfolio"', hex: "#f1fa8c" },
  { token: "--d-purple", papel: "Número / constante", exemplo: "42 · true · null", hex: "#bd93f9" },
  { token: "--d-cyan", papel: "Tipo / parâmetro", exemplo: "string · props", hex: "#8be9fd" },
  { token: "--d-orange", papel: "Atenção / atributo", exemplo: "href · warning", hex: "#ffb86c" },
  { token: "--d-red", papel: "Erro / remoção", exemplo: "throw · −linha", hex: "#ff5555" },
  { token: "--d-comment", papel: "Comentário / ruído", exemplo: "// nota", hex: "#6272a4" },
]

/* ---------------- 11 · contraste (medido) ---------------- */

/**
 * Números calculados sobre --d-bg (#282a36) pela fórmula do WCAG 2.
 * O do comentário é o achado que importa: 3.03:1 reprova em texto normal.
 */
const CONTRASTE = [
  { nome: "--d-fg", hex: "#f8f8f2", ratio: 13.36, veredito: "AA" },
  { nome: "--d-yellow", hex: "#f1fa8c", ratio: 12.74, veredito: "AA" },
  { nome: "--d-green", hex: "#50fa7b", ratio: 10.38, veredito: "AA" },
  { nome: "--d-cyan", hex: "#8be9fd", ratio: 10.29, veredito: "AA" },
  { nome: "--d-orange", hex: "#ffb86c", ratio: 8.36, veredito: "AA" },
  { nome: "--d-pink", hex: "#ff79c6", ratio: 5.97, veredito: "AA" },
  { nome: "--d-purple", hex: "#bd93f9", ratio: 5.9, veredito: "AA" },
  { nome: "--d-red", hex: "#ff5555", ratio: 4.53, veredito: "AA (no limite)" },
  { nome: "--d-comment", hex: "#6272a4", ratio: 3.03, veredito: "REPROVA em texto normal" },
]

const STATUS = ["idea", "mvp", "building", "done", "paused"] as const

/** 05.1 · A cor como gramática — matéria de Colors. */
export function DevSintaxe() {
  return (
      <SubChapter
        id="sintaxe"
        n="05.1"
        title="A paleta é um tema de sintaxe"
        lead={
          <>
            Aqui a cor não decora: ela classifica. A Dracula nasceu como tema de editor, e cada tinta
            carrega um papel gramatical — rosa é palavra-chave, verde é função, amarelo é string. É o
            que separa sistema de gosto pessoal: a cor de um elemento se deduz do que ele{" "}
            <em>é</em>, não do que ficaria bonito.
          </>
        }
      >
        <Surface>
          <div className="grid gap-2 sm:grid-cols-2">
            {SYNTAX_ROLES.map((r) => (
              <div
                key={r.token}
                className="flex items-center gap-3 rounded border border-[var(--d-current)] bg-[var(--d-bg-2)] px-3 py-2"
              >
                <span className="size-4 shrink-0 rounded-sm" style={{ background: r.hex }} />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px]" style={{ color: r.hex }}>
                    {r.exemplo}
                  </span>
                  <span className="block text-[10px] text-[var(--d-comment)]">{r.papel}</span>
                </span>
                <code className="shrink-0 font-mono text-[10px] text-[var(--d-comment)]">
                  {r.token}
                </code>
              </div>
            ))}
          </div>
        </Surface>
      </SubChapter>
  )
}

/** 09.7 · Terminal — matéria de Components. */
export function DevTerminal() {
  return (
      <SubChapter
        id="terminal"
        n="09.7"
        title="Terminal"
        lead="O prompt é a assinatura do realm. Caret piscando em passos (nunca fade — cursor não desvanece), saída monoespaçada e exit code visível: 0 é verde, qualquer outra coisa é vermelha."
      >
        <Surface>
          <div className="font-mono text-xs leading-relaxed">
            <p>
              <span className="text-[var(--d-green)]">➜</span>{" "}
              <span className="text-[var(--d-cyan)]">~/portfolio</span>{" "}
              <span className="text-[var(--d-fg)]">npm run build</span>
            </p>
            <p className="text-[var(--d-comment)]">Next.js 15.5.19</p>
            <p className="text-[var(--d-fg)]">
              <span className="text-[var(--d-green)]">✓</span> Compiled successfully in 21.9s
            </p>
            <p className="mt-2">
              <span className="text-[var(--d-green)]">➜</span>{" "}
              <span className="text-[var(--d-cyan)]">~/portfolio</span>{" "}
              <span className="dv-caret" />
            </p>
          </div>
        </Surface>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Surface>
            <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">exit 0</p>
            <p className="font-mono text-xs text-[var(--d-green)]">✓ tudo passou</p>
          </Surface>
          <Surface>
            <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">exit 1</p>
            <p className="font-mono text-xs text-[var(--d-red)]">✗ 2 testes falharam</p>
          </Surface>
        </div>
      </SubChapter>
  )
}

/** 09.8 · Código & diff — matéria de Components. */
export function DevCodigo() {
  return (
      <SubChapter
        id="codigo"
        n="09.8"
        title="Código & diff"
        lead="O bloco de código é conteúdo de primeira classe neste universo, não um adorno. O diff usa verde e vermelho da própria paleta — as mesmas tintas de sucesso e erro, porque adicionar e remover são exatamente isso."
      >
        <Surface>
          <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">
            <code>
              <span className="text-[var(--d-comment)]">{"// realm-variants.ts"}</span>
              {"\n"}
              <span className="text-[var(--d-pink)]">export const</span>{" "}
              <span className="text-[var(--d-fg)]">REALM_VARIANTS</span>
              <span className="text-[var(--d-fg)]">: </span>
              <span className="text-[var(--d-cyan)]">Record</span>
              <span className="text-[var(--d-fg)]">{"<RealmId, RealmVariant[]> = {"}</span>
              {"\n  "}
              <span className="text-[var(--d-green)]">creative</span>
              <span className="text-[var(--d-fg)]">: CREATIVE_VARIANTS,</span>
              {"\n  "}
              <span className="text-[var(--d-green)]">developer</span>
              <span className="text-[var(--d-fg)]">: DEVELOPER_VARIANTS,</span>
              {"\n"}
              <span className="text-[var(--d-fg)]">{"}"}</span>
            </code>
          </pre>
        </Surface>

        <div className="mt-3">
          <Surface>
            <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed">
              <code>
                <span className="text-[var(--d-comment)]">@@ dimension-cards.tsx @@</span>
                {"\n"}
                <span className="block bg-[rgba(255,85,85,0.12)] text-[var(--d-red)]">
                  {"- FEATURED.map(id => DIMENSIONS.find(d => d.id === id)!)"}
                </span>
                <span className="block bg-[rgba(80,250,123,0.12)] text-[var(--d-green)]">
                  {"+ FEATURED.flatMap(id => DIMENSIONS.filter(d => d.id === id))"}
                </span>
              </code>
            </pre>
          </Surface>
        </div>
      </SubChapter>
  )
}

/** 09.9 · Estados de projeto — matéria de Components. */
export function DevEstadosProjeto() {
  return (
      <SubChapter
        id="estados-projeto"
        n="09.9"
        title="Estados de projeto"
        lead="Um portfólio de dev mente quando mostra tudo como pronto. Os cinco estados existem para dizer a verdade sobre cada projeto — e cada um tem tinta própria, herdada do papel que a cor já cumpre na sintaxe."
      >
        <Surface>
          <div className="flex flex-wrap gap-2">
            {STATUS.map((s) => (
              <span key={s} className={`dv-status ${s} font-mono text-[10px]`}>
                {s}
              </span>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">
            .dv-status.idea · .mvp · .building · .done · .paused
          </p>
        </Surface>
      </SubChapter>
  )
}

/* id="cartoes" (não "components"): o grupo Components é o cluster de 6
   galerias em dev-library.tsx; este é um capítulo nativo do _Dev, e agora
   entra formalmente como matéria 09.10 daquele grupo. */
/** 09.10 · Cartões, tags e números — matéria de Components. */
export function DevCartoes() {
  return (
      <SubChapter
        id="cartoes"
        n="09.10"
        title="Cartões, tags e números"
        lead="O card do _Dev não salta nem inclina: a borda acende e pronto. Nada aqui distrai de ler."
      >
        <Surface>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="dv-card">
              <p className="dv-title text-sm">portfolio-2026</p>
              <p className="dv-sub mt-1 text-xs">Next.js · TypeScript · Supabase</p>
              <div className="dv-chip-row mt-3">
                <span className="dv-tag">next</span>
                <span className="dv-tag">ts</span>
                <span className="dv-tag">rsc</span>
              </div>
            </div>
            <div className="dv-card">
              <div className="dv-stats">
                <div className="dv-stat">
                  <span className="dv-count">31</span>
                  <span className="dv-sub text-[10px]">testes</span>
                </div>
                <div className="dv-stat">
                  <span className="dv-count">7</span>
                  <span className="dv-sub text-[10px]">projetos</span>
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </SubChapter>
  )
}

/** 10.6 · Devlog — matéria de Patterns: a timeline é um git log que virou UI. */
export function DevDevlog() {
  return (
      <SubChapter
        id="devlog"
        n="10.6"
        title="Devlog"
        lead="A linha do tempo é o formato nativo de quem versiona: data à esquerda, o que mudou à direita. É um git log que virou UI."
      >
        <Surface>
          <div className="dv-timeline">
            {[
              ["2026-07-17", "Guia do _Dev: sintaxe, terminal, diff e contraste medido"],
              ["2026-07-16", "Design System separado em três perfis"],
              ["2026-07-15", "Portal de entrada dos 3 multiversos"],
            ].map(([data, texto]) => (
              <div key={data} className="dv-tl-item">
                <span className="dv-tl-date font-mono text-[10px]">{data}</span>
                <p className="text-xs text-[var(--d-fg)]">{texto}</p>
              </div>
            ))}
          </div>
        </Surface>
      </SubChapter>
  )
}

/* O capítulo id="busca" vivia aqui e foi REMOVIDO: era duplicata de
   `pattern-busca` (dev-patterns.tsx) — mesmo .dv-search, mesmos quatro
   filtros todos/web/cli/lab, e a mesma frase "sem drawer, sem modal" no
   lead. Nasceu do commit de paridade com o Criativo, que criou o pattern
   sem notar que o capítulo nativo já existia. Ficou o pattern, que é
   superset (mostra também a contagem .dv-count). Ao reconciliar a
   numeração os dois passariam a aparecer lado a lado em 10.x, e a
   duplicação ficaria escancarada. */

/** 09.11 · Vazio — matéria de Components. */
export function DevVazio() {
  return (
      <SubChapter
        id="vazio"
        n="09.11"
        title="Vazio"
        lead="Sem onomatopeia, sem ilustração: uma linha de comentário explicando o que fazer. O vazio do _Dev fala como o código fala."
      >
        <Surface>
          <div className="dv-empty">
            <p className="font-mono text-xs text-[var(--d-comment)]">
              {"// nenhum projeto com esse filtro"}
            </p>
            <p className="mt-1 font-mono text-xs text-[var(--d-fg)]">
              <span className="text-[var(--d-green)]">➜</span> tente{" "}
              <span className="text-[var(--d-cyan)]">todos</span>
            </p>
          </div>
        </Surface>
      </SubChapter>
  )
}

/**
 * 12 · Accessibility — capítulo de topo. Exportado à parte para o corpo do
 * _Dev poder posicioná-lo na ordem do índice (entre Templates e Content
 * Design) em vez de ficar preso no fim do cluster de componentes. Hoje todos
 * os capítulos deste arquivo são exportados assim; este foi só o primeiro.
 */
export function DevAccessibility() {
  return (
      <Chapter
        id="accessibility"
        n="12"
        title="Contraste da paleta"
        lead={
          <>
            Medido, não estimado: razões calculadas pela fórmula do WCAG 2 sobre{" "}
            <code className="text-[var(--sv-cyan)]">--d-bg</code> (#282a36). O resultado tem uma
            consequência prática que o tema não anuncia — <strong>--d-comment reprova em texto
            normal</strong> (3.03:1, abaixo dos 4.5:1 exigidos). Serve para comentário e ruído de
            fundo; não use para conteúdo que precisa ser lido.
          </>
        }
      >
        <Surface>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-[var(--d-comment)]">
                  <th className="py-1 pr-3 font-normal">token</th>
                  <th className="py-1 pr-3 font-normal">hex</th>
                  <th className="py-1 pr-3 font-normal">vs --d-bg</th>
                  <th className="py-1 font-normal">WCAG AA</th>
                </tr>
              </thead>
              <tbody>
                {CONTRASTE.map((c) => {
                  const reprova = c.ratio < 4.5
                  return (
                    <tr key={c.nome} className="border-t border-[var(--d-current)]">
                      <td className="py-1.5 pr-3" style={{ color: c.hex }}>
                        {c.nome}
                      </td>
                      <td className="py-1.5 pr-3 text-[var(--d-comment)]">{c.hex}</td>
                      <td className="py-1.5 pr-3 text-[var(--d-fg)]">{c.ratio.toFixed(2)}:1</td>
                      <td
                        className="py-1.5"
                        style={{ color: reprova ? "#ff5555" : "#50fa7b" }}
                      >
                        {c.veredito}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Surface>
      </Chapter>
  )
}
