import type { Metadata } from "next"
import { DsSidebar } from "@/components/design-system/ds-sidebar"

export const metadata: Metadata = {
  title: "Design System · Design System",
  description:
    "Design System corporativo do portfólio: foundations, design tokens, componentes, patterns, templates, acessibilidade e documentação.",
}

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sv-canvas min-h-screen">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-10 lg:flex-row lg:gap-10">
        <DsSidebar />
        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>
    </div>
  )
}
