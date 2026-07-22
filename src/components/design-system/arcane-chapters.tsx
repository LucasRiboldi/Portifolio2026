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

/* As quatro vozes (04) e suas matérias 04.1/04.2 mudaram-se para
   arcane-typography.tsx; a tabela de contraste e o caderno 12 inteiro, para
   arcane-accessibility.tsx. Aqui ficam as primitivas e os capítulos curtos. */

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
