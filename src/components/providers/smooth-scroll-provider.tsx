"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/design-system/gsap"

/**
 * Smooth scroll (Lenis) com ponte para o GSAP ScrollTrigger.
 *
 * Escopo deliberado: montar isto só onde a experiência cinematográfica existe
 * (a landing do Criativo), não no site inteiro — o admin, o portal e o guia do
 * design system dependem do scroll nativo (o guia usa `window.scrollTo` para
 * trocar de seção). O Lenis sequestra o scroll da janela enquanto está montado
 * e o devolve intacto ao desmontar (troca de rota).
 *
 * A ponte é a parte que importa: o Lenis vira o "relógio" do scroll e o
 * ScrollTrigger recalcula a cada frame do mesmo `raf`, senão os dois brigam —
 * o pin salta e o scrub atrasa. `lagSmoothing(0)` evita que o GSAP "pule"
 * frames sob carga, o que descolaria o pin do conteúdo.
 *
 * `prefers-reduced-motion`: nada de Lenis. Quem pede menos movimento rola no
 * scroll nativo do navegador, sem interpolação nenhuma.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Toque continua nativo: smooth em touch atrapalha mais do que ajuda.
      syncTouch: false,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
