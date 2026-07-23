"use client"

import { useEffect, useRef, useState } from "react"

interface CounterProps {
  to: number
  /** Sufixo colado ao número (ex.: "+", "%", " anos"). */
  suffix?: string
  /** Duração da contagem, em milissegundos. */
  duration?: number
  className?: string
}

/**
 * Contador que corre uma vez, ao entrar no viewport.
 *
 * Usa `IntersectionObserver` e `requestAnimationFrame` direto em vez dos hooks
 * de animação: o número precisa de existir no DOM como texto (para leitores de
 * ecrã e para o caso de o observer nunca disparar), e é mais simples garantir
 * isso controlando o valor à mão do que a partir de um valor animado.
 *
 * Com `prefers-reduced-motion` o valor final é escrito de imediato — sem isto,
 * o contador ficava preso em zero para quem tem a preferência ligada, porque a
 * animação era a única coisa que alguma vez escrevia o número.
 */
export function Counter({ to, suffix = "", duration = 1600, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setValue(to)
      return
    }

    let raf = 0
    let start = 0

    function step(now: number) {
      if (!start) start = now
      const t = Math.min((now - start) / duration, 1)
      // Mesma curva do resto da página (ease-out forte): o número desacelera
      // à chegada em vez de parar de repente.
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        raf = requestAnimationFrame(step)
      },
      { threshold: 0.35 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, duration])

  return (
    // role="img" torna o aria-label válido (aria-label num <span> sem role é
    // ARIA proibido): o número é uma imagem de dado, lido de uma vez pelo
    // leitor de tela, enquanto o valor que corre por dentro fica aria-hidden.
    <span ref={ref} role="img" className={className} aria-label={`${to}${suffix}`}>
      <span aria-hidden>
        {value}
        {suffix}
      </span>
    </span>
  )
}
