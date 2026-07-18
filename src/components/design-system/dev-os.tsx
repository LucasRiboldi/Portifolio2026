/* ------------------------------------------------------------------
   18 · Temas e janelas — a seção 18 do _Dev, transposta e aprofundada.
   ------------------------------------------------------------------
   A seção 18 do _Dev dizia "o _Dev não tem Retro OS — tem temas de editor" e
   mostrava três fileiras de amostras de cor. Duas coisas estavam erradas
   nisso:

   1. A afirmação. O _Dev é o realm de IDE, terminal e janela — ele tem a
      reivindicação MAIS forte sobre chrome de sistema operacional, não a
      menor. No Criativo a janela retrô é nostalgia; aqui é o ambiente de
      trabalho.
   2. A amostra. Três faixas de cor não mostram um tema: mostram uma paleta.
      Tema é o que acontece quando o mesmo componente é repintado — e isso só
      se vê renderizando o componente.

   As janelas usam `retro-os.css`, a mesma folha do Criativo (importada
   globalmente). Não há cópia: o que muda é a leitura. Lá elas ilustram uma
   era; aqui, três gerações de decisão sobre a mesma peça de interface.
   ------------------------------------------------------------------ */
import { Chapter, SubChapter, Surface } from "./dev-chapters"

/** Um tema de editor com as cores reais, aplicadas a um painel de verdade. */
const TEMAS = [
  {
    nome: "Dracula",
    canonico: true,
    v: { bg: "#282a36", bg2: "#21222c", fg: "#f8f8f2", cmt: "#6272a4", roxo: "#bd93f9", verde: "#50fa7b", rosa: "#ff79c6", ciano: "#8be9fd", amarelo: "#f1fa8c" },
  },
  {
    nome: "Nord",
    canonico: false,
    v: { bg: "#2e3440", bg2: "#3b4252", fg: "#eceff4", cmt: "#616e88", roxo: "#b48ead", verde: "#a3be8c", rosa: "#bf616a", ciano: "#88c0d0", amarelo: "#ebcb8b" },
  },
  {
    nome: "Gruvbox",
    canonico: false,
    v: { bg: "#282828", bg2: "#32302f", fg: "#ebdbb2", cmt: "#928374", roxo: "#d3869b", verde: "#b8bb26", rosa: "#fb4934", ciano: "#83a598", amarelo: "#fabd2f" },
  },
  {
    nome: "Solarized Dark",
    canonico: false,
    v: { bg: "#002b36", bg2: "#073642", fg: "#eee8d5", cmt: "#586e75", roxo: "#6c71c4", verde: "#859900", rosa: "#d33682", ciano: "#2aa198", amarelo: "#b58900" },
  },
]

/** O mesmo trecho de código, repintado por cada tema. */
function Amostra({ v }: { v: Record<string, string> }) {
  return (
    <div
      className="rounded-md border p-3 font-mono text-[11px] leading-relaxed"
      style={{ background: v.bg, borderColor: v.cmt + "55" }}
    >
      <p style={{ color: v.cmt }}>{"// realm-variants.ts"}</p>
      <p>
        <span style={{ color: v.rosa }}>export const</span>{" "}
        <span style={{ color: v.fg }}>REALMS</span>
        <span style={{ color: v.fg }}> = {"{"}</span>
      </p>
      <p className="pl-3">
        <span style={{ color: v.verde }}>criativo</span>
        <span style={{ color: v.fg }}>: </span>
        <span style={{ color: v.amarelo }}>&quot;comic&quot;</span>
        <span style={{ color: v.fg }}>,</span>
      </p>
      <p className="pl-3">
        <span style={{ color: v.verde }}>dev</span>
        <span style={{ color: v.fg }}>: </span>
        <span style={{ color: v.amarelo }}>&quot;dracula&quot;</span>
        <span style={{ color: v.fg }}>,</span>
      </p>
      <p style={{ color: v.fg }}>{"}"}</p>
      <p className="mt-2">
        <span style={{ color: v.verde }}>➜</span>{" "}
        <span style={{ color: v.ciano }}>~/portfolio</span>{" "}
        <span style={{ color: v.fg }}>npm run build</span>
      </p>
      <p>
        <span style={{ color: v.verde }}>✓</span>{" "}
        <span style={{ color: v.cmt }}>Compiled in 8.4s</span>
      </p>
    </div>
  )
}

const ERAS = [
  {
    cls: "os-95",
    nome: "Windows 95",
    ano: "1995",
    o: "Bisel duro em quatro lados: a luz vem do canto superior esquerdo e a peça finge relevo físico. O botão inverte o bisel ao ser pressionado — a única animação de estado que existia.",
  },
  {
    cls: "os-xp",
    nome: "Windows XP",
    ano: "2001",
    o: "Luna azul: gradiente na barra, cantos arredondados, e a primeira vez que o chrome tentou parecer plástico moldado em vez de metal dobrado.",
  },
  {
    cls: "os-mac",
    nome: "Mac OS clássico",
    ano: "1984–2001",
    o: "Listras na barra de título como pegada para arrastar, borda de 1px e nenhum gradiente. É a mais econômica das três, e a que envelheceu melhor.",
  },
]

