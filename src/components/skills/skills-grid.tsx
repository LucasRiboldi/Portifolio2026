"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SkillCard } from "@/components/cards/skill-card"
import type { Skill, SkillCategory } from "@/data/skills"
import { SKILL_CATEGORY_META, skills as allSkills } from "@/data/skills"

const CATEGORIES = Object.keys(SKILL_CATEGORY_META) as SkillCategory[]

interface SkillsGridProps {
  skills?: Skill[]
}

export function SkillsGrid({ skills = allSkills }: SkillsGridProps) {
  const [active, setActive] = useState<SkillCategory | "all">("all")

  const filtered = active === "all" ? skills : skills.filter((s) => s.category === active)

  return (
    <div>
      <p className="mb-4 text-xs text-muted-foreground">
        {skills.length} skills instaladas no meu Claude Code · clique no comando para copiar
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={cn(
            "sv-heavy border-[3px] border-black px-4 py-1.5 text-xs uppercase tracking-wide transition-transform hover:-translate-y-0.5",
            active === "all"
              ? "bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
              : "bg-white/10 text-[var(--c-ink)] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"
          )}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => {
          const meta = SKILL_CATEGORY_META[cat]
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "sv-heavy border-[3px] border-black px-4 py-1.5 text-xs uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5",
                active === cat
                  ? "shadow-[3px_3px_0_0_#000]"
                  : "bg-white/10 text-[var(--c-ink)] shadow-[3px_3px_0_0_rgba(0,0,0,0.5)]"
              )}
              style={active === cat ? { background: meta.color } : undefined}
            >
              {meta.emoji} {meta.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  )
}
