/**
 * Configuração/estado do Supabase compartilhado pelos clientes e repositórios.
 *
 * O site foi desenhado para funcionar COM ou SEM Supabase conectado:
 * enquanto as env vars não existem, os repositórios caem no seed estático
 * (`src/data/*.ts`). Assim o build permanece verde e o CMS "liga" quando o
 * projeto Supabase é configurado.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/** True quando URL + anon key estão presentes (client/SSR podem falar com o banco). */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** Login do GitHub único autorizado no /admin. */
export const ADMIN_GITHUB_LOGIN = (process.env.ADMIN_GITHUB_LOGIN ?? "").toLowerCase()
