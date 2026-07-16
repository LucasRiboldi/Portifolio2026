import "@/styles/fonts-arcane.css"
import "@/styles/prophet.css"
import "@/styles/gazette.css"

import type { ReactNode } from "react"
import Link from "next/link"

import { VibeToggle } from "@/components/providers/vibe-toggle"
import { paper, sections } from "@/lib/anfitriao-gazette"

/** Brasão da folha: bigorna e meeple — as duas artes desta casa. */
function AnvilCrest() {
  return (
    <svg className="gz-crest" viewBox="0 0 64 64" aria-hidden>
      <g fill="currentColor">
        {/* Meeple */}
        <circle cx="20" cy="18" r="6" />
        <path d="M20 25c-6 0-9 4-11 9l5 2 3-4v13h6V34h-6l-3 4" opacity="0" />
        <path d="M20 25c-5 0-8 3-10 8l4 2 2-3v13h8V32l2 3 4-2c-2-5-5-8-10-8z" />
        {/* Bigorna */}
        <path d="M36 30h20l-2 5h-3c0 5-4 8-8 9v4h8v4H33v-4h8v-4c-4-1-8-4-8-9h-3l-2-5h8z" opacity=".92" />
      </g>
    </svg>
  )
}

export const metadata = {
  title: "The Meeple & Anvil Gazette",
  description:
    "Jornal das artes de mesa — game design, mecânicas, prototipagem, impressão 3D, miniaturas e print & play.",
}

export default function GazetteLayout({ children }: { children: ReactNode }) {
  const today = new Date()
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="prophet gz">
      <div className="gz-sheet">
        <header className="gz-masthead">
          <div className="gz-masthead-top">
            <span>{paper.established}</span>
            <span>{paper.registry}</span>
          </div>

          <hr className="gz-rule--hair" />

          <div className="flex items-center justify-center gap-4">
            <AnvilCrest />
            <Link href="/anfitriao" className="gz-nameplate">
              <h1>
                The Meeple <span className="gz-amp">&amp;</span> Anvil
              </h1>
              <p className="gz-nameplate-sub">{paper.mastheadSub}</p>
            </Link>
            <AnvilCrest />
          </div>

          <p className="gz-motto">
            {paper.motto}
            <small>{paper.mottoPt}</small>
          </p>
        </header>

        <div className="gz-dateline">
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

        <nav className="gz-sections" aria-label="Cadernos desta edição">
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
