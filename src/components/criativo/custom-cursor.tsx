"use client"

import { useEffect, useRef, useState } from "react"
import { prefersReducedMotion } from "@/design-system/gsap"

/**
 * Cursor de tinta do multiverso — o ponteiro vira peça da direção de arte.
 *
 * Dois elementos: um ponto que segue o cursor exato e um anel de contorno que
 * "persegue" com atraso (lerp por rAF) — a leitura de HQ, traço grosso, nada
 * suave demais. Sobre qualquer elemento com `data-cursor="rótulo"` o anel cresce
 * e imprime o rótulo (ex.: "ver", "play", "abrir"): é o hover contextual pedido,
 * dirigido por markup, sem o cursor precisar conhecer cada componente.
 *
 * Só entra em ponteiro fino com hover (desktop): em toque não há cursor a
 * substituir. Em `prefers-reduced-motion` não monta — o cursor nativo fica, sem
 * perseguição nenhuma. Enquanto ativo, esconde o cursor nativo via `.cx-cursor-on`
 * no `<html>` (revertido no cleanup).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")
  const [active, setActive] = useState(false)
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const root = document.documentElement
    root.classList.add("cx-cursor-on")

    let raf = 0
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my

    function loop() {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    function onMove(e: PointerEvent) {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      const hit = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null
      if (hit) {
        setActive(true)
        setLabel(hit.dataset.cursor || "")
      } else {
        setActive(false)
        setLabel("")
      }
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      root.classList.remove("cx-cursor-on")
    }
  }, [])

  return (
    <div aria-hidden className="cx-cursor" data-active={active} data-down={down} data-labelled={label ? "true" : "false"}>
      <div ref={dotRef} className="cx-cursor__dot" />
      <div ref={ringRef} className="cx-cursor__ring">
        {label && <span className="cx-cursor__label">{label}</span>}
      </div>
    </div>
  )
}
