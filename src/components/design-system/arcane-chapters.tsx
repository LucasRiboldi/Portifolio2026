/* ------------------------------------------------------------------
   O corpo do style guide do perfil "O Anfitrião".
   ------------------------------------------------------------------
   Nem revista nem editor: uma folha impressa. O Criativo fala em capa,
   painel e onomatopeia; o _Dev em sintaxe, prompt e diff; aqui fala-se em
   coluna, filete, capitular, expediente e classificado.

   A diferença mais funda não é de estilo, é de física: as duas outras
   interfaces são luz, esta finge ser papel. Papel não anima, não tem
   sombra difusa, não tem hover — e o guia respeita isso em vez de
   contrabandear gestos de tela para dentro da folha.

   Tudo usa as classes e tokens reais de `daily-prophet.css`, no escopo
   `.dp`. Se uma delas quebrar, quebra aqui.

   ------------------------------------------------------------------
   NUMERAÇÃO — leia antes de acrescentar capítulo.
   ------------------------------------------------------------------
   Cada capítulo é exportado sozinho e recebe o número de
   `src/design-system/architecture.ts`, que é a fonte única. Antes este
   arquivo rodava uma sequência própria 01–11 que colidia com a canônica em
   nove pontos: existiam dois "№ 02", dois "№ 03", dois "№ 05" e três
   "№ 09" na mesma página, e a sidebar apontava "04 Typography" para um
   título que dizia "№ 01".

   Um capítulo que aprofunda uma seção canônica é uma MATÉRIA dentro do
   caderno: usa <SubChapter> e o número herdado (04 → 04.1), e precisa estar
   declarado em `subs` da seção-mãe para aparecer no índice. Quem compõe a
   ordem na página é `arcane-guide.tsx`.
   ------------------------------------------------------------------ */

/**
 * Uma caixa dentro da folha — o "boxed item" do jornal: anúncio, quadro,
 * exemplo cercado por fio. Fundo `--dp-paper-2` (o tom de recuo) para se
 * destacar da folha sem virar outra cor. Exportada: as seções de fundação
 * (arcane-foundations) usam a mesma caixa.
 */
