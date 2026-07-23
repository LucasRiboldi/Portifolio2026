"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/design-system/gsap"

/**
 * Efeito magnético: o elemento é "puxado" na direção do ponteiro enquanto o
 * cursor está sobre ele, e volta ao lugar ao sair.
 *
 * Reutilizável em botões, selos e cards. A suavização fica no CSS (uma
 * `transition` de `transform` na classe do elemento), não em rAF por frame:
 * mexer só no `transform` é barato (composita na GPU) e deixar o navegador
 * interpolar evita um loop de animação por botão na página.
 *
 * `prefers-reduced-motion`: o ref não recebe listener nenhum — o elemento fica
 * parado. Toque idem: `mousemove` não dispara em toque.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el!.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    }
    function reset() {
      el!.style.transform = ""
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", reset)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", reset)
    }
  }, [strength])

  return ref
}
