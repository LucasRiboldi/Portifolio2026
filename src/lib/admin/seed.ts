import "server-only"

/**
 * Seed inicial — copia o conteúdo estático de `src/data/*.ts` (a fonte de
 * verdade histórica) para o Supabase. Idempotente: só popula tabelas vazias.
 * Usa o client service-role (ignora RLS). Chamado pela action do dashboard.
 */
import { createAdminClient } from "@/lib/supabase/admin"
import { projects } from "@/data/projects"
import { posts } from "@/data/posts"
import { skills } from "@/data/skills"
import { tools } from "@/data/tools"
import { siteConfig } from "@/constants/site"
import { REALMS, REALM_ORDER, DEFAULT_REALM } from "@/lib/realms"
import * as arcane from "@/lib/arcane-content"

export interface SeedReport {
  [table: string]: number | "já populada"
}

async function seedIfEmpty(
  supabase: ReturnType<typeof createAdminClient>,
  table: string,
  rows: Record<string, unknown>[],
): Promise<number | "já populada"> {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
  if ((count ?? 0) > 0) return "já populada"
  const { error } = await supabase.from(table).insert(rows)
  if (error) throw new Error(`${table}: ${error.message}`)
  return rows.length
}

export async function seedDatabase(): Promise<SeedReport> {
  const supabase = createAdminClient()
  const report: SeedReport = {}

  report.projects = await seedIfEmpty(
    supabase,
    "projects",
    projects.map((p, i) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags,
      cover_image: p.coverImage,
      href: p.href ?? null,
      featured: p.featured ?? false,
      published: true,
      sort: i,
    })),
  )

  report.posts = await seedIfEmpty(
    supabase,
    "posts",
    posts.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      reading_minutes: p.readingMinutes,
      tags: p.tags,
      accent: p.accent,
      body: p.body,
      published: true,
      sort: i,
    })),
  )

  report.skills = await seedIfEmpty(
    supabase,
    "skills",
    skills.map((s, i) => ({
      name: s.name,
      command: s.command,
      description: s.description,
      category: s.category,
      sort: i,
    })),
  )

  report.tools = await seedIfEmpty(
    supabase,
    "tools",
    tools.map((t, i) => ({
      name: t.name,
      description: t.description,
      type: t.type,
      stack: t.stack,
      emoji: t.emoji,
      demo_url: t.demoUrl ?? null,
      github_url: t.githubUrl ?? null,
      sort: i,
    })),
  )

  report.site_config = await seedIfEmpty(supabase, "site_config", [
    {
      id: "default",
      name: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      github: siteConfig.github,
      linkedin: siteConfig.linkedin,
      email: siteConfig.email,
      location: siteConfig.location,
    },
  ])

  report.realms = await seedIfEmpty(
    supabase,
    "realms",
    REALM_ORDER.map((id, i) => {
      const r = REALMS[id]
      return {
        id,
        label: r.label,
        glyph: r.glyph,
        enabled: true,
        is_default: id === DEFAULT_REALM,
        morph_label: r.morphLabel,
        aria: r.aria,
        arcane_content:
          id === "arcane"
            ? {
                gazette: arcane.gazette,
                leadArticle: arcane.leadArticle,
                columns: arcane.columns,
                sidebar: arcane.sidebar,
                almanac: arcane.almanac,
              }
            : null,
        sort: i,
      }
    }),
  )

  return report
}
