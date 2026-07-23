"use client"

import { useEffect, useRef, type RefObject } from "react"
import { prefersReducedMotion } from "@/design-system/gsap"

/**
 * Parallax de ponteiro por variáveis CSS.
 *
 * O hook escreve `--px` e `--py` (de -1 a 1, posição relativa do cursor no
 * container) no elemento; as camadas dentro dele consomem via
 * `translate3d(calc(var(--px) * Npx), calc(var(--py) * Npx), 0)`. Cada camada
 * escolhe o próprio N — quanto maior, mais "à frente" ela parece.
 *
 * Passar por CSS var em vez de mexer no `style` de cada camada mantém um único
 * ponto de escrita por frame (rAF), e a profundidade vira só uma constante no
 * markup — barato e declarativo. Fora do container o parallax volta a zero.
 *
 * `prefers-reduced-motion`/toque: sem listener, as vars ficam em 0 e nada mexe.
 */
export function useMouseParallax<T extends HTMLElement = HTMLElement>(external?: RefObject<T | null>) {
  const own = useRef<T>(null)
  const ref = external ?? own

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let raf = 0
    let px = 0
    let py = 0

    function apply() {
      raf = 0
      el!.style.setProperty("--px", px.toFixed(3))
      el!.style.setProperty("--py", py.toFixed(3))
    }
    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect()
      px = (e.clientX - r.left) / r.width - 0.5
      py = (e.clientY - r.top) / r.height - 0.5
      if (!raf) raf = requestAnimationFrame(apply)
    }
    function reset() {
      px = 0
      py = 0
      if (!raf) raf = requestAnimationFrame(apply)
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", reset)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", reset)
      cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}
