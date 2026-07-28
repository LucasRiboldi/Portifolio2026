/**
 * PROPHET WIRE — leitura do agendamento (Parte 13).
 *
 * O painel precisa dizer "próxima execução". Em vez de embutir um parser de
 * cron completo (faixas, listas, passos, nomes de mês), este módulo suporta
 * EXPLICITAMENTE o subconjunto que o projeto usa — execução diária em hora
 * fixa, `M H * * *` — e devolve `null` para qualquer outra expressão, para o
 * painel dizer a verdade ("não sei calcular") em vez de exibir um palpite.
 *
 * FUSO: a Vercel Cron dispara em UTC. Os cálculos aqui são todos em UTC, e o
 * painel rotula assim — `0 6 * * *` é 06h UTC, ou seja 03h em Brasília.
 */

/** Agendamento diário reconhecido. */
export interface DailySchedule {
  hourUtc: number
  minuteUtc: number
}

/**
 * Interpreta `M H * * *` (diário). Devolve `null` se a expressão usar qualquer
 * recurso fora desse formato — o chamador deve tratar isso como "desconhecido".
 */
export function parseDailyCron(expression: string): DailySchedule | null {
  const fields = expression.trim().split(/\s+/)
  if (fields.length !== 5) return null

  const [minute, hour, dom, month, dow] = fields
  // Só diário: dia-do-mês, mês e dia-da-semana têm de ser curinga.
  if (dom !== "*" || month !== "*" || dow !== "*") return null

  const minuteUtc = Number(minute)
  const hourUtc = Number(hour)
  const validMinute = /^\d{1,2}$/.test(minute!) && minuteUtc >= 0 && minuteUtc <= 59
  const validHour = /^\d{1,2}$/.test(hour!) && hourUtc >= 0 && hourUtc <= 23
  if (!validMinute || !validHour) return null

  return { hourUtc, minuteUtc }
}

/**
 * Próxima ocorrência (em UTC) de um agendamento diário, a partir de `from`.
 * Se o horário de hoje já passou, devolve o de amanhã. Um horário exatamente
 * igual a `from` conta como já ocorrido — a próxima é amanhã.
 */
export function nextRunAt(schedule: DailySchedule, from: Date): Date {
  const next = new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate(),
      schedule.hourUtc,
      schedule.minuteUtc,
      0,
      0,
    ),
  )
  if (next.getTime() <= from.getTime()) next.setUTCDate(next.getUTCDate() + 1)
  return next
}

/**
 * Conveniência: próxima execução direto da expressão, ou `null` se ela não for
 * do formato diário suportado.
 */
export function nextRunFromCron(expression: string, from: Date): Date | null {
  const schedule = parseDailyCron(expression)
  return schedule ? nextRunAt(schedule, from) : null
}
