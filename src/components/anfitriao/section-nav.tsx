"use client"

/**
 * Menu sanduíche flutuante da primeira página — navega para as 9 zonas
 * editoriais da folha (ver a âncora invisível que cada zona carrega em
 * `page.tsx`, classe `helper-hide`). Fica ao lado esquerdo do volume da
 * edição, na linha de data, escondido até o leitor clicar.
 */

import { useState } from "react"

const ZONES = [
  { id: "anf-manchete-principal", label: "Manchete principal" },
  { id: "anf-noticias-secundarias", label: "Notícias secundárias" },
  { id: "anf-colunas-texto", label: "Colunas de texto" },
  { id: "anf-noticias-internacionais", label: "Notícias internacionais" },
  { id: "anf-colecao", label: "Coleção" },
  { id: "anf-mercado", label: "Mercado financeiro e comércio" },
  { id: "anf-anuncios", label: "Anúncios publicitários" },
  { id: "anf-editorial", label: "Editorial" },
  { id: "anf-ilustracoes", label: "Ilustrações" },
] as const

export function SectionNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="dpx-navmenu">
      <button
        type="button"
        className="dpx-navmenu-btn"
        aria-expanded={open}
        aria-controls="dpx-navmenu-panel"
        aria-label={open ? "Fechar sumário da edição" : "Abrir sumário da edição"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden />
        <span aria-hidden />
        <span aria-hidden />
      </button>

      <nav
        id="dpx-navmenu-panel"
        className="dpx-navmenu-panel"
        aria-label="Sumário da edição"
        hidden={!open}
      >
        <p className="dpx-navmenu-title">Sumário desta edição</p>
        <ul>
          {ZONES.map((z) => (
            <li key={z.id}>
              <a href={`#${z.id}`} onClick={() => setOpen(false)}>
                {z.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
