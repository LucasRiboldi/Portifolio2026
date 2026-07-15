import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getProjects, getProjectBySlug } from "@/lib/repos/projects"

const CATEGORY: Record<string, string> = {
  code: "Código",
  design: "Design",
  art: "Arte",
  image: "Imagem",
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  return p ? { title: p.title, description: p.description } : { title: "Projeto" }
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProjectBySlug(slug)
  if (!p) notFound()

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/dev/projetos" className="dv-link text-sm">
        ← projetos
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <span className="dv-tag">{CATEGORY[p.category] ?? p.category}</span>
        {p.featured && <span className="dv-status done">★ destaque</span>}
      </div>

      <h1 className="dv-title mt-2">{p.title}</h1>
      <p className="dv-sub">{p.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <span key={t} className="dv-tag">
            {t}
          </span>
        ))}
      </div>

      {p.href && (
        <a href={p.href} target="_blank" rel="noreferrer" className="dv-link mt-4 inline-block">
          ❯ abrir repositório
        </a>
      )}

      {p.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.coverImage} alt={p.title} className="mt-5 w-full rounded-xl border" style={{ borderColor: "var(--d-current)" }} />
      )}

      {p.readme ? (
        <div className="dv-prose mt-6" style={{ fontSize: "0.95rem" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.readme}</ReactMarkdown>
        </div>
      ) : (
        <p className="dv-empty mt-6">Sem README ainda — adicione em /admin/projects.</p>
      )}
    </article>
  )
}
