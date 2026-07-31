import "server-only"

/**
 * Verificação de admin — server-side. A sessão vem do Firebase Auth (GitHub
 * OAuth) por cookie assinado; o login do GitHub é comparado com a allowlist
 * (`ADMIN_GITHUB_LOGIN`).
 *
 * Defesa em profundidade: o middleware barra a rota, mas TODA Server Action
 * também chama `requireAdmin()`. Isso passou a importar ainda mais depois da
 * migração — o middleware roda no Edge, onde o Admin SDK não existe, então lá a
 * checagem é apenas a presença do cookie. A autoridade é aqui.
 */
import { redirect } from "next/navigation"

import { ADMIN_GITHUB_LOGIN } from "@/lib/firebase/config"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { verifySession, type AppUser } from "./session"

/** Login do GitHub do usuário (já resolvido na criação da sessão). */
export function githubLogin(user: AppUser | null): string | null {
  return user?.githubLogin ? user.githubLogin.toLowerCase() : null
}

/** Usuário logado atual (ou null). */
export async function getCurrentUser(): Promise<AppUser | null> {
  if (!isFirebaseAdminConfigured) return null
  return verifySession()
}

/** True se há sessão e o login está na allowlist. */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const login = githubLogin(user)
  return Boolean(login && ADMIN_GITHUB_LOGIN && login === ADMIN_GITHUB_LOGIN)
}

/** Garante admin ou redireciona. Use no topo de páginas/actions do /admin. */
export async function requireAdmin(): Promise<AppUser> {
  if (!isFirebaseAdminConfigured) redirect("/login?e=config")
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  const login = githubLogin(user)
  if (!login || login !== ADMIN_GITHUB_LOGIN) redirect("/login?e=forbidden")
  return user
}

export type { AppUser }
