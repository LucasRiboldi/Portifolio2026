"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

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
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (active) setAuthed(Boolean(data.user))
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <Link
      href={authed ? "/admin" : "/login"}
      className="dp-press"
      title={authed ? "Painel de administração" : "Área administrativa"}
      aria-label={authed ? "Painel de administração" : "Área administrativa"}
    >
      {label}
    </Link>
  )
}
