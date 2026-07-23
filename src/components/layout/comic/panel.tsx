"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { ACCENT_VAR, type Accent } from "@/components/comic/atoms"
import type { PanelShape, PanelSpan } from "@/design-system/comic-layout"
import { spanVars } from "@/design-system/comic-layout"

interface PanelProps {
  children: React.ReactNode
  className?: string
  /** Largura/altura na grelha editorial, por breakpoint. */
  span?: PanelSpan
  /** Formato do requadro. Uma página só de retângulos não lê como HQ. */
  shape?: PanelShape
  /** Profundidade do chanfro, quando o formato usa corte. */
  cut?: number
  /** Cor da luz de acento no hover. */
  accent?: Accent
  /** Iluminação dinâmica seguindo o cursor. */
  lit?: boolean
  /** Sem moldura nem fundo — para quadros que são só respiro ou tipografia. */
  flush?: boolean
  as?: "article" | "div" | "li" | "section" | "aside"
}

/**
 * Requadro — a unidade atómica da página.
 *
 * Não sabe nada do conteúdo: recebe moldura, formato, posição na grelha e luz.
 * É essa ignorância que o torna reutilizável — o mesmo Panel serve a capa, uma
 * arte, um pôster ou uma nota, e um formato novo entra sem tocar nas zonas.
 *
 * A iluminação escreve `--cp-mx/--cp-my` direto no nó em vez de passar por
 * estado React: é um evento de `mousemove`, e re-renderizar a árvore a cada
 * pixel do rato custaria mais do que o efeito vale. O CSS é que decide se
 * mostra a luz (`prefers-reduced-motion` desliga por lá).
 */
export function Panel({
  children,
  className,
  span,
  shape = "rect",
  cut,
  accent = "cyan",
  lit = false,
  flush = false,
  as: Tag = "article",
}: PanelProps) {
  const ref = useRef<HTMLElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!lit || !el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--cp-mx", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--cp-my", `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <Tag
      ref={ref as React.Ref<never>}
      onMouseMove={lit ? onMove : undefined}
      style={
        {
          ...spanVars(span),
          "--k-accent": ACCENT_VAR[accent],
          ...(cut ? { "--cp-cut": `${cut}px` } : null),
        } as React.CSSProperties
      }
      className={cn(
        "cp-panel",
        span && "cp-col",
        lit && "cp-panel--lit",
        flush && "cp-panel--flush",
        SHAPE_CLASS[shape],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

const SHAPE_CLASS: Record<PanelShape, string | undefined> = {
  rect: undefined,
  cutTR: "cp-shape--cut-tr",
  cutBR: "cp-shape--cut-br",
  cutBL: "cp-shape--cut-bl",
  octagon: "cp-shape--octagon",
  wedge: "cp-shape--wedge",
  torn: "cp-shape--torn",
  tiltL: "cp-tilt-l",
  tiltR: "cp-tilt-r",
}

/** Cabeçalho do requadro — legenda/numeração acima da linha de tinta. */
export function PanelHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <header className={cn("cp-panel__header", className)}>{children}</header>
}

/**
 * Corpo do requadro. `bleed` remove o padding para o conteúdo tocar a moldura —
 * é o que distingue um quadro de imagem de um quadro de texto.
 */
export function PanelBody({
  children,
  className,
  bleed = false,
}: {
  children: React.ReactNode
  className?: string
  bleed?: boolean
}) {
  return (
    <div className={cn("cp-panel__body", bleed && "cp-panel__body--bleed", className)}>{children}</div>
  )
}

/** Rodapé do requadro — metadados, tags, créditos. */
export function PanelFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <footer className={cn("cp-panel__footer", className)}>{children}</footer>
}
