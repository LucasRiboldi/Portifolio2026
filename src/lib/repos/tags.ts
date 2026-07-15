/** Tags de cache para ISR on-demand (revalidateTag ao salvar no admin). */
export const CACHE_TAGS = {
  projects: "projects",
  posts: "posts",
  skills: "skills",
  tools: "tools",
  site: "site-config",
  realms: "realms",
  devlogs: "devlogs",
  ideas: "ideas",
  snippets: "snippets",
  wiki: "wiki",
  lab: "lab",
  tutorials: "tutorials",
  mechanics: "mechanics",
  prototypes: "prototypes",
  resources: "resources",
  prophetAbout: "prophet-about",
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]
