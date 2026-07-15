/**
 * Camada de gamificação do /dev/learn — funções puras sobre o progresso
 * salvo no navegador. Sem dependência de React/DOM (testável e reutilizável).
 */
import { XP_EXERCISE, XP_TOPIC, type LearnLanguage } from "@/data/learn"

export interface Progress {
  /** chave `${phaseId}:${index}` -> concluído */
  topics: Record<string, boolean>
  /** id do exercício -> concluído */
  exercises: Record<string, boolean>
  /** "YYYY-MM-DD" -> nº de ações no dia (para o heatmap) */
  activity: Record<string, number>
  /** dias consecutivos de atividade */
  streak: number
  /** último dia ativo "YYYY-MM-DD" */
  lastActive: string
}

export function emptyProgress(): Progress {
  return { topics: {}, exercises: {}, activity: {}, streak: 0, lastActive: "" }
}

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`
}

/** Registra uma ação de hoje e atualiza o streak. Retorna novo objeto. */
export function registerActivity(p: Progress): Progress {
  const today = dayKey()
  const activity = { ...p.activity, [today]: (p.activity[today] ?? 0) + 1 }
  let streak = p.streak
  if (p.lastActive !== today) {
    const y = new Date()
    y.setDate(y.getDate() - 1)
    streak = p.lastActive === dayKey(y) ? p.streak + 1 : 1
  } else if (streak === 0) {
    streak = 1
  }
  return { ...p, activity, streak, lastActive: today }
}

export interface Stats {
  xp: number
  level: number
  intoLevel: number
  levelSpan: number
  doneTopics: number
  totalTopics: number
  doneExercises: number
  totalExercises: number
}

export function computeStats(lang: LearnLanguage, p: Progress): Stats {
  const totalTopics = lang.phases.reduce((n, ph) => n + ph.topics.length, 0)
  const doneTopics = lang.phases.reduce(
    (n, ph) => n + ph.topics.filter((_, i) => p.topics[`${ph.id}:${i}`]).length,
    0,
  )
  const totalExercises = lang.exercises.length
  let xp = doneTopics * XP_TOPIC
  let doneExercises = 0
  for (const ex of lang.exercises) {
    if (p.exercises[ex.id]) {
      doneExercises += 1
      xp += XP_EXERCISE[ex.difficulty]
    }
  }
  // Curva de nível: limiar(L) = 50 * L^2.
  let level = 0
  while (50 * (level + 1) * (level + 1) <= xp) level += 1
  const floor = 50 * level * level
  const ceil = 50 * (level + 1) * (level + 1)
  return {
    xp,
    level: level + 1,
    intoLevel: xp - floor,
    levelSpan: ceil - floor,
    doneTopics,
    totalTopics,
    doneExercises,
    totalExercises,
  }
}

export interface Badge {
  id: string
  icon: string
  label: string
  desc: string
  earned: boolean
}

export function badgesFor(stats: Stats, streak: number): Badge[] {
  const topicPct = stats.totalTopics ? stats.doneTopics / stats.totalTopics : 0
  const list: (Omit<Badge, "earned"> & { ok: boolean })[] = [
    { id: "first", icon: "👣", label: "Primeiros passos", desc: "Concluiu o 1º tópico", ok: stats.doneTopics >= 1 },
    { id: "half", icon: "🧭", label: "Meia trilha", desc: "50% dos tópicos", ok: topicPct >= 0.5 },
    { id: "full", icon: "🏆", label: "Trilha completa", desc: "100% dos tópicos", ok: stats.totalTopics > 0 && stats.doneTopics === stats.totalTopics },
    { id: "hands", icon: "🔧", label: "Mãos à obra", desc: "1º exercício resolvido", ok: stats.doneExercises >= 1 },
    { id: "grind", icon: "💪", label: "Praticante", desc: "5 exercícios", ok: stats.doneExercises >= 5 },
    { id: "challenger", icon: "🎯", label: "Mestre dos desafios", desc: "Todos os exercícios", ok: stats.totalExercises > 0 && stats.doneExercises === stats.totalExercises },
    { id: "streak3", icon: "🔥", label: "Constância", desc: "Streak de 3 dias", ok: streak >= 3 },
    { id: "streak7", icon: "⭐", label: "Dedicação", desc: "Streak de 7 dias", ok: streak >= 7 },
    { id: "lvl5", icon: "🎖️", label: "Veterano", desc: "Alcançou o nível 5", ok: stats.level >= 5 },
  ]
  return list.map(({ ok, ...b }) => ({ ...b, earned: ok }))
}

export interface HeatCell {
  date: string
  count: number
}

/** Últimos `weeks*7` dias, do mais antigo ao mais recente. */
export function heatmap(p: Progress, weeks = 12): HeatCell[] {
  const cells: HeatCell[] = []
  const start = new Date()
  start.setDate(start.getDate() - (weeks * 7 - 1))
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = dayKey(d)
    cells.push({ date: key, count: p.activity[key] ?? 0 })
  }
  return cells
}
