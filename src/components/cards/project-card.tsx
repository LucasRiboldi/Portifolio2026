"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/projects"

const CATEGORY_LABELS: Record<Project['category'], string> = {
  design: 'Design',
  code: 'Código',
  art: 'Arte',
  image: 'Imagem',
}

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const card = (
    <div
      className={cn(
        "sv-panel group art-paper art-hover-ink relative overflow-hidden p-0",
        featured && "md:col-span-2"
      )}
    >
      {/* carimbo narrativo "CASE" (com propósito: marca de dossiê) */}
      <span
        aria-hidden
        className="art-stamp pointer-events-none absolute right-3 top-3 z-[3] text-[0.6rem] opacity-0 transition-all duration-300 group-hover:opacity-90"
        style={{ color: featured ? "var(--sv-magenta)" : "var(--sv-cyan)" }}
      >
        {featured ? "Case ★" : "Case"}
      </span>
      {featured && <span aria-hidden className="art-tape absolute left-1/2 top-0 z-[3]" />}

      <div
        className={cn(
          "relative w-full overflow-hidden",
          featured ? "h-64 md:h-80" : "h-48"
        )}
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(139,92,246,0.12))' }}
      >
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span
            className="rounded px-2 py-0.5 text-xs font-medium text-white"
            style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
          >
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  if (project.href) {
    const isExternal = /^https?:\/\//.test(project.href)
    return (
      <Link
        href={project.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(featured && "md:col-span-2")}
      >
        {card}
      </Link>
    )
  }
  return card
}
