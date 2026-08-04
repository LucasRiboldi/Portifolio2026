"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { DIAS, NIVEIS, type Disciplina, type NivelExercicio } from "@/data/estudos/tipos"
import { chave } from "@/lib/estudos/armazenamento"
import { comoISO, dataBR, situacao as situacaoDe } from "@/lib/estudos/calendario"
import { useProgresso } from "@/lib/estudos/progresso"
import { DevSection } from "@/components/dev/ui/dev-primitives"
import { Calendar } from "./calendar"
import { Exercise } from "./exercise"
import { Lesson } from "./lesson"
import { LessonCard } from "./lesson-card"
import { Progress } from "./progress"
import { Sidebar, type ItemSidebar } from "./sidebar"
import { Timeline } from "./timeline"

/**
 * A página de uma disciplina, montada a partir do arquivo de configuração.
 *
 * Nada aqui conhece disciplina alguma pelo nome: o que muda entre Banco de
 * Dados e Sistemas Operacionais é o objeto `disciplina`, e mais nada. É o que
 * torna verdadeira a promessa de que acrescentar uma disciplina é acrescentar
 * um arquivo.
 *
 * `Notes` e `Search` entram por `next/dynamic` porque nenhum dos dois é
 * necessário para o primeiro render: as anotações carregam um editor e um
 * renderizador de Markdown, a busca monta o índice inteiro da disciplina. Fora
 * do bundle inicial, a página abre no conteúdo, que é o que se veio ver.
 */

const Notes = dynamic(() => import("./notes").then((m) => m.Notes), {
  loading: () => <p className="dv-empty">Carregando anotações…</p>,
})

const Search = dynamic(() => import("./search").then((m) => m.Search), {
  loading: () => <p className="dv-empty">Carregando busca…</p>,
})

const ORDEM_NIVEIS: NivelExercicio[] = ["basico", "intermediario", "avancado", "desafio"]

/** Seções fixas, na ordem em que aparecem na sidebar e na página. */
const FIXAS_TOPO = [
  { ancora: "visao-geral", rotulo: "Visão Geral" },
  { ancora: "cronograma", rotulo: "Cronograma" },
]
const FIXAS_BASE = [
  { ancora: "exercicios", rotulo: "Exercícios" },
  { ancora: "resumo-geral", rotulo: "Resumo Geral" },
  { ancora: "bibliografia", rotulo: "Bibliografia" },
  { ancora: "anotacoes", rotulo: "Anotações" },
]

