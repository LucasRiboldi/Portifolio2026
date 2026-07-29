import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getPosts, getPostBySlug } from "@/lib/repos/posts"
import { MetaRow, TagList } from "@/components/dev/ui/dev-primitives"
import { formatarData } from "@/lib/format-date"

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await getPostBySlug(slug)
  if (!p) return { title: "Artigo não encontrado" }
  return {
    title: p.title,
    description: p.excerpt,
    openGraph: {
      title: p.title,
      description: p.excerpt,
      type: "article",
      publishedTime: p.date,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPostBySlug(slug)
  if (!p) notFound()

  const outros = (await getPosts()).filter((o) => o.slug !== p.slug).slice(0, 3)

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/desenvolvedor/blog" className="dv-out">
        voltar ao blog
      </Link>

      <header className="mt-4">
        <h1 className="dv-title">{p.title}</h1>
        <p className="dv-sub">{p.excerpt}</p>
      </header>

      <div className="mt-3">
        <MetaRow
          items={[
            { k: "publicado", v: <time dateTime={p.date}>{formatarData(p.date)}</time> },
            { k: "leitura", v: `${p.readingMinutes} min` },
          ]}
        />
      </div>

      <TagList items={p.tags} label="Assuntos" />

      <div className="dv-prose mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.body}</ReactMarkdown>
      </div>

      {outros.length > 0 && (
        <footer className="dv-section">
          <div className="dv-section-head">
            <span className="dv-section-id" aria-hidden>
              §
            </span>
            <h2>Outros artigos</h2>
          </div>
          <ul className="dv-section-body dv-stack-tight">
            {outros.map((o) => (
              <li key={o.slug}>
                <Link href={`/desenvolvedor/blog/${o.slug}`} className="dv-out">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  )
}
