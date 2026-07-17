import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Design System · Design System",
  description:
    "Design System corporativo do portfólio: foundations, design tokens, componentes, patterns, templates, acessibilidade e documentação.",
}

/**
 * Sem sidebar: o Design System é um documento único e corrido, lido de cima a
 * baixo, e não uma árvore para navegar. As rotas por seção continuam existindo
 * para linkar direto — elas é que são a fonte que a página única compõe.
 */
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sv-canvas min-h-screen">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <main className="min-w-0 pb-24">{children}</main>
      </div>
    </div>
  )
}
