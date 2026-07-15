import "@/styles/dracula.css"

import type { ReactNode } from "react"
import { JetBrains_Mono } from "next/font/google"

import { DevNav } from "@/components/dev/dev-nav"

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "Dev",
  description: "Modo desenvolvedor — projetos, laboratório, devlogs e mais.",
}

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`dracula ${mono.variable}`}>
      <DevNav />
      <div className="dv-container">{children}</div>
    </div>
  )
}
