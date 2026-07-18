/* ------------------------------------------------------------------
   09.15 · Peças de vitrine e 11.9 · Arquétipos de landing.
   ------------------------------------------------------------------
   Duas respostas a "mais componentes extrapolados" e "mais versões de
   landing page".

   Sobre as landings, uma decisão que vale explicar: acrescentar quatro
   páginas cheias de texto de mentira não ensinaria nada — o template 11.1 já
   mostra como uma landing se monta. O que faltava era o nível acima: POR QUE
   uma landing tem aquela ordem de seções, e o que muda quando o objetivo
   muda. Arquétipo é isso — a ordem é a decisão de design, o conteúdo é
   consequência.

   Por isso cada arquétipo abaixo aparece como anatomia (a pilha de seções na
   ordem, com o motivo de cada posição) e não como mais uma página. As seções
   são as reais de `src/components/sections/`, então a composição é copiável.
   ------------------------------------------------------------------ */

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

function Secao({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">{lead}</p>
      {children}
    </section>
  )
}

/* ══════════════ 09.15 · PEÇAS DE VITRINE ══════════════ */

export function CreativeShowcase() {
  return (
    <Secao
      id="vitrine"
      n="09.15"
      title="Peças de vitrine"
      lead={
        <>
          Componentes caros de renderizar, difíceis de justificar numa tela de produto e exatamente
          o que um portfólio existe para mostrar. O que as mantém honestas é serem{" "}
          <strong className="text-white/80">objetos físicos citados</strong>, não efeitos genéricos:
          o holograma vira com o ângulo, o tubo escurece nos cantos porque a curvatura afasta o
          feixe, a polaroide tem a margem de baixo maior porque é onde se escreve.
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* carta holográfica */}
        <div>
          <div className="fx-holo-card p-4">
            <p className="sv-heavy text-[10px] uppercase tracking-wide text-white/70">Terra-1610</p>
            <p className="sv-display mt-1 text-2xl uppercase leading-none text-white">Miles</p>
            <div className="mt-8 flex items-end justify-between">
              <span className="sv-sticker sv-sticker-cyan text-[10px]">RARA</span>
              <span className="font-mono text-[10px] text-white/60">001/020</span>
            </div>
          </div>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Carta holográfica</p>
          <p className="text-[10px] leading-snug text-white/45">
            Passe o ponteiro: o brilho corre. Duas camadas — o arco-íris em{" "}
            <code className="text-[var(--sv-cyan)]">color-dodge</code> e a retícula fina que o
            revela. Sem a segunda, vira gradiente comum.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-holo-card</code>
        </div>

        {/* tela de tubo */}
        <div>
          <div className="fx-crt-screen p-5">
            <p className="font-mono text-xs leading-relaxed text-[#7dff9b]">
              &gt; LOADING DIMENSION
              <br />
              &gt; EARTH-42 OK
              <br />
              &gt; _
            </p>
          </div>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Tela de tubo</p>
          <p className="text-[10px] leading-snug text-white/45">
            Moldura de 10px, raio elíptico (22px/16px) e vinheta radial. A curvatura não é filtro —
            é o raio assimétrico que finge o vidro.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-crt-screen</code>
        </div>

        {/* cassete */}
        <div>
          <div className="fx-cassette">
            <p className="sv-heavy text-[11px] uppercase">Mixtape · Vol. 1</p>
            <p className="mt-0.5 text-[10px] italic">gravado da rádio, 1994</p>
          </div>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Fita cassete</p>
          <p className="text-[10px] leading-snug text-white/45">
            As duas janelas de carretel saem de{" "}
            <code className="text-[var(--sv-cyan)]">::before</code> e{" "}
            <code className="text-[var(--sv-cyan)]">::after</code> — o componente não precisa de
            filho nenhum para parecer fita.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-cassette</code>
        </div>

        {/* neon */}
        <div>
          <div className="grid min-h-[7rem] place-items-center rounded-lg border-[3px] border-black bg-[#0a0612] p-4">
            <span className="fx-neon-sign sv-display text-xl uppercase">Aberto</span>
          </div>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Letreiro de neon</p>
          <p className="text-[10px] leading-snug text-white/45">
            Brilho por dentro e por fora da moldura, ambos em{" "}
            <code className="text-[var(--sv-cyan)]">currentColor</code> — troque a cor do texto e o
            tubo inteiro acompanha. Três tintas.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-neon-sign</code>
        </div>

        {/* polaroide */}
        <div>
          <figure className="fx-polaroid w-fit">
            <span
              className="art-tex-riso block h-24 w-36 border border-black/20"
              aria-hidden
            />
            <figcaption>o dia em que tudo mudou</figcaption>
          </figure>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Polaroide</p>
          <p className="text-[10px] leading-snug text-white/45">
            Margem de baixo de 42px contra 12px nos outros lados. É essa assimetria — e não a
            sombra — que faz o olho reconhecer a peça.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-polaroid</code>
        </div>

        {/* folha de adesivos */}
        <div>
          <div className="fx-sticker-sheet flex flex-wrap gap-2">
            <span className="sv-sticker sv-sticker-magenta text-[10px]">THWIP</span>
            <span className="sv-sticker sv-sticker-lime text-[10px]">CANON</span>
            <span className="sv-sticker sv-sticker-cyan text-[10px]">GO!</span>
          </div>
          <p className="sv-heavy mt-2 text-[11px] uppercase text-white/80">Folha de adesivos</p>
          <p className="text-[10px] leading-snug text-white/45">
            O tracejado é o corte de faca. Os filhos herdam a mesma borda, então qualquer conteúdo
            vira adesivo destacável sem classe extra.
          </p>
          <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-sticker-sheet</code>
        </div>
      </div>

      <Painel className="mt-6">
        <Cap>quando NÃO usar</Cap>
        <p className="text-[11px] leading-relaxed text-white/60">
          Nenhuma destas peças serve a uma interface de trabalho. São caras (a carta empilha três
          camadas com <code className="text-[var(--sv-cyan)]">mix-blend-mode</code>, o tubo tem duas
          sobreposições e sombra interna) e todas roubam atenção por desenho — que é o objetivo
          numa vitrine e o defeito num formulário. Use uma por tela, no máximo: duas competem, e a
          página perde o ponto focal que elas existiam para criar.
        </p>
      </Painel>

      <p className="mt-4 font-mono text-[10px] text-white/40">
        .fx-holo-card · .fx-crt-screen · .fx-cassette · .fx-neon-sign (+2) · .fx-polaroid ·
        .fx-sticker-sheet
      </p>
    </Secao>
  )
}

