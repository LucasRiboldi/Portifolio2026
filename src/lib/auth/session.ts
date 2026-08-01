import "server-only"

/**
 * Sessão do admin — cookie assinado pelo Firebase Admin SDK.
 *
 * Por que não usar o token do SDK web direto: o Firebase Auth é client-first e
 * guarda o ID token em IndexedDB, invisível para o servidor. Server Components e
 * Server Actions precisam de um cookie. O caminho oficial é trocar o ID token
 * (curto, 1h) por um **session cookie** (longo, httpOnly), que o servidor
 * verifica sem depender do browser. É o equivalente ao que o @supabase/ssr fazia
 * por baixo dos panos.
 *
 * O login do GitHub não vem no ID token — o Firebase guarda o *id numérico* do
 * provider. Resolvemos o login uma única vez, na criação da sessão, e gravamos
 * como custom claim; daí em diante a checagem é local.
 */
import { cache } from "react"
import { cookies } from "next/headers"

import { getAdminAuth } from "@/lib/firebase/admin"
import { ADMIN_GITHUB_LOGIN, SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/firebase/config"
import { githubLoginFromProviderId } from "./github"

/** Usuário autenticado, já normalizado — substitui o `User` do supabase-js. */
export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  githubLogin: string | null
}

interface ClaimsAdmin {
  admin?: boolean
  githubLogin?: string
}

/**
 * Cria a sessão a partir de um ID token recém-emitido.
 *
 * Recusa quem não está na allowlist: diferente do arranjo anterior — onde
 * qualquer conta GitHub obtinha sessão e só o /admin era barrado — aqui sem
 * allowlist não há cookie nenhum. Menos superfície, mesmo resultado prático,
 * já que o site não tem área logada além do painel.
 */
export async function createSession(
  idToken: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = getAdminAuth()

  let decoded
  try {
    decoded = await auth.verifyIdToken(idToken, true)
  } catch {
    return { ok: false, error: "Token inválido ou expirado." }
  }

  const claims = decoded as unknown as ClaimsAdmin
  let login = claims.githubLogin ?? null

  if (!login) {
    // Primeiro login: descobrir o username a partir do id numérico do provider.
    // Nunca confiamos em nada vindo do client para isto.
    const user = await auth.getUser(decoded.uid)
    const github = user.providerData.find((p) => p.providerId === "github.com")
    if (!github) return { ok: false, error: "Sessão sem provedor GitHub." }
    login = await githubLoginFromProviderId(github.uid)
    if (!login) return { ok: false, error: "Não foi possível confirmar a conta do GitHub." }
  }

  if (!ADMIN_GITHUB_LOGIN || login.toLowerCase() !== ADMIN_GITHUB_LOGIN) {
    return { ok: false, error: "forbidden" }
  }

  await auth.setCustomUserClaims(decoded.uid, { admin: true, githubLogin: login.toLowerCase() })

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  })

  const store = await cookies()
  store.set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  })

  return { ok: true }
}

/**
 * Lê e valida a sessão. Devolve null quando não há cookie, está expirado ou
 * revogado.
 *
 * As claims são lidas do *registro* do usuário, não do cookie: claims gravadas
 * depois da emissão de um token só apareceriam nele na renovação seguinte (até
 * 1h de atraso). Consultar o registro é o que mantém a decisão sempre correta.
 *
 * ------------------------------------------------------------------
 * POR QUE `cache()` DO REACT, E NÃO UM CACHE COM PRAZO
 * ------------------------------------------------------------------
 * Cada chamada custa DUAS idas ao Admin SDK (`verifySessionCookie` e
 * `getUser`), e um mesmo request costuma chamar isto mais de uma vez — o
 * layout do `/admin` chama, e a Server Action que ele dispara chama de novo,
 * dentro do mesmo request.
 *
 * `cache()` memoriza **dentro de um request** e esquece no seguinte. É o que
 * elimina a repetição sem custo nenhum de correção: revogar uma claim ou uma
 * sessão continua valendo já no próximo request.
 *
 * Um cache com prazo (mesmo "curto", 30s) compraria menos e custaria caro:
 * abriria uma janela em que uma sessão revogada segue valendo. Num portão de
 * admin, essa janela é exatamente o que não se quer — por isso não foi feito
 * assim, e não é para "melhorar" depois.
 */
export const verifySession = cache(async (): Promise<AppUser | null> => {
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE)?.value
  if (!cookie) return null

  try {
    const auth = getAdminAuth()
    const decoded = await auth.verifySessionCookie(cookie, true)
    const user = await auth.getUser(decoded.uid)
    const claims = (user.customClaims ?? {}) as ClaimsAdmin
    return {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      githubLogin: claims.githubLogin ?? null,
    }
  } catch {
    return null
  }
})

/** Apaga o cookie e revoga os refresh tokens do usuário. */
export async function destroySession(): Promise<void> {
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE)?.value
  store.delete(SESSION_COOKIE)
  if (!cookie) return
  try {
    const auth = getAdminAuth()
    const decoded = await auth.verifySessionCookie(cookie, false)
    await auth.revokeRefreshTokens(decoded.sub)
  } catch {
    // Cookie já inválido: apagar basta.
  }
}
