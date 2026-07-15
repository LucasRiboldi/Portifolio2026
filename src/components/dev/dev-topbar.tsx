import Link from "next/link"

import { VibeToggle } from "@/components/providers/vibe-toggle"

/** Topbar do realm Dev: só o logo e a troca de universo. */
export function DevTopbar() {
  return (
    <header className="dv-topbar">
      <Link href="/dev" className="dv-logo">
        <span className="lr">LR</span>
        <span>
          dev<span className="blink">_</span>
        </span>
      </Link>
      <VibeToggle />
    </header>
  )
}
