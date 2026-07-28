/* ------------------------------------------------------------------
   Matéria 09.15 — a camada de tokens do Anfitrião e os componentes do
   Prophet Wire, o agregador que abastece a primeira página.
   ------------------------------------------------------------------
   Por que esta matéria existe: a folha passou a viver sobre o layout
   original do Daily Prophet (`public/dporiginal`), e desse encontro
   nasceram peças que o catálogo não tinha — a linha de data, a barra de
   cadernos e a coluna de notícia automática. Documentá-las aqui é a regra
   da casa: o que se aplica na folha existe no guia, e quebra junto.

   As peças abaixo são as REAIS. Este arquivo importa o mesmo
   `anfitriao-wire.css` que /anfitriao importa e carrega as mesmas fontes
   pelo next/font — não há cópia nem captura de tela no meio.
   ------------------------------------------------------------------ */
import { Kreon, Vollkorn } from "next/font/google"

import "@/styles/anfitriao-tokens.css"
import "@/styles/anfitriao-newspaper.css"
import "@/styles/anfitriao-wire.css"

import { SubChapter, Folha, Nota } from "./arcane-chapters"
import { Classes } from "./arcane-ui-helpers"

/** As mesmas faces da folha, para o guia mostrar o tipo certo. */
const kreon = Kreon({ subsets: ["latin"], weight: ["700"], variable: "--font-kreon" })
const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-vollkorn",
})

/** Uma amostra de cor da paleta, com o valor legível ao lado. */
function Tinta({ token, nome, uso }: { token: string; nome: string; uso: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-7 w-7 shrink-0"
        style={{ background: `var(${token})`, border: "1px solid var(--anf-rule)" }}
      />
      <span className="min-w-0">
        <code className="block font-mono text-[11px]">{token}</code>
        <span className="block text-[11px]" style={{ color: "var(--dp-ink-3)" }}>
          {nome} · {uso}
        </span>
      </span>
    </div>
  )
}

