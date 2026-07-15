"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const KEY = "prophet:sound"

/**
 * SoundToggle — farfalhar de papel opt-in ao navegar pelo jornal.
 * Desligado por padrão, nunca toca sem gesto do usuário. O som é
 * sintetizado com a Web Audio API (ruído filtrado com envelope), então
 * não há nenhum arquivo de áudio para baixar.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    try {
      setOn(localStorage.getItem(KEY) === "1")
    } catch {
      /* ignore */
    }
  }, [])

  const rustle = useCallback(() => {
    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
    const w = window as WithWebkit
    const Ctor = w.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return
    const ctx = ctxRef.current ?? (ctxRef.current = new Ctor())
    if (ctx.state === "suspended") void ctx.resume()

    const dur = 0.28
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const env = Math.min(1, i / 400) * (1 - i / data.length) ** 2
      data[i] = (Math.random() * 2 - 1) * env
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const band = ctx.createBiquadFilter()
    band.type = "bandpass"
    band.frequency.value = 2600
    band.Q.value = 0.7
    const gain = ctx.createGain()
    gain.gain.value = 0.16
    src.connect(band).connect(gain).connect(ctx.destination)
    src.start()
  }, [])

  // Enquanto ligado, toca o farfalhar ao clicar em links de navegação do jornal.
  useEffect(() => {
    if (!on) return
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest(".pr-navlink, .pr-card-link, .pr-card")) rustle()
    }
    document.addEventListener("click", handler, true)
    return () => document.removeEventListener("click", handler, true)
  }, [on, rustle])

  const toggle = () => {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem(KEY, next ? "1" : "0")
    } catch {
      /* ignore */
    }
    if (next) rustle() // confirmação sonora (gesto do usuário)
  }

  return (
    <button
      type="button"
      className="pr-sound"
      onClick={toggle}
      aria-pressed={on}
      title={on ? "Silenciar o jornal" : "Ligar o farfalhar do papel"}
    >
      {on ? "🔊" : "🔈"} <span className="pr-sound-lbl">sons</span>
    </button>
  )
}
