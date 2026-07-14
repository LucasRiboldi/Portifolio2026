import "server-only"

/**
 * Verificação de admin — server-side. A sessão vem do Supabase Auth (GitHub
 * OAuth); o login do GitHub é comparado com a allowlist (`ADMIN_GITHUB_LOGIN`).
 * Defesa em profundidade: o middleware barra a rota, mas TODA Server Action
 * também chama `requireAdmin()`.
 */
import { redirect } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { ADMIN_GITHUB_LOGIN, isSupabaseConfigured } from "@/lib/supabase/config"

/** Extrai o login do GitHub dos metadados do usuário. */
export function githubLogin(user: User | null): string | null {
  const meta = user?.user_metadata as Record<string, unknown> | undefined
  const login = (meta?.user_name ?? meta?.preferred_username ?? meta?.login) as
    | string
    | undefined
  return login ? login.toLowerCase() : null
}

/** Usuário logado atual (ou null). */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** True se há sessão e o login está na allowlist. */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const login = githubLogin(user)
  return Boolean(login && ADMIN_GITHUB_LOGIN && login === ADMIN_GITHUB_LOGIN)
}

/** Garante admin ou redireciona. Use no topo de páginas/actions do /admin. */
export async function requireAdmin(): Promise<User> {
  if (!isSupabaseConfigured) redirect("/login?e=config")
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  const login = githubLogin(user)
  if (!login || login !== ADMIN_GITHUB_LOGIN) redirect("/login?e=forbidden")
  return user
}
