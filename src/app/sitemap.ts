import type { MetadataRoute } from "next"

const SITE_URL = "https://portifolio2026-two.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "", "/portfolio", "/dimensoes", "/styleguide", "/design-system",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))
}
