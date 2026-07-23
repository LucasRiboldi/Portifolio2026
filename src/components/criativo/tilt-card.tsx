"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { prefersReducedMotion } from "@/design-system/gsap"

/**
 * Card com tilt 3D pelo ponteiro — inclina para o cursor e volta ao sair.
 *
 * Reutilizável em qualquer superfície do realm. É `rotateX/rotateY` com
 * `perspective`, escrito direto no `transform` no `mousemove` (barato, na GPU),
 * e uma `transition` no CSS suaviza a volta. `prefers-reduced-motion`/toque:
 * o handler sai cedo e o card fica reto.
 */
export function TiltCard({
  max = 8,
  className,
  children,
}: {
  max?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent) {
    if (prefersReducedMotion() || !ref.current) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -2 * max
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 2 * max
    el.style.transform = `perspective(760px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  }
  function reset() {
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset} className={cn("cx-tilt", className)}>
      {children}
    </div>
  )
}
