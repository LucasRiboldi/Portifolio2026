import Image from "next/image"

import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * A GRAVURA — o clichê da folha.
 *
 * ------------------------------------------------------------------
 * POR QUE ESTA PEÇA EXISTE
 * ------------------------------------------------------------------
 * A mesma lógica — "arte real quando houver, moldura vazia quando não" —
 * estava escrita três vezes na página, cada cópia com um conjunto diferente
 * de atributos. Aqui ela é uma peça só.
 *
 * ------------------------------------------------------------------
 * A MOLDURA TEM TAMANHO FIXO, E ISSO É DECISÃO EDITORIAL
 * ------------------------------------------------------------------
 * A arte vem do agregador: URL remota, proporção desconhecida até baixar. Um
 * `<img>` sem dimensão declarada reserva zero altura e empurra a coluna
 * inteira quando a imagem chega — o salto de layout (CLS).
 *
 * A saída não é adivinhar a proporção de cada foto: é a que o impresso já
 * usa. No jornal o clichê é um ESPAÇO RESERVADO na diagramação, de medida
 * fixa, e a foto é recortada para caber nele. Aqui a moldura declara a
 * proporção (`aspect-ratio`) e a arte preenche por `object-fit: cover`.
 *
 * Três coisas caem juntas com isso:
 *   • Não há salto: a altura existe antes de a arte chegar.
 *   • A moldura vazia e a foto ocupam EXATAMENTE o mesmo bloco — a folha se
 *     diagrama igual, com ou sem arte disponível.
 *   • A gravura redonda passa a ser um círculo de verdade. Antes o
 *     `border-radius: 50%` era aplicado sobre a imagem na sua proporção
 *     original: foto não quadrada saía elipse.
 */
export function Plate({
  image,
  sizes,
  shape = "landscape",
}: {
  image: NewsItem["image"]
  /** Largura de exibição por faixa — é o que decide qual arquivo o
      otimizador entrega. Em px porque a folha tem largura máxima: `vw`
      superestimaria em tela grande e baixaria arte maior que a necessária. */
  sizes: string
  shape?: "landscape" | "round"
}) {
  return (
    <div className={`dpx-plate dpx-plate--${shape}`}>
      {image.src ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="dpx-plate-art" />
      ) : (
        <div className="dpx-news-plate" role="img" aria-label={image.alt} />
      )}
    </div>
  )
}

/*
 * A COLUNA do Wire saiu daqui em 14/08 para `wire-motion.tsx`, onde ela ganhou
 * as microinterações. Não ficou cópia estática atrás: duas versões da mesma
 * coluna divergem na primeira vez que alguém corrigir só uma delas.
 *
 * `Plate` ficou, e de propósito não virou "use client": as matérias inferiores
 * da primeira página o renderizam no SERVIDOR. Como `wire-motion.tsx` também o
 * importa, ele existe nos dois grafos — o servidor imprime as gravuras das
 * matérias, o navegador recebe o código para as colunas animadas. É o preço de
 * ter uma implementação só da moldura de proporção fixa que evita o CLS, e é
 * mais barato que manter duas.
 */
