"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import type { Skill } from "@/data/skills"
import { SKILL_CATEGORY_META } from "@/data/skills"

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  const [copied, setCopied] = useState(false)
  const meta = SKILL_CATEGORY_META[skill.category]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(skill.command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard indisponível — silencioso */
    }
  }

  return (
    <div className="sv-panel sv-action group flex flex-col gap-3 p-5">
      <span className="sv-lines rounded-[6px]" />

      <div className="flex items-start justify-between gap-2">
        <span
          className="rounded-full border px-2 py-0.5 text-xs font-medium"
          style={{ color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}12` }}
        >
          {meta.emoji} {meta.label}
        </span>
      </div>

      <h3 className="text-sm font-semibold" style={{ color: meta.color }}>
        {skill.name}
      </h3>

      <p className="line-clamp-3 text-xs text-muted-foreground">{skill.description}</p>

      <button
        onClick={copy}
        aria-label={`Copiar comando ${skill.command}`}
        className="mt-auto flex items-center justify-between gap-2 rounded-md border border-border bg-black/30 px-3 py-2 font-mono text-xs transition-colors hover:border-foreground/40"
      >
        <span className="truncate" style={{ color: meta.color }}>{skill.command}</span>
        {copied ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-[var(--sv-lime)]" />
        ) : (
          <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        )}
      </button>
    </div>
  )
}
