/* ------------------------------------------------------------------
   As matérias que faltavam ao caderno 09 do _Dev.
   ------------------------------------------------------------------
   Mesma auditoria que se fez no Anfitrião: contar as classes `.dv-*` que
   dracula.css e dev-mode.css definem (41) contra as que o guia mostrava
   (26). Faltavam duas famílias inteiras — a navegação (topo, dock, marca) e
   o bloco de código com botão de copiar —, além das primitivas de página.

   Quinze peças reais, em produção, que ninguém achava sem abrir o CSS. Quem
   lesse o catálogo concluiria que o realm não tem navegação documentada e
   inventaria a sua.
   ------------------------------------------------------------------ */
import { SubChapter, Surface } from "./dev-chapters"

function Cap({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">
      {"// "}
      {children}
    </p>
  )
}

function Classes({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">{children}</p>
}

/* ══════════════ 09.12 · NAVEGAÇÃO ══════════════ */
export function DevNavegacao() {
  return (
    <SubChapter
      id="navegacao"
      n="09.12"
      title="Navegação · topo, marca e dock"
      lead="O chrome do realm: a barra fixa no topo, a marca à esquerda e o dock flutuante que substitui o menu no telefone. São peças que toda página usa e que nenhuma documentação mostrava — o resultado é que cada tela nova reinventava a sua barra."
    >
      {/* barra de topo */}
      <Cap>a barra — sticky, com vidro sobre o conteúdo</Cap>
      <Surface className="!p-0">
        <div className="dv-head !static">
          <div className="dv-topbar">
            <span className="dv-logo">
              <span className="lr font-mono font-bold">LR</span>
              <span className="dv-brand font-mono">
                <span className="dv-prompt">➜</span> ~/portfolio
              </span>
            </span>
            <nav className="flex items-center gap-1">
              <a href="#navegacao" className="dv-navlink font-mono" data-active="true">
                projetos
              </a>
              <a href="#navegacao" className="dv-navlink font-mono">
                devlog
              </a>
              <a href="#navegacao" className="dv-navlink font-mono">
                sobre
              </a>
            </nav>
          </div>
        </div>
      </Surface>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-head</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            A camada fixa: <code className="font-mono">position: sticky</code>,{" "}
            <code className="font-mono">z-index: 40</code> e{" "}
            <code className="font-mono">backdrop-filter: blur(10px)</code> sobre um fundo a 92% de
            opacidade. O desfoque não é enfeite — é o que deixa o código passar por baixo sem
            competir com os links.
          </p>
        </Surface>
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-topbar</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            O conteúdo dentro dela: <code className="font-mono">space-between</code> puro, marca de
            um lado e navegação do outro. Sem largura máxima — a barra acompanha a página, não o
            container.
          </p>
        </Surface>
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-logo · .dv-brand</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            O quadrado roxo de 30px com as iniciais, e ao lado o caminho como se fosse prompt —{" "}
            <code className="font-mono">.dv-prompt</code> pinta o{" "}
            <span className="text-[var(--d-pink)]">➜</span> de rosa. A marca deste realm é literalmente
            uma linha de shell.
          </p>
        </Surface>
      </div>

      {/* dock */}
      <Cap>o dock — a navegação do telefone</Cap>
      <Surface>
        <div className="dv-dock !mx-0">
          {[
            ["▲", "início", true],
            ["●", "projetos", false],
            ["±", "devlog", false],
            ["⌘", "atalhos", false],
          ].map(([g, l, on]) => (
            <a key={l as string} href="#navegacao" data-active={on ? "true" : undefined}>
              <span className="font-mono text-base">{g}</span>
              <span className="dock-lbl">{l}</span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
          Glifo em cima, rótulo embaixo, o ativo em roxo sólido. Rola na horizontal quando não cabe
          (<code className="font-mono">overflow-x: auto</code> com{" "}
          <code className="font-mono">max-width: calc(100vw - 2rem)</code>), então aguenta seis ou
          sete destinos sem quebrar o layout.
        </p>
      </Surface>

      <Surface className="mt-3">
        <p className="mb-2 font-mono text-[10px] text-[var(--d-orange)]">
          {"// "}a exceção honesta: aqui há transform
        </p>
        <p className="text-[11px] leading-snug text-[var(--d-comment)]">
          O capítulo de motion afirma que neste realm nada salta e que as transições são só de cor e
          borda. <strong className="text-[var(--d-fg)]">Uma peça desobedece:</strong>{" "}
          <code className="font-mono text-[var(--d-cyan)]">.dv-dock a:hover</code> aplica{" "}
          <code className="font-mono text-[var(--d-orange)]">transform: translateY(-3px)</code>. É o
          único deslocamento da folha de estilo inteira.
          <br />
          <br />
          Está documentado em vez de escondido porque tem defesa: o dock é alvo de toque, e o
          levantar de 3px é o retorno tátil que um alvo de dedo precisa — não é decoração de hover
          de mouse. Se um dia parecer inconsistente demais, a correção é remover daqui, não
          espalhar para os cards.
        </p>
      </Surface>

      <Classes>
        .dv-head · .dv-topbar · .dv-nav · .dv-navlink · .dv-brand · .dv-prompt · .dv-logo · .lr ·
        .dv-dock · .dock-lbl · .dv-link
      </Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.13 · BLOCO DE CÓDIGO ══════════════ */
export function DevBlocoCodigo() {
  return (
    <SubChapter
      id="bloco-codigo"
      n="09.13"
      title="O bloco de código"
      lead="A peça mais usada de um portfólio de dev e a que estava menos documentada. Três classes cooperam: o bloco em si, o invólucro que posiciona o rótulo da linguagem, e o botão de copiar. Separadas porque nem todo bloco precisa das três."
    >
      <Cap>as três camadas, juntas</Cap>
      <div className="dv-snippet">
        <span className="lang">bash</span>
        <pre className="dv-code">
          <code>
            <span className="text-[var(--d-comment)]">{"# clonar e subir o ambiente"}</span>
            {"\n"}
            <span className="text-[var(--d-green)]">git</span>
            <span className="text-[var(--d-fg)]"> clone git@github.com:LucasRiboldi/Portifolio2026.git</span>
            {"\n"}
            <span className="text-[var(--d-green)]">npm</span>
            <span className="text-[var(--d-fg)]"> install </span>
            <span className="text-[var(--d-comment)]">{"&& "}</span>
            <span className="text-[var(--d-green)]">npm</span>
            <span className="text-[var(--d-fg)]"> run dev</span>
          </code>
        </pre>
      </div>
      <div className="mt-2 flex justify-end">
        <button type="button" className="dv-copy font-mono">
          ⧉ copiar
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-code</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            O bloco: fundo <code className="font-mono">--d-bg-2</code>, borda de 1px, raio de 10px e{" "}
            <code className="font-mono">overflow-x: auto</code>. A rolagem horizontal é deliberada —
            quebrar linha de código altera o significado do que se lê.
          </p>
        </Surface>
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-snippet · .lang</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            Só um <code className="font-mono">position: relative</code> em volta, para o rótulo da
            linguagem ancorar no canto superior direito. Use quando a linguagem não for óbvia pelo
            conteúdo.
          </p>
        </Surface>
        <Surface>
          <p className="mb-1.5 font-mono text-xs text-[var(--d-cyan)]">.dv-copy</p>
          <p className="text-[11px] leading-snug text-[var(--d-comment)]">
            Botão discreto que vira verde no hover — verde porque copiar é uma ação que{" "}
            <em>dá certo</em>, e a paleta já usa verde para sucesso. Coerente com 05.1.
          </p>
        </Surface>
      </div>

      <Surface className="mt-3">
        <p className="mb-2 font-mono text-[10px] text-[var(--d-green)]">{"// "}acessibilidade</p>
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            ["Semântica", "<pre><code> — não <div>. Leitor de tela anuncia bloco de código e preserva o espaçamento."],
            ["Copiar", "Confirme em texto ('copiado'), não só trocando o ícone: leitor de tela não vê ⧉ virar ✓."],
            ["Rolagem", "Um bloco com overflow precisa ser focável por teclado (tabindex=\"0\"), senão quem não usa mouse não alcança o fim da linha."],
            ["Realce", "As cores de sintaxe são decorativas — o código precisa ser legível se todas virarem --d-fg."],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[var(--d-current)] py-1.5">
              <p className="font-mono text-[11px] text-[var(--d-cyan)]">{k}</p>
              <p className="text-[11px] leading-snug text-[var(--d-comment)]">{v}</p>
            </div>
          ))}
        </div>
      </Surface>

      <Classes>.dv-code · .dv-snippet · .lang · .dv-copy</Classes>
    </SubChapter>
  )
}

/* ══════════════ 09.14 · PRIMITIVAS DE PÁGINA ══════════════ */
export function DevPrimitivas() {
  return (
    <SubChapter
      id="primitivas"
      n="09.14"
      title="Primitivas de página"
      lead="As três peças de composição que sustentam qualquer tela do realm: o título de seção com o marcador roxo, o chapéu que fala em sintaxe, e a grade que se organiza sozinha. Pequenas demais para virar capítulo, essenciais demais para ficarem fora do catálogo."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Surface>
          <Cap>título de seção</Cap>
          <p className="dv-section-title">Projetos recentes</p>
          <p className="mt-2 text-[11px] leading-snug text-[var(--d-comment)]">
            <code className="font-mono text-[var(--d-cyan)]">.dv-section-title</code> injeta o{" "}
            <span className="text-[var(--d-purple)]">▍</span> por{" "}
            <code className="font-mono">::before</code> — o mesmo caret que marca o cursor, agora
            marcando a seção. O glifo não está no HTML, então não é lido em duplicidade por leitor de
            tela.
          </p>
        </Surface>

        <Surface>
          <Cap>chapéu em sintaxe</Cap>
          <p className="dv-kicker font-mono">
            <span className="tok-fn">buscar</span>(<span className="tok-str">&quot;projetos&quot;</span>)
          </p>
          <p className="mt-2 text-[11px] leading-snug text-[var(--d-comment)]">
            <code className="font-mono text-[var(--d-cyan)]">.dv-kicker</code> escreve o chapéu como
            chamada de função, com <code className="font-mono">.tok-fn</code> em verde e{" "}
            <code className="font-mono">.tok-str</code> em amarelo — as mesmas tintas da tabela de
            sintaxe (05.1). É o realm sendo coerente até no subtítulo.
          </p>
        </Surface>
      </div>

      <Surface className="mt-3">
        <Cap>a grade que se resolve sozinha</Cap>
        <div className="dv-grid !mt-0">
          {["portfolio-2026", "sports-widget", "skill-seekers"].map((n) => (
            <div key={n} className="dv-card">
              <p className="dv-title text-xs">{n}</p>
              <p className="dv-sub mt-1 text-[10px]">Next.js · TypeScript</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-snug text-[var(--d-comment)]">
          <code className="font-mono text-[var(--d-cyan)]">.dv-grid</code> usa{" "}
          <code className="font-mono">repeat(auto-fill, minmax(280px, 1fr))</code>: sem breakpoint,
          sem variante, sem decisão. A coluna nasce quando cabem 280px e some quando não cabem — o
          layout responde à largura real do container, não à do viewport.
        </p>
      </Surface>

      <Classes>.dv-section-title · .dv-kicker · .tok-fn · .tok-str · .dv-grid</Classes>
    </SubChapter>
  )
}
