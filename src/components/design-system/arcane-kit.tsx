/* ------------------------------------------------------------------
   Ampliação do UI Kit de "O Anfitrião" — as peças de jornal que faltavam.
   ------------------------------------------------------------------
   Matérias novas, na língua da folha e nos tokens `--dp-*`. Cada uma ilustra
   classes reais de `daily-prophet-kit.css` — se uma quebrar, quebra aqui à
   vista, como o resto do guia.

   As três fontes novas (nameplate blackletter, corpo old-style, máquina de
   escrever) chegam por `daily-prophet.css`, que passou a apontar `--dp-black`,
   `--dp-body` e `--dp-type` para webfonts reais em vez de nomes de sistema.
   ------------------------------------------------------------------ */
import { Folha, Nota, SubChapter } from "./arcane-chapters"

/* ══════════════ 04.3 · As três vozes novas da folha ══════════════ */
export function ArcaneVozes() {
  return (
    <SubChapter
      id="vozes-novas"
      n="04.3"
      title="Blackletter, old-style e máquina"
      lead="Três vozes que a folha não tinha impressas de verdade — dependiam de fontes que o leitor talvez não tivesse. Agora são tipos carregados: o gótico do nameplate, a old-style do corpo e a datilografada da errata."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Folha>
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Nameplate · blackletter
          </p>
          <p className="text-4xl leading-tight" style={{ fontFamily: "var(--dp-black)", color: "var(--dp-ink)" }}>
            O Anfitrião
          </p>
          <Nota>UnifrakturCook. Só no cabeçalho — uma folha inteira em gótico é ilegível.</Nota>
        </Folha>

        <Folha>
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Corpo · old-style 1900
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: "var(--dp-body)", color: "var(--dp-ink)" }}>
            O olho lê old-style sem esforço porque o contraste entre a haste e o filete é gentil.
            <span style={{ fontStyle: "italic" }}> Itálico verdadeiro</span>, não inclinado.
          </p>
          <Nota>Old Standard TT — desenhada para texto corrido de jornal.</Nota>
        </Folha>

        <Folha>
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Errata · máquina de escrever
          </p>
          <p className="dp-typed text-sm">
            Onde se lê {"“token”"}, leia-se {"“sicautomóvel”"}.
          </p>
          <Nota>Special Elite. A voz do comunicado datilografado, não composto na prensa.</Nota>
        </Folha>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 02.2 · Texturas físicas ══════════════ */
