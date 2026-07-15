"use client"

import { Fragment, useEffect, useMemo, useState } from "react"

import { countTopics, type LearnLanguage } from "@/data/learn"

type Tab = "roadmap" | "praticas" | "erros" | "recursos"

const TABS: { id: Tab; label: string }[] = [
  { id: "roadmap", label: "roadmap" },
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

export function LearnView({ languages }: { languages: LearnLanguage[] }) {
  const available = languages.filter((l) => l.status === "available")
  const [activeId, setActiveId] = useState(available[0]?.id ?? languages[0]?.id)
  const [tab, setTab] = useState<Tab>("roadmap")
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)

  const lang = useMemo(
    () => languages.find((l) => l.id === activeId) ?? languages[0],
    [languages, activeId],
  )

  // Carrega o progresso salvo ao trocar de linguagem.
  useEffect(() => {
    if (!lang) return
    try {
      const raw = localStorage.getItem(storageKey(lang.id))
      setDone(raw ? (JSON.parse(raw) as Record<string, boolean>) : {})
    } catch {
      setDone({})
    }
    setHydrated(true)
  }, [lang])

  // Persiste o progresso.
  useEffect(() => {
    if (!hydrated || !lang) return
    try {
      localStorage.setItem(storageKey(lang.id), JSON.stringify(done))
    } catch {
      /* localStorage indisponível — ignora */
    }
  }, [done, hydrated, lang])

  if (!lang) return null

  const total = countTopics(lang)
  const doneCount = lang.phases.reduce(
    (n, p) => n + p.topics.filter((_, i) => done[`${p.id}:${i}`]).length,
    0,
  )
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const toggle = (key: string) => setDone((d) => ({ ...d, [key]: !d[key] }))

  return (
    <div style={{ ["--learn-accent" as string]: lang.accent }}>
      {/* Seletor de linguagem */}
      <div className="dv-chip-row" role="tablist" aria-label="Escolha a linguagem">
        {languages.map((l) => {
          const soon = l.status === "coming-soon"
          return (
            <button
              key={l.id}
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

      {/* Progresso */}
      <div className="dv-stats" style={{ marginTop: "1.1rem" }}>
        <div className="dv-stat">
          <div className="n" style={{ color: "var(--learn-accent)" }}>
            {pct}%
          </div>
          <div className="l">progresso</div>
        </div>
        <div className="dv-stat">
          <div className="n">
            {doneCount}
            <span style={{ color: "var(--d-comment)", fontSize: "1rem" }}>/{total}</span>
          </div>
          <div className="l">tópicos dominados</div>
        </div>
        <div className="dv-stat">
          <div className="n">{lang.phases.length}</div>
          <div className="l">fases</div>
        </div>
        <div className="dv-stat">
          <div className="n">{lang.practices.length}</div>
          <div className="l">boas práticas</div>
        </div>
      </div>
      <div className="learn-bar" aria-hidden>
        <span style={{ width: `${pct}%`, background: "var(--learn-accent)" }} />
      </div>

      {/* Abas */}
      <div className="dv-tabs" style={{ marginTop: "1.5rem" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="dv-tab"
            data-on={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roadmap" && (
        <div className="learn-phases">
          {lang.phases.map((phase) => {
            const localDone = phase.topics.filter((_, i) => done[`${phase.id}:${i}`]).length
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
                    const checked = !!done[key]
                    return (
                      <li key={key}>
                        <button
                          className="learn-item"
                          role="checkbox"
                          aria-checked={checked}
                          data-done={checked}
                          onClick={() => toggle(key)}
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

      {tab === "roadmap" && lang.routine && (
        <div className="learn-routine">
          <p className="dv-section-title">Rotina sugerida</p>
          <div className="dv-grid" style={{ marginTop: "0.75rem" }}>
            {lang.routine.map((r) => (
              <div key={r.day} className="dv-card">
                <h3 style={{ color: "var(--learn-accent)" }}>{r.day}</h3>
                <p>{r.activity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
