/**
 * PADRÃO DE IMAGENS — fonte única de verdade.
 * ------------------------------------------------------------
 * Três proporções, e só. Toda imagem do projeto usa uma delas.
 * As classes CSS vivem em `src/styles/images.css` (.img-frame + .img-*),
 * a documentação viva em /styleguide.
 *
 * Regra: ao mudar uma proporção aqui, mude também em images.css.
 */

export const IMAGE_RATIOS = {
  wide: {
    label: "Wide",
    ratio: "16 / 9",
    className: "img-wide",
    use: "Capas de projeto, thumbnails, mídia do admin, figuras do jornal",
    export: "1600 × 900",
  },
  portrait: {
    label: "Portrait",
    ratio: "4 / 5",
    className: "img-portrait",
    use: "Galeria e retratos",
    export: "1200 × 1500",
  },
  square: {
    label: "Square",
    ratio: "1 / 1",
    className: "img-square",
    use: "Avatar, logos e ícones",
    export: "800 × 800",
  },
} as const

export type ImageRatio = keyof typeof IMAGE_RATIOS

/** Larguras servidas pelo next/image. Mantém o srcset curto de propósito. */
export const IMAGE_WIDTHS = [400, 800, 1600] as const

/**
 * Valores do atributo `sizes` do next/image. Sem isto, `fill` faz o Next
 * servir a imagem na largura total da viewport em qualquer breakpoint.
 */
export const IMAGE_SIZES = {
  /** Card dentro de grelha de 2–3 colunas. */
  card: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  /** Imagem que ocupa a largura do conteúdo. */
  full: "(min-width: 1180px) 1180px, 100vw",
  /** Miniatura fixa (avatar, ícone). */
  thumb: "96px",
} as const
