import "@/styles/fonts-arcane.css"
import "@/styles/prophet.css"
import "@/styles/daily-prophet.css"

import type { ReactNode } from "react"
import Link from "next/link"

import { VibeToggle } from "@/components/providers/vibe-toggle"
import { paper, sections } from "@/lib/anfitriao-prophet"

export const metadata = {
  title: "Daily Prophet",
  description:
    "Jornal das artes de mesa — game design, mecânicas, prototipagem, impressão 3D, miniaturas e print & play.",
}

export default function DailyProphetLayout({ children }: { children: ReactNode }) {
  const today = new Date()
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="prophet dp">
      <div className="dp-sheet">
        <header className="dp-masthead">
          <div className="dp-masthead-top">
            <span>{paper.established}</span>
            <span>{paper.registry}</span>
          </div>

          <hr className="dp-rule--hair" />

          <div className="flex items-center justify-center gap-4">
            <Link href="/anfitriao" className="dp-nameplate">
              <h1>Daily Prophet</h1>
              <p className="dp-nameplate-sub">{paper.mastheadSub}</p>
            </Link>
          </div>

          <p className="dp-motto">
            {paper.motto}
            <small>{paper.mottoPt}</small>
          </p>
        </header>

        <div className="dp-dateline">
          <span>
            {paper.volume} — {paper.issue}
          </span>
          <span>{today}</span>
          <span className="flex items-center gap-3">
            {paper.price}
            {/* Troca de multiverso — preservada. */}
            <VibeToggle />
          </span>
        </div>

        <nav className="dp-sections" aria-label="Cadernos desta edição">
          {sections.map((s, i) => (
            <span key={`${s.href}-${s.label}`} className="contents">
              {i > 0 && <span aria-hidden>❦</span>}
              <Link href={s.href}>{s.label}</Link>
            </span>
          ))}
        </nav>

        {children}
      </div>
    </div>
  )
}
