"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

/**
 * Entrada discreta do admin no rodapé — acessível a partir do site publicado,
 * sem depender de ambiente local.
 *
 * Roda 100% no client (checa a sessão via Supabase no browser), então NÃO
 * força as páginas a virarem dinâmicas — o ISR do site público é preservado.
 *
 *  - deslogado → link "Admin" (discreto) para /login
 *  - logado    → link "Painel" para /admin
 */
export function AdminFooterLink() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthed(false)
      return
    }
    let active = true
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (active) setAuthed(Boolean(data.user))
    })
    return () => {
      active = false
    }
  }, [])

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
      className="text-white/25 transition-colors hover:text-white/60"
    >
      Admin
    </Link>
  )
}
