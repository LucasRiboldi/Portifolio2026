"use client"

/**
 * Menu sanduíche flutuante da primeira página — navega para TODAS as zonas
 * editoriais da folha, na ordem em que elas aparecem.
 *
 * A lista vem de `zones` (`anfitriao-prophet.ts`), a mesma que alimenta o
 * índice do rodapé. Antes ela era declarada aqui, duplicada — e as duas
 * cópias já haviam divergido em nome e em ordem. Cada zona carrega em
 * `page.tsx` uma âncora invisível (`helper-hide`) com o `id` correspondente;
 * é o que permite auditar a cobertura: zona sem âncora não rola, âncora sem
 * zona não aparece no menu.
 *
 * Fica ao lado esquerdo do volume da edição, na linha de data, escondido até
 * o leitor clicar.
 */

import { useState } from "react"

import { zones } from "@/lib/anfitriao-prophet"

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
          {zones.map((z) => (
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
