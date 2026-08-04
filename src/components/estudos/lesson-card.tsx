"use client"

import { dataBR, type SituacaoAula } from "@/lib/estudos/calendario"

/**
 * LESSONCARD — a aula em forma de cartão, para a visão geral.
 *
 * É a versão curta do que `Lesson` mostra por inteiro: identifica, situa no
 * tempo e informa o que já foi feito. Não repete conteúdo — quem quer o
 * conteúdo clica e vai para a aula.
 */
export function LessonCard({
  numero,
  data,
  assunto,
  unidade,
  situacao,
  concluida,
  revisada,
  exercicios,
  exerciciosFeitos,
  onIr,
}: {
  numero: number
  data: string
  assunto: string
  unidade: string
  situacao: SituacaoAula
  concluida: boolean
  revisada: boolean
  exercicios: number
  exerciciosFeitos: number
  onIr: (n: number) => void
}) {
  return (
    <article className="es-card" data-situacao={situacao} data-concluida={concluida}>
      <header className="es-card-topo">
        <span className="es-card-num">Aula {String(numero).padStart(2, "0")}</span>
        <time className="es-card-data" dateTime={data}>
          {dataBR(data)}
        </time>
      </header>
      <h4 className="es-card-tit">
        <button type="button" className="es-card-link" onClick={() => onIr(numero)}>
          {assunto}
        </button>
      </h4>
      <p className="es-card-unidade">{unidade}</p>
      <footer className="es-card-pe">
        {concluida && <span className="es-selo" data-tipo="ok">concluída</span>}
        {revisada && <span className="es-selo" data-tipo="rev">revisada</span>}
        {exercicios > 0 && (
          <span className="es-selo" data-tipo="ex">
            {exerciciosFeitos}/{exercicios} exercícios
          </span>
        )}
        {situacao === "hoje" && <span className="es-selo" data-tipo="hoje">hoje</span>}
      </footer>
    </article>
  )
}
