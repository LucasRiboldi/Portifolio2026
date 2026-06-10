import { cn } from "@/lib/utils"

interface BentoCardProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  accent?: 'orange' | 'purple' | 'pink' | 'cyan' | 'green' | 'amber'
}

const accentStyles: Record<NonNullable<BentoCardProps['accent']>, string> = {
  orange: 'bg-orange-500/10 border-orange-500/20',
  purple: 'bg-violet-500/10 border-violet-500/20',
  pink:   'bg-pink-500/10 border-pink-500/20',
  cyan:   'bg-cyan-500/10 border-cyan-500/20',
  green:  'bg-green-500/10 border-green-500/20',
  amber:  'bg-amber-500/10 border-amber-500/20',
}

export function BentoCard({ className, style, children, accent }: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all",
        accent && accentStyles[accent],
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
