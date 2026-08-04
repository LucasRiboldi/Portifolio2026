"use client"

import { useMemo, useState } from "react"

import type { Disciplina } from "@/data/estudos/tipos"
import { buscar, montarIndice, ROTULO_TIPO } from "@/lib/estudos/busca"

/**
 * SEARCH — busca dentro da disciplina.
 *
 * O índice é montado uma vez por disciplina; as anotações entram como texto
 * avulso porque mudam a cada tecla e invalidariam o índice inteiro.
 *
 * `role="status"` no contador: quem navega por teclado ou leitor de tela
 * precisa saber que a lista mudou depois de digitar, e isso não é visível
 * fora da tela.
 */
export function Search({
  disciplina,
  anotacoes,
  onIr,
}: {
  disciplina: Disciplina
  anotacoes: string
  onIr: (ancora: string) => void
}) {
  const [termo, setTermo] = useState("")
  const indice = useMemo(() => montarIndice(disciplina), [disciplina])
  const achados = useMemo(() => buscar(indice, termo, anotacoes), [indice, termo, anotacoes])
  const curto = termo.trim().length > 0 && termo.trim().length < 2

  return (
    <div className="es-busca">
      <label className="es-busca-campo">
        <span className="sr-only">Buscar na disciplina</span>
        <input
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="buscar em conteúdos, exemplos, exercícios, resumos e anotações…"
          autoComplete="off"
        />
      </label>

      {termo.trim() && (
        <p className="es-busca-conta" role="status">
          {curto
            ? "digite ao menos dois caracteres"
            : `${achados.length} ${achados.length === 1 ? "ocorrência" : "ocorrências"}`}
        </p>
      )}

      {achados.length > 0 && (
        <ul className="es-busca-lista">
          {achados.map((o, i) => (
            <li key={`${o.ancora}-${o.tipo}-${i}`}>
              <button type="button" className="es-busca-item" onClick={() => onIr(o.ancora)}>
                <span className="es-busca-tipo" data-tipo={o.tipo}>
                  {ROTULO_TIPO[o.tipo]}
                </span>
                <span className="es-busca-tit">{o.titulo}</span>
                <span className="es-busca-trecho">{o.trecho}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
