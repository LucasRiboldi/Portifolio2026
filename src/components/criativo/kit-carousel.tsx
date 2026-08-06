"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

import { prefersReducedMotion } from "@/design-system/gsap"

/**
 * A GALERIA — carrossel com virada de folha.
 *
 * ## Por que Embla e não um carrossel escrito à mão
 *
 * O que uma biblioteca resolve aqui não é o movimento (esse é nosso, abaixo):
 * é o arrasto com inércia, o teclado, o `aria` dos slides e o cálculo de qual
 * lâmina está no centro em telas de qualquer largura. Escrever isso à mão dá
 * quatrocentas linhas que ninguém revisa. Embla faz só isso, sem opinar sobre
 * aparência — e é por isso que a virada de folha continua sendo CSS nosso.
 *
 * ## A virada
 *
 * Cada lâmina gira em `rotateY` a partir da lombada (`transform-origin`
 * lateral), com `perspective` no trilho. A lâmina que sai vira para dentro
 * como a folha que se levanta; a que entra chega deitada. É o mesmo gesto do
 * `PageTurn` dos capítulos, aplicado slide a slide em vez de página a página.
 *
 * O ângulo sai de `--k-turn`, que este componente escreve por lâmina a partir
 * da distância dela ao centro. Sem JavaScript o CSS não recebe nada, o ângulo
 * fica em 0 e a galeria continua a ser um trilho com scroll-snap — navegável,
 * só sem a virada.
 *
 * `prefers-reduced-motion` desliga a rotação e o arrasto animado: Embla passa
 * a saltar direto para o slide, sem transição.
 */

export interface LaminaKit {
  /** Identificador estável — vira `key` e âncora do `aria-label`. */
  id: string
  titulo: string
  legenda: string
  src: string
}

export function KitCarousel({ laminas }: { laminas: readonly LaminaKit[] }) {
  const parado = typeof window !== "undefined" && prefersReducedMotion()

  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
    /* `trimSnaps` deixaria a primeira e a última lâmina encostadas na borda —
       numa revista a folha do meio é a que se lê, e o centro é o eixo da
       virada. */
    containScroll: false,
    duration: parado ? 0 : 26,
    skipSnaps: false,
  })

  const [atual, setAtual] = useState(0)
  const [progresso, setProgresso] = useState<number[]>([])

  /**
   * Escreve `--k-turn` em cada lâmina.
   *
   * O valor é a distância assinada da lâmina ao centro do trilho, de -1 a 1.
   * Fica em estado do React e não em manipulação direta do DOM porque o número
   * de lâminas é dinâmico e o React já as renderiza — mexer no DOM por baixo
   * dele daria dois donos para o mesmo atributo.
   */
  const medir = useCallback(() => {
    if (!embla) return
    setAtual(embla.selectedScrollSnap())
    const inicio = embla.scrollProgress()
    setProgresso(
      embla.scrollSnapList().map((snap) => {
        let d = snap - inicio
        // Em loop, a distância pode "dar a volta"; normaliza para o caminho curto.
        if (d > 0.5) d -= 1
        if (d < -0.5) d += 1
        return Math.max(-1, Math.min(1, d * embla.scrollSnapList().length))
      }),
    )
  }, [embla])

  useEffect(() => {
    if (!embla) return
    medir()
    embla.on("select", medir).on("scroll", medir).on("reInit", medir)
    return () => {
      embla.off("select", medir).off("scroll", medir).off("reInit", medir)
    }
  }, [embla, medir])

  const anterior = useCallback(() => embla?.scrollPrev(), [embla])
  const proxima = useCallback(() => embla?.scrollNext(), [embla])

  return (
    <div className="k-gal">
      <div className="k-gal-palco" ref={emblaRef}>
        <ul className="k-gal-trilho">
          {laminas.map((l, i) => (
            <li
              key={l.id}
              className="k-gal-lamina"
              data-ativa={i === atual || undefined}
              style={{ "--k-turn": `${(progresso[i] ?? 0) * 42}deg` } as React.CSSProperties}
            >
              <figure className="k-gal-folha">
                <span className="k-gal-img">
                  <Image
                    src={l.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 80vw, 420px"
                    className="object-cover"
                  />
                  {/* A dobra: um gradiente na lombada, do lado em que a folha
                      se levanta. É o que faz o retângulo ler como papel. */}
                  <span aria-hidden className="k-gal-dobra" />
                </span>
                <figcaption className="k-gal-legenda">
                  <strong className="k-title">{l.titulo}</strong>
                  <span>{l.legenda}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {/* Controles fora do trilho: dentro, o arrasto do Embla engolia o clique. */}
      <div className="k-gal-controles">
        <button type="button" onClick={anterior} className="k-gal-btn" aria-label="Lâmina anterior">
          ‹
        </button>
        <p className="k-gal-conta" aria-live="polite">
          <span className="k-title">{String(atual + 1).padStart(2, "0")}</span>
          <span aria-hidden>/</span>
          <span>{String(laminas.length).padStart(2, "0")}</span>
          <span className="sr-only">de {laminas.length} lâminas</span>
        </p>
        <button type="button" onClick={proxima} className="k-gal-btn" aria-label="Próxima lâmina">
          ›
        </button>
      </div>
    </div>
  )
}