/* ══════════════ 11.9 · ARQUÉTIPOS DE LANDING ══════════════ */

type Bloco = { s: string; por: string; destaque?: boolean }

const ARQUETIPOS: { nome: string; obj: string; quando: string; blocos: Bloco[] }[] = [
  {
    nome: "Lançamento",
    obj: "Apresentar algo que ninguém conhece",
    quando: "Produto novo, sem tração e sem prova social para exibir.",
    blocos: [
      { s: "Hero", por: "A promessa vem primeiro porque não há reputação que a anteceda." },
      { s: "SvStats", por: "Números logo abaixo: substituem a prova que ainda não existe. É o que define o arquétipo.", destaque: true },
      { s: "SvLogosGrid", por: "Emprestar credibilidade de quem já é conhecido." },
      { s: "SvPricing", por: "Preço depois da promessa, nunca antes." },
      { s: "SvCTA", por: "Fecho único, repetindo a ação do hero." },
    ],
  },
  {
    nome: "Prova social",
    obj: "Converter quem já ouviu falar",
    quando: "O produto tem clientes. A dúvida não é o que é, é se funciona.",
    blocos: [
      { s: "Hero curto", por: "Uma linha. Quem chega aqui já sabe o que é." },
      { s: "SvTestimonials", por: "A prova vem ANTES da promessa — é a inversão que define o arquétipo.", destaque: true },
      { s: "SvLogosGrid", por: "Quem mais usa, em escala." },
      { s: "SvStats", por: "O número que sustenta os depoimentos." },
      { s: "SvCTA", por: "Ação com atrito baixo: teste, não compra." },
    ],
  },
  {
    nome: "Captura",
    obj: "Uma conversão, zero distração",
    quando: "Campanha paga, isca de conteúdo, lista de espera.",
    blocos: [
      { s: "Hero mínimo", por: "Sem navegação: todo link daqui é uma fuga." },
      { s: "SvNewsletter", por: "O formulário acima da dobra. É a página inteira.", destaque: true },
      { s: "SvStats", por: "Três números, só para reduzir o risco percebido." },
      { s: "Rodapé curto", por: "Privacidade e nada mais." },
    ],
  },
  {
    nome: "Evento",
    obj: "Vender presença numa data",
    quando: "Lançamento, workshop, encontro — algo que expira.",
    blocos: [
      { s: "Hero + data", por: "A data É a informação. Sem ela o resto não decide nada.", destaque: true },
      { s: "SvTimeline", por: "A programação: quem vai investir horas quer saber quais." },
      { s: "SvTeam", por: "Quem fala. Numa conferência, as pessoas são o produto." },
      { s: "SvPricing", por: "Lotes, com o atual destacado — escassez é honesta aqui." },
      { s: "SvCTA", por: "Inscrição, com a data repetida." },
    ],
  },
]

