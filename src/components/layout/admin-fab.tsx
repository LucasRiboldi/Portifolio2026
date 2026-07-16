"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Lock } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

/**
 * Botão flutuante global de acesso ao admin, presente em todas as páginas.
 * Roda 100% no client (checa a sessão via Supabase), preservando o ISR.
 *  - deslogado → /login
 *  - logado    → /admin
 */
export function AdminFab() {
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

  const href = authed ? "/admin" : "/login"
  const label = authed ? "Painel de administração" : "Área administrativa"

  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/65 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black"
    >
      <Lock className="size-3.5" />
      Admin
    </Link>
  )
}
