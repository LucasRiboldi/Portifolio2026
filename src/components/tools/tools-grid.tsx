"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ToolCard } from "@/components/cards/tool-card"
import type { Tool, ToolType } from "@/data/tools"
import { TOOL_LABELS, TOOL_COLORS } from "@/data/tools"

const ALL_TYPES: ToolType[] = ['webapp', 'cli', 'extension', 'bot', 'script', 'plugin']

interface ToolsGridProps {
  tools: Tool[]
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  const [activeFilter, setActiveFilter] = useState<ToolType | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? tools
    : tools.filter(t => t.type === activeFilter)

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "sv-heavy border-[3px] border-black px-4 py-1.5 text-xs uppercase tracking-wide transition-transform hover:-translate-y-0.5",
            activeFilter === 'all'
              ? "bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
              : "bg-white/10 text-[var(--c-ink)] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"
          )}
        >
          Todos
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              "sv-heavy border-[3px] border-black px-4 py-1.5 text-xs uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5",
              activeFilter === type
                ? "shadow-[3px_3px_0_0_#000]"
                : "bg-white/10 text-[var(--c-ink)] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"
            )}
            style={activeFilter === type ? { background: TOOL_COLORS[type] } : undefined}
          >
            {TOOL_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
