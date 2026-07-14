/**
 * Middleware — renova a sessão do Supabase em cada request e protege /admin.
 * A checagem de allowlist definitiva é server-side (requireAdmin); aqui só
 * barramos quem não tem sessão nenhuma (redireciona para /login).
 */
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Sem Supabase configurado: /admin fica inacessível (sem como autenticar).
  if (!isSupabaseConfigured) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("e", "config")
      return NextResponse.redirect(url)
    }
    return response
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
