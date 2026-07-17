import { cn } from "@/lib/utils"
import { DIMENSIONS, dimClass, type Dimension } from "@/design-system/dimensions"

/**
 * O catálogo das dimensões (tipo, classes e metadata) mudou-se para
 * `src/design-system/dimensions.ts` — é dado, não componente, e aqui obrigava
 * quem só queria a lista a arrastar JSX junto. Reexportado para os imports
 * existentes continuarem válidos.
 */
export { DIMENSIONS, dimClass }
export type { Dimension }
interface SvCanvasProps {
  dimension?: Dimension
  className?: string
  children: React.ReactNode
}

/** Full-bleed comic canvas that switches art dimension. */
export function SvCanvas({ dimension = 'multiverse', className, children }: SvCanvasProps) {
  return (
    <section
      className={cn(
        "sv-canvas min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8",
        dimClass[dimension],
        className
      )}
    >
      <div className="relative z-[1] mx-auto max-w-container">{children}</div>
    </section>
  )
}
