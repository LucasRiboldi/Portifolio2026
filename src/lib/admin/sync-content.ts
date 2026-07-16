import "server-only"

/**
 * Sincroniza conteúdo NOVO de `src/data/*.ts` para o Supabase.
 *
 * Diferente de `seedDatabase()` (que só popula tabelas vazias), este sync serve
 * para quando a tabela já tem dados e faltam registros novos — o caso comum
 * depois de acrescentar um projeto/ferramenta/post no código.
 *
 * Regras de segurança:
 *  - Só INSERE o que falta (compara por título/nome/slug). Nunca atualiza nem
 *    apaga conteúdo existente que você tenha editado pelo painel.
 *  - Exceção deliberada: ao inserir um projeto com `featured`, os demais são
 *    desmarcados, já que a home mostra um único destaque.
 *  - Idempotente: rodar de novo não duplica nada.
 */
import { createAdminClient } from "@/lib/supabase/admin"
import { projects } from "@/data/projects"
import { posts } from "@/data/posts"
import { tools } from "@/data/tools"

export interface SyncReport {
  /** Nomes/títulos inseridos por tabela (vazio = nada faltava). */
  [table: string]: string[]
}

export async function syncNewContent(): Promise<SyncReport> {
  const supabase = createAdminClient()
  const report: SyncReport = { projects: [], tools: [], posts: [] }

  // ─── Projetos (chave: title) ───
  const { data: projRows, error: projErr } = await supabase.from("projects").select("title, sort")
  if (projErr) throw new Error(`projects: ${projErr.message}`)
  const projHave = new Set((projRows ?? []).map((r) => r.title))
  const projMax = Math.max(0, ...(projRows ?? []).map((r) => r.sort ?? 0))
  const projMissing = projects.filter((p) => !projHave.has(p.title))

  if (projMissing.length) {
    // A home renderiza um único destaque: se algum entrante é featured,
    // os antigos perdem o holofote antes da inserção.
    if (projMissing.some((p) => p.featured)) {
      const { error } = await supabase.from("projects").update({ featured: false }).eq("featured", true)
      if (error) throw new Error(`projects (featured): ${error.message}`)
    }
    const { error } = await supabase.from("projects").insert(
      projMissing.map((p, i) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        tags: p.tags,
        cover_image: p.coverImage,
        href: p.href ?? null,
        featured: p.featured ?? false,
        published: true,
        // Destaque vai para o topo; o resto entra no fim da fila.
        sort: p.featured ? -1 : projMax + 1 + i,
      })),
    )
    if (error) throw new Error(`projects: ${error.message}`)
    report.projects = projMissing.map((p) => p.title)
  }

  // ─── Ferramentas (chave: name) ───
  const { data: toolRows, error: toolErr } = await supabase.from("tools").select("name, sort")
  if (toolErr) throw new Error(`tools: ${toolErr.message}`)
  const toolHave = new Set((toolRows ?? []).map((r) => r.name))
  const toolMax = Math.max(0, ...(toolRows ?? []).map((r) => r.sort ?? 0))
  const toolMissing = tools.filter((t) => !toolHave.has(t.name))

  if (toolMissing.length) {
    const { error } = await supabase.from("tools").insert(
      toolMissing.map((t, i) => ({
        name: t.name,
        description: t.description,
        type: t.type,
        stack: t.stack,
        emoji: t.emoji,
        demo_url: t.demoUrl ?? null,
        github_url: t.githubUrl ?? null,
        sort: toolMax + 1 + i,
      })),
    )
    if (error) throw new Error(`tools: ${error.message}`)
    report.tools = toolMissing.map((t) => t.name)
  }

  // ─── Posts (chave: slug) ───
  const { data: postRows, error: postErr } = await supabase.from("posts").select("slug, sort")
  if (postErr) throw new Error(`posts: ${postErr.message}`)
  const postHave = new Set((postRows ?? []).map((r) => r.slug))
  const postMax = Math.max(0, ...(postRows ?? []).map((r) => r.sort ?? 0))
  const postMissing = posts.filter((p) => !postHave.has(p.slug))

  if (postMissing.length) {
    const { error } = await supabase.from("posts").insert(
      postMissing.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        reading_minutes: p.readingMinutes,
        tags: p.tags,
        accent: p.accent,
        body: p.body,
        published: true,
        sort: postMax + 1 + i,
      })),
    )
    if (error) throw new Error(`posts: ${error.message}`)
    report.posts = postMissing.map((p) => p.title)
  }

  return report
}
