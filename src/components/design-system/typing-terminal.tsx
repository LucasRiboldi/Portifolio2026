"use client"

import { useEffect, useState } from "react"

/**
 * TypingTerminal — tela CRT que "emite mensagens" com efeito máquina de
 * escrever, cursor piscante e scanlines. Faz loop pela lista de linhas.
 */
export function TypingTerminal({
  lines,
  className,
  speed = 32,
}: {
  lines: string[]
  className?: string
  speed?: number
}) {
  const [done, setDone] = useState<string[]>([])
  const [current, setCurrent] = useState("")
  const [li, setLi] = useState(0)
  const [ci, setCi] = useState(0)

  useEffect(() => {
    const line = lines[li % lines.length] ?? ""
    if (ci < line.length) {
      const t = setTimeout(() => {
        setCurrent(line.slice(0, ci + 1))
        setCi(ci + 1)
      }, speed)
      return () => clearTimeout(t)
    }
    // linha completa: pausa, commita e avança
    const t = setTimeout(() => {
      setDone((d) => {
        const next = [...d, line]
        return next.length > 8 ? next.slice(-8) : next
      })
      setCurrent("")
      setCi(0)
      setLi(li + 1)
    }, 900)
    return () => clearTimeout(t)
  }, [ci, li, lines, speed])

  return (
    <div className={`crt ${className ?? ""}`} role="log" aria-label="Terminal">
      {done.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      <div>
        {current}
        <span className="crt-cursor" aria-hidden>
          &nbsp;
        </span>
      </div>
    </div>
  )
}
