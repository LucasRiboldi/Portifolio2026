"use client"

/**
 * Estado de login no browser, para os atalhos discretos do admin (rodapé do
 * site e assinatura do jornal).
 *
 * Roda 100% no client de propósito: se estes componentes consultassem o
 * servidor, as páginas públicas virariam dinâmicas e o ISR do site iria junto.
 * Mesma escolha do arranjo anterior — só que agora a fonte é o SDK web do
 * Firebase, que mantém a sessão em IndexedDB.
 *
 * Isso é um indicador de UI, não uma autorização: o cookie httpOnly é a
 * sessão de verdade, e quem decide é o `requireAdmin()` no servidor.
 */
import { useEffect, useState } from "react"

import { observarLogin } from "@/lib/firebase/client"
import { isFirebaseConfigured } from "@/lib/firebase/config"

/** null enquanto indefinido; depois true/false. */
export function useAuthState(): boolean | null {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthed(false)
      return
    }
    // O SDK é carregado sob demanda, então a inscrição é assíncrona: guardamos
    // a função de cancelamento e respeitamos o desmonte que possa vir antes.
    let vivo = true
    let cancelar: (() => void) | undefined
    observarLogin((logado) => setAuthed(logado)).then((fn) => {
      if (vivo) cancelar = fn
      else fn()
    })
    return () => {
      vivo = false
      cancelar?.()
    }
  }, [])

  return authed
}
