"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

/**
 * O portão do fundo WebGL.
 *
 * O shader (`ink-shader`) arrasta `three` + `@react-three/fiber` atrás de si —
 * peso que a maioria das visitas não deve pagar. Este componente decide, já no
 * cliente, se vale a pena carregá-lo, e só então o importa.
 *
 * Recusa em quatro casos, por esta ordem de importância:
 *   1. `prefers-reduced-motion` — é movimento contínuo, e movimento contínuo é
 *      exatamente o que essa preferência pede para não existir;
 *   2. ecrã estreito — em telemóvel o efeito é invisível e o custo de bateria
 *      não é;
 *   3. poucos núcleos — máquina fraca renderiza isto às custas do scroll;
 *   4. sem contexto WebGL — placa/driver sem suporte.
 *
 * Quando recusa, não há degradação visível: as camadas de papel, offset e
 * retícula em CSS (`cp-paper`, `cp-offset`, `cp-halftone`) já dão a textura. O
 * WebGL é o andar de cima, nunca o chão.
 */

const InkShader = dynamic(() => import("./ink-shader"), { ssr: false })

function supported() {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  if (window.matchMedia("(max-width: 1023px)").matches) return false
  if ((navigator.hardwareConcurrency ?? 8) < 4) return false

  try {
    const c = document.createElement("canvas")
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"))
  } catch {
    return false
  }
}

export function InkBackdrop({ color, opacity }: { color?: string; opacity?: number }) {
  const [on, setOn] = useState(false)

  // Depois da montagem, e nunca durante o render: a decisão depende de APIs do
  // browser, e avaliá-la no servidor produziria uma hidratação divergente.
  useEffect(() => setOn(supported()), [])

  if (!on) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-70">
      <InkShader color={color} opacity={opacity} />
    </div>
  )
}
