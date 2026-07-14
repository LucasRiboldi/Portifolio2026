import { cn } from "@/lib/utils"

interface BentoCardProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  accent?: 'magenta' | 'cyan' | 'yellow' | 'violet' | 'lime'
  tilt?: 1 | 2 | 3
}

const accentPanel: Record<NonNullable<BentoCardProps['accent']>, string> = {
  magenta: '',
  cyan:   'sv-panel-cyan',
  yellow: 'sv-panel-yellow',
  violet: 'sv-panel-violet',
  lime:   'sv-panel-lime',
}

const tiltClass = { 1: 'sv-tilt-1', 2: 'sv-tilt-2', 3: 'sv-tilt-3' } as const

export function BentoCard({ className, style, children, accent, tilt }: BentoCardProps) {
  return (
    <div
      className={cn(
        "sv-panel sv-action art-paper p-4",
        accent && accentPanel[accent],
        tilt && tiltClass[tilt],
        className
      )}
      style={style}
    >
      <span className="sv-lines rounded-[6px]" />
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  )
}
