"use client"

import Link from "next/link"

import { useAuthState } from "@/lib/auth/use-auth-state"

/**
 * Entrada discreta do admin no rodapé — acessível a partir do site publicado,
 * sem depender de ambiente local.
 *
 * Roda 100% no client (checa a sessão via Firebase no browser), então NÃO
 * força as páginas a virarem dinâmicas — o ISR do site público é preservado.
 *
 *  - deslogado → link "Admin" (discreto) para /login
 *  - logado    → link "Painel" para /admin
 */
export function AdminFooterLink() {
  const authed = useAuthState()

  if (authed) {
    return (
      <Link
        href="/admin"
        className="text-white/50 underline-offset-4 transition-colors hover:text-[var(--sv-cyan)] hover:underline"
      >
        Painel
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      aria-label="Área administrativa"
      // /55 sobre o rodapé escuro alcança ~4.5:1 (AA para texto pequeno); antes
      // /25 dava 2.1:1 e reprovava. O sublinhado distingue o link do texto ao
      // redor por algo além da cor (evita o link-in-text-block). Segue discreto.
      className="text-white/55 underline underline-offset-2 transition-colors hover:text-white/80"
    >
      Admin
    </Link>
  )
}
