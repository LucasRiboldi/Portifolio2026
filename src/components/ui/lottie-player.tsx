"use client"

/**
 * LottiePlayer — wrapper canônico para animações Lottie.
 * ------------------------------------------------------------------------
 * Carrega `lottie-react` sob demanda (dynamic import) para não pesar no bundle
 * inicial e respeita prefers-reduced-motion: com reduce, pinta o último frame
 * (estático) em vez de animar.
 *
 * Uso:
 *   import { LottiePlayer } from "@/components/ui/lottie-player"
 *   import hero from "@/assets/lottie/hero.json"
 *   <LottiePlayer animationData={hero} className="size-40" loop />
 *
 * `animationData` aceita o JSON importado; `src` aceita uma URL pública.
 */
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { LottieComponentProps } from "lottie-react"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

type LottiePlayerProps = Omit<LottieComponentProps, "animationData"> & {
  /** JSON de animação já importado. */
  animationData?: unknown
  /** URL pública de um .json Lottie (alternativa a animationData). */
  src?: string
}

export function LottiePlayer({ animationData, src, loop = true, ...rest }: LottiePlayerProps) {
  const [data, setData] = useState<unknown>(animationData)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true)
  }, [])

  useEffect(() => {
    if (animationData || !src) return
    let alive = true
    fetch(src)
      .then((r) => r.json())
      .then((json) => alive && setData(json))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [src, animationData])

  if (!data) return null

  return (
    <Lottie
      animationData={data}
      loop={reduced ? false : loop}
      autoplay={!reduced}
      {...rest}
    />
  )
}

export default LottiePlayer
