/**
 * Configuração declarativa dos recursos de conteúdo do /admin.
 * Um único config dirige: colunas da lista, campos do formulário, validação
 * (zod) e a tag de cache a revalidar. Adicionar uma entidade = uma entrada aqui.
 */
import { z } from "zod"

import { CACHE_TAGS, type CacheTag } from "@/lib/repos/tags"

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "select"
  | "tags"
  | "boolean"
  | "media"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
}

export interface ResourceConfig {
  slug: string
  label: string
  singular: string
  tag: CacheTag
  /** colunas exibidas na listagem */
  columns: { name: string; label: string }[]
  /** ordenação da listagem */
  orderBy: { column: string; ascending: boolean }
  fields: FieldConfig[]
  schema: z.ZodTypeAny
}

const tagList = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(v)
        ? v
        : [],
  z.array(z.string()),
)

const bool = z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean())
const int = z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int())
const optText = z.preprocess((v) => (v === "" ? null : v), z.string().nullable())

export const RESOURCES: Record<string, ResourceConfig> = {
  projects: {
    slug: "projects",
    label: "Projetos",
    singular: "Projeto",
    tag: CACHE_TAGS.projects,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "category", label: "Categoria" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "category",
        label: "Categoria",
        type: "select",
        required: true,
        options: [
          { value: "design", label: "Design" },
          { value: "code", label: "Código" },
          { value: "art", label: "Arte" },
          { value: "image", label: "Imagem" },
        ],
      },
      { name: "tags", label: "Tags", type: "tags", help: "separadas por vírgula" },
      { name: "cover_image", label: "Imagem de capa", type: "media" },
      { name: "href", label: "Link", type: "text" },
      { name: "featured", label: "Destaque", type: "boolean" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      category: z.enum(["design", "code", "art", "image"]),
      tags: tagList,
      cover_image: z.string().default(""),
      href: optText,
      featured: bool,
      published: bool,
      sort: int,
    }),
  },

  posts: {
    slug: "posts",
    label: "Blog",
    singular: "Post",
    tag: CACHE_TAGS.posts,
    orderBy: { column: "date", ascending: false },
    columns: [
      { name: "title", label: "Título" },
      { name: "date", label: "Data" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "url-amigável, único" },
      { name: "excerpt", label: "Resumo", type: "textarea" },
      { name: "date", label: "Data", type: "text", placeholder: "2026-07-14" },
      { name: "reading_minutes", label: "Minutos de leitura", type: "number" },
      { name: "tags", label: "Tags", type: "tags" },
      {
        name: "accent",
        label: "Cor de destaque",
        type: "select",
        options: [
          { value: "magenta", label: "Magenta" },
          { value: "cyan", label: "Cyan" },
          { value: "lime", label: "Lime" },
          { value: "violet", label: "Violet" },
        ],
      },
      { name: "body", label: "Conteúdo (Markdown)", type: "markdown" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      slug: z.string().min(1, "Slug obrigatório").regex(/^[a-z0-9-]+$/, "use minúsculas, números e hífens"),
      excerpt: z.string().default(""),
      date: z.string().default(() => new Date().toISOString().slice(0, 10)),
      reading_minutes: int,
      tags: tagList,
      accent: z.enum(["magenta", "cyan", "lime", "violet"]).default("magenta"),
      body: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },

  skills: {
    slug: "skills",
    label: "Skills",
    singular: "Skill",
    tag: CACHE_TAGS.skills,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "name", label: "Nome" },
      { name: "category", label: "Categoria" },
    ],
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "command", label: "Comando", type: "text", placeholder: "/nome-da-skill" },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "category",
        label: "Categoria",
        type: "select",
        required: true,
        options: [
          { value: "frontend", label: "Frontend" },
          { value: "design", label: "Design" },
          { value: "performance", label: "Performance" },
          { value: "quality", label: "Qualidade" },
          { value: "system", label: "Sistema" },
          { value: "git", label: "Git" },
          { value: "orchestration", label: "Orquestração" },
        ],
      },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      name: z.string().min(1, "Nome obrigatório"),
      command: z.string().default(""),
      description: z.string().default(""),
      category: z.enum([
        "frontend",
        "design",
        "performance",
        "quality",
        "system",
        "git",
        "orchestration",
      ]),
      sort: int,
    }),
  },

  tools: {
    slug: "tools",
    label: "Ferramentas",
    singular: "Ferramenta",
    tag: CACHE_TAGS.tools,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "name", label: "Nome" },
      { name: "type", label: "Tipo" },
    ],
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "type",
        label: "Tipo",
        type: "select",
        required: true,
        options: [
          { value: "webapp", label: "Web App" },
          { value: "cli", label: "CLI" },
          { value: "extension", label: "Extensão" },
          { value: "bot", label: "Bot" },
          { value: "script", label: "Script" },
          { value: "plugin", label: "Plugin Figma" },
        ],
      },
      { name: "stack", label: "Stack", type: "tags" },
      { name: "emoji", label: "Emoji", type: "text" },
      { name: "demo_url", label: "Demo URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      name: z.string().min(1, "Nome obrigatório"),
      description: z.string().default(""),
      type: z.enum(["webapp", "cli", "extension", "bot", "script", "plugin"]),
      stack: tagList,
      emoji: z.string().default(""),
      demo_url: optText,
      github_url: optText,
      sort: int,
    }),
  },

  // ─── Realm DEV ────────────────────────────────────────────────────────
  devlogs: {
    slug: "devlogs",
    label: "DevLogs",
    singular: "DevLog",
    tag: CACHE_TAGS.devlogs,
    orderBy: { column: "date", ascending: false },
    columns: [
      { name: "title", label: "Título" },
      { name: "date", label: "Data" },
      { name: "published", label: "Publicado" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "date", label: "Data", type: "text", placeholder: "2026-07-14" },
      { name: "summary", label: "Resumo", type: "textarea" },
      { name: "body", label: "Conteúdo (Markdown)", type: "markdown" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "minúsculas, números e hífens"),
      date: z.string().default(() => new Date().toISOString().slice(0, 10)),
      summary: z.string().default(""),
      body: z.string().default(""),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  ideas: {
    slug: "ideas",
    label: "Ideias",
    singular: "Ideia",
    tag: CACHE_TAGS.ideas,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "idea", label: "Ideia" },
          { value: "mvp", label: "MVP" },
          { value: "building", label: "Em construção" },
          { value: "paused", label: "Pausado" },
          { value: "done", label: "Concluído" },
        ],
      },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      status: z.enum(["idea", "mvp", "building", "paused", "done"]).default("idea"),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  snippets: {
    slug: "snippets",
    label: "Código",
    singular: "Snippet",
    tag: CACHE_TAGS.snippets,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "language", label: "Linguagem" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "language", label: "Linguagem", type: "text", placeholder: "ts, tsx, py…" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "code", label: "Código", type: "markdown" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      language: z.string().default("ts"),
      description: z.string().default(""),
      code: z.string().default(""),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  wiki: {
    slug: "wiki",
    label: "Wiki",
    singular: "Página",
    tag: CACHE_TAGS.wiki,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "category", label: "Categoria" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "category", label: "Categoria", type: "text", placeholder: "Geral" },
      { name: "body", label: "Conteúdo (Markdown)", type: "markdown" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "minúsculas, números e hífens"),
      category: z.string().default("Geral"),
      body: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },

  lab: {
    slug: "lab",
    label: "Laboratório",
    singular: "Experimento",
    tag: CACHE_TAGS.lab,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "wip", label: "WIP" },
          { value: "playtest", label: "Playtest" },
          { value: "stable", label: "Estável" },
          { value: "archived", label: "Arquivado" },
        ],
      },
      { name: "stack", label: "Stack", type: "tags" },
      { name: "demo_url", label: "Demo URL", type: "text" },
      { name: "repo_url", label: "Repo URL", type: "text" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      status: z.enum(["wip", "playtest", "stable", "archived"]).default("wip"),
      stack: tagList,
      demo_url: optText,
      repo_url: optText,
      published: bool,
      sort: int,
    }),
  },
}

/** Recurso destino do "table" no Supabase (nem sempre == slug). */
export function resourceTable(slug: string): string {
  return slug === "lab" ? "lab_experiments" : slug
}

export function getResource(slug: string): ResourceConfig | null {
  return RESOURCES[slug] ?? null
}
