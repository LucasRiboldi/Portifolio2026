/**
 * Tipos das tabelas do Supabase — curados à mão para bater com as migrations
 * em `supabase/migrations/`. Se preferir, regenere com:
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/types.gen.ts
 */

export type ProjectCategory = "design" | "code" | "art" | "image"
export type PostAccent = "magenta" | "cyan" | "lime" | "violet"
export type SkillCategory =
  | "frontend"
  | "design"
  | "performance"
  | "quality"
  | "system"
  | "git"
  | "orchestration"
export type ToolType = "webapp" | "cli" | "extension" | "bot" | "script" | "plugin"
export type RealmId = "creative" | "developer" | "arcane"

export interface ProjectRow {
  id: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  cover_image: string
  href: string | null
  featured: boolean
  published: boolean
  sort: number
  created_at: string
  updated_at: string
}

export interface PostRow {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  reading_minutes: number
  tags: string[]
  accent: PostAccent
  body: string
  published: boolean
  sort: number
  created_at: string
  updated_at: string
}

export interface SkillRow {
  id: string
  name: string
  command: string
  description: string
  category: SkillCategory
  sort: number
}

export interface ToolRow {
  id: string
  name: string
  description: string
  type: ToolType
  stack: string[]
  emoji: string
  demo_url: string | null
  github_url: string | null
  sort: number
}

export interface SiteConfigRow {
  id: string
  name: string
  title: string
  description: string
  github: string
  linkedin: string
  email: string
  location: string
  og_title: string | null
  og_description: string | null
  updated_at: string
}

export interface RealmRow {
  id: RealmId
  label: string
  glyph: string
  enabled: boolean
  is_default: boolean
  morph_label: string
  aria: string
  /** Conteúdo do Arcane (masthead + artigos). Só usado quando id = 'arcane'. */
  arcane_content: unknown | null
  sort: number
}

export interface ContactMessageRow {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

type Table<Row> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}

export interface Database {
  public: {
    Tables: {
      projects: Table<ProjectRow>
      posts: Table<PostRow>
      skills: Table<SkillRow>
      tools: Table<ToolRow>
      site_config: Table<SiteConfigRow>
      realms: Table<RealmRow>
      contact_messages: Table<ContactMessageRow>
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