export function Folha({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden border border-[var(--dp-rule)] p-5 ${className}`}
      style={{ background: "var(--dp-paper-2)", color: "var(--dp-ink)" }}
    >
      {children}
    </div>
  )
}

/**
 * Cabeçalho de seção no ritmo do jornal: fio grosso, o número como fólio e o
 * título em slab (`--dp-head`). Nada de magenta nem branco — a folha inteira é
 * tinta sobre papel. Exportada para arcane-foundations usar o mesmo compasso.
 */
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
    <section id={id} aria-label={`${n} · ${title}`} className="mt-14 scroll-mt-24">
      <div className="dp-rule dp-rule--thick" />
      <p
        className="mb-3 mt-2 flex items-baseline gap-3 text-2xl uppercase leading-none"
        style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}
      >
        <span className="text-base" style={{ color: "var(--dp-sepia)" }}>
          №&nbsp;{n}
        </span>
        {title}
      </p>
      {lead && (
        <p
          className="mb-5 max-w-3xl text-sm leading-relaxed"
          style={{ color: "var(--dp-ink-2)", fontFamily: "var(--dp-body)" }}
        >
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}

/**
 * Rótulo de apoio no tom da folha — o "quando usar" ao pé de uma peça.
 *
 * Exportada daqui porque `arcane-index-chapters`, `arcane-extras` e
 * `arcane-components` definiam cada um a sua cópia idêntica. Três definições
 * da mesma coisa, num guia cujo tema é justamente não ter duas fontes.
 */
export function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
      {children}
    </p>
  )
}

/**
 * Uma matéria dentro do caderno — o segundo nível do índice.
 *
 * A hierarquia não é inventada para este componente: ela usa o próprio
 * sistema de fios que o guia documenta na seção 02. O caderno abre com
 * `.dp-rule--thick` ("abre cada caderno"); a matéria abre com `.dp-rule`
 * ("separa matérias"). O guia passa a obedecer a regra que ele mesmo ensina,
 * em vez de descrevê-la e usar outra coisa.
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
    <section id={id} aria-label={`${n} · ${title}`} className="mt-9 scroll-mt-24">
      <div className="dp-rule" />
      <p
        className="mb-2 mt-2 flex items-baseline gap-2.5 text-lg uppercase leading-none"
        style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}
      >
        <span className="text-[11px]" style={{ color: "var(--dp-sepia)" }}>
          №&nbsp;{n}
        </span>
        {title}
      </p>
      {lead && (
        <p
          className="mb-4 max-w-3xl text-[13px] leading-relaxed"
          style={{ color: "var(--dp-ink-2)", fontFamily: "var(--dp-body)" }}
        >
          {lead}
        </p>
      )}
      {children}
    </section>
  )
}

/**
 * As vozes não são "fontes bonitas": são tecnologias de impressão de épocas
 * distintas, e a hierarquia da página é a própria linha do tempo.
 *
 * `--dp-black` está aqui com uma ressalva honesta em vez de um elogio: o
 * token promete UnifrakturCook, mas nenhum @font-face dessa face existe em
 * fonts-arcane.css — na prática ele resolve em Georgia. Um guia que mostrasse
 * "blackletter" ao lado de uma serifa comum estaria mentindo sobre o próprio
 * sistema. Ficou registrado como lacuna.
 */
const VOZES = [
  {
    token: "--dp-wood",
    familia: "Tipo de madeira · Headline One/Two",
    epoca: "séc. XIX · cartazes",
    papel: "O nameplate e a manchete que grita. Talhada em madeira porque metal daquele corpo rachava.",
    amostra: "EDIÇÃO EXTRA",
    css: "font-family: var(--dp-wood)",
    lacuna: false,
  },
  {
    token: "--dp-head",
    familia: "Slab / Clarendon",
    epoca: "séc. XIX · anúncios",
    papel: "Títulos de matéria e cabeçalhos de caixa. Serifa quadrada, aguenta tinta pesada.",
    amostra: "Ministério nega tudo",
    css: "font-family: var(--dp-head)",
    lacuna: false,
  },
  {
    token: "--dp-body",
    familia: "Old Style",
    epoca: "séc. XVIII · livro",
    papel: "O corpo do texto. Feita para ser lida em coluna estreita, não para ser notada.",
    amostra: "Corpo de texto em coluna estreita, com entrelinha curta.",
    css: "font-family: var(--dp-body)",
    lacuna: false,
  },
  {
    token: "--dp-black",
    familia: "Blackletter — prometida, não servida",
    epoca: "séc. XV · tipos móveis",
    papel:
      "Subtítulo do nameplate. O token declara UnifrakturCook, mas o projeto não serve essa face: cai em Georgia. A amostra abaixo é o que você realmente vê — não o que o token promete.",
    amostra: "The Daily Prophet",
    css: "font-family: var(--dp-black)",
    lacuna: true,
  },
]

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

/* ══════════════ 02.1 · FILETES (matéria de Foundations) ══════════════ */
export function ArcaneFiletes() {
  return (
    <SubChapter
      id="filetes"
      n="02.1"
      title="Filetes"
      lead="O papel não tem sombra, não tem elevação, não tem card flutuante. Tem filete. As quatro espessuras são todo o sistema de separação da folha — e por isso cada uma significa algo diferente. Esta página obedece à regra: o caderno abre com fio grosso, a matéria com fio médio."
    >
      <Folha>
        <div className="space-y-4">
          <div>
            <div className="dp-rule dp-rule--hair" />
            <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
              .dp-rule--hair · separa itens dentro de um bloco
            </p>
          </div>
          <div>
            <div className="dp-rule" />
            <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
              .dp-rule · separa matérias
            </p>
          </div>
          <div>
            <div className="dp-rule dp-rule--double" />
            <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
              .dp-rule--double · separa seções do jornal
            </p>
          </div>
          <div>
            <div className="dp-rule dp-rule--thick" />
            <p className="mt-1 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
              .dp-rule--thick · abre cada caderno
            </p>
          </div>
        </div>
      </Folha>
    </SubChapter>
  )
}

/* ══════════════ 04 · TYPOGRAPHY ══════════════ */
export function ArcaneTypography() {
  return (
    <Chapter
      id="typography"
      n="04"
      title="As quatro vozes"
      lead={
        <>
          A tipografia deste realm não é um cardápio de fontes bonitas: é uma linha do tempo da
          própria impressão. O tipo de madeira existe porque metal daquele corpo rachava; a slab
          foi feita para aguentar tinta pesada em cartaz; a old style, para desaparecer sob a
          leitura. Cada uma ocupa o degrau da hierarquia que a sua tecnologia justificava — a
          página é cronologia, não gosto.
        </>
      }
    >
      <div className="space-y-3">
        {VOZES.map((v) => (
          <Folha key={v.token}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--dp-rule)] pb-2">
              <span style={{ fontFamily: `var(${v.token})` }} className="text-2xl leading-tight">
                {v.amostra}
              </span>
              <code className="font-mono text-[10px]" style={{ color: "var(--dp-ink-2)" }}>
                {v.css}
              </code>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
              {v.familia} · {v.epoca}
            </p>
            <p className="mt-1 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              {v.papel}
            </p>
            {v.lacuna && (
              <p
                className="mt-2 border-t border-dashed pt-2 text-[10px] uppercase tracking-wide"
                style={{ borderColor: "var(--dp-ink-3)", color: "#a33" }}
              >
                ⚠ Lacuna conhecida — face ausente em fonts-arcane.css
              </p>
            )}
          </Folha>
        ))}
      </div>
    </Chapter>
  )
}

/* ══════════════ 04.1 · A MANCHETE ══════════════ */
export function ArcaneManchete() {
  return (
    <SubChapter
      id="manchete"
      n="04.1"
      title="Hierarquia da manchete"
      lead="Cinco peças, nesta ordem, sempre: chapéu, manchete, olho, linha de crédito e data. É a gramática que permite ler a página em três segundos e decidir se vale os três minutos."
    >
      <Folha>
        <p className="dp-kicker">Exclusivo · Terra-2026</p>
        <h3 className="dp-bighead">Design system é achado em edição rara</h3>
        <p className="dp-subhead mt-1">
          Três universos convivem sob o mesmo teto; especialistas divergem
        </p>
        <p className="dp-byline mt-2">Por L. Riboldi</p>
        <p className="dp-dateline">Porto Alegre, 17 de julho de 2026</p>
        <p className="dp-lead-body mt-3 text-xs">
          O chapéu classifica, a manchete afirma, o olho qualifica, o crédito responsabiliza e a
          data situa. Retire qualquer um e a folha perde uma função inteira.
        </p>
        <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
          .dp-kicker · .dp-bighead · .dp-subhead · .dp-byline · .dp-dateline
        </p>
      </Folha>
    </SubChapter>
  )
}

/* ══════════════ 04.2 · CAPITULAR ══════════════ */
export function ArcaneCapitular() {
  return (
    <SubChapter
      id="capitular"
      n="04.2"
      title="Capitular"
      lead={
        <>
          A letra que desce três linhas existe desde o manuscrito iluminado: marca onde o texto
          começa de verdade. Uma por matéria — duas e o olho não sabe mais onde entrar. Ela vive
          no início de <em>uma</em> coluna:{" "}
          <code className="text-[var(--dp-sepia)]">.dp-cap</code> usa float, e dentro de um bloco
          multi-coluna o float ancora na coluna errada, separando a capitular da própria palavra.
          Por isso a demo abaixo é de coluna única — que é onde ela pertence.
        </>
      }
    >
      <Folha>
        <div className="max-w-md">
          <p style={{ fontFamily: "var(--dp-body)" }} className="text-sm leading-snug">
            <span className="dp-cap">N</span>
            este realm o movimento é quase inexistente, e isso é uma escolha, não uma limitação. A
            capitular ancora o olho no início da coluna e não se repete: ela é o único ponto de
            entrada. O resto do parágrafo desce em medida estreita, com a entrelinha curta que a
            old style pede, até encontrar o filete.
          </p>
        </div>
      </Folha>
    </SubChapter>
  )
}

/* ══════════════ 06 · GRID ══════════════ */
export function ArcaneGrid() {
  return (
    <Chapter
      id="grid"
      n="06"
      title="A grade de colunas"
      lead={
        <>
          Duas coisas diferentes, e confundi-las quebra a página. A{" "}
          <strong>grade</strong> (<code className="text-[var(--dp-sepia)]">.dp-grid</code>) divide a
          folha em matéria e trilho. O <strong>corpo</strong> (
          <code className="text-[var(--dp-sepia)]">.dp-lead-body</code>) é ele próprio multi-coluna
          — de 2 a 4 colunas conforme a largura. Aninhar um dentro do outro produz colunas de uma
          palavra: o corpo já é o motor de colunas, precisa da medida cheia.
        </>
      }
    >
      <p className="mb-2 font-mono text-[10px] text-[var(--dp-ink-3)]">
        .dp-lead-body — o corpo em medida cheia, fluindo em colunas reais
      </p>
      <Folha>
        <p className="dp-kicker">Ministério</p>
        <h3 className="dp-subhead mb-2">A coluna corre</h3>
        <p className="dp-lead-body">
          O corpo desce em medida estreita, com entrelinha curta e alinhamento justificado. Cada
          coluna é uma unidade de leitura, não uma caixa de layout — e é isso que torna a old
          style legível: ela foi desenhada para linhas curtas. Quando a matéria não cabe, salta
          para a coluna seguinte; nunca encolhe a fonte. O papel tem tamanho fixo, e o que sobra
          vai para a página interna. A rotativa impunha essa disciplina; aqui ela é escolha, mas a
          razão continua a mesma.
        </p>
      </Folha>

      <p className="mb-2 mt-5 font-mono text-[10px] text-[var(--dp-ink-3)]">
        .dp-grid · .dp-col--rail — a grade da página: matéria e trilho
      </p>
      <Folha>
        <div className="dp-grid">
          <div className="dp-col">
            <p className="dp-kicker">Matéria</p>
            <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              A coluna larga recebe a matéria. Aqui o texto é simples: quem faz colunas é o
              corpo, não a grade.
            </p>
          </div>
          <div className="dp-col dp-col--rail">
            <p className="dp-box-title">No trilho</p>
            <p className="text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              Índice, breves e classificados. O que não é matéria vive à margem, separado por
              filete.
            </p>
          </div>
        </div>
      </Folha>
    </Chapter>
  )
}

/* ══════════════ 08.1 · O SILÊNCIO (matéria de Motion) ══════════════ */
export function ArcaneSilencio() {
  return (
    <SubChapter
      id="silencio"
      n="08.1"
      title="O silêncio"
      lead="Este é o capítulo mais curto de todos os três guias, e de propósito. As outras duas interfaces são luz: podem saltar, piscar, seguir o ponteiro. Esta finge ser papel — e papel está parado sobre a mesa. Não há hover que levante, não há parallax, não há spring. O único gesto permitido é o filete que se revela sob um link, e mesmo esse existe porque um link precisa se anunciar como link."
    >
      <Folha>
        <p className="text-xs" style={{ color: "var(--dp-ink-2)" }}>
          Regra prática: se você precisou de <code className="font-mono">transition</code> para
          algo além de cor de link, provavelmente está escrevendo no realm errado.
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--dp-ink-2)" }}>
          A única exceção é o <em>ink settle</em> — a tinta assentando letra a letra no masthead,
          que existe para dizer “esta folha acabou de sair da prensa”. Ver o registro de motion
          acima: dos quatro gestos deste realm, dois são “imóvel”.
        </p>
      </Folha>
    </SubChapter>
  )
}

/* A matéria 09.1 (a gravura) vivia aqui e mudou-se para arcane-components.tsx.
   Ela mostrava a figura com `art-tex-benday` — uma textura do CRIATIVO, não
   da folha — enquanto o realm tem a peça própria e melhor: `.dp-plate` +
   `.dp-plate-inner`, com retícula e entintagem de verdade. O capítulo que
   deveria exibir a chapa da casa exibia emprestado do universo vizinho. */

/* ══════════════ 09.2 · CAIXAS, OLHO E BREVES ══════════════ */
export function ArcaneCaixas() {
  return (
    <SubChapter
      id="caixas"
      n="09.2"
      title="Caixas, olho e breves"
      lead="Quando algo precisa sair do fluxo da coluna, a folha não levanta um card — ela cerca com filete. O olho (pull quote) rouba uma frase da matéria; os breves empilham o que não merece manchete."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Folha>
          <div className="dp-box">
            <p className="dp-box-title">Caixa</p>
            <p className="text-xs" style={{ color: "var(--dp-ink-2)" }}>
              Conteúdo cercado por filete, fora do fluxo da coluna.
            </p>
          </div>
          <div className="dp-box dp-box--heavy mt-3">
            <p className="dp-box-title">Caixa pesada</p>
            <p className="text-xs" style={{ color: "var(--dp-ink-2)" }}>
              Para aviso oficial — o filete grosso é a voz do Ministério.
            </p>
          </div>
        </Folha>
        <Folha>
          {/* Sem aspas no texto: `.dp-pull` já as injeta por ::before/::after.
              Escrevê-las aqui rendia ““assim””, duplicado na tela. */}
          <blockquote className="dp-pull">
            Papel não anima. Se algo se mexe nesta folha, alguém errou.
          </blockquote>
          <Nota>
            O texto do olho entra <strong>sem</strong> aspas — a peça as compõe sozinha, na tinta e
            no corpo certos.
          </Nota>
          <div className="dp-briefs mt-3">
            <p className="text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              <strong>Breves.</strong> Notas curtas, empilhadas, separadas por filete fino.
            </p>
          </div>
        </Folha>
      </div>
    </SubChapter>
  )
}

/* ══════════════ 09.3 · CLASSIFICADOS ══════════════ */
export function ArcaneClassificados() {
  return (
    <SubChapter
      id="classificados"
      n="09.3"
      title="Classificados"
      lead="O anúncio é parte da folha, não intruso: tem a mesma tinta, o mesmo filete e a mesma tipografia. O que o distingue é a assinatura ao pé — quem paga, assina."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Folha>
          <div className="dp-ad">
            <p className="dp-ad-head">Vassouras Nimbus</p>
            <p className="text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              Modelo 2026. Cabo de freixo, cerdas alinhadas à mão. Entrega em toda a Terra-2026.
            </p>
            <p className="dp-ad-sign">— Qualidade Quality Quidditch</p>
          </div>
        </Folha>
        <Folha>
          <div className="dp-notice">
            <p className="dp-box-title">Aviso</p>
            <p className="text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              Comunicado oficial ocupa medida cheia e dispensa manchete: quem precisa gritar não
              tem autoridade.
            </p>
          </div>
        </Folha>
      </div>
      <p className="mt-3 font-mono text-[10px] text-[var(--dp-ink-3)]">
        .dp-ad · .dp-ad-head · .dp-ad-sign · .dp-notice
      </p>
    </SubChapter>
  )
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

/* ══════════════ 17.2 · EXPEDIENTE (matéria de Seções de página) ══════════════ */
export function ArcaneExpediente() {
  return (
    <SubChapter
      id="expediente"
      n="17.2"
      title="Expediente, fólio e índice"
      lead="O rodapé de um jornal não é rodapé: é o expediente — quem imprime, onde, em que edição. É também, neste site, onde vive o acesso administrativo, embutido no nome da tipografia (ver PressMark). Nada de botão flutuante: quebraria a folha."
    >
      <Folha>
        <div className="dp-index">
          {[
            ["Manchete", "1"],
            ["Mecânicas", "4"],
            ["Oficina", "7"],
            ["Classificados", "12"],
          ].map(([sec, pag]) => (
            <p key={sec} className="dp-index-item">
              <span>{sec}</span>
              <span className="dp-index-dots" />
              <span>{pag}</span>
            </p>
          ))}
        </div>

        <div className="dp-rule dp-rule--thick my-4" />

        <p className="dp-colophon">
          Composto em Iowan Old Style e Playbill · Impresso na Terra-2026 · Edição #1
        </p>
        <p className="dp-folio mt-1">— 1 —</p>
        <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
          .dp-index · .dp-index-dots · .dp-colophon · .dp-folio
        </p>
      </Folha>
    </SubChapter>
  )
}
