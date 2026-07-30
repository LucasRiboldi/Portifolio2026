import "@/styles/dracula.css"
// Camada do acervo de referência (notícias, roadmap, badges, estante,
// padrões). Depois de `dracula.css` de propósito: compõe com as classes de
// lá e nunca as redefine.
import "@/styles/dev-acervo.css"

import type { ReactNode } from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"

import { DevTopbar } from "@/components/dev/dev-topbar"
import { DevRealmDock } from "@/components/dev/dev-realm-dock"

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

/**
 * `title.template` em vez de um título fixo: as sete rotas do realm herdavam
 * literalmente "Dev" como <title>, o que deixava o site com sete páginas de
 * título idêntico no índice de busca. Agora cada rota informa o próprio nome e
 * o realm assina no fim.
 */
export const metadata: Metadata = {
  title: { default: "Dev", template: "%s · Dev" },
  description:
    "Laboratório de engenharia: projetos, experimentos, ferramentas, snippets e trilhas de estudo.",
}

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`dracula ${mono.variable}`}>
      {/* O dock tem sete destinos e vem antes do conteúdo em toda página; sem
          salto, quem navega por teclado atravessa os sete a cada visita. */}
      <a href="#conteudo" className="dv-skip">
        Pular para o conteúdo
      </a>
      {/* Topbar + dock viajam juntos no topo, grudados ao rolar. */}
      <div className="dv-head">
        <DevTopbar />
        <DevRealmDock />
      </div>
      {/* Landmark `main`: o realm inteiro era uma sequência de <div> sem
          nenhuma marcação de região, e nenhum leitor de tela sabia onde o
          conteúdo começava. */}
      <main id="conteudo" className="dv-container">
        {children}
      </main>
    </div>
  )
}
