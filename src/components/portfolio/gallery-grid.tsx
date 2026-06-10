"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/cards/project-card"
import type { Project, ProjectCategory } from "@/data/projects"

const FILTERS: { label: string; value: ProjectCategory | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Código', value: 'code' },
  { label: 'Arte', value: 'art' },
  { label: 'Imagem', value: 'image' },
]

interface GalleryGridProps {
  projects: Project[]
}

export function GalleryGrid({ projects }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  const showFeatured = activeFilter === 'all'
  const featured = showFeatured ? filtered.find(p => p.featured) : undefined
  const rest = featured ? filtered.filter(p => p.id !== featured.id) : filtered

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              activeFilter === f.value
                ? "border-transparent text-white"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            style={activeFilter === f.value
              ? { background: 'linear-gradient(90deg, #f97316, #ec4899)' }
              : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {featured && <ProjectCard project={featured} featured />}
        {rest.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhum projeto nessa categoria ainda.
        </p>
      )}
    </div>
  )
}
