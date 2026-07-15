"use client"

import { Fragment, useEffect, useMemo, useState } from "react"

import { type LearnLanguage } from "@/data/learn"
import {
  badgesFor,
  computeStats,
  emptyProgress,
  heatmap,
  registerActivity,
  type Progress,
} from "@/lib/learn/gamify"
import { LearnExercises } from "@/components/dev/learn-exercises"
import { LearnGamification } from "@/components/dev/learn-gamification"
import { LearnTrail } from "@/components/dev/learn-trail"

type Tab = "trilha" | "roadmap" | "exercicios" | "praticas" | "erros" | "recursos"

const TABS: { id: Tab; label: string }[] = [
  { id: "trilha", label: "trilha" },
  { id: "roadmap", label: "roadmap" },
  { id: "exercicios", label: "exercícios" },
  { id: "praticas", label: "boas práticas" },
  { id: "erros", label: "erros comuns" },
  { id: "recursos", label: "recursos" },
]

/** Renderiza `code` entre crases como <code> monoespaçado. */
function withCode(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="learn-code">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

const storageKey = (langId: string) => `dev:learn:${langId}`

/** Aceita o formato novo (Progress) ou o legado (só o mapa de tópicos). */
function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress()
  try {
    const obj = JSON.parse(raw) as unknown
    if (obj && typeof obj === "object" && "topics" in obj) {
      return { ...emptyProgress(), ...(obj as Partial<Progress>) }
    }
    return { ...emptyProgress(), topics: (obj as Record<string, boolean>) ?? {} }
  } catch {
    return emptyProgress()
  }
}

