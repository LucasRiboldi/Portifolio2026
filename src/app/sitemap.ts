import type { MetadataRoute } from "next"

const SITE_URL = "https://portifolio2026-two.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // /styleguide fora de propósito: virou redirect para o guia do Criativo.
    // Sitemap não deve anunciar rota que só redireciona.
    "", "/portfolio", "/cards", "/dimensoes", "/design-system",
    "/design-system/realms/creative",
    "/design-system/realms/developer",
    "/design-system/realms/arcane",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))
}
