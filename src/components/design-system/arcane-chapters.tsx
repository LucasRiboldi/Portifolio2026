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
   ------------------------------------------------------------------ */

/** Superfície do realm: o CSS do Anfitrião é escopado em `.dp`. */
function Folha({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`dp overflow-hidden rounded-sm border-2 border-black p-5 ${className}`}
      style={{ background: "var(--dp-paper)", color: "var(--dp-ink)" }}
    >
      {children}
    </div>
  )
}

function Chapter({
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
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      {lead && <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/70">{lead}</p>}
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

export function ArcaneChapters() {
  return (
    <>
      {/* ---------- 01 ---------- */}
      <Chapter
        id="vozes"
        n="01"
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

      {/* ---------- 02 ---------- */}
      <Chapter
        id="colunas"
        n="02"
        title="A grade de colunas"
        lead={
          <>
            Duas coisas diferentes, e confundi-las quebra a página. A{" "}
            <strong>grade</strong> (<code className="text-[var(--sv-cyan)]">.dp-grid</code>) divide a
            folha em matéria e trilho. O <strong>corpo</strong> (
            <code className="text-[var(--sv-cyan)]">.dp-lead-body</code>) é ele próprio multi-coluna
            — de 2 a 4 colunas conforme a largura. Aninhar um dentro do outro produz colunas de uma
            palavra: o corpo já é o motor de colunas, precisa da medida cheia.
          </>
        }
      >
        <p className="mb-2 font-mono text-[10px] text-white/40">
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

        <p className="mb-2 mt-5 font-mono text-[10px] text-white/40">
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

      {/* ---------- 03 ---------- */}
      <Chapter
        id="manchete"
        n="03"
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
      </Chapter>

      {/* ---------- 04 ---------- */}
      <Chapter
        id="capitular"
        n="04"
        title="Capitular"
        lead={
          <>
            A letra que desce três linhas existe desde o manuscrito iluminado: marca onde o texto
            começa de verdade. Uma por matéria — duas e o olho não sabe mais onde entrar. Ela vive
            no início de <em>uma</em> coluna:{" "}
            <code className="text-[var(--sv-cyan)]">.dp-cap</code> usa float, e dentro de um bloco
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
      </Chapter>

      {/* ---------- 05 ---------- */}
      <Chapter
        id="filetes"
        n="05"
        title="Filetes"
        lead="O papel não tem sombra, não tem elevação, não tem card flutuante. Tem filete. As três espessuras são todo o sistema de separação da folha — e por isso cada uma significa algo diferente."
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
                .dp-rule--thick · fecha a página, sob o expediente
              </p>
            </div>
          </div>
        </Folha>
      </Chapter>

      {/* ---------- 06 ---------- */}
      <Chapter
        id="figura"
        n="06"
        title="Figura e legenda"
        lead="Foto de jornal antigo é retícula grossa, não fotografia: a chapa não conseguia meio-tom fino. A legenda nunca é opcional — imagem sem legenda, na folha, é imagem sem procedência."
      >
        <Folha>
          <figure className="dp-figure">
            <div
              className="art-tex-benday h-32 w-full border border-[var(--dp-rule)]"
              style={{ ["--tex-a" as string]: "rgba(28,23,16,0.55)", ["--tex-b" as string]: "rgba(28,23,16,0.3)" } as React.CSSProperties}
              aria-hidden
            />
            <figcaption className="dp-figcaption">
              A retícula do Ben-Day, ampliada: de perto são pontos, de longe é foto.
            </figcaption>
          </figure>
          <p className="mt-3 font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
            .dp-figure · .dp-figcaption · textura .art-tex-benday
          </p>
        </Folha>
      </Chapter>

      {/* ---------- 07 ---------- */}
      <Chapter
        id="caixas"
        n="07"
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
            <blockquote className="dp-pull">
              “Papel não anima. Se algo se mexe nesta folha, alguém errou.”
            </blockquote>
            <div className="dp-briefs mt-3">
              <p className="text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
                <strong>Breves.</strong> Notas curtas, empilhadas, separadas por filete fino.
              </p>
            </div>
          </Folha>
        </div>
      </Chapter>

      {/* ---------- 08 ---------- */}
      <Chapter
        id="classificados"
        n="08"
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
        <p className="mt-3 font-mono text-[10px] text-white/35">
          .dp-ad · .dp-ad-head · .dp-ad-sign · .dp-notice
        </p>
      </Chapter>

      {/* ---------- 09 ---------- */}
      <Chapter
        id="expediente"
        n="09"
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
      </Chapter>

      {/* ---------- 10 ---------- */}
      <Chapter
        id="tintas"
        n="10"
        title="As tintas sobre o papel"
        lead={
          <>
            Medido pela fórmula do WCAG 2 sobre os <strong>dois</strong> papéis, e é aí que está a
            armadilha: a folha tem duas superfícies. <code className="text-[var(--sv-cyan)]">--dp-ink-3</code>{" "}
            e <code className="text-[var(--sv-cyan)]">--dp-sepia</code> passam no papel claro e{" "}
            <strong>caem no escuro</strong> — escolher a tinta sem saber sobre qual papel vai
            imprimir é como aprovar contraste no Figma e reprovar no site. Já o{" "}
            <code className="text-[var(--sv-cyan)]">--dp-gold</code> reprova nos dois (2.94:1): é
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
      </Chapter>

      {/* ---------- 11 ---------- */}
      <Chapter
        id="silencio"
        n="11"
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
      </Chapter>
    </>
  )
}
