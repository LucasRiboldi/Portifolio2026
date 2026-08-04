import type { DiaSemana } from "@/data/estudos/tipos"

/**
 * O calendário das aulas — calculado, nunca digitado.
 *
 * Digitar vinte datas por disciplina, cinco vezes, é cem oportunidades de errar
 * em silêncio: uma data trocada não quebra nada, só mente. Aqui existem três
 * entradas — o dia da semana da disciplina, a segunda-feira que abre o
 * semestre e a lista de feriados — e as datas saem daí.
 *
 * Tudo em UTC de propósito. Data de aula é dia de calendário, não instante: com
 * horário local, um fuso a oeste de Greenwich empurra `2026-07-27T00:00` para o
 * dia 26 e o cronograma inteiro anda um dia para trás.
 */

/** Segunda-feira que abre o 3º semestre de 2026. */
export const INICIO_SEMESTRE = "2026-07-27"

/** Total de encontros por disciplina: 80 horas-aula ÷ 4 por encontro. */
export const AULAS_POR_SEMESTRE = 20

/**
 * Feriados nacionais que caem em dia letivo no 2º semestre de 2026.
 *
 * Só entram os que realmente derrubam uma aula: 15/11/2026 é domingo e
 * 25/12/2026 é sexta, mas cai depois do fim do semestre — nenhum dos dois
 * altera data nenhuma. Ficam de fora para a lista não sugerir efeito que não
 * tem.
 */
export const FERIADOS_2026: readonly string[] = [
  "2026-09-07", // Independência — segunda
  "2026-10-12", // Nossa Senhora Aparecida — segunda
  "2026-11-02", // Finados — segunda
  "2026-11-20", // Consciência Negra — sexta
]

const DIA_MS = 86_400_000

/** `2026-07-27` → Date em UTC. Recusa o que não for uma data ISO válida. */
export function comoData(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) throw new Error(`Data fora do formato AAAA-MM-DD: ${iso}`)
  const d = new Date(`${iso}T00:00:00.000Z`)
  if (Number.isNaN(d.getTime())) throw new Error(`Data inexistente: ${iso}`)
  return d
}

/** Date → `2026-07-27`. */
export function comoISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/**
 * As datas dos `total` encontros de uma disciplina.
 *
 * Feriado não adia a aula para outro dia da semana: a semana inteira se perde e
 * o conteúdo escorrega para a semana seguinte — que é o que acontece de fato
 * num curso presencial. Por isso o laço percorre semanas e só conta as que
 * sobraram.
 */
export function datasDasAulas({
  diaSemana,
  inicio = INICIO_SEMESTRE,
  total = AULAS_POR_SEMESTRE,
  feriados = FERIADOS_2026,
}: {
  diaSemana: DiaSemana
  inicio?: string
  total?: number
  feriados?: readonly string[]
}): string[] {
  const segunda = comoData(inicio)
  if (segunda.getUTCDay() !== 1) {
    throw new Error(`O início do semestre precisa ser uma segunda-feira: ${inicio}`)
  }

  const pulados = new Set(feriados)
  const datas: string[] = []

  // Teto de segurança: sem ele, uma lista de feriados absurda daria laço
  // infinito em vez de erro. Três anos de semanas é folga de sobra.
  for (let semana = 0; datas.length < total && semana < 156; semana++) {
    const dia = new Date(segunda.getTime() + (semana * 7 + (diaSemana - 1)) * DIA_MS)
    const iso = comoISO(dia)
    if (!pulados.has(iso)) datas.push(iso)
  }

  if (datas.length < total) {
    throw new Error(`Não foi possível agendar ${total} aulas a partir de ${inicio}`)
  }
  return datas
}

/** `2026-07-27` → `27/07/2026`. */
export function dataBR(iso: string): string {
  const [a, m, d] = iso.split("-")
  return `${d}/${m}/${a}`
}

/** `2026-07-27` → `27 de julho`. Para o cabeçalho da aula. */
export function dataExtenso(iso: string): string {
  return comoData(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
}

export type SituacaoAula = "passada" | "hoje" | "futura"

/**
 * Onde a aula está no tempo — o que a linha do tempo usa para se orientar.
 *
 * `hoje` é parâmetro, não `new Date()` escondido: sem isso a função é
 * impossível de testar e o componente que a chama passa a depender do relógio
 * da máquina que renderiza.
 */
export function situacao(iso: string, hoje: string): SituacaoAula {
  if (iso === hoje) return "hoje"
  return iso < hoje ? "passada" : "futura"
}

/** Índice da próxima aula (a de hoje, ou a primeira futura). -1 se acabou. */
export function proximaAula(datas: readonly string[], hoje: string): number {
  return datas.findIndex((d) => d >= hoje)
}
