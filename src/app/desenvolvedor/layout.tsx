import "@/styles/dracula.css"

import type { ReactNode } from "react"
import { JetBrains_Mono } from "next/font/google"

import { DevTopbar } from "@/components/dev/dev-topbar"
import { DevRealmDock } from "@/components/dev/dev-realm-dock"

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "Dev",
  description: "Modo desenvolvedor — projetos, laboratório, devlogs e mais.",
}

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`dracula ${mono.variable}`}>
      <DevTopbar />
      <div className="dv-container">{children}</div>
      <DevRealmDock />
    </div>
  )
}