export function DisciplinaView({
  disciplina,
  datas,
}: {
  disciplina: Disciplina
  /** Calculadas no servidor; uma por aula, na mesma ordem. */
  datas: readonly string[]
}) {
  const { progresso, stats, hidratado, alternarAula, alternarRevisao, alternarExercicio } =
    useProgresso(disciplina)

  /**
   * "Hoje" só existe depois da montagem.
   *
   * Lido durante o render, o relógio do servidor e o do navegador divergem e o
   * React acusa hidratação inconsistente — e, pior, o marcador "hoje" ficaria
   * congelado no instante do build numa página estática.
   */
  const [hoje, setHoje] = useState<string | null>(null)
  useEffect(() => setHoje(comoISO(new Date())), [])

  const [ativo, setAtivo] = useState("visao-geral")
  const raiz = useRef<HTMLDivElement>(null)

  /** Texto das anotações, só para alimentar a busca. */
  const [anotacoes, setAnotacoes] = useState("")
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(chave(disciplina.slug, "anotacoes"))
      setAnotacoes(bruto ? ((JSON.parse(bruto) as { texto?: string }).texto ?? "") : "")
    } catch {
      setAnotacoes("")
    }
  }, [disciplina.slug])

  const aulas = useMemo(
    () =>
      disciplina.aulas.map((a, i) => ({
        aula: a,
        data: datas[i] ?? "",
        // Sem `hoje`, tudo é "futura": é o estado neutro, e o certo entra no
        // primeiro efeito sem alterar o HTML servido.
        situacao: hoje ? situacaoDe(datas[i] ?? "", hoje) : ("futura" as const),
      })),
    [disciplina.aulas, datas, hoje],
  )

  /** Rolagem suave, obedecendo quem pediu menos movimento no sistema. */
  const irPara = useCallback((ancora: string) => {
    const alvo = document.getElementById(ancora)
    if (!alvo) return
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    alvo.scrollIntoView({ behavior: suave ? "smooth" : "auto", block: "start" })
    // Foco, não só rolagem: quem navega por teclado precisa continuar de onde
    // a página parou. `tabindex=-1` está no CSS das seções-alvo.
    alvo.focus({ preventScroll: true })
    setAtivo(ancora)
  }, [])

  const irParaAula = useCallback((n: number) => irPara(`aula-${n}`), [irPara])

  /**
   * Marca na sidebar a seção visível.
   *
   * `rootMargin` negativo no topo faz a troca acontecer quando a seção cruza o
   * terço superior da tela, e não quando encosta na borda — encostando, o item
   * ativo piscava entre dois a cada pequeno rolar.
   */
  useEffect(() => {
    const alvos = raiz.current?.querySelectorAll<HTMLElement>("[data-secao]")
    if (!alvos || alvos.length === 0) return

    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visivel?.target.id) setAtivo(visivel.target.id)
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    )
    alvos.forEach((a) => obs.observe(a))
    return () => obs.disconnect()
  }, [])

  const itensSidebar: ItemSidebar[] = [
    ...FIXAS_TOPO,
    ...aulas.map(({ aula }) => ({
      ancora: `aula-${aula.numero}`,
      rotulo: `Aula ${String(aula.numero).padStart(2, "0")}`,
      recuado: true,
      concluida: hidratado && !!progresso.concluidas[aula.numero],
    })),
    ...FIXAS_BASE,
  ]

  const todosExercicios = disciplina.aulas.flatMap((a) =>
    (a.exercicios ?? []).map((e) => ({ e, aula: a.numero })),
  )

  const palavrasChave = [
    ...new Set(disciplina.aulas.flatMap((a) => a.resumo?.palavrasChave ?? [])),
  ]

  return (
    <div className="es-layout" ref={raiz}>
      <aside className="es-aside">
        <Progress stats={stats} hidratado={hidratado} />
        <Sidebar itens={itensSidebar} ativo={ativo} onIr={irPara} />
      </aside>

      <div className="es-conteudo">
        {/* ─── Visão geral ─────────────────────────────────────────────── */}
        <section id="visao-geral" data-secao tabIndex={-1} aria-labelledby="visao-geral-tit">
          <DevSection
            id="ficha"
            index={1}
            title="Visão Geral"
            meta={`${disciplina.cargaHorariaAula} h/a`}
            note={`${DIAS[disciplina.diaSemana]} · ${disciplina.aulas.length} aulas no semestre`}
          >
            <h2 id="visao-geral-tit" className="sr-only">
              Visão geral de {disciplina.nome}
            </h2>

            <dl className="dv-meta">
              <div>
                <dt>Curso</dt>
                <dd>{disciplina.curso}</dd>
              </div>
              <div>
                <dt>Período</dt>
                <dd>{disciplina.periodo}º semestre</dd>
              </div>
              <div>
                <dt>Carga horária</dt>
                <dd>
                  {disciplina.cargaHorariaAula} horas-aula · {disciplina.cargaHorariaRelogio}{" "}
                  horas-relógio
                </dd>
              </div>
              <div>
                <dt>Dia da semana</dt>
                <dd>{DIAS[disciplina.diaSemana]}</dd>
              </div>
              <div>
                <dt>Pré-requisito</dt>
                <dd>{disciplina.preRequisito}</dd>
              </div>
            </dl>

            <div className="es-bloco">
              <h4>Ementa</h4>
              <p className="es-prosa">{disciplina.ementa}</p>
            </div>

            <div className="es-bloco">
              <h4>Objetivo geral</h4>
              <p className="es-prosa">{disciplina.objetivoGeral}</p>
            </div>

            <div className="es-bloco">
              <h4>Conteúdo programático</h4>
              <ol className="es-programa">
                {disciplina.conteudoPrograma.map((t) => (
                  <li key={t.titulo}>
                    <span className="es-prog-tit">{t.titulo}</span>
                    {t.subtopicos && t.subtopicos.length > 0 && (
                      <ul className="es-lista">
                        {t.subtopicos.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <div className="es-bloco">
              <h4>Buscar nesta disciplina</h4>
              <Search disciplina={disciplina} anotacoes={anotacoes} onIr={irPara} />
            </div>
          </DevSection>
        </section>

        {/* ─── Cronograma ──────────────────────────────────────────────── */}
        <section id="cronograma" data-secao tabIndex={-1}>
          <DevSection
            id="crono"
            index={2}
            title="Cronograma"
            meta={`${datas[0] ? dataBR(datas[0]) : ""} → ${
              datas[datas.length - 1] ? dataBR(datas[datas.length - 1]!) : ""
            }`}
            note="Datas calculadas a partir do dia da semana da disciplina, do início do semestre e dos feriados nacionais."
          >
            <Calendar
              dias={aulas.map(({ aula, data }) => ({
                numero: aula.numero,
                data,
                assunto: aula.assunto,
                concluida: hidratado && !!progresso.concluidas[aula.numero],
              }))}
              onIr={irParaAula}
            />

            <Timeline
              itens={aulas.map(({ aula, data, situacao }) => ({
                numero: aula.numero,
                data,
                assunto: aula.assunto,
                unidade: aula.unidade,
                situacao,
                concluida: hidratado && !!progresso.concluidas[aula.numero],
                revisada: hidratado && !!progresso.revisadas[aula.numero],
              }))}
              onIr={irParaAula}
            />

            <div className="es-cards">
              {aulas.map(({ aula, data, situacao }) => (
                <LessonCard
                  key={aula.numero}
                  numero={aula.numero}
                  data={data}
                  assunto={aula.assunto}
                  unidade={aula.unidade}
                  situacao={situacao}
                  concluida={hidratado && !!progresso.concluidas[aula.numero]}
                  revisada={hidratado && !!progresso.revisadas[aula.numero]}
                  exercicios={aula.exercicios?.length ?? 0}
                  exerciciosFeitos={
                    hidratado
                      ? (aula.exercicios ?? []).filter((e) => progresso.exercicios[e.id]).length
                      : 0
                  }
                  onIr={irParaAula}
                />
              ))}
            </div>
          </DevSection>
        </section>

        {/* ─── As aulas ────────────────────────────────────────────────── */}
        {aulas.map(({ aula, data, situacao }) => (
          <section key={aula.numero} id={`aula-${aula.numero}`} data-secao tabIndex={-1}>
            <Lesson
              aula={aula}
              data={data}
              situacao={situacao}
              concluida={hidratado && !!progresso.concluidas[aula.numero]}
              revisada={hidratado && !!progresso.revisadas[aula.numero]}
              exerciciosFeitos={progresso.exercicios}
              onAlternarAula={alternarAula}
              onAlternarRevisao={alternarRevisao}
              onAlternarExercicio={alternarExercicio}
            />
          </section>
        ))}

        {/* ─── Exercícios, todos ───────────────────────────────────────── */}
        <section id="exercicios" data-secao tabIndex={-1}>
          <DevSection
            id="ex-geral"
            index={3}
            title="Exercícios"
            meta={`${stats.exerciciosFeitos}/${todosExercicios.length}`}
            note="Todos os exercícios da disciplina reunidos, na ordem das aulas."
          >
            {todosExercicios.length === 0 ? (
              <p className="dv-empty">Nenhum exercício escrito ainda.</p>
            ) : (
              ORDEM_NIVEIS.map((nivel) => {
                const doNivel = todosExercicios.filter((x) => x.e.nivel === nivel)
                if (doNivel.length === 0) return null
                return (
                  <div key={nivel} className="es-ex-grupo">
                    <h4 className="es-ex-grupo-tit" data-nivel={nivel}>
                      {NIVEIS[nivel]} <span className="es-ex-conta">({doNivel.length})</span>
                    </h4>
                    {doNivel.map(({ e, aula }) => (
                      <div key={e.id}>
                        <button
                          type="button"
                          className="es-ex-origem"
                          onClick={() => irParaAula(aula)}
                        >
                          aula {String(aula).padStart(2, "0")}
                        </button>
                        <Exercise
                          exercicio={e}
                          feito={!!progresso.exercicios[e.id]}
                          onAlternar={alternarExercicio}
                        />
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </DevSection>
        </section>

        {/* ─── Resumo geral ────────────────────────────────────────────── */}
        <section id="resumo-geral" data-secao tabIndex={-1}>
          <DevSection
            id="res-geral"
            index={4}
            title="Resumo Geral"
            meta={`${palavrasChave.length} palavras-chave`}
            note="O que cada aula deixou como essencial, reunido."
          >
            {palavrasChave.length === 0 ? (
              <p className="dv-empty">Os resumos das aulas ainda não foram escritos.</p>
            ) : (
              <>
                <ul className="es-chaves" aria-label="Palavras-chave da disciplina">
                  {palavrasChave.map((p) => (
                    <li key={p} className="dv-tag">
                      {p}
                    </li>
                  ))}
                </ul>
                <ol className="es-res-geral">
                  {disciplina.aulas
                    .filter((a) => a.resumo)
                    .map((a) => (
                      <li key={a.numero}>
                        <button
                          type="button"
                          className="es-res-link"
                          onClick={() => irParaAula(a.numero)}
                        >
                          Aula {String(a.numero).padStart(2, "0")} · {a.assunto}
                        </button>
                        <ul className="es-lista">
                          {a.resumo!.conceitosImportantes.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ol>
              </>
            )}
          </DevSection>
        </section>

        {/* ─── Bibliografia ────────────────────────────────────────────── */}
        <section id="bibliografia" data-secao tabIndex={-1}>
          <DevSection
            id="biblio"
            index={5}
            title="Bibliografia"
            meta={`${disciplina.bibliografia.basica.length} básicas · ${disciplina.bibliografia.complementar.length} complementares`}
            note="Como consta no Plano de Ensino oficial da disciplina."
          >
            <div className="es-bloco">
              <h4>Básica</h4>
              <ul className="es-biblio">
                {disciplina.bibliografia.basica.map((r) => (
                  <li key={`${r.autor}${r.titulo}`}>
                    <span className="es-biblio-autor">{r.autor}</span>{" "}
                    <cite>{r.titulo}</cite> {r.detalhes}
                  </li>
                ))}
              </ul>
            </div>
            <div className="es-bloco">
              <h4>Complementar</h4>
              <ul className="es-biblio">
                {disciplina.bibliografia.complementar.map((r) => (
                  <li key={`${r.autor}${r.titulo}`}>
                    <span className="es-biblio-autor">{r.autor}</span>{" "}
                    <cite>{r.titulo}</cite> {r.detalhes}
                  </li>
                ))}
              </ul>
            </div>
          </DevSection>
        </section>

        {/* ─── Anotações ───────────────────────────────────────────────── */}
        <section id="anotacoes" data-secao tabIndex={-1}>
          <DevSection
            id="notas"
            index={6}
            title="Anotações"
            meta="só neste navegador"
            note="Salvas automaticamente e independentes por disciplina."
          >
            <Notes slug={disciplina.slug} nome={disciplina.nome} onTexto={setAnotacoes} />
          </DevSection>
        </section>
      </div>
    </div>
  )
}
