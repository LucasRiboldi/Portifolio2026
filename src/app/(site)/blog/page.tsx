import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader } from "@/components/spiderverse/decor"
import { BlogCard } from "@/components/cards/blog-card"
import { getPosts } from "@/lib/repos/posts"

export const metadata = { title: "Blog" }

export default async function BlogPage() {
  const posts = await getPosts()
  const sorted = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return (
    <SvCanvas dimension="noir">
      <ArtOverlay universe="noir" />
      <ComicHeader
        kicker="Edição especial"
        title="Blog"
        highlight="noir"
        subtitle="Artigos sobre design, código e experimentos."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </SvCanvas>
  )
}
