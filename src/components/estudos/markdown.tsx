"use client"

import { Fragment, type ReactNode } from "react"

/**
 * Markdown básico das anotações — renderizado como árvore React.
 *
 * Deliberadamente SEM `dangerouslySetInnerHTML` e sem biblioteca. O texto vem
 * do `localStorage`, que qualquer script no domínio pode escrever; converter
 * isso em HTML seria abrir XSS numa página que não precisa de HTML nenhum.
 * Aqui cada marca vira elemento React, e o que não for reconhecido continua
 * sendo texto — inofensivo por construção.
 *
 * O suporte é o "básico" pedido: título, negrito, itálico, código, lista,
 * citação e bloco de código. Não é um renderizador de Markdown completo e não
 * pretende ser.
 */

/** Marcas de linha: `**negrito**`, `*itálico*`, `` `código` ``. */
function inline(texto: string): ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return partes.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return <strong key={i}>{p.slice(2, -2)}</strong>
    }
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
      return (
        <code key={i} className="es-inline-code">
          {p.slice(1, -1)}
        </code>
      )
    }
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) {
      return <em key={i}>{p.slice(1, -1)}</em>
    }
    return <Fragment key={i}>{p}</Fragment>
  })
}

export function Markdown({ texto }: { texto: string }) {
  if (!texto.trim()) {
    return <p className="dv-empty">Nada anotado ainda.</p>
  }

  const blocos: ReactNode[] = []
  const linhas = texto.split("\n")
  let lista: string[] = []
  let codigo: string[] | null = null

  const fecharLista = () => {
    if (lista.length === 0) return
    blocos.push(
      <ul key={`l${blocos.length}`} className="es-lista">
        {lista.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </ul>,
    )
    lista = []
  }

  for (const linha of linhas) {
    if (linha.trimStart().startsWith("```")) {
      if (codigo === null) {
        fecharLista()
        codigo = []
      } else {
        blocos.push(
          <pre key={`c${blocos.length}`} className="es-code">
            <code>{codigo.join("\n")}</code>
          </pre>,
        )
        codigo = null
      }
      continue
    }
    if (codigo !== null) {
      codigo.push(linha)
      continue
    }

    const titulo = /^(#{1,3})\s+(.*)$/.exec(linha)
    if (titulo) {
      fecharLista()
      const nivel = titulo[1]!.length
      const conteudo = inline(titulo[2]!)
      blocos.push(
        nivel === 1 ? (
          <h4 key={blocos.length}>{conteudo}</h4>
        ) : nivel === 2 ? (
          <h5 key={blocos.length}>{conteudo}</h5>
        ) : (
          <h6 key={blocos.length}>{conteudo}</h6>
        ),
      )
      continue
    }

    const item = /^\s*[-*]\s+(.*)$/.exec(linha)
    if (item) {
      lista.push(item[1]!)
      continue
    }

    fecharLista()

    const citacao = /^>\s?(.*)$/.exec(linha)
    if (citacao) {
      blocos.push(
        <blockquote key={blocos.length} className="es-citacao">
          {inline(citacao[1]!)}
        </blockquote>,
      )
      continue
    }

    if (linha.trim()) {
      blocos.push(
        <p key={blocos.length} className="es-prosa">
          {inline(linha)}
        </p>,
      )
    }
  }

  fecharLista()
  // Cerca aberta e nunca fechada: mostra o que já foi digitado em vez de
  // engolir o trecho.
  if (codigo !== null && codigo.length > 0) {
    blocos.push(
      <pre key="cf" className="es-code">
        <code>{codigo.join("\n")}</code>
      </pre>,
    )
  }

  return <>{blocos}</>
}
