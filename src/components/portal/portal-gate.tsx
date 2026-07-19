"use client"

import { useRouter } from "next/navigation"
import { markEntered } from "@/lib/portal"
import { LogoCriativo } from "./logos/logo-criativo"
import { LogoDesenvolvedor } from "./logos/logo-desenvolvedor"
import { LogoAnfitriao } from "./logos/logo-anfitriao"

const PANELS = [
  { id: "criativo", name: "Criativo", role: "Design · Arte · Multiverso", route: "/criativo",
    glow: "#ff2d95", accent: "#ff2d95", Logo: LogoCriativo },
  { id: "desenvolvedor", name: "Desenvolvedor", role: "Aprendizado · Código · Ferramentas", route: "/desenvolvedor",
    glow: "#50fa7b", accent: "#50fa7b", Logo: LogoDesenvolvedor },
  { id: "anfitriao", name: "Anfitrião", role: "Boardgame · Magia · Nostalgia", route: "/anfitriao",
    glow: "#9a7b28", accent: "#c9a24a", Logo: LogoAnfitriao },
] as const

export function PortalGate() {
  const router = useRouter()

  function enter(route: string) {
    markEntered()
    router.push(route)
  }

  // Só os logos: cada painel é o logo do perfil, e o logo é o botão.
  // O nome sobrevive para leitores de tela (aria-label) e como tooltip.
  return (
    <div className="portal">
      <div className="portal-stage">
        {PANELS.map(({ id, name, route, glow, accent, Logo }) => (
          <button
            key={id}
            className="portal-panel"
            style={{ ["--glow" as string]: glow, ["--accent" as string]: accent }}
            onClick={() => enter(route)}
            aria-label={`Entrar no multiverso ${name}`}
            title={name}
          >
            <span className="portal-logo"><Logo /></span>
          </button>
        ))}
      </div>
    </div>
  )
}
