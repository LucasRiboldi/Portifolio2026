"use client"

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/design-system/gsap"

/**
 * A virada de página entre capítulos.
 *
 * Um capítulo novo não deve simplesmente aparecer por baixo do anterior: numa
 * revista, ele chega porque alguém virou a folha. Esta camada é essa folha — um
 * painel de papel que cobre o capítulo enquanto ele sobe e desliza para fora
 * conforme o leitor avança, descobrindo o conteúdo por baixo.
 *
 * ## Decisões
 *
 * **Vive dentro do capítulo, não sobre a página.** Um overlay global teria de
 * saber onde acaba um capítulo e começa o outro, e taparia a navegação a meio
 * da transição. Contido em `absolute inset-0`, a folha nunca cobre mais do que
 * o bloco a que pertence, e `pointer-events: none` garante que não intercepta
 * clique nenhum mesmo enquanto é visível.
 *
 * **`scrub` e não `toggleActions`.** A folha tem de estar presa ao dedo: quem
 * volta atrás vê a página voltar. Uma animação com tempo próprio continuaria a
 * correr contra o scroll e descolaria do gesto.
 *
 * **A dobra é uma sombra, não uma imagem.** O gradiente na borda de fuga faz o
 * papel parecer levantar — que é o que o olho procura para ler "virada" em vez
 * de "cortina".
 *
 * `prefers-reduced-motion`: a folha nem chega a ser desenhada.
 */
export function PageTurn() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (prefersReducedMotion() || !el) return

      const chapter = el.parentElement
      if (!chapter) return

      el.style.opacity = "1"

      gsap.to(el, {
        // -118% e não -102%: a rotação faz a borda de fuga descrever um arco e
        // voltar a entrar pela esquerda. Com o curso justo, ficava uma aresta
        // de papel colada à margem depois da folha já ter saído.
        xPercent: -118,
        // Um pouco de rotação e origem na lombada: a folha sai a rodar sobre a
        // dobra, não a resvalar na horizontal.
        rotate: -2.5,
        ease: "none",
        scrollTrigger: {
          trigger: chapter,
          start: "top bottom",
          end: "top 45%",
          scrub: 0.5,
        },
      })
    },
    { scope: ref },
  )

  return (
    <div
      ref={ref}
      aria-hidden
      // Nasce invisível: sem JavaScript (ou com movimento reduzido) o efeito não
      // existe, e uma folha estática por cima do capítulo seria um bloqueio.
      style={{ opacity: 0, transformOrigin: "left center" }}
      className="cp-pageturn"
    />
  )
}
