/* ------------------------------------------------------------------
   Cadernos de tipografia da folha "O Anfitrião" — extraídos de
   arcane-chapters.tsx para manter cada arquivo sob 500 linhas.
   Reúne o capítulo 04 (As quatro vozes) e suas duas matérias, 04.1
   (a manchete) e 04.2 (a capitular). Reusa Chapter/SubChapter/Folha
   das primitivas em ./arcane-chapters — mesmos tokens .dp.
   ------------------------------------------------------------------ */
import { Chapter, SubChapter, Folha } from "./arcane-chapters"

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
