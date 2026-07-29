"use client"

/**
 * Demo funcional — GSAP no realm Developer.
 * Timeline com stagger + ScrollTrigger: as barras "compilam" da esquerda e
 * o cursor pisca, revelando ao entrar na viewport. Respeita reduced-motion.
 */
import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, DUR, EASE } from "@/design-system/gsap"

const BARS = [
  { label: "TypeScript", pct: 92 },
  { label: "React / Next", pct: 88 },
  { label: "Node / APIs", pct: 80 },
  { label: "Python", pct: 72 },
]

export function GsapDemo() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".gsap-fill", { scaleX: 1 })
        gsap.set(".gsap-row", { opacity: 1, x: 0 })
        return
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      })
      tl.from(".gsap-row", { opacity: 0, x: -24, duration: DUR.base, ease: EASE.out, stagger: 0.1 })
        .from(".gsap-fill", { scaleX: 0, transformOrigin: "left", duration: DUR.slow, ease: EASE.out, stagger: 0.1 }, "<")
      gsap.to(".gsap-cursor", { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" })
    },
    { scope: root },
  )

  return (
    /* As barras são <meter>-like mas não usam <meter>: o elemento nativo não
       aceita o preenchimento animado. O papel `img` com `aria-label` entrega o
       valor a quem não vê a barra — antes o número só existia como texto solto
       ao lado, sem vínculo com o gráfico. */
    <div ref={root} className="dv-card">
      <div className="dv-panel-head">
        <h3>
          stack.animate()
          <span className="gsap-cursor dv-ink-ok" aria-hidden>
            ▊
          </span>
        </h3>
        <span className="dv-tag">GSAP · ScrollTrigger</span>
      </div>
      <div className="dv-bars">
        {BARS.map((b) => (
          <div key={b.label} className="gsap-row">
            <div className="dv-bar-label">
              <span>{b.label}</span>
              <span>{b.pct}%</span>
            </div>
            <div className="dv-bar" role="img" aria-label={`${b.label}: ${b.pct} por cento`}>
              <div className="gsap-fill dv-bar-fill" style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
