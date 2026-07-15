import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader } from "@/components/spiderverse/decor"
import { BlogCard } from "@/components/cards/blog-card"
import { getPosts } from "@/lib/repos/posts"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Blog" }

export default async function BlogPage() {
  const [posts, c] = await Promise.all([getPosts(), getPageContent("blog")])
  const sorted = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return (
    <SvCanvas dimension="noir">
      <ArtOverlay universe="noir" />
      <ComicHeader kicker={c.kicker} title={c.title} highlight={c.highlight} subtitle={c.subtitle} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </SvCanvas>
  )
}
