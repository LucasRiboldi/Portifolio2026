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
      { name: "tags", label: "Tecnologias", type: "tags", help: "separadas por vírgula" },
      { name: "cover_image", label: "Imagem de capa", type: "media" },
      { name: "slug", label: "Slug", type: "text", help: "url da página do projeto" },
      { name: "href", label: "Link do repositório", type: "text" },
      { name: "readme", label: "README (Markdown)", type: "markdown" },
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
      slug: z.preprocess((v) => (v === "" ? null : v), z.string().regex(/^[a-z0-9-]+$/, "minúsculas, números e hífens").nullable()),
      href: optText,
      readme: z.string().default(""),
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

  // ─── Realm DAILY PROPHET ──────────────────────────────────────────────
  tutorials: {
    slug: "tutorials",
    label: "Oficina (Tutoriais)",
    singular: "Tutorial",
    tag: CACHE_TAGS.tutorials,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "difficulty", label: "Nível" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Resumo", type: "textarea" },
      { name: "body", label: "Conteúdo (Markdown)", type: "markdown" },
      {
        name: "difficulty",
        label: "Nível",
        type: "select",
        options: [
          { value: "iniciante", label: "Iniciante" },
          { value: "intermediario", label: "Intermediário" },
          { value: "avancado", label: "Avançado" },
        ],
      },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "minúsculas, números e hífens"),
      summary: z.string().default(""),
      body: z.string().default(""),
      difficulty: z.enum(["iniciante", "intermediario", "avancado"]).default("iniciante"),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  mechanics: {
    slug: "mechanics",
    label: "Caderno (Mecânicas)",
    singular: "Mecânica",
    tag: CACHE_TAGS.mechanics,
    orderBy: { column: "sort", ascending: true },
    columns: [{ name: "title", label: "Mecânica" }],
    fields: [
      { name: "title", label: "Nome", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "summary", label: "Resumo", type: "textarea" },
      { name: "body", label: "Explicação (Markdown)", type: "markdown" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Nome obrigatório"),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "minúsculas, números e hífens"),
      summary: z.string().default(""),
      body: z.string().default(""),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  prototypes: {
    slug: "prototypes",
    label: "Laboratório (Protótipos)",
    singular: "Protótipo",
    tag: CACHE_TAGS.prototypes,
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
          { value: "conceito", label: "Conceito" },
          { value: "prototipo", label: "Protótipo" },
          { value: "playtest", label: "Playtest" },
          { value: "publicado", label: "Publicado" },
        ],
      },
      { name: "players", label: "Jogadores", type: "text", placeholder: "2–4" },
      { name: "playtime", label: "Duração", type: "text", placeholder: "45 min" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      status: z.enum(["conceito", "prototipo", "playtest", "publicado"]).default("conceito"),
      players: z.string().default(""),
      playtime: z.string().default(""),
      tags: tagList,
      published: bool,
      sort: int,
    }),
  },

  resources: {
    slug: "resources",
    label: "Imprensa (Recursos)",
    singular: "Recurso",
    tag: CACHE_TAGS.resources,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "type", label: "Tipo" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "type",
        label: "Tipo",
        type: "select",
        options: [
          { value: "pnp", label: "Print & Play" },
          { value: "cartas", label: "Cartas" },
          { value: "tabuleiro", label: "Tabuleiro" },
          { value: "regras", label: "Regras" },
          { value: "outro", label: "Outro" },
        ],
      },
      { name: "file_url", label: "Arquivo (URL)", type: "media" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      type: z.enum(["pnp", "cartas", "tabuleiro", "regras", "outro"]).default("pnp"),
      file_url: optText,
      published: bool,
      sort: int,
    }),
  },

  // ─── Zonas da landing /criativo ──────────────────────────────────────
  // Cada uma é uma "dimensão" da página pessoal: ateliê, banca, cine,
  // rádio, videoteca, mural e tirinhas.

  artworks: {
    slug: "artworks",
    label: "Ateliê (Artes)",
    singular: "Arte",
    tag: CACHE_TAGS.artworks,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "kind", label: "Tipo" },
      { name: "year", label: "Ano" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      {
        name: "kind",
        label: "Tipo",
        type: "select",
        options: [
          { value: "ilustracao", label: "Ilustração" },
          { value: "edicao", label: "Edição de imagem" },
          { value: "3d", label: "3D" },
          { value: "pixel", label: "Pixel art" },
          { value: "vetor", label: "Vetor" },
          { value: "colagem", label: "Colagem" },
        ],
      },
      { name: "image", label: "Imagem", type: "media" },
      { name: "tools", label: "Ferramentas", type: "tags", help: "separadas por vírgula" },
      { name: "year", label: "Ano", type: "number" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      kind: z.enum(["ilustracao", "edicao", "3d", "pixel", "vetor", "colagem"]).default("ilustracao"),
      image: z.string().default(""),
      tools: tagList,
      year: int,
      published: bool,
      sort: int,
    }),
  },

  comics: {
    slug: "comics",
    label: "Banca (Quadrinhos)",
    singular: "Quadrinho",
    tag: CACHE_TAGS.comics,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "author", label: "Autor" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "author", label: "Autor", type: "text" },
      { name: "publisher", label: "Editora", type: "text" },
      { name: "cover_image", label: "Capa", type: "media" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "lendo", label: "Lendo agora" },
          { value: "lido", label: "Lido" },
          { value: "fila", label: "Na fila" },
          { value: "largado", label: "Larguei" },
        ],
      },
      { name: "rating", label: "Nota (0–5)", type: "number", help: "0 = sem nota" },
      { name: "note", label: "Comentário", type: "textarea" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      author: z.string().default(""),
      publisher: z.string().default(""),
      cover_image: z.string().default(""),
      status: z.enum(["lendo", "lido", "fila", "largado"]).default("lendo"),
      rating: z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int().min(0).max(5)),
      note: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },

  movies: {
    slug: "movies",
    label: "Cine (Filmes)",
    singular: "Filme",
    tag: CACHE_TAGS.movies,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "director", label: "Direção" },
      { name: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "director", label: "Direção", type: "text" },
      { name: "year", label: "Ano", type: "number" },
      { name: "poster_image", label: "Pôster", type: "media" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "assistido", label: "Assistido" },
          { value: "assistindo", label: "Assistindo" },
          { value: "fila", label: "Na fila" },
        ],
      },
      { name: "rating", label: "Nota (0–5)", type: "number", help: "0 = sem nota" },
      { name: "note", label: "Comentário", type: "textarea" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      director: z.string().default(""),
      year: int,
      poster_image: z.string().default(""),
      status: z.enum(["assistido", "assistindo", "fila"]).default("assistido"),
      rating: z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int().min(0).max(5)),
      note: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },

  tracks: {
    slug: "tracks",
    label: "Rádio (Música)",
    singular: "Faixa",
    tag: CACHE_TAGS.tracks,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "artist", label: "Artista" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "artist", label: "Artista", type: "text" },
      { name: "audio_url", label: "Áudio (mp3/ogg)", type: "media", help: "o player é local, não embed" },
      { name: "cover_image", label: "Capa", type: "media" },
      { name: "note", label: "Comentário", type: "textarea" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      artist: z.string().default(""),
      audio_url: z.string().default(""),
      cover_image: z.string().default(""),
      note: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },

  videos: {
    slug: "videos",
    label: "Videoteca",
    singular: "Vídeo",
    tag: CACHE_TAGS.videos,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "kind", label: "Origem" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "video_url", label: "Vídeo (arquivo ou URL)", type: "media" },
      { name: "poster_image", label: "Pôster", type: "media" },
      {
        name: "kind",
        label: "Origem",
        type: "select",
        options: [
          { value: "local", label: "Arquivo local" },
          { value: "youtube", label: "YouTube" },
          { value: "vimeo", label: "Vimeo" },
        ],
      },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      description: z.string().default(""),
      video_url: z.string().default(""),
      poster_image: z.string().default(""),
      kind: z.enum(["local", "youtube", "vimeo"]).default("local"),
      published: bool,
      sort: int,
    }),
  },

  notes: {
    slug: "notes",
    label: "Mural (Recados)",
    singular: "Recado",
    tag: CACHE_TAGS.notes,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "author", label: "Autor" },
      { name: "pinned", label: "Fixado" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "body", label: "Recado", type: "textarea", required: true },
      { name: "author", label: "Autor", type: "text" },
      {
        name: "accent",
        label: "Cor do papel",
        type: "select",
        options: [
          { value: "yellow", label: "Amarelo" },
          { value: "cyan", label: "Ciano" },
          { value: "magenta", label: "Magenta" },
          { value: "lime", label: "Lima" },
          { value: "orange", label: "Laranja" },
          { value: "violet", label: "Violeta" },
        ],
      },
      { name: "pinned", label: "Fixado no topo", type: "boolean" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().default(""),
      body: z.string().min(1, "Recado obrigatório"),
      author: z.string().default("Lucas"),
      accent: z.enum(["yellow", "cyan", "magenta", "lime", "orange", "violet"]).default("yellow"),
      pinned: bool,
      published: bool,
      sort: int,
    }),
  },

  strips: {
    slug: "strips",
    label: "Tirinhas",
    singular: "Tirinha",
    tag: CACHE_TAGS.strips,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "title", label: "Título" },
      { name: "setup", label: "Setup" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "image", label: "Imagem da tira", type: "media", help: "opcional — sem imagem, vira tira de texto" },
      { name: "setup", label: "Quadro 1 (setup)", type: "textarea" },
      { name: "punchline", label: "Quadro 2 (punchline)", type: "textarea" },
      { name: "published", label: "Publicado", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      title: z.string().min(1, "Título obrigatório"),
      image: z.string().default(""),
      setup: z.string().default(""),
      punchline: z.string().default(""),
      published: bool,
      sort: int,
    }),
  },
}

/** Recurso destino do "table" no Supabase (nem sempre == slug). */
const TABLE_MAP: Record<string, string> = {
  lab: "lab_experiments",
  tutorials: "prophet_tutorials",
  mechanics: "prophet_mechanics",
  prototypes: "prophet_prototypes",
  resources: "prophet_resources",
}
export function resourceTable(slug: string): string {
  return TABLE_MAP[slug] ?? slug
}

export function getResource(slug: string): ResourceConfig | null {
  return RESOURCES[slug] ?? null
}