export function DevOsThemes() {
  return (
    <Chapter
      id="retro-os"
      n="18"
      title="Temas e janelas"
      lead="Duas famílias de tema no mesmo realm, e é a comparação entre elas que ensina: o tema de editor repinta o CONTEÚDO (a sintaxe), a era de janela repinta o CHROME (a moldura). Um design system que serve a um IDE precisa dos dois, e precisa saber que são eixos independentes — Dracula numa janela do 95 é uma combinação legítima, não um erro."
    >
      {/* ---- temas de editor ---- */}
      <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
        {"// "}temas de editor — o mesmo código, quatro paletas
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {TEMAS.map((t) => (
          <Surface key={t.nome} className={t.canonico ? "ring-1 ring-[var(--d-purple)]" : ""}>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs text-[var(--d-fg)]">{t.nome}</p>
              {t.canonico && (
                <span className="font-mono text-[9px] text-[var(--d-green)]">● canônico</span>
              )}
            </div>
            <Amostra v={t.v} />
            <div className="mt-2 flex gap-1">
              {[t.v.bg, t.v.roxo, t.v.verde, t.v.rosa, t.v.ciano, t.v.amarelo].map((c) => (
                <span key={c} className="h-4 flex-1 rounded-sm" style={{ background: c }} />
              ))}
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="mt-3">
        <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
          {"// "}por que renderizar em vez de listar cores
        </p>
        <p className="text-[11px] leading-relaxed text-[var(--d-comment)]">
          Esta seção mostrava três fileiras de amostras de cor. Amostra de cor prova que a paleta
          existe; não prova que o <strong className="text-[var(--d-fg)]">tema</strong> funciona —
          para isso é preciso ver o mesmo componente repintado, porque o que quebra um tema quase
          nunca é a cor isolada: é o par. O <code className="text-[var(--d-cyan)]">--cmt</code> do
          Gruvbox sobre o próprio fundo, por exemplo, tem contraste mais folgado que o do Dracula,
          onde <code className="text-[var(--d-cyan)]">--d-comment</code> reprova em texto normal
          (3,03:1 — ver seção 12). Duas paletas bonitas, uma decisão diferente.
        </p>
      </Surface>

      {/* ---- janelas ---- */}
      <SubChapter
        id="janelas"
        n="18.1"
        title="A janela de sistema — três eras"
        lead="Transposta do Criativo, onde ilustrava nostalgia. Aqui é outra coisa: três gerações de resposta à mesma pergunta de interface — como uma janela anuncia que é arrastável, redimensionável e fechável, antes de existir convenção para isso."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {ERAS.map((e) => (
            <div key={e.cls}>
              <div className={`os-window ${e.cls}`}>
                <div className="os-titlebar">
                  <span className="os-title">build — zsh</span>
                  <span className="os-btns">
                    <button type="button" aria-label="Minimizar janela">
                      _
                    </button>
                    <button type="button" aria-label="Fechar janela">
                      ×
                    </button>
                  </span>
                </div>
                <div className="os-body">
                  <p className="font-mono text-[11px]">➜ npm run build</p>
                  <p className="font-mono text-[11px]">✓ Compiled in 8.4s</p>
                  <button type="button" className="os-btn mt-2">
                    OK
                  </button>
                </div>
              </div>
              <p className="mt-2 flex items-baseline gap-2 font-mono text-xs text-[var(--d-fg)]">
                {e.nome}
                <span className="text-[10px] text-[var(--d-comment)]">{e.ano}</span>
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--d-comment)]">{e.o}</p>
              <code className="font-mono text-[10px] text-[var(--d-cyan)]">.os-window .{e.cls}</code>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Surface>
            <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
              {"// "}a arquitetura é a mesma das dimensões
            </p>
            <p className="text-[11px] leading-relaxed text-[var(--d-comment)]">
              A estrutura não muda: <code className="text-[var(--d-cyan)]">.os-window</code> &gt;{" "}
              <code className="text-[var(--d-cyan)]">.os-titlebar</code> (com{" "}
              <code className="text-[var(--d-cyan)]">.os-title</code> e{" "}
              <code className="text-[var(--d-cyan)]">.os-btns</code>) +{" "}
              <code className="text-[var(--d-cyan)]">.os-body</code>. A era é uma classe a mais no
              wrapper — exatamente como as vinte dimensões do Criativo fazem com o canvas, e como o
              tema de editor faz com a sintaxe.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--d-comment)]">
              Três sistemas de tema no projeto, a mesma forma: declare no wrapper, deixe o filho
              ignorante. É o que permite escrever o componente uma vez.
            </p>
          </Surface>

          <Surface>
            <p className="mb-2 font-mono text-[10px] text-[var(--d-orange)]">
              {"// "}acessibilidade — o custo do chrome falso
            </p>
            <p className="text-[11px] leading-relaxed text-[var(--d-comment)]">
              &quot;_&quot; e &quot;×&quot; não dizem nada a quem ouve a página: os botões acima
              levam <code className="text-[var(--d-cyan)]">aria-label</code>. Mas a pergunta antes
              dessa é se eles deviam ser botões.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--d-comment)]">
              <strong className="text-[var(--d-fg)]">Se a janela é decorativa</strong> — e numa
              página de portfólio ela quase sempre é —, esses controles são cenário. Botão que não
              faz nada mas recebe foco é uma parada morta na navegação por teclado. Nesse caso, o
              conjunto inteiro leva <code className="text-[var(--d-cyan)]">aria-hidden</code> e os{" "}
              <code className="text-[var(--d-cyan)]">&lt;button&gt;</code> viram{" "}
              <code className="text-[var(--d-cyan)]">&lt;span&gt;</code>. Aqui eles são botões
              porque esta página os apresenta como componente — quem copiar para uma tela real
              precisa fazer a escolha.
            </p>
          </Surface>
        </div>

        <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">
          .os-window · .os-titlebar · .os-title · .os-btns · .os-body · .os-btn · .os-btn-ghost ·
          .os-inset · .os-95 · .os-xp · .os-mac
        </p>
      </SubChapter>
    </Chapter>
  )
}
