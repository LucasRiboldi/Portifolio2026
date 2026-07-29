/**
 * Tokens de diagramação da HQ — o vocabulário de `ComicPage › Chapter › Panel`.
 *
 * Fica no design system (e não junto dos componentes) porque é contrato: as
 * zonas, o guia do DS e qualquer capítulo futuro descrevem a sua página com
 * estes tipos. O CSS que os desenha está em `styles/comic-layout.css`.
 */

/**
 * As dimensões da landing — um capítulo cada, com paleta própria em
 * `comic-2026.css`. Vive aqui e não no componente porque é o que liga a copy
 * (`constants/criativo-landing`) à paleta e à âncora da URL.
 */
export type ChapterId =
  | "multiverso"
  | "atelie"
  | "oficina"
  | "banca"
  | "cine"
  | "radio"
  | "videoteca"
  | "mural"
  | "tirinhas"

/** Formatos de requadro. Uma página só de retângulos não lê como quadrinho. */
export type PanelShape =
  | "rect"
  | "cutTR"
  | "cutBR"
  | "cutBL"
  | "octagon"
  | "wedge"
  | "torn"
  | "tiltL"
  | "tiltR"

/**
 * Largura (e altura) do quadro na grelha editorial.
 *
 * A grelha tem 4 colunas no telemóvel, 8 no tablet e 12 no desktop — os três
 * valores são divisíveis por 4, então um mesmo ritmo (1/2, 1/3, 1/4) sobrevive
 * a todos os ecrãs. `rows` só surte efeito em grelhas `withRows`.
 */
export interface PanelSpan {
  /** Colunas ocupadas até 640px (grelha de 4). Omisso: largura total. */
  base?: number
  /** Colunas ocupadas de 640px a 1024px (grelha de 8). */
  sm?: number
  /** Colunas ocupadas a partir de 1024px (grelha de 12). */
  lg?: number
  /** Linhas ocupadas a partir de 1024px — o quadro "vertical". */
  rows?: number
  /** Linhas ocupadas no telemóvel, se o quadro também deve ser alto lá. */
  rowsBase?: number
}

/** Traduz o span para as custom properties lidas por `.cp-col`. */
export function spanVars(span?: PanelSpan): React.CSSProperties {
  if (!span) return {}
  const v: Record<string, string> = {}
  if (span.base != null) v["--cp-span-b"] = String(span.base)
  if (span.sm != null) v["--cp-span-s"] = String(span.sm)
  if (span.lg != null) v["--cp-span-l"] = String(span.lg)
  if (span.rows != null) v["--cp-row-l"] = String(span.rows)
  if (span.rowsBase != null) v["--cp-row-b"] = String(span.rowsBase)
  return v as React.CSSProperties
}

/**
 * Medidas prontas, para as zonas não reinventarem frações.
 *
 * Nomes editoriais (e não `col-6`) porque a decisão que se toma ao diagramar é
 * "isto é uma tira ou um destaque?", não "isto tem seis colunas".
 */
export const SPAN = {
  /** Página inteira — splash page. */
  full: { base: 4, sm: 8, lg: 12 },
  /** Duas colunas de leitura. */
  half: { base: 4, sm: 4, lg: 6 },
  /** Um terço — o ritmo padrão de galeria. */
  third: { base: 4, sm: 4, lg: 4 },
  /** Um quarto — tiras de pôsteres e miniaturas. */
  quarter: { base: 2, sm: 2, lg: 3 },
  /** Destaque largo: dois terços da mancha. */
  wide: { base: 4, sm: 8, lg: 8 },
  /** Coluna estreita ao lado de um destaque. */
  rail: { base: 4, sm: 4, lg: 4 },
  /**
   * Quadro vertical: estreito e alto. Ocupa a largura toda no telemóvel — a
   * meia coluna dá 170px, e texto corrido nessa medida parte em três palavras
   * por linha. O "vertical" é uma decisão de desktop.
   */
  tall: { base: 4, sm: 4, lg: 4, rows: 2 },
  /** Quadro-cartaz: alto e com meia largura. */
  poster: { base: 4, sm: 4, lg: 6, rows: 2 },
} as const satisfies Record<string, PanelSpan>

/**
 * Ritmo de diagramação por índice.
 *
 * Recebe a posição do item e devolve largura e formato, para que uma lista
 * uniforme vinda do banco saia da grelha com o desalinho de uma página montada
 * à mão.
 *
 * O ciclo tem 5 passos e as larguras somam 8+4 e 4+4+4 — dois pares de linhas
 * que fecham as 12 colunas exatamente. Um ciclo que não fecha deixa uma coluna
 * órfã no fim de cada volta, e o buraco branco lê-se como erro, não como
 * diagramação. A variação vem do formato do requadro (e do quadro vertical no
 * passo 2), não de larguras que não encaixam.
 */
export function beat(i: number): { span: PanelSpan; shape: PanelShape } {
  switch (i % 5) {
    case 0:
      return { span: SPAN.wide, shape: "cutTR" }
    case 1:
      return { span: SPAN.third, shape: "rect" }
    case 2:
      return { span: SPAN.tall, shape: "cutBL" }
    case 3:
      return { span: SPAN.third, shape: "octagon" }
    default:
      return { span: SPAN.third, shape: "tiltR" }
  }
}