function Anatomia({ blocos }: { blocos: Bloco[] }) {
  return (
    <ol className="space-y-1.5">
      {blocos.map((b, i) => (
        <li key={b.s} className="flex gap-3">
          <span
            className={`sv-heavy mt-0.5 grid size-5 shrink-0 place-items-center rounded border-2 border-black text-[9px] ${
              b.destaque ? "bg-[var(--sv-magenta)] text-white" : "bg-[var(--sv-ink)] text-white/60"
            }`}
          >
            {i + 1}
          </span>
          <span className="min-w-0">
            <code className="font-mono text-[11px] text-[var(--sv-cyan)]">{b.s}</code>
            <span className="block text-[10px] leading-snug text-white/50">{b.por}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export function CreativeLandings() {
  return (
    <Secao
      id="arquetipos"
      n="11.9"
      title="Arquétipos de landing"
      lead={
        <>
          O template 11.1 mostra como uma landing se monta. Isto é o nível acima:{" "}
          <strong className="text-white/80">por que ela tem aquela ordem</strong>, e o que muda
          quando o objetivo muda. Quatro páginas cheias de texto de mentira não ensinariam nada — a
          ordem das seções é a decisão de design, e o conteúdo é consequência dela. As seções
          citadas são as reais de{" "}
          <code className="text-[var(--sv-cyan)]">src/components/sections/</code>, então cada
          anatomia é copiável como está.
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {ARQUETIPOS.map((a) => (
          <Painel key={a.nome}>
            <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-white/10 pb-2">
              <p className="sv-display text-lg uppercase leading-none text-white">{a.nome}</p>
              <p className="text-[10px] uppercase tracking-wide text-[var(--sv-yellow)]">{a.obj}</p>
            </div>
            <Anatomia blocos={a.blocos} />
            <p className="mt-3 border-t border-white/10 pt-2 text-[10px] leading-snug text-white/45">
              <span className="text-white/70">Quando:</span> {a.quando}
            </p>
          </Painel>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Painel>
          <Cap>a regra que atravessa os quatro</Cap>
          <p className="text-[11px] leading-relaxed text-white/60">
            Repare no bloco destacado: é o que define cada arquétipo — e em três dos quatro ele é o{" "}
            <strong className="text-white/80">segundo</strong> movimento, não o hero. Todos abrem
            com um hero; o que os separa é o que vem logo depois. Lançamento põe números, prova
            social põe depoimento, captura põe o formulário. Trocar essa segunda seção de lugar é
            trocar de arquétipo sem perceber.
            <br />
            <br />
            O evento é a exceção honesta: nele o elemento definidor — a data — vive dentro do
            próprio hero, porque sem ela nenhuma das seções seguintes decide nada.
          </p>
        </Painel>

        <Painel>
          <Cap>o que NÃO varia</Cap>
          <p className="text-[11px] leading-relaxed text-white/60">
            Uma ação principal por página, repetida no fim com as mesmas palavras do começo — se o
            hero diz &quot;Começar grátis&quot;, o fecho não pode dizer &quot;Saiba mais&quot;. E
            preço nunca antes da promessa: o leitor precisa saber o que está comprando antes de ver
            quanto custa. Os quatro arquétipos respeitam as duas regras; é o que os torna variações
            e não sistemas diferentes.
          </p>
        </Painel>
      </div>

      <Painel className="mt-4">
        <Cap>composição — o arquétipo de captura, inteiro</Cap>
        <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
          <code>{`<SvCanvas dimension="graffiti">
  {/* sem <SiteHeader>: navegação é fuga numa landing de captura */}
  <ComicHeader kicker="Lista de espera" title="Entre" highlight="antes" />
  <SvNewsletter />
  <SvStats stats={[…3 números…]} />
</SvCanvas>`}</code>
        </pre>
        <p className="mt-2 text-[10px] leading-snug text-white/45">
          Quatro linhas. A landing de captura é a mais curta de escrever e a mais difícil de
          acertar, porque cada elemento a mais é uma chance de perder a conversão.
        </p>
      </Painel>

      <p className="mt-4 font-mono text-[10px] text-white/40">
        Hero · SvStats · SvLogosGrid · SvPricing · SvCTA · SvNewsletter · SvTestimonials · SvTeam ·
        SvTimeline
      </p>
    </Secao>
  )
}
