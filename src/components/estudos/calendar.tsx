"use client"

import { useMemo } from "react"

import { comoData } from "@/lib/estudos/calendario"

/**
 * CALENDAR — as datas das aulas agrupadas por mês.
 *
 * A linha do tempo responde "o que vem depois do quê"; o calendário responde
 * "como isso cai no mês" — que é a pergunta de quem está organizando a semana.
 * Nenhum dos dois digita data: ambos recebem o que `lib/estudos/calendario`
 * calculou.
 */

export interface DiaAula {
  numero: number
  data: string
  assunto: string
  concluida: boolean
}

const MES = (iso: string) =>
  comoData(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" })

export function Calendar({ dias, onIr }: { dias: readonly DiaAula[]; onIr?: (n: number) => void }) {
  const meses = useMemo(() => {
    const mapa = new Map<string, DiaAula[]>()
    for (const d of dias) {
      const k = MES(d.data)
      const lista = mapa.get(k)
      if (lista) lista.push(d)
      else mapa.set(k, [d])
    }
    return [...mapa.entries()]
  }, [dias])

  return (
    <div className="es-cal">
      {meses.map(([mes, doMes]) => (
        <section key={mes} className="es-cal-mes" aria-label={mes}>
          <h4 className="es-cal-tit">{mes}</h4>
          <ul className="es-cal-dias">
            {doMes.map((d) => (
              <li key={d.numero}>
                <button
                  type="button"
                  className="es-cal-dia"
                  data-concluida={d.concluida}
                  onClick={() => onIr?.(d.numero)}
                  title={d.assunto}
                >
                  <span className="es-cal-num">{comoData(d.data).getUTCDate()}</span>
                  <span className="es-cal-aula">aula {String(d.numero).padStart(2, "0")}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
