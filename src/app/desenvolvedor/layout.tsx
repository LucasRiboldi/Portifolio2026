import "@/styles/dracula.css"
// Camada do acervo de referência (notícias, roadmap, badges, estante,
// padrões). Depois de `dracula.css` de propósito: compõe com as classes de
// lá e nunca as redefine.
import "@/styles/dev-acervo.css"
// Abertura da home do realm (hero, manifesto, princípios). Depois de
// `dev-acervo.css` pela mesma razão: compõe com as classes anteriores e não
// redefine nenhuma delas.
import "@/styles/dev-home.css"
// Zonas da home (radar, pulso, bancada, console) e a camada de movimento.
// Depois de `dev-home.css`: algumas regras daqui sobrepõem de propósito o que
// `dracula.css` define para o hero.
import "@/styles/dev-zonas.css"
// Módulo de estudos do 3º semestre. Carregado pelo layout, e não pela rota,
// porque o brilho verde dos menus das disciplinas precisa existir em toda
// página do realm — senão o dock muda de aparência conforme onde se está.
import "@/styles/estudos.css"

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
