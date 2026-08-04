"use client"

import { dataBR, type SituacaoAula } from "@/lib/estudos/calendario"

/**
 * TIMELINE — a sequência das aulas ao longo do semestre.
 *
 * Cada item traz número, data, assunto e status, que é o pedido. O estado de
 * "hoje" não sai do relógio do navegador: chega pronto por `situacoes`, porque
 * o componente é renderizado no servidor primeiro e um `new Date()` aqui daria
 * marcação diferente da do cliente.
 */

export interface ItemTimeline {
  numero: number
  data: string
  assunto: string
  unidade: string
  situacao: SituacaoAula
  concluida: boolean
  revisada: boolean
}

const ROTULO: Record<SituacaoAula, string> = {
  passada: "já ocorreu",
  hoje: "hoje",
  futura: "a ocorrer",
}

export function Timeline({
  itens,
  onIr,
}: {
  itens: readonly ItemTimeline[]
  /** Leva à seção da aula. Sem ele a linha do tempo é só leitura. */
  onIr?: (numero: number) => void
}) {
  return (
    <ol className="es-timeline">
      {itens.map((i) => {
        const estado = i.concluida ? "concluída" : ROTULO[i.situacao]
        return (
          <li
            key={i.numero}
            className="es-tl-item"
            data-situacao={i.situacao}
            data-concluida={i.concluida}
          >
            <span className="es-tl-marca" aria-hidden />
            <button
              type="button"
              className="es-tl-corpo"
              onClick={() => onIr?.(i.numero)}
              aria-label={`Aula ${i.numero}, ${dataBR(i.data)}, ${i.assunto} — ${estado}`}
            >
              <span className="es-tl-num">Aula {String(i.numero).padStart(2, "0")}</span>
              <time className="es-tl-data" dateTime={i.data}>
                {dataBR(i.data)}
              </time>
              <span className="es-tl-assunto">{i.assunto}</span>
              <span className="es-tl-status" data-concluida={i.concluida}>
                {estado}
                {i.revisada && <span className="es-tl-rev"> · revisada</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
