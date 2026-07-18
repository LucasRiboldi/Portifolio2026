"use client"

import { usePathname } from "next/navigation"

/**
 * O fundo animado do Design System — trocado pela rota.
 *
 * Vive no layout (não numa página) para cobrir também as sub-rotas
 * (/design-system/tokens…), que herdam o comic por padrão. O guia do _Dev e o
 * do Anfitrião pedem o seu próprio universo — antes ficavam com o fundo comic
 * do layout brigando por baixo.
 *
 * É `position: fixed` atrás de tudo (ver ds-canvas.css): um client component
 * mínimo só para ler o pathname; toda a arte é CSS.
 */
type Variant = "comic" | "dev" | "arcane"

function variantFor(pathname: string): Variant {
  if (pathname.startsWith("/design-system/realms/developer")) return "dev"
  if (pathname.startsWith("/design-system/realms/arcane")) return "arcane"
  return "comic"
}

export function DsCanvasAuto() {
  const variant = variantFor(usePathname())
  return <div aria-hidden className={`ds-canvas ds-canvas--${variant}`} />
}
