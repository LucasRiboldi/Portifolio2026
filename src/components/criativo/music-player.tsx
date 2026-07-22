"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Track } from "@/data/criativo-zones"
import { cn } from "@/lib/utils"

/** Quantas barras o visualizador desenha. */
const BARS = 48

/** Formata segundos como `m:ss`. Devolve `--:--` enquanto não há duração. */
function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "--:--"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

/**
 * Player da zona Rádio: playlist, controles e visualizador reagindo ao som.
 *
 * Um único elemento `<audio>` serve a playlist inteira e só troca de `src`.
 * É obrigatório: `createMediaElementSource` só pode ser chamado uma vez por
 * elemento, e montar um `<audio>` por faixa quebraria o visualizador na
 * segunda música.
 *
 * O `AudioContext` nasce no primeiro play, não na montagem — a política de
 * autoplay dos navegadores exige gesto do utilizador, e criar antes deixa um
 * contexto suspenso que nunca produz dados.
 *
 * Sem faixas, o componente entra em modo demo: as barras ondulam por seno para
 * a zona não ficar com espaço morto. O modo demo é decoração e não é anunciado
 * ao leitor de ecrã.
 */
export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef(0)

  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.12))

  const track = tracks[current]
  const hasAudio = Boolean(track?.audio_url)

  // --- modo demo: sem faixa tocando, as barras ondulam sozinhas ----------
  useEffect(() => {
    if (playing) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const tick = (t: number) => {
      setLevels(
        Array.from({ length: BARS }, (_, i) =>
          0.16 + 0.4 * Math.abs(Math.sin(t / 620 + i / 3.2)) + 0.14 * Math.abs(Math.sin(t / 240 + i)),
        ),
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // --- espectro real -----------------------------------------------------
  const loop = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)
    setLevels(Array.from({ length: BARS }, (_, i) => (data[i % data.length] ?? 0) / 255))
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  function ensureAnalyser() {
    const audio = audioRef.current
    if (!audio) return null
    if (analyserRef.current) return analyserRef.current

    type WithWebkit = typeof window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = window.AudioContext ?? (window as WithWebkit).webkitAudioContext
    if (!Ctor) return null

    const ctx = new Ctor()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    ctx.createMediaElementSource(audio).connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    analyserRef.current = analyser
    return analyser
  }

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    const analyser = ensureAnalyser()
    // O contexto pode voltar suspenso depois de uma pausa longa.
    if (ctxRef.current?.state === "suspended") await ctxRef.current.resume()
    try {
      await audio.play()
      setPlaying(true)
      if (analyser) rafRef.current = requestAnimationFrame(loop)
    } catch {
      // Play recusado (sem gesto do utilizador, ou arquivo ausente).
      setPlaying(false)
    }
  }, [loop])

  function pause() {
    audioRef.current?.pause()
    cancelAnimationFrame(rafRef.current)
    setPlaying(false)
  }

  /** Troca de faixa. `autoplay` continua tocando ao pular ou ao terminar. */
  const select = useCallback(
    (index: number, autoplay: boolean) => {
      const next = (index + tracks.length) % tracks.length
      setCurrent(next)
      setTime(0)
      setDuration(0)
      if (autoplay) {
        // Espera o `src` novo entrar no elemento antes de mandar tocar.
        queueMicrotask(() => void play())
      }
    },
    [tracks.length, play],
  )

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      void ctxRef.current?.close()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  if (tracks.length === 0) {
    return (
      <div className="k-panel p-8">
        <p className="k-body text-sm opacity-80">
          Nenhuma faixa ainda. Coloque um arquivo em <code>public/musica/</code> ou cadastre em
          {" "}/admin → Rádio.
        </p>
      </div>
    )
  }

  return (
    <div className="k-panel overflow-hidden">
      {/* --- visualizador ------------------------------------------------ */}
      <div
        aria-hidden
        className="flex h-36 items-end justify-center gap-[3px] bg-[var(--k-ink)] px-4 py-4 sm:h-48"
      >
        {levels.map((v, i) => (
          <span
            key={i}
            className="w-full max-w-[10px] flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max(4, v * 100)}%`,
              // O matiz percorre o espectro ao longo das barras: é o arco-íris
              // girando que a zona psicodélica pede.
              background: `hsl(${(i / BARS) * 320 + 20} 100% ${45 + v * 22}%)`,
              transition: "height 90ms linear",
            }}
          />
        ))}
      </div>

      {/* --- faixa atual + controles ------------------------------------- */}
      <div className="border-t-[3px] border-[var(--k-ink)] p-5">
        <p className="k-kicker text-[10px] opacity-60">
          Faixa {current + 1} de {tracks.length}
        </p>
        <h3 className="k-title mt-1 text-2xl leading-tight">{track?.title}</h3>
        <p className="k-sub mt-1 text-[11px] opacity-70">{track?.artist || "sem artista"}</p>

        {/* Barra de progresso. É um range nativo: arrastar, teclas de seta e
            Home/End já vêm prontos e acessíveis. */}
        <div className="mt-5 flex items-center gap-3">
          <span className="k-num w-12 shrink-0 text-xs tabular-nums opacity-70">{fmt(time)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            disabled={!hasAudio || !duration}
            onChange={(e) => {
              const v = Number(e.target.value)
              setTime(v)
              if (audioRef.current) audioRef.current.currentTime = v
            }}
            aria-label="Posição da faixa"
            className="h-2 w-full cursor-pointer appearance-none rounded-full border-2 border-[var(--k-ink)] bg-[var(--k-white)] accent-[var(--k-violet)] disabled:opacity-40"
          />
          <span className="k-num w-12 shrink-0 text-right text-xs tabular-nums opacity-70">
            {fmt(duration)}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => select(current - 1, playing)}
            disabled={tracks.length < 2}
            aria-label="Faixa anterior"
            className="k-btn k-btn--ghost size-12 items-center justify-center p-0 text-lg disabled:opacity-40"
          >
            <span aria-hidden>◀◀</span>
          </button>

          <button
            type="button"
            onClick={() => (playing ? pause() : void play())}
            disabled={!hasAudio}
            aria-label={playing ? `Pausar ${track?.title}` : `Tocar ${track?.title}`}
            className="k-btn k-btn--primary k-sub px-7 py-3 text-sm disabled:opacity-40"
          >
            {playing ? "❚❚ Pausar" : "▶ Tocar"}
          </button>

          <button
            type="button"
            onClick={() => select(current + 1, playing)}
            disabled={tracks.length < 2}
            aria-label="Próxima faixa"
            className="k-btn k-btn--ghost size-12 items-center justify-center p-0 text-lg disabled:opacity-40"
          >
            <span aria-hidden>▶▶</span>
          </button>

          <label className="ml-auto flex items-center gap-2">
            <span className="k-sub text-[10px] opacity-70">Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-2 w-24 cursor-pointer appearance-none rounded-full border-2 border-[var(--k-ink)] bg-[var(--k-white)] accent-[var(--k-magenta)]"
            />
          </label>
        </div>

        {!hasAudio && (
          <p className="k-body mt-4 text-xs opacity-70">
            Esta faixa está cadastrada mas sem arquivo de áudio — o visualizador está em modo demo.
          </p>
        )}
      </div>

      {/* --- playlist ----------------------------------------------------- */}
      {tracks.length > 1 && (
        <div className="border-t-[3px] border-[var(--k-ink)]">
          <h4 className="k-kicker border-b-2 border-[var(--k-ink)]/20 px-5 py-3 text-[10px] opacity-70">
            Playlist
          </h4>

          <ul className="max-h-72 overflow-y-auto">
            {tracks.map((t, i) => {
              const active = i === current
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => select(i, true)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 border-b-2 border-[var(--k-ink)]/10 px-5 py-3 text-left transition-colors",
                      active
                        ? "bg-[var(--k-violet)] text-[var(--k-white)]"
                        : "hover:bg-[var(--k-ink)]/[0.07]",
                    )}
                  >
                    <span className="k-num w-6 shrink-0 text-sm tabular-nums opacity-70">
                      {active && playing ? (
                        <span aria-hidden>♪</span>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="k-sub block truncate text-sm">{t.title}</span>
                      {t.artist && (
                        <span className="k-body block truncate text-[11px] opacity-70">{t.artist}</span>
                      )}
                    </span>

                    {!t.audio_url && (
                      <span className="k-kicker shrink-0 text-[9px] opacity-60">sem áudio</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <audio
        ref={audioRef}
        src={track?.audio_url || undefined}
        preload="none"
        crossOrigin="anonymous"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => {
          // Última faixa: para em vez de voltar ao início da playlist.
          if (current === tracks.length - 1) {
            cancelAnimationFrame(rafRef.current)
            setPlaying(false)
            return
          }
          select(current + 1, true)
        }}
      />
    </div>
  )
}
