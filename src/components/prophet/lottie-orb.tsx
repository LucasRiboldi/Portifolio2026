"use client"

/**
 * Demo funcional — Lottie no realm Arcane (Daily Prophet).
 * Orbe dourado animado (Lottie JSON) emoldurado como uma "ilustração viva"
 * do jornal. Respeita reduced-motion via LottiePlayer.
 */
import { LottiePlayer } from "@/components/ui/lottie-player"
import orb from "@/assets/lottie/golden-orb.json"

export function LottieOrb() {
  return (
    <figure className="pr-card" style={{ display: "grid", placeItems: "center", padding: "1.25rem" }}>
      <span className="pr-badge">Ilustração encantada · Lottie</span>
      <LottiePlayer animationData={orb} className="mt-2" style={{ width: 140, height: 140 }} loop />
      <figcaption className="pr-byline" style={{ marginTop: "0.25rem" }}>
        O Pomo de Ouro gira sem descanso — animação vetorial Lottie.
      </figcaption>
    </figure>
  )
}