export function LearnView({ languages }: { languages: LearnLanguage[] }) {
  const available = languages.filter((l) => l.status === "available")
  const [activeId, setActiveId] = useState(available[0]?.id ?? languages[0]?.id)
  const [tab, setTab] = useState<Tab>("trilha")
  const [progress, setProgress] = useState<Progress>(emptyProgress)
  const [hydrated, setHydrated] = useState(false)

  const lang = useMemo(
    () => languages.find((l) => l.id === activeId) ?? languages[0],
    [languages, activeId],
  )

  // Carrega o progresso salvo ao trocar de linguagem.
  useEffect(() => {
    if (!lang) return
    setProgress(parseProgress(localStorage.getItem(storageKey(lang.id))))
    setHydrated(true)
  }, [lang])

  // Persiste o progresso.
  useEffect(() => {
    if (!hydrated || !lang) return
    try {
      localStorage.setItem(storageKey(lang.id), JSON.stringify(progress))
    } catch {
      /* localStorage indisponível — ignora */
    }
  }, [progress, hydrated, lang])

  if (!lang) return null

  const stats = computeStats(lang, progress)
  const pct = stats.totalTopics ? Math.round((stats.doneTopics / stats.totalTopics) * 100) : 0
  const badges = badgesFor(stats, progress.streak)
  const cells = heatmap(progress)
  const trailPhases = lang.phases.map((ph) => ({
    id: ph.id,
    title: ph.title,
    total: ph.topics.length,
    done: ph.topics.filter((_, i) => progress.topics[`${ph.id}:${i}`]).length,
  }))

  const toggleTopic = (key: string) =>
    setProgress((p) => {
      const nowDone = !p.topics[key]
      const base = { ...p, topics: { ...p.topics, [key]: nowDone } }
      return nowDone ? registerActivity(base) : base
    })

  const toggleExercise = (id: string) =>
    setProgress((p) => {
      const nowDone = !p.exercises[id]
      const base = { ...p, exercises: { ...p.exercises, [id]: nowDone } }
      return nowDone ? registerActivity(base) : base
    })

  const runHref = lang.resources.find((r) => /compilador|online|godbolt|jdoodle|gdb/i.test(r.label))?.href

  return (
    <div style={{ ["--learn-accent" as string]: lang.accent }}>
      {/* Seletor de linguagem */}
      <div className="dv-chip-row" role="group" aria-label="Escolha a linguagem">
        {languages.map((l) => {
          const soon = l.status === "coming-soon"
          return (
            <button
              key={l.id}
              type="button"
              className="dv-filter learn-lang"
              data-on={l.id === activeId}
              disabled={soon}
              title={soon ? "Em breve" : `Estudar ${l.name}`}
              onClick={() => !soon && setActiveId(l.id)}
              style={{ ["--learn-accent" as string]: l.accent }}
            >
              <span aria-hidden>{l.emoji}</span> {l.name}
              {soon && <span className="learn-soon">em breve</span>}
            </button>
          )
        })}
      </div>

      {/* Cabeçalho da linguagem */}
      <div className="learn-lead">
        <p className="learn-tagline">{lang.tagline}</p>
        {lang.course && (
          <p className="learn-course">
            curso base:{" "}
            {lang.courseHref ? (
              <a className="dv-link" href={lang.courseHref} target="_blank" rel="noreferrer">
                {lang.course}
              </a>
            ) : (
              lang.course
            )}
          </p>
        )}
      </div>

      {/* Progresso (números) */}
      <div className="dv-stats" style={{ marginTop: "1.1rem" }}>
        <div className="dv-stat">
          <div className="n" style={{ color: "var(--learn-accent)" }}>
            {pct}%
          </div>
          <div className="l">roadmap</div>
        </div>
        <div className="dv-stat">
          <div className="n">
            {stats.doneTopics}
            <span style={{ color: "var(--d-comment)", fontSize: "1rem" }}>/{stats.totalTopics}</span>
          </div>
          <div className="l">tópicos</div>
        </div>
        <div className="dv-stat">
          <div className="n">
            {stats.doneExercises}
            <span style={{ color: "var(--d-comment)", fontSize: "1rem" }}>
              /{stats.totalExercises}
            </span>
          </div>
          <div className="l">exercícios</div>
        </div>
        <div className="dv-stat">
          <div className="n">{lang.phases.length}</div>
          <div className="l">fases</div>
        </div>
      </div>

      {/* Gamificação (XP, streak, badges, heatmap) */}
      {hydrated && (
        <LearnGamification stats={stats} streak={progress.streak} badges={badges} cells={cells} />
      )}

      {/* Abas */}
      <div className="dv-tabs" style={{ marginTop: "1.5rem" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="dv-tab"
            data-on={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!hydrated && ["trilha", "roadmap", "exercicios"].includes(tab) && (
        <p className="dv-empty">Carregando…</p>
      )}

      {hydrated && tab === "trilha" && <LearnTrail phases={trailPhases} />}

      {hydrated && tab === "roadmap" && (
        <div className="learn-phases">
          {lang.phases.map((phase) => {
            const localDone = phase.topics.filter((_, i) => progress.topics[`${phase.id}:${i}`]).length
            return (
              <section key={phase.id} className="learn-phase">
                <header className="learn-phase-head">
                  <h3>{phase.title}</h3>
                  <span className="dv-tag">
                    {localDone}/{phase.topics.length}
                  </span>
                </header>
                <ul className="learn-list">
                  {phase.topics.map((topic, i) => {
                    const key = `${phase.id}:${i}`
                    const checked = !!progress.topics[key]
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className="learn-item"
                          role="checkbox"
                          aria-checked={checked}
                          data-done={checked}
                          onClick={() => toggleTopic(key)}
                        >
                          <span className="learn-box" aria-hidden />
                          <span>{withCode(topic.label)}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      {hydrated && tab === "exercicios" && (
        <LearnExercises
          exercises={lang.exercises}
          done={progress.exercises}
          onToggle={toggleExercise}
          runHref={runHref}
        />
      )}

      {tab === "praticas" && (
        <ul className="learn-list learn-standalone">
          {lang.practices.map((p, i) => (
            <li key={i} className="learn-bullet">
              <span aria-hidden style={{ color: "var(--d-green)" }}>
                ✓
              </span>
              <span>{withCode(p)}</span>
            </li>
          ))}
        </ul>
      )}

      {tab === "erros" && (
        <div className="learn-errors">
          {lang.errors.map((e, i) => (
            <div key={i} className="dv-card learn-error">
              <code className="learn-code learn-error-name">{e.error}</code>
              <p>{e.cause}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "recursos" && (
        <ul className="learn-list learn-standalone">
          {lang.resources.map((r, i) => (
            <li key={i} className="learn-bullet">
              <span aria-hidden style={{ color: "var(--learn-accent)" }}>
                →
              </span>
              <a className="dv-link" href={r.href} target="_blank" rel="noreferrer">
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
