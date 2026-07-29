import Link from "next/link"
import type { ReactNode } from "react"

import { paper } from "@/lib/anfitriao-prophet"

/**
 * A moldura de um caderno da folha.
 *
 * Quatro rotas internas repetem exatamente a mesma abertura — folio, chapéu,
 * título, olho — e o mesmo fecho. Componentizar aqui é o que impede que elas
 * divirjam, que foi o que aconteceu com as classes `pr-*`: cada página
 * montava a própria cabeça e nenhuma delas era carregada pela rota.
 *
 * `h2` e não `h1`: a `h1` do documento é o nome do jornal, declarada uma vez
 * no layout do realm. Mesma regra da matéria e da primeira página.
 */
export function Caderno({
  caderno,
  page,
  kicker,
  titulo,
  olho,
  children,
}: {
  /** Nome do caderno, impresso no folio. */
  caderno: string
  /** Página em numeração romana. */
  page: string
  kicker: string
  titulo: string
  /** O parágrafo entre filetes duplos, antes do acervo. */
  olho: string
  children: ReactNode
}) {
  return (
    <article className="dpx-cad wrapper">
      <div className="dpx-mat-folio">
        <span>
          <b>{caderno}</b>
        </span>
        <span>
          {paper.volume} — Página <b>{page}</b>
        </span>
        <span>{paper.price}</span>
      </div>

      <header className="dpx-mat-head">
        <p className="dpx-mat-kicker">{kicker}</p>
        <h2>{titulo}</h2>
      </header>

      <p className="dpx-mat-standfirst">{olho}</p>

      {children}

      <Link href="/anfitriao" className="dpx-cad-volta">
        ❦ Voltar à primeira página
      </Link>
    </article>
  )
}

/** Nota da redação para caderno sem acervo — o vazio, dito com voz da folha. */
export function CadernoVazio({ children }: { children: ReactNode }) {
  return <p className="dpx-cad-vazio">{children}</p>
}
