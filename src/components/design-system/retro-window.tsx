"use client"

/**
 * RetroWindow — chrome de janela em três skins retrô (recriação original).
 * os: "95" | "xp" | "mac". Sem logos/ícones de marca.
 * draggable: arrastável pela title bar (absolute dentro do container relativo).
 */
import { useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

type OS = "95" | "xp" | "mac"

export function RetroWindow({
  os,
  title,
  className,
  children,
  draggable,
  initial,
  z = 1,
}: {
  os: OS
  title: string
  className?: string
  children: React.ReactNode
  draggable?: boolean
  initial?: { x: number; y: number }
  z?: number
}) {
  const [pos, setPos] = useState(initial ?? { x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [zi, setZi] = useState(z)
  const drag = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggable) return
      setZi(50)
      setDragging(true)
      drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y }
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [draggable, pos]
  )
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drag.current) return
      setPos({ x: drag.current.px + (e.clientX - drag.current.sx), y: drag.current.py + (e.clientY - drag.current.sy) })
    },
    []
  )
  const onPointerUp = useCallback(() => {
    drag.current = null
    setDragging(false)
  }, [])

  return (
    <div
      className={cn("os-window", `os-${os}`, draggable && "is-draggable", dragging && "is-dragging", className)}
      style={draggable ? { position: "absolute", left: pos.x, top: pos.y, zIndex: zi } : undefined}
    >
      <div
        className="os-titlebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {os === "mac" && (
          <span className="os-lights" aria-hidden>
            <span className="l-red" />
            <span className="l-yellow" />
            <span className="l-green" />
          </span>
        )}
        <span className="os-title">{title}</span>
        {os !== "mac" && (
          <span className="os-btns" aria-hidden>
            <button tabIndex={-1}>_</button>
            <button tabIndex={-1}>▢</button>
            <button tabIndex={-1} className={os === "xp" ? "os-close" : ""}>✕</button>
          </span>
        )}
      </div>
      <div className="os-body">{children}</div>
    </div>
  )
}
