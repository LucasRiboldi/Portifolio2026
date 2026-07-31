"use client"

import Link from "next/link"

import { useAuthState } from "@/lib/auth/use-auth-state"

/**
 * Acesso administrativo incorporado ao expediente do jornal.
 *
 * Não há botão: o nome da tipografia que assina a folha é o próprio link.
 * Só se revela ao passar o cursor (filete pontilhado), preservando a
 * ilusão de página impressa. Mesma lógica do AdminFooterLink do site:
 *  - deslogado → /login
 *  - logado    → /admin
 */
export function PressMark({ label }: { label: string }) {
  const authed = useAuthState() ?? false

  return (
    <Link
      href={authed ? "/admin" : "/login"}
      className="dpx-press"
      title={authed ? "Painel de administração" : "Área administrativa"}
      aria-label={authed ? "Painel de administração" : "Área administrativa"}
    >
      {label}
    </Link>
  )
}