/* ══════════════════════════════════════════════════════════════
   A PÁGINA MONTADA — diagramação que conhece o número de quadros
   ══════════════════════════════════════════════════════════════

   O PROBLEMA QUE ISTO RESOLVE

   `beat(i)` decide a largura de um quadro olhando só para a posição dele.
   Funciona enquanto o total for múltiplo do ciclo; deixa de funcionar no
   resto do tempo — e medido na página, era o resto do tempo:

     ateliê     6 quadros → última tira ocupa 66% da largura
     cine       4 quadros → 24%
     tirinhas   3 quadros → 49%
     videoteca  1 quadro  → 49%
     oficina    2 quadros → 41%

   Sete das oito páginas terminavam num vazio irregular à direita. Numa página
   de quadrinhos isso não acontece, e não por rigor de grelha: a TIRA é a
   unidade de leitura, e uma tira que não fecha deixa o olho suspenso a meio
   caminho, sem saber se desce ou se ainda falta alguma coisa ali. O letrista
   ajusta a largura dos quadros ao número deles — quatro quadros numa tira são
   estreitos, dois são largos, um sozinho vira splash.

   É o que esta função faz: recebe QUANTOS quadros a página tem e devolve a
   diagramação inteira, com todas as tiras fechando as 12 colunas.

   O vazio deixa de ser resto e passa a ser decisão: onde a página quiser
   respirar, é a tira `[8,4]` que abre o espaço — intencional, ancorado, com
   o quadro estreito a segurar a margem.
   ══════════════════════════════════════════════════════════════ */

/**
 * As tiras possíveis, por número de quadros. Cada arranjo soma 12.
 *
 * Duas opções por tamanho, para que páginas vizinhas não saiam com o mesmo
 * desenho: a escolha alterna com o índice da tira. Vocabulário de HQ e não de
 * grelha — `[8,4]` é "destaque com nota ao lado", `[4,4,4]` é "tira de três".
 */
const TIRAS: Record<number, readonly (readonly number[])[]> = {
  1: [[12]],
  2: [
    [8, 4],
    [4, 8],
  ],
  3: [
    [4, 4, 4],
    [6, 3, 3],
  ],
  4: [[3, 3, 3, 3]],
}

/**
 * Quantos quadros por tira, para um total.
 *
 * A preferência é 3 → 2 → 4: a tira de três é o ritmo base de página, a de
 * dois abre respiro, a de quatro adensa. O resto nunca fica em 1 por acidente
 * — mas um total de 1 vira `[12]` de propósito, que é a splash page e a
 * resposta editorial certa para uma dimensão com uma peça só.
 */
function tiras(total: number): number[] {
  if (total <= 0) return []
  if (total <= 4) return [total]

  const out: number[] = []
  let resto = total
  let i = 0

  while (resto > 0) {
    if (resto <= 4) {
      out.push(resto)
      break
    }
    // Evita deixar para trás um resto de 1 quando ainda há tira a compor: um
    // quadro solto no meio da página lê-se como falha, não como splash.
    //
    // O ajuste tem de continuar dentro do vocabulário (1 a 4 quadros por
    // tira): somar 1 a uma tira de quatro pediria uma tira de cinco, que não
    // existe — e a página perdia quadros em silêncio. Encontrado pelo teste
    // de invariante, nos totais 13, 25 e 37. Quando somar não cabe, tira-se.
    const passo = [3, 2, 3, 4][i % 4] ?? 3
    const escolha = resto - passo !== 1 ? passo : passo < 4 ? passo + 1 : passo - 1
    out.push(escolha)
    resto -= escolha
    i++
  }

  return out
}

/** Formatos, distribuídos para que dois quadros vizinhos nunca repitam recorte. */
const RECORTES: PanelShape[] = ["cutTR", "rect", "cutBL", "octagon", "tiltR", "cutBR", "wedge"]

/**
 * Diagrama uma página inteira.
 *
 * Devolve um item por quadro, na ordem, com a largura que fecha a sua tira.
 * A zona deixa de decidir diagramação e passa a descrever conteúdo — que é a
 * divisão de trabalho certa entre editor e diagramador.
 *
 * `destaque` marca o primeiro quadro de cada tira larga: é onde a zona pode
 * pedir mais altura à imagem sem desalinhar a tira.
 */
export function compose(
  total: number
): { span: PanelSpan; shape: PanelShape; destaque: boolean }[] {
  const saida: { span: PanelSpan; shape: PanelShape; destaque: boolean }[] = []
  let n = 0

  tiras(total).forEach((quantos, linha) => {
    const opcoes = TIRAS[quantos] ?? TIRAS[3]!
    const arranjo = opcoes[linha % opcoes.length]!

    arranjo.forEach((colunas, pos) => {
      saida.push({
        span: {
          // No telemóvel a grelha tem 4 colunas: um quadro de 3/12 ali daria
          // 60px. Abaixo de 640px tudo ocupa a largura toda, menos os pares,
          // que continuam a caber lado a lado.
          base: colunas <= 3 && arranjo.length === 4 ? 2 : 4,
          sm: colunas >= 8 ? 8 : colunas >= 6 ? 8 : colunas >= 4 ? 4 : 2,
          lg: colunas,
        },
        shape: RECORTES[n % RECORTES.length]!,
        destaque: colunas >= 6,
      })
      n++
    })
  })

  return saida
}
