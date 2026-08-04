"use client"

import { NIVEIS, type Aula, type Exemplo, type NivelExercicio } from "@/data/estudos/tipos"
import { dataBR, dataExtenso, type SituacaoAula } from "@/lib/estudos/calendario"
import { BlocoTexto, Exercise } from "./exercise"
import { Summary } from "./summary"

/**
 * LESSON — uma aula inteira: conteúdo, exemplos, exercícios e resumo.
 *
 * A aula é `<article>` com heading próprio e âncora estável (`aula-07`), que é
 * o que a sidebar e a busca usam para chegar aqui. Quando o plano prevê a aula
 * mas o conteúdo didático ainda não foi escrito, o componente diz isso em vez
 * de renderizar seções vazias — silêncio aqui pareceria conteúdo faltando por
 * defeito.
 */

const ORDEM_NIVEIS: NivelExercicio[] = ["basico", "intermediario", "avancado", "desafio"]

export function Lesson({
  aula,
  data,
  situacao,
  concluida,
  revisada,
  exerciciosFeitos,
  onAlternarAula,
  onAlternarRevisao,
  onAlternarExercicio,
}: {
  aula: Aula
  data: string
  situacao: SituacaoAula
  concluida: boolean
  revisada: boolean
  exerciciosFeitos: Record<string, boolean>
  onAlternarAula: (n: number) => void
  onAlternarRevisao: (n: number) => void
  onAlternarExercicio: (id: string) => void
}) {
  const id = `aula-${aula.numero}`
  const numero = String(aula.numero).padStart(2, "0")
  const c = aula.conteudo
  const exercicios = aula.exercicios ?? []

  return (
    <article id={id} className="es-aula" data-situacao={situacao} aria-labelledby={`${id}-titulo`}>
      <header className="es-aula-topo">
        <div className="es-aula-id">
          <span className="es-aula-num">Aula {numero}</span>
          <time className="es-aula-data" dateTime={data} title={dataExtenso(data)}>
            {dataBR(data)}
          </time>
          {situacao === "hoje" && <span className="es-hoje">hoje</span>}
        </div>
        <h3 id={`${id}-titulo`}>{aula.assunto}</h3>
        <p className="es-aula-unidade">{aula.unidade}</p>

        <div className="es-aula-marcas">
          <label className="es-check">
            <input type="checkbox" checked={concluida} onChange={() => onAlternarAula(aula.numero)} />
            <span>aula concluída</span>
          </label>
          <label className="es-check">
            <input type="checkbox" checked={revisada} onChange={() => onAlternarRevisao(aula.numero)} />
            <span>revisada</span>
          </label>
        </div>
      </header>

      {!c && (
        <p className="es-pendente">
          O plano de ensino prevê esta aula; o material didático dela ainda não foi escrito.
        </p>
      )}

      {c && (
        <div className="es-aula-corpo">
          <p className="es-resumo-linha">{c.resumo}</p>

          <section className="es-bloco" aria-label="Explicação simples">
            <h4>Em palavras simples</h4>
            <p className="es-prosa">{c.explicacaoSimples}</p>
          </section>

          <section className="es-bloco" aria-label="Explicação técnica">
            <h4>Tecnicamente</h4>
            <BlocoTexto texto={c.explicacaoTecnica} />
          </section>

          {c.conceitos.length > 0 && (
            <section className="es-bloco" aria-label="Principais conceitos">
              <h4>Principais conceitos</h4>
              <dl className="es-conceitos">
                {c.conceitos.map((k) => (
                  <div key={k.termo}>
                    <dt>{k.termo}</dt>
                    <dd>{k.definicao}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {c.exemplos.length > 0 && (
            <section className="es-bloco" aria-label="Exemplos">
              <h4>Exemplos</h4>
              {c.exemplos.map((ex, i) => (
                <ExemploBloco key={i} exemplo={ex} />
              ))}
            </section>
          )}

          {c.aplicacoes.length > 0 && (
            <section className="es-bloco" aria-label="Aplicações práticas">
              <h4>Onde isso aparece na prática</h4>
              <ul className="es-lista">
                {c.aplicacoes.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
          )}

          {c.curiosidades.length > 0 && (
            <section className="es-bloco" aria-label="Curiosidades">
              <h4>Curiosidades</h4>
              <ul className="es-lista es-curiosidades">
                {c.curiosidades.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {exercicios.length > 0 && (
        <section className="es-bloco" aria-label={`Exercícios da aula ${numero}`}>
          <h4>Exercícios</h4>
          {ORDEM_NIVEIS.map((nivel) => {
            const doNivel = exercicios.filter((e) => e.nivel === nivel)
            if (doNivel.length === 0) return null
            return (
              <div key={nivel} className="es-ex-grupo">
                <h5 className="es-ex-grupo-tit" data-nivel={nivel}>
                  {NIVEIS[nivel]}
                </h5>
                {doNivel.map((e) => (
                  <Exercise
                    key={e.id}
                    exercicio={e}
                    feito={!!exerciciosFeitos[e.id]}
                    onAlternar={onAlternarExercicio}
                  />
                ))}
              </div>
            )
          })}
        </section>
      )}

      {aula.resumo && <Summary resumo={aula.resumo} />}
    </article>
  )
}

/** Um exemplo: descrição, código e a leitura guiada trecho a trecho. */
function ExemploBloco({ exemplo }: { exemplo: Exemplo }) {
  return (
    <div className="es-exemplo">
      <h5 className="es-exemplo-tit">{exemplo.titulo}</h5>
      {exemplo.descricao && <p className="es-prosa">{exemplo.descricao}</p>}
      {exemplo.codigo && (
        <pre className="es-code" data-lang={exemplo.linguagem}>
          <code>{exemplo.codigo}</code>
        </pre>
      )}
      {exemplo.linhas && exemplo.linhas.length > 0 && (
        <details className="es-reveal">
          <summary>Linha a linha</summary>
          <dl className="es-linhas">
            {exemplo.linhas.map((l, i) => (
              <div key={i}>
                <dt>
                  <code>{l.trecho}</code>
                </dt>
                <dd>{l.explicacao}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}
