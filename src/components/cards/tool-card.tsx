import { ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/ui/social-icons"
import type { Tool } from "@/data/tools"
import { TOOL_COLORS, TOOL_LABELS } from "@/data/tools"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const color = TOOL_COLORS[tool.type]

  return (
    <div className="sv-panel sv-action group flex flex-col gap-3 p-5"><span className="sv-lines rounded-[6px]" />
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl">{tool.emoji}</span>
          <div className="mt-2">
            <span
              className="rounded-full border px-2 py-0.5 text-xs font-medium"
              style={{ color, borderColor: `${color}40`, background: `${color}12` }}
            >
              {TOOL_LABELS[tool.type]}
            </span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {tool.demoUrl && (
            <a
              href={tool.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Demo"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold" style={{ color }}>{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {tool.stack.map(s => (
          <span
            key={s}
            className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