export function ArcaneTexturas() {
  return (
    <SubChapter
      id="texturas"
      n="02.2"
      title="O papel envelhecido"
      lead="A folha não é uma superfície limpa: tem o vinco da dobra, as manchas de foxing e a tinta que passou de leve e desalinhou. São defeitos de propósito — é o que faz o olho ler papel de 1920 em vez de div."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="dp-crease" style={{ minHeight: "8rem", border: "1px solid var(--dp-rule)", padding: "1rem" }}>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>Vinco</p>
          <p className="mt-2 text-sm" style={{ color: "var(--dp-ink-2)" }}>
            A dobra central que todo jornal de banca carrega. <code>.dp-crease</code>
          </p>
        </div>

        <div className="dp-foxing" style={{ minHeight: "8rem", border: "1px solid var(--dp-rule)", padding: "1rem" }}>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>Foxing</p>
          <p className="mt-2 text-sm" style={{ color: "var(--dp-ink-2)" }}>
            O amarelado do papel guardado décadas. <code>.dp-foxing</code>
          </p>
        </div>

        <div style={{ minHeight: "8rem", border: "1px solid var(--dp-rule)", padding: "1rem" }}>
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>Sangria de tinta</p>
          <p className="dp-bleed mt-2 text-lg" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            MÁ REGISTAÇÃO
          </p>
          <Nota>A chapa a cores que desalinhou um fio. <code>.dp-bleed</code></Nota>
        </div>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 08.2 · Movimento da prensa ══════════════ */
export function ArcaneMotionKit() {
  return (
    <SubChapter
      id="motion-prensa"
      n="08.2"
      title="Tinta a secar, folha a assentar"
      lead="Os dois únicos gestos que um jornal admite, ambos disparados uma vez e nunca em loop: a manchete que escurece do sépia claro ao preto conforme a tinta seca, e a folha que entra torta e endireita ao pousar na mesa."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <p className="dp-anim-ink text-2xl" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            A TINTA AINDA SECA
          </p>
          <Nota><code>.dp-anim-ink</code> — do sépia diluído ao ink, no primeiro paint.</Nota>
        </Folha>

        <div className="dp-anim-drop">
          <Folha>
            <p className="text-2xl" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
              Assenta na mesa
            </p>
            <Nota><code>.dp-anim-drop</code> — entra torta, endireita. Respeita prefers-reduced-motion.</Nota>
          </Folha>
        </div>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 11.1 · Templates de seção de jornal ══════════════ */
export function ArcaneTemplatesJornal() {
  return (
    <SubChapter
      id="templates-jornal"
      n="11.1"
      title="Os blocos da folha"
      lead="As seções que uma folha real diagrama e que faltavam ao catálogo: a tarja de última hora, o almanaque do tempo, o pregão, o obituário, o cupão recortável, a citação de destaque e a linha de salto."
    >
      {/* Pare-a-prensa */}
      <div className="dp-stoppress mb-5">
        <span className="dp-stoppress__flag">Pare a prensa</span>
        <span className="dp-stoppress__text">Terceira dimensão do multiverso entra em composição esta noite.</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Almanaque do tempo */}
        <div className="dp-weather">
          <div className="dp-weather__glyph">☁</div>
          <div className="dp-weather__temp">14°</div>
          <div className="dp-weather__label">Nublado · Terra-2026</div>
        </div>

        {/* Pregão */}
        <div style={{ border: "1px solid var(--dp-rule)", padding: "0.75rem" }}>
          <table className="dp-market">
            <thead>
              <tr><th>Dimensão</th><th>Cotação</th></tr>
            </thead>
            <tbody>
              <tr><td>Mumbattan</td><td className="dp-market__up">+3,2</td></tr>
              <tr><td>Noir</td><td className="dp-market__down">−1,1</td></tr>
              <tr><td>Colisor</td><td className="dp-market__up">+0,8</td></tr>
            </tbody>
          </table>
        </div>

        {/* Obituário */}
        <div className="dp-obituary">
          <div className="dp-obituary__mark">†</div>
          <div className="dp-obituary__name">O Scroll Infinito</div>
          <div className="dp-obituary__dates">2010 — 2026</div>
          <p className="mt-2 text-xs" style={{ color: "var(--dp-ink-3)", fontStyle: "italic" }}>
            Descansa. A folha tem fim.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Cupão */}
        <div className="dp-coupon">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>Vale um token</p>
          <p className="mt-1 text-lg" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            Uma ideia grátis
          </p>
          <p className="dp-jump mt-2">continua na pág. 7</p>
        </div>

        {/* Citação de destaque + carimbo */}
        <div>
          <blockquote className="dp-pullquote">
            Nada aqui foi finalizado. É de propósito.
          </blockquote>
          <div className="mt-3 text-center">
            <span className="dp-stamp">Aprovado pela redação</span>
          </div>
        </div>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 03.1 · Sinalização em cor ══════════════ */
export function ArcaneSinalizacao() {
  return (
    <SubChapter
      id="sinalizacao"
      n="03.1"
      title="Metais e tintas de sinalização"
      lead="A folha ganhou dois metais (ouro e prata, para o brasão e os selos) e cinco tintas escuras — vermelho, azul, amarelo, verde — para marcar a editoria e a urgência. São tons fundos, dessaturados: a folha imprime, não acende. Cada um foi medido para AA sobre o papel."
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="dp-seal dp-seal--red">Alarme</span>
        <span className="dp-seal dp-seal--blue">Edital</span>
        <span className="dp-seal dp-seal--yellow">Aviso</span>
        <span className="dp-seal dp-seal--green">Campo</span>
        <span className="dp-seal dp-seal--gold">Ouro</span>
        <span className="dp-seal dp-seal--silver">Prata</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Folha>
          <div className="flex items-center gap-3">
            <span className="dp-medal dp-medal--gold" aria-hidden>★</span>
            <span className="dp-medal dp-medal--silver" aria-hidden>❦</span>
          </div>
          <Nota>Brasão cunhado — a única superfície onde o gradiente é lícito: metal reflete.</Nota>
        </Folha>

        <div className="dp-flag dp-flag--red">
          <p className="text-sm" style={{ color: "var(--dp-ink)" }}>
            Fio de edital na tinta da editoria. <code>.dp-flag--red</code>
          </p>
        </div>

        <div className="dp-flag dp-flag--green">
          <p className="text-sm" style={{ color: "var(--dp-ink)" }}>
            O mesmo fio, outro caderno. A cor diz a que secção pertence.
          </p>
        </div>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 07.1 · Runas & escrita mística ══════════════ */
export function ArcaneRunas() {
  return (
    <SubChapter
      id="runas"
      n="07.1"
      title="Runas dos anões e a escrita mística"
      lead="Duas escritas ancestrais entram como ornamento de tipógrafo — nunca como conteúdo que alguém precise de ler: o Fuþark rúnico (as runas nórdicas) e o Ogham celta, o alfabeto-árvore. Baixadas e servidas do próprio projeto, para carregarem em qualquer folha sem depender de fonte de sistema."
    >
      <div className="dp-runeband mb-5" aria-hidden>
        ᚨᚾᚠᛁᛏᚱᛁᚨᛟ · ᛞᚨᛁᛚᚤ · ᛈᚱᛟᛈᚺᛖᛏ · ᛗᚢᛚᛏᛁᚢᛖᚱᛋᛟ
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Runas · Fuþark
          </p>
          <p className="dp-runic text-3xl" aria-hidden>ᚱᚢᚾᚨᛋ ᛞᛟᛋ ᚨᚾᛟᛖᛋ</p>
          <Nota>Noto Sans Runic (OFL). Cerca cadernos e assina o brasão. Sempre com o latim ao lado.</Nota>
        </Folha>

        <Folha>
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Místico · Ogham
          </p>
          <p className="dp-elvish text-3xl" aria-hidden>ᚁᚂᚃᚄᚅᚆᚇᚈᚉ</p>
          <Nota>Noto Sans Ogham (OFL), no lugar da tengwar élfica — que não é Unicode nem tem licença redistribuível. Lê como escrita mística, e é honesto.</Nota>
        </Folha>

        <Folha className="sm:col-span-2">
          <p className="text-sm leading-relaxed" style={{ color: "var(--dp-ink)" }}>
            <span className="dp-glyph-cap text-4xl" aria-hidden>᚛</span>{" "}
            A capitular pode vir ladeada por um glifo ancestral — o ar de mistério
            sobre a folha séria, sem que o corpo do texto deixe de ser latim legível.
          </p>
        </Folha>
      </div>
    </SubChapter>
  )
}
