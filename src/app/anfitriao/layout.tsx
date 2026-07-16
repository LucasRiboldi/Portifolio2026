import "@/styles/fonts-arcane.css"
import "@/styles/prophet.css"

import type { ReactNode } from "react"
import Link from "next/link"

import { ProphetNav } from "@/components/prophet/prophet-nav"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { gazette, frontPage } from "@/lib/arcane-content"

function OwlCrest() {
  return (
    <svg className="pr-crest-icon" viewBox="0 0 64 64" aria-hidden>
      <g fill="currentColor">
        <path d="M32 10c-8 0-14 6-14 16 0 12 7 24 14 30 7-6 14-18 14-30 0-10-6-16-14-16z" opacity=".9" />
        <circle cx="25" cy="26" r="6" fill="#f4ecd8" />
        <circle cx="39" cy="26" r="6" fill="#f4ecd8" />
        <circle cx="25" cy="26" r="2.4" />
        <circle cx="39" cy="26" r="2.4" />
        <path d="M32 30l3 5h-6z" />
        <path d="M12 16l9 8-12 2z" />
        <path d="M52 16l-9 8 12 2z" />
      </g>
    </svg>
  )
}

export const metadata = {
  title: "The Daily Prophet",
  description: "Jornal de Game Design — tutoriais, mecânicas, protótipos e print & play.",
}

export default function ProphetLayout({ children }: { children: ReactNode }) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="prophet">
      <div className="pr-container">
        <header className="pr-masthead">
          <div className="pr-topstrip">
            <div className="pr-crest pr-crest--l" aria-hidden>
              <OwlCrest />
              <span className="pr-crest-words">{frontPage.crestLeft.join(" · ")}</span>
            </div>
            <div className="pr-crest pr-crest--r" aria-hidden>
              <span className="pr-crest-words">{frontPage.crestRight.join(" · ")}</span>
              <span className="pr-sign">{frontPage.signature}</span>
            </div>
          </div>
          <Link href="/anfitriao" className="pr-nameplate-mid">
            <span className="pr-the">The</span>
            <h1>
              Daily <span className="pr-goldp">P</span>rophet
            </h1>
          </Link>
          <p className="pr-motto">{gazette.motto}</p>
        </header>
        <div className="pr-dateline">
          <span>{gazette.edition}</span>
          <span>{today}</span>
          <span className="flex items-center gap-3">
            {gazette.price}
            <VibeToggle />
          </span>
        </div>
        <ProphetNav />
        {children}
      </div>
    </div>
  )
}
