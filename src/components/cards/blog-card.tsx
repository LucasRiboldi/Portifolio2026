import Link from "next/link"
import type { Post } from "@/data/posts"

const ACCENT: Record<Post["accent"], string> = {
  magenta: "var(--sv-magenta)",
  cyan: "var(--sv-cyan)",
  lime: "var(--sv-lime)",
  violet: "var(--sv-violet)",
}

export function BlogCard({ post }: { post: Post }) {
  const date = new Date(post.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="sv-panel art-paper art-hover-jitter relative h-full overflow-hidden p-5">
        <span aria-hidden className="absolute left-0 top-0 h-1.5 w-full" style={{ background: ACCENT[post.accent] }} />
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wide text-white/45">
          <span>{date}</span><span>·</span><span>{post.readingMinutes} min</span>
        </div>
        <h3 className="sv-display mt-2 text-2xl uppercase leading-tight text-white transition-colors group-hover:text-[var(--sv-cyan)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-white/65">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded border-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide" style={{ borderColor: ACCENT[post.accent], color: ACCENT[post.accent] }}>
              {t}
            </span>
          ))}
        </div>
        <span className="sv-heavy mt-4 inline-block text-xs uppercase tracking-wide" style={{ color: ACCENT[post.accent] }}>
          Ler artigo →
        </span>
      </article>
    </Link>
  )
}
