import type { MetadataRoute } from "next"
import { getPosts } from "@/lib/repos/posts"

const SITE_URL = "https://portifolio2026-two.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const routes = [
    "", "/portfolio", "/tools", "/skills", "/blog", "/about", "/contact",
    "/dimensoes", "/styleguide", "/design-system",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  const blogRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...routes, ...blogRoutes]
}
