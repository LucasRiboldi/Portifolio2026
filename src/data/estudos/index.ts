import { BANCO_DE_DADOS } from "./banco-de-dados"
import { ENGENHARIA_DE_SOFTWARE_I } from "./engenharia-de-software-i"
import { ESTRUTURA_DE_DADOS } from "./estrutura-de-dados"
import { POO_I } from "./poo-i"
import { SISTEMAS_OPERACIONAIS } from "./sistemas-operacionais"
import type { Disciplina } from "./tipos"

/**
 * O REGISTRO DAS DISCIPLINAS — a única lista que precisa ser tocada.
 *
 * Acrescentar uma disciplina é escrever um arquivo de configuração e nomeá-lo
 * aqui. Nada mais muda: a rota é dinâmica, a página é uma só, os itens do menu
 * saem desta lista e o calendário calcula as datas a partir do `diaSemana` que
 * o arquivo declara.
 *
 * A ordem é a dos dias da semana, e não a alfabética: é assim que a semana é
 * vivida, e é a ordem em que os itens aparecem no dock.
 */
export const DISCIPLINAS: readonly Disciplina[] = [
  ESTRUTURA_DE_DADOS, // segunda
  SISTEMAS_OPERACIONAIS, // terça
  POO_I, // quarta
  BANCO_DE_DADOS, // quinta
  ENGENHARIA_DE_SOFTWARE_I, // sexta
]

/** Prefixo comum das rotas — usado pela página e pelo dock. */
export const BASE_ESTUDOS = "/desenvolvedor/estudos"

export function buscarDisciplina(slug: string): Disciplina | undefined {
  return DISCIPLINAS.find((d) => d.slug === slug)
}

export type { Disciplina }
