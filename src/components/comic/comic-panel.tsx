"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { ACCENT_VAR, type Accent } from "./atoms"

interface ComicPanelProps {
  children: React.ReactNode
  className?: string
  accent?: Accent
  /** Recorte diagonal do requadro; `none` mantém o retângulo. */
  cut?: "none" | "tr" | "bl"
  /** Inclinação 3D no hover. Desligar em painéis grandes: cansa a leitura. */
  tilt?: boolean
}

/** Intensidade máxima da inclinação, em graus. */
const TILT_MAX = 7

/**
 * Requadro de HQ: vidro sobre preto, borda de tinta e luz de acento que
 * acende no hover — opcionalmente com inclinação 3D seguindo o cursor.
 *
 * A inclinação é aplicada por estado React e não por `transform` imperativo
 * porque o painel também reage a `focus-within` (navegação por teclado), e
 * misturar as duas fontes de verdade produzia saltos ao sair do foco.
 */
export function ComicPanel({ children, className, accent = "cyan", cut = "none", tilt = false }: ComicPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const interactive = tilt && !reduced

  function onMove(e: React.MouseEvent) {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setRot({ x: -py * TILT_MAX * 2, y: px * TILT_MAX * 2 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      animate={interactive ? { rotateX: rot.x, rotateY: rot.y } : undefined}
      transition={{ type: "spring", stiffness: 190, damping: 18 }}
      style={
        {
          "--k-accent": ACCENT_VAR[accent],
          transformPerspective: interactive ? 900 : undefined,
          transformStyle: interactive ? "preserve-3d" : undefined,
        } as React.CSSProperties
      }
      className={cn(
        "k-panel k-panel--lit",
        cut === "tr" && "k-cut-tr",
        cut === "bl" && "k-cut-bl",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
