/**
 * Troca o ID token do Firebase por um cookie de sessão.
 *
 * Substitui o antigo `/auth/callback?code=…`: no Firebase o OAuth se resolve no
 * browser (popup), e o que chega aqui já é um ID token assinado. Nada vindo do
 * client é usado sem verificação — ver `lib/auth/session.ts`.
 */
import { NextResponse } from "next/server"

import { createSession } from "@/lib/auth/session"

export async function POST(request: Request) {
  let idToken: unknown
  try {
    ;({ idToken } = (await request.json()) as { idToken?: unknown })
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 })
  }

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "idToken ausente." }, { status: 400 })
  }

  const result = await createSession(idToken)
  if (!result.ok) {
    // "forbidden" = autenticou no GitHub, mas não é o admin. 403 para a UI
    // distinguir de token inválido e mostrar a mensagem certa.
    const status = result.error === "forbidden" ? 403 : 401
    return NextResponse.json({ error: result.error }, { status })
  }

  return NextResponse.json({ ok: true })
}
