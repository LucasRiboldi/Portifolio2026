/* ------------------------------------------------------------------
   09.10 · O vocabulário do gibi.
   ------------------------------------------------------------------
   O último grande bloco indocumentado do Criativo, e o mais estranho de
   estar faltando: são as peças que dão NOME ao realm. Balão de fala, painel
   inclinado, onomatopeia, adesivo, legenda de canto, explosão — o léxico que
   qualquer leitor de quadrinho reconhece sem precisar de legenda, e que o
   guia do realm inteiro construído sobre quadrinhos não mostrava.

   Junto vão as peças de dimensão que atravessam o sistema: a fenda, o vazio,
   a garra, a dupla exposição e o split — os componentes que só existem
   porque este design system tem multiverso.
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

export function CreativeComic() {
  return (
    <section
      id="vocabulario"
      aria-label="09.10 · O vocabulário do gibi"
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">09.10</span>
        O vocabulário do gibi
      </p>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">
        As peças que dão nome ao realm — balão, painel, onomatopeia, adesivo, legenda — e que o guia
        de um design system inteiro construído sobre quadrinhos não mostrava. É o léxico que
        qualquer leitor de gibi reconhece sem precisar de explicação, e é justamente por isso que
        cada peça carrega uma regra de uso: o balão diz quem fala, a onomatopeia diz o que soa, o
        adesivo diz o que foi colado depois. Trocar as funções desfaz a leitura.
      </p>

      {/* ---- balões ---- */}
      <Cap>balões — quem fala, e como</Cap>
      <Painel>
        <div className="flex flex-wrap items-start gap-8">
          <div className="sv-bubble max-w-[15rem]">
            <p className="text-sm text-black">
              O balão redondo é fala normal. O rabicho aponta para quem fala.
            </p>
          </div>
          <div className="sv-bubble sv-bubble-spiky max-w-[15rem]">
            <p className="text-sm text-black">
              O espinhoso é grito, rádio ou voz mecânica — som que corta.
            </p>
          </div>
          <div className="sv-bubble sv-bubble-thought max-w-[15rem]">
            <p className="text-sm text-black">
              O de pensamento é nuvem: o que não foi dito em voz alta.
            </p>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-snug text-white/50">
          As variantes desligam o rabicho (
          <code className="text-[var(--sv-cyan)]">::before</code> e{" "}
          <code className="text-[var(--sv-cyan)]">::after</code> viram{" "}
          <code className="text-[var(--sv-cyan)]">display: none</code>) e desenham a própria borda —
          por isso <code className="text-[var(--sv-cyan)]">.sv-bubble-spiky</code> e{" "}
          <code className="text-[var(--sv-cyan)]">.sv-bubble-thought</code> vêm sempre acompanhadas
          de <code className="text-[var(--sv-cyan)]">.sv-bubble</code>, nunca sozinhas.
        </p>
        <p className="mt-2 text-[11px] leading-snug text-white/50">
          <span className="text-[var(--sv-yellow)]">Acessibilidade:</span> o balão é forma, não
          semântica. Diálogo real vai em <code className="text-[var(--sv-cyan)]">&lt;blockquote&gt;</code>{" "}
          com <code className="text-[var(--sv-cyan)]">&lt;cite&gt;</code>; o balão só o veste.
        </p>
      </Painel>

      {/* ---- onomatopeias ---- */}
      <div className="mt-6">
        <Cap>onomatopeias — o som desenhado</Cap>
        <Painel>
          <div className="flex flex-wrap items-center gap-6">
            <span className="sv-onoma sv-onoma-magenta text-4xl">THWIP!</span>
            <span className="sv-onoma sv-onoma-cyan text-4xl">BAM!</span>
            <span className="sv-onoma sv-onoma-lime text-3xl">POW!</span>
            <span className="sv-onoma sv-onoma-orange text-3xl">CRASH!</span>
            <span className="sv-onoma sv-onoma-violet text-3xl">ZAP!</span>
          </div>
          <p className="mt-4 text-[11px] leading-snug text-white/50">
            Cinco tintas, e a escolha não é decorativa: a onomatopeia herda a cor do que a produz —
            teia em magenta, impacto em ciano, elétrico em violeta. Duas onomatopeias no mesmo
            painel competem pelo mesmo ouvido; use uma.
          </p>
          <p className="mt-2 text-[11px] leading-snug text-white/50">
            <span className="text-[var(--sv-yellow)]">Acessibilidade:</span> som desenhado é
            decoração para quem ouve a página —{" "}
            <code className="text-[var(--sv-cyan)]">aria-hidden=&quot;true&quot;</code>, salvo quando a
            palavra É o conteúdo (um título &quot;BAM!&quot;, por exemplo).
          </p>
        </Painel>
      </div>

      {/* ---- painéis e inclinação ---- */}
      <div className="mt-6">
        <Cap>painéis — a moldura e a inclinação</Cap>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sv-panel sv-panel-cyan sv-tilt-1 p-4">
            <p className="sv-heavy text-xs uppercase">tilt-1 · −3°</p>
            <p className="mt-1 text-[11px] opacity-70">Passe o ponteiro: endireita e desloca.</p>
          </div>
          <div className="sv-panel sv-panel-yellow sv-tilt-2 p-4">
            <p className="sv-heavy text-xs uppercase">tilt-2 · +3,4°</p>
            <p className="mt-1 text-[11px] opacity-70">Ângulos diferentes de propósito.</p>
          </div>
          <div className="sv-panel sv-panel-violet sv-tilt-3 p-4">
            <p className="sv-heavy text-xs uppercase">tilt-3 · −2°</p>
            <p className="mt-1 text-[11px] opacity-70">Nenhum é múltiplo do outro.</p>
          </div>
        </div>
        <Painel className="mt-4">
          <p className="text-[11px] leading-relaxed text-white/60">
            Os três ângulos são deliberadamente irregulares — −3°, +3,4°, −2°. Se fossem múltiplos
            entre si, a grade leria como erro de alinhamento; sendo primos, lê como colagem. A
            sombra do painel é <strong className="text-white/80">chapada e deslocada</strong>, nunca
            desfocada: quadrinho impresso não tem penumbra.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/60">
            <code className="text-[var(--sv-cyan)]">.sv-panel-*</code> muda só a cor da sombra no
            hover. As quatro existem para o painel poder pertencer à seção onde está sem trocar de
            componente.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/50">
            <span className="text-[var(--sv-yellow)]">Lacuna conhecida:</span> a inclinação é{" "}
            <code className="text-[var(--sv-cyan)]">transform</code> e não é desligada por{" "}
            <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code> — o endireitar no
            hover chega a quem pediu menos movimento. Mesma lacuna registrada em 09.7.
          </p>
        </Painel>
      </div>

      {/* ---- adesivos, legendas, explosões ---- */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Painel>
          <Cap>adesivos e etiquetas</Cap>
          <div className="flex flex-wrap items-center gap-3">
            {["magenta", "cyan", "lime", "violet", "orange"].map((c) => (
              <span key={c} className={`sv-sticker sv-sticker-${c} text-[11px]`}>
                {c}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-white/50">
            O adesivo é o que foi <em>colado depois</em> — promoção, selo, aviso de capa. Por isso
            vem torto e com borda preta grossa. Se a informação nasceu com a página, não é adesivo:
            é legenda.
          </p>
        </Painel>

        <Painel>
          <Cap>legendas e explosões</Cap>
          <div className="flex flex-wrap items-center gap-4">
            <span className="sv-caption sv-caption-cyan text-[11px]">MEANWHILE…</span>
            <span className="sv-caption sv-caption-white text-[11px]">EARTH-1610</span>
            <span className="sv-badge-burst !p-5 text-[11px]">NEW!</span>
            {/* `.sv-burst` sozinho recorta o nada: é só clip-path. Aqui vai
                sobre um fundo, que é a única forma de a estrela existir. */}
            <span className="sv-burst inline-grid size-16 place-items-center bg-[var(--sv-lime)] text-[10px] font-bold text-black">
              #1
            </span>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-white/50">
            A legenda (<code className="text-[var(--sv-cyan)]">.sv-caption</code>) é a voz do
            narrador, não de um personagem — vai no canto, em caixa retangular.
          </p>
          <p className="mt-2 text-[11px] leading-snug text-white/50">
            <span className="text-[var(--sv-yellow)]">A distinção que engana:</span>{" "}
            <code className="text-[var(--sv-cyan)]">.sv-badge-burst</code> é o componente completo —
            traz fundo, respiro e a fonte de display.{" "}
            <code className="text-[var(--sv-cyan)]">.sv-burst</code> é{" "}
            <strong className="text-white/80">só um clip-path</strong>, sem cor nenhuma: aplicado a
            um elemento sem fundo, ele recorta o nada e some. Use o primeiro para selo pronto, o
            segundo para dar forma de estrela a algo que já tem preenchimento.
          </p>
        </Painel>
      </div>

      {/* ---- peças de multiverso ---- */}
      <div className="mt-6">
        <Cap>peças de multiverso — só existem porque há dimensões</Cap>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Painel>
            <div className="sv-rift mb-2 h-16 w-full" aria-hidden />
            <p className="sv-heavy text-[11px] uppercase text-white/80">Fenda</p>
            <p className="text-[10px] leading-snug text-white/45">
              A rasgadura entre dimensões. <code className="text-[var(--sv-cyan)]">.sv-rift</code>
            </p>
          </Painel>
          <Painel>
            <div className="sv-void mb-2 h-16 w-full" aria-hidden />
            <p className="sv-heavy text-[11px] uppercase text-white/80">Vazio</p>
            <p className="text-[10px] leading-snug text-white/45">
              O buraco do Spot. <code className="text-[var(--sv-cyan)]">.sv-void</code>
            </p>
          </Painel>
          <Painel>
            <div className="sv-claw mb-2 h-16 w-full" aria-hidden />
            <p className="sv-heavy text-[11px] uppercase text-white/80">Garra</p>
            <p className="text-[10px] leading-snug text-white/45">
              O corte do Prowler. <code className="text-[var(--sv-cyan)]">.sv-claw</code>
            </p>
          </Painel>
          <Painel>
            <span
              className="sv-doubleexpose sv-display mb-2 block text-2xl uppercase text-white"
              data-text="DUPLO"
            >
              DUPLO
            </span>
            <p className="sv-heavy text-[11px] uppercase text-white/80">Dupla exposição</p>
            <p className="text-[10px] leading-snug text-white/45">
              Dois you da mesma pessoa.{" "}
              <code className="text-[var(--sv-cyan)]">.sv-doubleexpose</code>
            </p>
          </Painel>
        </div>
        <Painel className="mt-4">
          <p className="text-[11px] leading-relaxed text-white/60">
            <code className="text-[var(--sv-cyan)]">.sv-split</code> merece nota à parte: divide o
            bloco em duas metades de dimensões diferentes (
            <code className="text-[var(--sv-cyan)]">.sv-split-a</code> e{" "}
            <code className="text-[var(--sv-cyan)]">.sv-split-b</code>) com o conteúdo por cima em{" "}
            <code className="text-[var(--sv-cyan)]">.sv-split-content</code>. É a peça que mostra
            duas realidades no mesmo quadro — a imagem central do filme, e a única do sistema que
            exige três filhos com papéis fixos.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-white/60">
            <code className="text-[var(--sv-cyan)]">.sv-doubleexpose</code> lê{" "}
            <code className="text-[var(--sv-cyan)]">data-text</code>, como o glitch de 09.9 — sem o
            atributo, não desenha nada e não avisa.
          </p>
        </Painel>
      </div>

      <p className="mt-4 font-mono text-[10px] text-white/40">
        .sv-bubble (+2) · .sv-onoma (+5) · .sv-panel (+4) · .sv-tilt-1..3 · .sv-sticker (+5) ·
        .sv-caption (+2) · .sv-burst · .sv-badge-burst · .sv-rift · .sv-void · .sv-claw ·
        .sv-split · .sv-doubleexpose · .sv-outline-text · .sv-underline · .sv-divider · .sv-studs
      </p>
    </section>
  )
}
