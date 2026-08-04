import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { buscarDisciplina, DISCIPLINAS } from "@/data/estudos"
import { DIAS } from "@/data/estudos/tipos"
import { datasDasAulas } from "@/lib/estudos/calendario"
import { DisciplinaView } from "@/components/estudos/disciplina-view"

/**
 * A página de uma disciplina do 3º semestre.
 *
 * Uma rota para todas: o que muda é o arquivo de configuração encontrado pelo
 * slug. `generateStaticParams` pré-renderiza as cinco no build — o conteúdo é
 * versionado, não vem do banco, então não há o que revalidar.
 *
 * As datas são calculadas AQUI, no servidor, e descem prontas para o
 * componente. Calcular no cliente faria o HTML servido divergir do
 * hidratado assim que o fuso do visitante fosse diferente do da máquina de
 * build.
 */

export function generateStaticParams() {
  return DISCIPLINAS.map((d) => ({ disciplina: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ disciplina: string }>
}): Promise<Metadata> {
  const { disciplina: slug } = await params
  const d = buscarDisciplina(slug)
  if (!d) return { title: "Disciplina não encontrada" }
  return {
    title: d.nome,
    description: `${d.nome} — ${d.periodo}º semestre, ${DIAS[d.diaSemana]}. Plano de ensino, cronograma das ${d.aulas.length} aulas, exercícios e anotações.`,
  }
}

export default async function PaginaDisciplina({
  params,
}: {
  params: Promise<{ disciplina: string }>
}) {
  const { disciplina: slug } = await params
  const disciplina = buscarDisciplina(slug)
  if (!disciplina) notFound()

  const datas = datasDasAulas({
    diaSemana: disciplina.diaSemana,
    total: disciplina.aulas.length,
  })

  return (
    <>
      <header className="dv-hero">
        <p className="term">
          <span className="tok-fn">const</span> disciplina ={" "}
          <span className="tok-str">&quot;{disciplina.nomeCurto}&quot;</span>
        </p>
        <h1>{disciplina.nome}</h1>
        <p>
          {disciplina.periodo}º semestre · {DIAS[disciplina.diaSemana]} ·{" "}
          {disciplina.cargaHorariaAula} horas-aula
        </p>
      </header>

      <DisciplinaView disciplina={disciplina} datas={datas} />
    </>
  )
}
