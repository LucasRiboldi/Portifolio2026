import type { Badge, HeatCell, Stats } from "@/lib/learn/gamify"

/** Intensidade 0..4 do heatmap a partir da contagem de ações. */
function level(count: number): number {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

export function LearnGamification({
  stats,
  streak,
  badges,
  cells,
}: {
  stats: Stats
  streak: number
  badges: Badge[]
  cells: HeatCell[]
}) {
  const pct = stats.levelSpan ? Math.round((stats.intoLevel / stats.levelSpan) * 100) : 0
  const earned = badges.filter((b) => b.earned).length

  return (
    <div className="learn-game">
      <div className="learn-xp">
        <div className="learn-level" style={{ color: "var(--learn-accent)" }}>
          Nível {stats.level}
        </div>
        <div className="learn-xpbar" aria-label={`${stats.xp} XP`}>
          <span style={{ width: `${pct}%`, background: "var(--learn-accent)" }} />
        </div>
        <div className="learn-xp-meta">
          <span>{stats.xp} XP</span>
          <span>
            <span aria-hidden>🔥</span> {streak} dia{streak === 1 ? "" : "s"}
          </span>
          <span>
            {earned}/{badges.length} conquistas
          </span>
        </div>
      </div>

      <div className="learn-badges" aria-label="Conquistas">
        {badges.map((b) => (
          <div
            key={b.id}
            className="learn-badge"
            data-earned={b.earned}
            title={`${b.label} — ${b.desc}${b.earned ? "" : " (bloqueada)"}`}
          >
            <span aria-hidden>{b.icon}</span>
          </div>
        ))}
      </div>

      <div className="learn-heat" aria-label="Atividade dos últimos 3 meses">
        {cells.map((c) => (
          <span key={c.date} className="learn-heat-cell" data-lvl={level(c.count)} title={`${c.date}: ${c.count} ação(ões)`} />
        ))}
      </div>
    </div>
  )
}
