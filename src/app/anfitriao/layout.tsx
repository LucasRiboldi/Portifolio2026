/**
 * A folha tem UM sistema, nesta ordem:
 *
 *   1. tokens    — papel, tinta, tipos, escalas. Todo o resto os consome.
 *   2. original  — a grelha e as proporções herdadas de `public/dporiginal`.
 *   3. página    — o que é específico desta rota (mesa de madeira, manchetes).
 *   4. sistema   — faixas, zonas e peças da diagramação.
 *   5. wire      — os componentes de notícia automática.
 *
 * O kit antigo (`daily-prophet*.css`, escopo `.dp`) saiu daqui de propósito:
 * a página inteira passou a falar o vocabulário `dpx-*`, e manter os dois
 * carregados era o que fazia a folha parecer dois impressos grampeados.
 * Aquele kit continua vivo e documentado no style guide do realm — é lá que
 * ele tem função.
 */
import "@/styles/anfitriao-tokens.css"
import "@/styles/dp-original.css"
import "@/styles/dp-original-extras.css"
import "@/styles/anfitriao-newspaper.css"
import "@/styles/anfitriao-wire.css"

import type { ReactNode } from "react"
import Link from "next/link"
import { Kreon, Vollkorn } from "next/font/google"

import { VibeToggle } from "@/components/providers/vibe-toggle"
import { paper, sections } from "@/lib/anfitriao-prophet"

/**
 * Layout do Daily Prophet — reconstruído sobre o layout original
 * (`public/dporiginal`), do qual herda o CSS, o brasão, o logo, as fontes e a
 * estrutura de cabeçalho. Os textos são nossos, em português, sobre jogos de
 * tabuleiro.
 *
 * Por que o CSS do original é importado AQUI e não no layout raiz: ele traz
 * seletores globais (`html`, `body`, `h1`, `p`, `a`, `img`, `hr`) que
 * quebrariam o resto do site. O Next isola CSS por segmento de rota, então
 * carregá-lo neste layout o restringe a /anfitriao.
 *
 * Os caminhos de fonte e imagem dentro do CSS foram reescritos de relativos
 * (`../fonts/`) para absolutos (`/dporiginal/fonts/`) — o bundler move o CSS
 * para `/_next/static/css/`, onde os relativos apontariam para o vazio.
 */

/** As duas fontes do original, servidas localmente pelo next/font. */
const kreon = Kreon({ subsets: ["latin"], weight: ["700"], variable: "--font-kreon" })
const vollkorn = Vollkorn({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-vollkorn",
})

export const metadata = {
  title: "Daily Prophet",
  description:
    "Jornal das artes de mesa — game design, mecânicas, prototipagem, impressão 3D, miniaturas e print & play.",
  /**
   * Favicon do jornal, restrito a estas rotas: o resto do portfólio mantém o
   * seu. Só referencia arquivos que existem em `public/dporiginal/favicons`.
   */
  icons: {
    icon: [
      { url: "/dporiginal/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/dporiginal/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/dporiginal/favicons/apple-touch-icon.png",
  },
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
    <div className={`newspaper ${kreon.variable} ${vollkorn.variable}`} role="main">
      {/* ─── Cabeçalho: a peça mais reconhecível do original ─── */}
      <header className="newspaper-topheader">
        <hr className="hr-double-top" />
        <h1 className="helper-hide">Daily Prophet</h1>
        <figure className="wrapper">
          <Link href="/anfitriao" aria-label="Primeira página">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Brasão do Daily Prophet"
              src="/dporiginal/images/logo-shield155.png"
              srcSet="/dporiginal/images/logo-shield155.png 1x, /dporiginal/images/logo-shield310.png 2x"
              width={155}
              height={152}
              className="newspaper-topheader-imgshield"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/dporiginal/images/logo-cleanup.svg"
              alt="Daily Prophet"
              className="newspaper-topheader-imglogo"
            />
          </Link>
          <figcaption>{paper.mottoPt}</figcaption>
        </figure>
        <hr className="hr-double-bottom" />
      </header>

      {/* ─── Linha de data: nossa, no idioma visual do jornal ─── */}
      <div className="dpx-dateline wrapper">
        <span>
          {paper.volume} — {paper.issue}
        </span>
        <span>{today}</span>
        <span className="dpx-dateline-price">
          {paper.price}
          {/* Troca de multiverso — preservada do layout anterior. */}
          <VibeToggle />
        </span>
      </div>

      {/* ─── Cadernos ─── */}
      <nav className="dpx-sections wrapper" aria-label="Cadernos desta edição">
        {sections.map((s, i) => (
          <span key={`${s.href}-${s.label}`} className="contents">
            {i > 0 && <span aria-hidden>❦</span>}
            <Link href={s.href}>{s.label}</Link>
          </span>
        ))}
      </nav>

      {children}
    </div>
  )
}
