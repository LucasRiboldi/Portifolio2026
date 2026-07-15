import "@/styles/fonts-arcane.css"
import "@/styles/prophet.css"

import type { ReactNode } from "react"
import Link from "next/link"

import { ProphetNav } from "@/components/prophet/prophet-nav"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { gazette } from "@/lib/arcane-content"

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
          <Link href="/prophet">
            <h1>{gazette.masthead}</h1>
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
