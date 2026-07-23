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
      // /55 sobre o rodapé escuro alcança ~4.5:1 (AA para texto pequeno); antes
      // /25 dava 2.1:1 e reprovava. Segue discreto, mas legível.
      className="text-white/55 transition-colors hover:text-white/80"
    >
      Admin
    </Link>
  )
}
