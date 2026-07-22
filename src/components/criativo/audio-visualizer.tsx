"use client"

import { useEffect, useRef, useState } from "react"

/** Quantas barras o visualizador desenha. */
const BARS = 48

interface AudioVisualizerProps {
  src: string
  title: string
  artist: string
}

/**
 * Player local com visualizador reagindo ao som.
 *
 * A Web Audio API só pode ser inicializada depois de um gesto do utilizador
 * (política de autoplay dos navegadores), por isso o `AudioContext` é criado no
 * primeiro play e não na montagem — criar antes deixa um contexto "suspended"
 * pendurado que nunca produz dados.
 *
 * Sem `src` (nenhum áudio subido pelo admin) o componente entra em modo demo:
 * as barras ondulam por seno, para a zona não ficar com um espaço morto. O
 * modo demo é puramente decorativo e não anuncia nada ao leitor de ecrã.
 */
export function AudioVisualizer({ src, title, artist }: AudioVisualizerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.12))

  // Modo demo: sem áudio, as barras ondulam sozinhas.
  useEffect(() => {
    if (src) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const tick = (t: number) => {
      setLevels(
        Array.from({ length: BARS }, (_, i) =>
          0.18 + 0.42 * Math.abs(Math.sin(t / 620 + i / 3.2)) + 0.15 * Math.abs(Math.sin(t / 240 + i)),
        ),
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [src])

  function ensureAnalyser() {
    const audio = audioRef.current
    if (!audio || analyserRef.current) return analyserRef.current

    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = window.AudioContext ?? (window as WithWebkit).webkitAudioContext
    if (!Ctor) return null

    const ctx = new Ctor()
    const source = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    source.connect(analyser)
    analyser.connect(ctx.destination)
    analyserRef.current = analyser
    return analyser
  }

  function loop() {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)
    setLevels(Array.from({ length: BARS }, (_, i) => (data[i % data.length] ?? 0) / 255))
    rafRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <div className="k-panel overflow-hidden">
      {/* --- visualizador ------------------------------------------------ */}
      <div
        aria-hidden
        className="flex h-40 items-end justify-center gap-[3px] bg-[var(--k-ink)] px-4 py-4 sm:h-52"
      >
        {levels.map((v, i) => (
          <span
            key={i}
            className="w-full max-w-[10px] flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max(4, v * 100)}%`,
              // O matiz percorre o espectro ao longo das barras: o resultado é
              // o arco-íris girando que a zona psicodélica pede.
              background: `hsl(${(i / BARS) * 320 + 20} 100% ${45 + v * 22}%)`,
              transition: "height 90ms linear",
            }}
          />
        ))}
      </div>

      {/* --- controles --------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-[var(--k-ink)] p-5">
        <div className="min-w-0">
          <h3 className="k-title text-2xl leading-tight">{title}</h3>
          <p className="k-sub mt-1 text-[11px] opacity-70">{artist || "sem artista"}</p>
        </div>

        {src ? (
          <button
            type="button"
            onClick={async () => {
              const audio = audioRef.current
              if (!audio) return

              if (playing) {
                audio.pause()
                cancelAnimationFrame(rafRef.current)
                setPlaying(false)
                return
              }

              const analyser = ensureAnalyser()
              await audio.play()
              setPlaying(true)
              if (analyser) rafRef.current = requestAnimationFrame(loop)
            }}
            className="k-btn k-btn--primary k-sub px-6 py-3 text-sm"
            aria-label={playing ? `Pausar ${title}` : `Tocar ${title}`}
          >
            {playing ? "❚❚ Pausar" : "▶ Tocar"}
          </button>
        ) : (
          <p className="k-body max-w-xs text-xs opacity-70">
            Nenhum áudio subido ainda — o visualizador está em modo demo.
          </p>
        )}
      </div>

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          crossOrigin="anonymous"
          onEnded={() => {
            cancelAnimationFrame(rafRef.current)
            setPlaying(false)
          }}
        />
      )}
    </div>
  )
}
