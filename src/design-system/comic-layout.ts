/**
 * Tokens de diagramação da HQ — o vocabulário de `ComicPage › Chapter › Panel`.
 *
 * Fica no design system (e não junto dos componentes) porque é contrato: as
 * zonas, o guia do DS e qualquer capítulo futuro descrevem a sua página com
 * estes tipos. O CSS que os desenha está em `styles/comic-layout.css`.
 */

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
  /** Quadro vertical: estreito e alto. */
  tall: { base: 2, sm: 4, lg: 4, rows: 2 },
  /** Quadro-cartaz: alto e com meia largura. */
  poster: { base: 2, sm: 4, lg: 6, rows: 2 },
} as const satisfies Record<string, PanelSpan>

/**
 * Ritmo de diagramação por índice.
 *
 * Recebe a posição do item e devolve largura e formato, para que uma lista
 * uniforme vinda do banco saia da grelha com o desalinho de uma página montada
 * à mão. O ciclo é de 5 — primo em relação às grelhas de 3 e 4 colunas, o que
 * evita que o padrão caia sempre na mesma coluna e volte a parecer catálogo.
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
      return { span: SPAN.half, shape: "rect" }
  }
}
