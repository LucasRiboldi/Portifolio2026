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
    <div ref={root} className="dv-card" style={{ marginTop: "0.5rem" }}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 style={{ fontSize: "1rem" }}>
          stack.animate()<span className="gsap-cursor" style={{ color: "var(--d-green)" }}>▊</span>
        </h3>
        <span className="dv-tag">GSAP · ScrollTrigger</span>
      </div>
      <div className="mt-3 grid gap-2.5">
        {BARS.map((b) => (
          <div key={b.label} className="gsap-row">
            <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--d-comment)" }}>
              <span>{b.label}</span>
              <span>{b.pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "var(--d-bg-soft, rgba(255,255,255,0.08))", overflow: "hidden" }}>
              <div
                className="gsap-fill"
                style={{ height: "100%", width: `${b.pct}%`, borderRadius: 999, background: "linear-gradient(90deg, var(--d-green), var(--d-cyan))" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
