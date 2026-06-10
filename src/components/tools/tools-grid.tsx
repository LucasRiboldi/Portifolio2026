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
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            activeFilter === 'all'
              ? "border-transparent text-white"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
          style={activeFilter === 'all'
            ? { background: 'linear-gradient(90deg, #f97316, #ec4899)' }
            : undefined
          }
        >
          Todos
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              activeFilter === type
                ? "border-transparent text-white"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            style={activeFilter === type
              ? { background: TOOL_COLORS[type] }
              : undefined
            }
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
