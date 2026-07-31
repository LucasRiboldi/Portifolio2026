/**
 * Forma dos documentos de cada coleção do Firestore.
 *
 * O Postgres declarava isto nas migrations, e os testes de integridade do
 * painel liam o SQL para conferir que todo recurso do /admin aponta para tabela
 * e colunas que existem de verdade. O Firestore não tem schema — se este
 * arquivo não existisse, aquela verificação teria simplesmente sumido junto com
 * o `supabase/`, e um campo com nome errado numa definição de recurso voltaria
 * a passar despercebido até alguém abrir o formulário.
 *
 * Foi gerado a partir das migrations, na última vez em que elas existiram, e
 * agora é a declaração de referência. Documento sem schema não valida sozinho:
 * ao acrescentar campo a um recurso do painel, acrescente aqui também — é o que
 * o teste cobra.
 */

// `admin_allowlist` saiu daqui em 31/07/2026: a autorização virou
// `ADMIN_GITHUB_LOGIN` + custom claim, e a coleção não era lida por ninguém.
// A coleção órfã pode continuar no Firestore — apagar exige credencial.
export const COLECOES: Record<string, readonly string[]> = {
  artworks: ["id", "title", "description", "kind", "image", "tools", "year", "published", "sort", "created_at", "updated_at"],
  comics: ["id", "title", "author", "publisher", "cover_image", "status", "rating", "note", "published", "sort", "created_at"],
  contact_messages: ["id", "name", "email", "message", "read", "created_at"],
  devlogs: ["id", "slug", "title", "date", "summary", "body", "tags", "published", "sort", "created_at", "updated_at"],
  ideas: ["id", "title", "description", "status", "tags", "published", "sort", "created_at"],
  lab_experiments: ["id", "title", "description", "status", "stack", "demo_url", "repo_url", "published", "sort", "created_at"],
  movies: ["id", "title", "director", "year", "poster_image", "status", "rating", "note", "published", "sort", "created_at"],
  notes: ["id", "title", "body", "author", "accent", "pinned", "published", "sort", "created_at", "updated_at"],
  page_content: ["key", "kicker", "title", "highlight", "subtitle", "updated_at"],
  posts: ["id", "slug", "title", "excerpt", "date", "reading_minutes", "tags", "accent", "body", "published", "sort", "created_at", "updated_at"],
  projects: ["id", "title", "description", "category", "tags", "cover_image", "href", "featured", "published", "sort", "created_at", "updated_at", "slug", "readme"],
  prophet_about: ["id", "author", "intro", "passion", "proposal", "updated_at"],
  prophet_materias: ["id", "slug", "caderno", "page", "kicker", "headline", "subhead", "standfirst", "byline", "byline_role", "dateline", "continua_de", "dropcap", "open_line", "blocos", "pullquote", "figure", "boxes", "sign", "colofao", "remissoes", "published", "sort", "created_at", "updated_at"],
  prophet_mechanics: ["id", "slug", "title", "summary", "body", "tags", "published", "sort", "created_at", "updated_at"],
  prophet_prototypes: ["id", "title", "description", "status", "players", "playtime", "tags", "published", "sort", "created_at"],
  prophet_resources: ["id", "title", "description", "type", "file_url", "published", "sort", "created_at"],
  prophet_tutorials: ["id", "slug", "title", "summary", "body", "difficulty", "tags", "published", "sort", "created_at", "updated_at"],
  prophet_wire_news: ["slug", "hash", "title", "subtitle", "summary", "dropcap", "note", "category", "subcategory", "tags", "image", "designer", "publisher", "mechanics", "player_count", "play_time", "complexity", "year", "seo_title", "meta_description", "keywords", "hashtags", "source_name", "source_url", "published_at", "status", "created_at", "updated_at"],
  prophet_wire_runs: ["id", "started_at", "finished_at", "duration_ms", "counters", "entries", "created_at"],
  realms: ["id", "label", "glyph", "enabled", "is_default", "morph_label", "aria", "arcane_content", "sort"],
  site_config: ["id", "name", "title", "description", "github", "linkedin", "email", "location", "og_title", "og_description", "updated_at"],
  skills: ["id", "name", "command", "description", "category", "sort"],
  snippets: ["id", "title", "language", "description", "code", "tags", "published", "sort", "created_at"],
  strips: ["id", "title", "image", "setup", "punchline", "published", "sort", "created_at"],
  tools: ["id", "name", "description", "type", "stack", "emoji", "demo_url", "github_url", "sort"],
  tracks: ["id", "title", "artist", "audio_url", "cover_image", "note", "published", "sort", "created_at"],
  videos: ["id", "title", "description", "video_url", "poster_image", "kind", "published", "sort", "created_at"],
  wiki: ["id", "slug", "title", "category", "body", "published", "sort", "created_at", "updated_at"],
}

/** Nomes das coleções — equivalente à lista de tabelas. */
export const NOMES_COLECOES = Object.keys(COLECOES)

/** Campos de uma coleção (vazio quando ela não é declarada). */
export function camposDe(colecao: string): readonly string[] {
  return COLECOES[colecao] ?? []
}
