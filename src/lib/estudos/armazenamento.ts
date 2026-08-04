"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Persistência local do módulo de estudos.
 *
 * O realm já guarda o progresso da trilha em `dev:learn:<id>` (ver
 * `components/dev/learn-view.tsx`); aqui se mantém o mesmo prefixo e o mesmo
 * comportamento tolerante — `localStorage` pode estar bloqueado (aba anônima,
 * cookies de terceiros, cota cheia) e nesse caso a página tem de continuar
 * funcionando sem persistir, nunca quebrar.
 *
 * O par `hidratado`/valor existe porque o servidor não tem `localStorage`: ler
 * durante o render produziria markup diferente do do cliente e o React
 * acusaria erro de hidratação. Só depois do primeiro efeito o valor salvo
 * entra — e quem consome usa `hidratado` para não piscar um estado falso.
 */

/** Chave de armazenamento de uma disciplina. */
export function chave(slug: string, caixa: string): string {
  return `dev:estudos:${slug}:${caixa}`
}

function ler<T>(k: string, inicial: T): T {
  try {
    const bruto = localStorage.getItem(k)
    if (!bruto) return inicial
    const obj = JSON.parse(bruto) as unknown
    // Mescla com o inicial: um campo acrescentado ao formato depois de o
    // usuário já ter salvo não pode chegar `undefined` ao componente.
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return { ...inicial, ...(obj as object) } as T
    }
    return (obj as T) ?? inicial
  } catch {
    return inicial
  }
}

/**
 * Estado espelhado no `localStorage`, com gravação adiada.
 *
 * O adiamento é o que torna isto utilizável pela área de anotações: sem ele,
 * cada tecla digitada serializa e escreve em disco. `atraso: 0` grava na hora,
 * que é o certo para um clique de checkbox.
 */
export function useArmazenamentoLocal<T>(
  k: string,
  inicial: T,
  atraso = 0,
): {
  valor: T
  definir: (proximo: T | ((atual: T) => T)) => void
  hidratado: boolean
  /** ISO da última gravação — `null` enquanto nada foi salvo. */
  salvoEm: string | null
  limpar: () => void
} {
  const [valor, setValor] = useState<T>(inicial)
  const [hidratado, setHidratado] = useState(false)
  const [salvoEm, setSalvoEm] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Recarrega ao trocar de chave (trocar de disciplina, por exemplo).
  useEffect(() => {
    setValor(ler(k, inicial))
    setSalvoEm(localStorage.getItem(`${k}:em`))
    setHidratado(true)
    // `inicial` fica fora: é literal recriado a cada render e reiniciaria o
    // estado em toda atualização do componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])

  useEffect(() => {
    if (!hidratado) return
    const grava = () => {
      try {
        const agora = new Date().toISOString()
        localStorage.setItem(k, JSON.stringify(valor))
        localStorage.setItem(`${k}:em`, agora)
        setSalvoEm(agora)
      } catch {
        /* sem espaço ou sem permissão — segue sem persistir */
      }
    }
    if (atraso <= 0) {
      grava()
      return
    }
    timer.current = setTimeout(grava, atraso)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [k, valor, hidratado, atraso])

  const definir = useCallback((proximo: T | ((atual: T) => T)) => {
    setValor((atual) =>
      typeof proximo === "function" ? (proximo as (a: T) => T)(atual) : proximo,
    )
  }, [])

  const limpar = useCallback(() => {
    try {
      localStorage.removeItem(k)
      localStorage.removeItem(`${k}:em`)
    } catch {
      /* idem */
    }
    setSalvoEm(null)
    setValor(inicial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k])

  return { valor, definir, hidratado, salvoEm, limpar }
}
