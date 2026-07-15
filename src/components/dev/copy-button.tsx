"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ text, label = "copiar" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="dv-copy"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1400)
      }}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {done ? "copiado!" : label}
    </button>
  )
}