export function ArcaneWire() {
  return (
    <SubChapter
      id="wire"
      n="09.15"
      title="Tokens, diagramação e a coluna do Wire"
      lead="A folha passou a viver sobre o layout original do Daily Prophet, e o encontro dos dois sistemas exigiu uma decisão em cada eixo: um papel, uma tinta, uma tríade de tipos. Esta matéria é o registro dessas decisões e das peças que nasceram delas — a linha de data, a barra de cadernos e a coluna de notícia que o agregador preenche sozinho."
    >
      <div className={`${kreon.variable} ${vollkorn.variable}`}>
        {/* ─── A decisão de paleta ─── */}
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A paleta única
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Tinta token="--anf-paper" nome="papel" uso="a folha" />
            <Tinta token="--anf-paper-2" nome="recuo" uso="caixas e quadros" />
            <Tinta token="--anf-ink" nome="tinta" uso="texto e título" />
            <Tinta token="--anf-ink-2" nome="tinta 2" uso="legenda e olho" />
            <Tinta token="--anf-ink-3" nome="tinta 3" uso="nota e rodapé" />
            <Tinta token="--anf-rule" nome="filete" uso="fios e molduras" />
            <Tinta token="--anf-accent" nome="ouro" uso="selo e realce" />
            <Tinta token="--anf-alarm" nome="alarme" uso="só carimbo de alerta" />
          </div>
          <Nota>
            Dois sistemas chegaram com paletas próprias: o original trazia papel quase branco
            (<code className="font-mono">#fff8ee</code>) e âmbar de destaque; o kit da casa, papel
            envelhecido e ouro. Venceu o envelhecido — sobre tela iluminada, o quase-branco lê
            como interface, não como papel — e o ouro, porque o âmbar acendia como adesivo
            fluorescente sobre o tom envelhecido. As duas metades da página passaram a usar
            estes mesmos oito valores.
          </Nota>
        </Folha>

        {/* ─── A decisão de tipo ─── */}
        <Folha className="mt-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A tríade tipográfica
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p style={{ fontFamily: "var(--anf-display)", fontSize: "1.6rem", lineHeight: 1.1 }}>
                Manchete
              </p>
              <Nota>
                <code className="font-mono">--anf-display</code> — Mugglenews. Só o logotipo e a
                manchete de primeira página. Nunca em texto corrido.
              </Nota>
            </div>
            <div>
              <p style={{ fontFamily: "var(--anf-head)", fontSize: "1.2rem", lineHeight: 1.15 }}>
                Título de matéria
              </p>
              <Nota>
                <code className="font-mono">--anf-head</code> — Kreon. Tudo que titula abaixo da
                manchete, inclusive chapéu e barra de cadernos.
              </Nota>
            </div>
            <div>
              <p style={{ fontFamily: "var(--anf-body)", fontSize: "0.95rem", lineHeight: 1.45 }}>
                Texto corrido da folha, composto em corpo legível e justificado na coluna.
              </p>
              <Nota>
                <code className="font-mono">--anf-body</code> — Vollkorn. Corpo, legenda,
                formulário. <code className="font-mono">--anf-poster</code> (Playbill) fica
                reservada ao classificado: no impresso ele saía de outra oficina, com o tipo que
                ela tinha na gaveta.
              </Nota>
            </div>
          </div>
          <Nota>
            Armadilha registrada: os tokens de tipo são declarados no <code className="font-mono">:root</code>{" "}
            pelos NOMES das famílias, e só promovidos às fontes do next/font dentro de{" "}
            <code className="font-mono">.newspaper</code>. Um <code className="font-mono">var()</code>{" "}
            irresolvível dentro de um custom property invalida o token inteiro e derruba a página
            para sans-serif — silenciosamente.
          </Nota>
        </Folha>

        {/* ─── A coluna de notícia ─── */}
        <Folha className="mt-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A coluna do Wire
          </p>

          <div className="dpx-wire-grid" style={{ gridTemplateColumns: "minmax(0,1fr)" }}>
            <article className="dpx-news">
              <p>
                <span className="dpx-news-kicker">Lançamentos</span>
              </p>
              <h3 className="dpx-news-head">Editora anuncia reimpressão esgotada há dois anos</h3>
              <p className="dpx-news-sub">
                A tiragem volta ao prelo depois de fila de espera em três continentes
              </p>
              <figure>
                <div className="dpx-news-plate" role="img" aria-label="Campo de gravura à espera de arte" />
                <figcaption>Fig. — A gravura vazia, quando não há arte.</figcaption>
              </figure>
              <p className="dpx-news-body">
                <span className="dpx-news-cap">A</span>
                folha compõe a notícia do agregador na mesma coluna do impresso: chapéu que
                classifica, título que chama, olho que explica, corpo justificado e o crédito da
                fonte ao pé, porque matéria de telégrafo se credita.
              </p>
              <p className="dpx-news-note">Nota do expedidor.</p>
              <a className="dpx-news-source" href="#0">
                Fonte ↗
              </a>
            </article>
          </div>

          <Classes>
            .dpx-news — a coluna, com filete à esquerda que some no primeiro item e vira filete
            superior no celular · .dpx-news-kicker — chapéu em tinta cheia com papel por cima ·
            .dpx-news-head — título em Kreon, entrelinha fechada · .dpx-news-sub — olho em
            itálico, tinta 2 · .dpx-news-plate — gravura vazia, hachura a 45° e proporção 3:2 ·
            .dpx-news-body — corpo justificado com hifenização · .dpx-news-cap — capitular
            flutuada · .dpx-news-source — crédito da fonte, com realce de foco em ouro
          </Classes>

          <Nota>
            A gravura vazia não é um buraco à espera de imagem: é peça de impresso. A cascata de
            arte tenta a imagem da fonte, depois a busca, depois a foto padrão da categoria — e só
            então desenha a hachura. Quando cai na foto padrão, a legenda passa a dizer{" "}
            <em>imagem ilustrativa</em>, porque foto de arquivo não pode se apresentar como
            registro do fato.
          </Nota>
        </Folha>

        {/* ─── A estrutura: faixa, zona, peça ─── */}
        <Folha className="mt-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Faixa, zona e peça — a diagramação
          </p>

          <div style={{ background: "var(--anf-paper)", padding: "var(--anf-space-4)" }}>
            <section className="dpx-band" style={{ marginBottom: 0 }}>
              <header className="dpx-band-head">
                <h4 className="dpx-band-title">Nome da editoria</h4>
                <p className="dpx-band-sub">A linha de apoio da faixa</p>
              </header>

              <div className="dpx-zone dpx-zone--3">
                <div>
                  <div className="dpx-box">
                    <p className="dpx-box-title">Quadro</p>
                    <p className="dpx-text">
                      A peça cercada por fio, sobre o papel de recuo. Não define margem externa:
                      quem espaça é a faixa.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="dpx-ad">
                    <p className="dpx-ad-head">Classificado</p>
                    <p className="dpx-ad-body">
                      A única peça com face de cartaz — no impresso saía de outra oficina.
                    </p>
                    <p className="dpx-ad-sign">Assinatura do anunciante</p>
                  </div>
                </div>
                <div>
                  <p className="dpx-kv">
                    <b>Par chave/valor</b>
                    <span>XII</span>
                  </p>
                  <p className="dpx-kv">
                    <b>Algarismo tabular</b>
                    <span>CDXVII</span>
                  </p>
                  <p className="dpx-term">
                    <b>Verbete</b> — <em>termo e definição</em>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <Classes>
            .dpx-band — a faixa: largura inteira da folha, de fio a fio · .dpx-band-head /
            .dpx-band-title / .dpx-band-sub — o cabeçalho de editoria entre fios duplos ·
            .dpx-zone--2 / --3 / --4 — a subdivisão interna, com filete entre colunas ·
            .dpx-box, .dpx-ad, .dpx-table, .dpx-kv, .dpx-term, .dpx-list — as peças
          </Classes>

          <Nota>
            A regra que faz o alinhamento fechar: <b>nenhuma peça define margem externa
            própria</b> — quem espaça é a faixa, sempre pela escala{" "}
            <code className="font-mono">--anf-space-*</code>. Foi assim que a folha deixou de ter
            duas metades: antes o caderno da oficina era um bloco com grelha e vocabulário
            próprios, encaixado no meio como encarte de outra gráfica.
          </Nota>
        </Folha>

        {/* ─── O efeito de letra ─── */}
        <Folha className="mt-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O erro de registro
          </p>

          <div style={{ background: "var(--anf-paper)", padding: "var(--anf-space-4)" }}>
            <p
              className="dpx-misregister"
              style={{ fontFamily: "var(--anf-head)", fontSize: "2.4rem", margin: 0, color: "var(--anf-ink)" }}
            >
              27 °C
            </p>
            <p
              className="dpx-misregister--ink"
              style={{ fontFamily: "var(--anf-head)", fontSize: "2.4rem", margin: 0, color: "var(--anf-ink)" }}
            >
              XII
            </p>
          </div>

          <Classes>
            .dpx-misregister — deslocamento em ouro · .dpx-misregister--ink — em tinta fraca ·
            .dpx-misregister--cold — no único tom frio do sistema
          </Classes>

          <Nota>
            Herdado do original, que assina assim os algarismos grandes do quadro de clima:{" "}
            <code className="font-mono">text-shadow: 3px 0 0</code>, deslocamento horizontal e{" "}
            <b>sem desfoque</b>. Não é sombra — é a chapa de cor saindo fora de registro, defeito
            clássico da rotativa. Regra de uso: <b>só em tipo grande</b>; em corpo pequeno o
            deslocamento não lê como impressão, lê como texto borrado.
          </Nota>
        </Folha>

        {/* ─── Linha de data e cadernos ─── */}
        <Folha className="mt-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Linha de data e barra de cadernos
          </p>

          <div className="dpx-dateline">
            <span>Vol. XXVI — Nº 1</span>
            <span>Terça-feira, 28 de julho de 2026</span>
            <span className="dpx-dateline-price">Preço: Três Pence</span>
          </div>

          <nav className="dpx-sections" aria-label="Exemplo de cadernos">
            <a href="#0">Reviews</a>
            <span aria-hidden>❦</span>
            <a href="#0">Outras Edições</a>
          </nav>

          <Classes>
            .dpx-dateline — volume, data e preço entre dois fios · .dpx-dateline-price — o grupo
            do preço, que abriga a troca de multiverso · .dpx-sections — cadernos em versalete
            espaçado, separados por fleurão
          </Classes>

          <Nota>
            Ambas declaram <code className="font-mono">grid-column: 1 / -1</code>. O{" "}
            <code className="font-mono">.newspaper</code> do original é uma grelha de seis colunas
            e posiciona cada seção explicitamente; sem essa declaração, peças novas eram
            auto-posicionadas em duas colunas e apareciam espremidas a um terço da largura.
          </Nota>
        </Folha>
      </div>
    </SubChapter>
  )
}
