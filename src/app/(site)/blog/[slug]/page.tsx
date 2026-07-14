import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { SvTag, SvBreadcrumb } from "@/components/ui/sv-data"
import { posts, getPost } from "@/data/posts"
import { siteConfig } from "@/constants/site"

const ACCENT: Record<string, string> = {
  magenta: "var(--sv-magenta)", cyan: "var(--sv-cyan)", lime: "var(--sv-lime)", violet: "var(--sv-violet)",
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Artigo não encontrado" }
  return { title: post.title, description: post.excerpt }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const accent = ACCENT[post.accent]
  const date = new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })

  return (
    <SvCanvas dimension="noir">
      <ArtOverlay universe="noir" />
      <article className="mx-auto max-w-2xl">
        <Link href="/blog" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
          <ArrowLeft className="size-3.5" /> Blog
        </Link>

        <SvBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {post.tags.map((t) => <SvTag key={t} color={post.accent}>{t}</SvTag>)}
          <span className="inline-flex items-center gap-1 text-xs text-white/40"><Clock className="size-3" /> {post.readingMinutes} min</span>
        </div>

        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl uppercase leading-tight text-white sm:text-5xl [-webkit-text-stroke:1px_#000]">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 border-y-2 border-white/10 py-3">
          <span className="grid size-10 place-items-center rounded-full border-2 border-black font-[family-name:var(--font-heavy)] text-black" style={{ background: accent }}>LR</span>
          <div className="text-xs">
            <div className="font-bold text-white">{siteConfig.name}</div>
            <div className="text-white/40">{date}</div>
          </div>
        </div>

        <div className="sv-article art-paper mt-6 text-sm leading-relaxed text-white/80" style={{ ["--accent" as string]: accent } as React.CSSProperties}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>
    </SvCanvas>
  )
}
