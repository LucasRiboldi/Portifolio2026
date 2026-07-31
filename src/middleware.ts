/**
 * Middleware — barra /admin para quem não tem cookie de sessão.
 *
 * Diferença importante em relação ao arranjo anterior: aqui NÃO validamos a
 * sessão. O middleware roda no Edge Runtime, onde o Firebase Admin SDK (que
 * depende de APIs Node e de criptografia própria) não roda — não há como
 * verificar a assinatura do cookie neste ponto.
 *
 * Isso é seguro porque a verificação real nunca esteve aqui: `requireAdmin()`
 * é chamado no topo de toda página e Server Action do /admin, e é ele quem
 * decide. Este middleware é um filtro barato, que evita renderizar o painel
 * para quem obviamente não está logado — um cookie forjado passa por ele e
 * morre no `requireAdmin()`, com redirect para /login.
 */
import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE } from "@/lib/firebase/config"

export function middleware(request: NextRequest) {
  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
