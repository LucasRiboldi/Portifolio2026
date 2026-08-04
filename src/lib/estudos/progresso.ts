"use client"

import { useMemo } from "react"

import type { Aula, Disciplina } from "@/data/estudos/tipos"
import { chave, useArmazenamentoLocal } from "./armazenamento"

/**
 * Progresso da disciplina: o que foi concluído, revisado e resolvido.
 *
 * Três marcas separadas e não uma só porque respondem a perguntas diferentes —
 * "assisti" não é "revisei", e é justamente o segundo que diz o que ainda cai
 * na prova sem estar seguro.
 */
export interface Progresso {
  /** Número da aula → concluída. */
  concluidas: Record<number, boolean>
  /** Número da aula → revisada. */
  revisadas: Record<number, boolean>
  /** Id do exercício → resolvido. */
  exercicios: Record<string, boolean>
}

export const PROGRESSO_VAZIO: Progresso = { concluidas: {}, revisadas: {}, exercicios: {} }

export interface Estatisticas {
  totalAulas: number
  concluidas: number
  revisadas: number
  restantes: number
  totalExercicios: number
  exerciciosFeitos: number
  /** 0–100. */
  percentual: number
}

/**
 * O percentual geral pesa aula e exercício juntos.
 *
 * Contar só aulas daria 100% a quem marcou vinte caixas sem resolver um
 * exercício; contar só exercícios ignoraria as aulas que não têm nenhum. A
 * soma dos dois universos é a única medida que não mente em nenhum dos casos.
 */
export function calcular(aulas: readonly Aula[], p: Progresso): Estatisticas {
  const totalAulas = aulas.length
  const idsExercicios = aulas.flatMap((a) => a.exercicios?.map((e) => e.id) ?? [])
  const concluidas = aulas.filter((a) => p.concluidas[a.numero]).length
  const revisadas = aulas.filter((a) => p.revisadas[a.numero]).length
  const exerciciosFeitos = idsExercicios.filter((id) => p.exercicios[id]).length

  const universo = totalAulas + idsExercicios.length
  const feitos = concluidas + exerciciosFeitos

  return {
    totalAulas,
    concluidas,
    revisadas,
    restantes: totalAulas - concluidas,
    totalExercicios: idsExercicios.length,
    exerciciosFeitos,
    percentual: universo === 0 ? 0 : Math.round((feitos / universo) * 100),
  }
}

export function useProgresso(disciplina: Disciplina) {
  const { valor, definir, hidratado, limpar } = useArmazenamentoLocal<Progresso>(
    chave(disciplina.slug, "progresso"),
    PROGRESSO_VAZIO,
  )

  const stats = useMemo(() => calcular(disciplina.aulas, valor), [disciplina.aulas, valor])

  const alternarAula = (numero: number) =>
    definir((p) => ({ ...p, concluidas: { ...p.concluidas, [numero]: !p.concluidas[numero] } }))

  const alternarRevisao = (numero: number) =>
    definir((p) => ({ ...p, revisadas: { ...p.revisadas, [numero]: !p.revisadas[numero] } }))

  const alternarExercicio = (id: string) =>
    definir((p) => ({ ...p, exercicios: { ...p.exercicios, [id]: !p.exercicios[id] } }))

  return {
    progresso: valor,
    stats,
    hidratado,
    alternarAula,
    alternarRevisao,
    alternarExercicio,
    limpar,
  }
}
