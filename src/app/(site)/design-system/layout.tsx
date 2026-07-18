import type { Metadata } from "next"
import { DsCanvasAuto } from "@/components/design-system/ds-canvas"

export const metadata: Metadata = {
  title: "Design System · Design System",
  description:
    "Design System corporativo do portfólio: foundations, design tokens, componentes, patterns, templates, acessibilidade e documentação.",
}

/**
 * O fundo não é mais fixo no comic: `DsCanvasAuto` escolhe o canvas pelo realm
 * da rota (comic / dev / arcane), full-bleed atrás do conteúdo. Antes o
 * `sv-canvas` aqui impunha o multiverso comic ao guia Dracula e ao da folha.
 *
 * Sem sidebar de árvore: o Design System é um documento corrido; o índice de
 * cada realm é o sumário daquele documento.
 */
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <DsCanvasAuto />
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <main className="min-w-0 pb-24">{children}</main>
      </div>
    </div>
  )
}
