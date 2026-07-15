"use client"

import { useEffect, useRef, useState } from "react"

const GLYPHS = "aeiourstlnmᚠᚢᚦᚨᚱ✦·"

/**
 * InkScramble — manchete que "se reescreve" como tinta mágica assentando.
 * SSR e o primeiro render do cliente mostram o texto final (sem mismatch de
 * hidratação); a animação de embaralhar→resolver só dispara depois do mount,
 * uma vez, e respeita prefers-reduced-motion.
 */
export function InkScramble({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const [caret, setCaret] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    setCaret(true)
    const chars = Array.from(text)
    let frame = 0
    const total = chars.length * 3
    const id = window.setInterval(() => {
      frame += 1
      const revealed = Math.floor(frame / 3)
      const next = chars
        .map((ch, i) => {
          if (ch === " ") return " "
          if (i < revealed) return ch
          return GLYPHS[(Math.random() * GLYPHS.length) | 0]
        })
        .join("")
      setDisplay(next)
      if (frame >= total) {
        window.clearInterval(id)
        setDisplay(text)
        setCaret(false)
      }
    }, 45)

    return () => window.clearInterval(id)
  }, [text])

  return (
    <span className={`pr-scramble ${className ?? ""}`} aria-label={text}>
      <span aria-hidden>{display}</span>
      {caret && (
        <span className="pr-caret" aria-hidden>
          ▌
        </span>
      )}
    </span>
  )
}
