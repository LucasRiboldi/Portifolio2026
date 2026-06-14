"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  GROUP_LABELS,
  RESULTS,
  UPCOMING,
  flagUrl,
  formatDateLong,
  formatDateShort,
  formatTime,
  type Match,
  type SportsTab,
} from "@/data/sports"
import styles from "./sports-widget.module.css"

/** Agrupa partidas em seções consecutivas por `groupKey` (igual ao DOM original). */
function toSections(matches: Match[]): { key: string; matches: Match[] }[] {
  const sections: { key: string; matches: Match[] }[] = []
  for (const match of matches) {
    const last = sections[sections.length - 1]
    if (last && last.key === match.groupKey) last.matches.push(match)
    else sections.push({ key: match.groupKey, matches: [match] })
  }
  return sections
}

function Flag({ team, large }: { team: { name: string; code: string }; large?: boolean }) {
  const size = large ? 30 : 22
  if (team.code === "--") {
    return (
      <span className={styles.flagWrap}>
        <span
          className={styles.flagTbd}
          style={{ width: size, height: size }}
          aria-hidden="true"
        />
      </span>
    )
  }
  return (
    <span className={styles.flagWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element -- bandeiras vêm de CDN externo (Merino), sem otimização do next/image */}
      <img
        className={cn(styles.flag, large && styles.flagLarge)}
        src={flagUrl(team.code)}
        alt={team.name}
        title={team.name}
        width={size}
        height={size}
        loading="lazy"
      />
    </span>
  )
}

function TeamCell({
  team,
  side,
  large,
}: {
  team: { name: string; code: string }
  side: "home" | "away"
  large?: boolean
}) {
  return (
    <div className={cn(styles.team, side === "home" ? styles.teamHome : styles.teamAway)}>
      <Flag team={team} large={large} />
      <span className={cn(styles.code, large && styles.codeLarge)}>{team.code}</span>
    </div>
  )
}

function MatchRow({ match, large }: { match: Match; large?: boolean }) {
  const isResult = match.status === "full-time"
  const ariaLabel = isResult
    ? `${match.home.name}, ${match.homeScore} contra ${match.away.name}, ${match.awayScore}`
    : `${match.home.name} contra ${match.away.name}, ${formatTime(match.date)}, ${formatDateLong(match.date)}`

  return (
    <a
      className={cn(styles.row, large && styles.rowLarge, "clickable")}
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <TeamCell team={match.home} side="home" large={large} />

      {isResult ? (
        <div className={styles.result}>
          <span className={cn(styles.pill, large && styles.pillLarge)}>
            <span>{match.homeScore}</span>
            <span className={styles.pillSep} aria-hidden="true">
              -
            </span>
            <span>{match.awayScore}</span>
          </span>
          {large && <span className={styles.ftLabel}>Fim de jogo</span>}
        </div>
      ) : (
        <div className={styles.center}>
          <span className={cn(styles.time, large && styles.timeLarge)}>
            {formatTime(match.date)}
          </span>
          <span className={styles.date}>{formatDateShort(match.date)}</span>
        </div>
      )}

      <TeamCell team={match.away} side="away" large={large} />
    </a>
  )
}

const MENU_ITEMS = [
  { id: "follow", label: "Seguir times" },
  { id: "schedule", label: "Ver calendário" },
  { id: "view-upcoming", label: "Ver próximos" },
  { id: "view-results", label: "Ver resultados" },
  { id: "move", label: "Mover" },
  { id: "hide", label: "Ocultar widget" },
  { id: "sep", label: "" },
  { id: "learn-more", label: "Saiba mais" },
] as const

export function SportsWidget() {
  const [tab, setTab] = useState<SportsTab>("upcoming")
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  const matches = tab === "results" ? RESULTS : UPCOMING
  const sections = useMemo(() => toSections(matches), [matches])
  const featured = matches[0]

  function selectTab(next: SportsTab) {
    setTab(next)
    setExpanded(false)
    setMenuOpen(false)
  }

  function onMenuAction(id: string) {
    setMenuOpen(false)
    switch (id) {
      case "view-upcoming":
        selectTab("upcoming")
        break
      case "view-results":
        selectTab("results")
        break
      case "hide":
        setHidden(true)
        break
      case "learn-more":
        window.open("https://support.mozilla.org/kb/firefox-new-tab-widgets", "_blank")
        break
      default:
        break
    }
  }

  if (hidden) {
    return (
      <button className={styles.viewAll} onClick={() => setHidden(false)} type="button">
        Mostrar widget de esportes
      </button>
    )
  }

  return (
    <article className={styles.widget} aria-label="Placar de esportes">
      <div className={styles.header}>
        <button
          type="button"
          className={cn(styles.iconBtn, styles.backBtn, expanded && styles.backBtnVisible)}
          aria-label="Voltar"
          onClick={() => setExpanded(false)}
        >
          <ArrowLeft size={16} />
        </button>

        <div className={styles.tabs} role="tablist" aria-label="Visualização de partidas">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "results"}
            className={cn(styles.tab, tab === "results" && styles.tabActive)}
            onClick={() => selectTab("results")}
          >
            Resultados
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "upcoming"}
            className={cn(styles.tab, tab === "upcoming" && styles.tabActive)}
            onClick={() => selectTab("upcoming")}
          >
            Seguintes
          </button>
        </div>

        <div className={styles.menuWrapper}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Mais opções"
            onClick={() => setMenuOpen(o => !o)}
          >
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className={styles.menu} role="menu">
              {MENU_ITEMS.map(item =>
                item.id === "sep" ? (
                  <hr key="sep" className={styles.menuSep} />
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => onMenuAction(item.id)}
                  >
                    {item.label}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.body}>
        {expanded ? (
          <>
            <div className={styles.list}>
              {sections.map((section, i) => (
                <div key={`${section.key}-${i}`}>
                  <span className={styles.sectionLabel}>
                    {GROUP_LABELS[section.key] ?? section.key}
                  </span>
                  <ul>
                    {section.matches.map(match => (
                      <li key={match.id}>
                        <MatchRow match={match} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button className={styles.viewAll} type="button" onClick={() => setExpanded(false)}>
              Mostrar menos
            </button>
          </>
        ) : (
          <>
            {featured && (
              <>
                <span className={styles.sectionLabel}>
                  {GROUP_LABELS[featured.groupKey] ?? featured.groupKey}
                </span>
                <MatchRow match={featured} large />
              </>
            )}
            <button className={styles.viewAll} type="button" onClick={() => setExpanded(true)}>
              Ver tudo
            </button>
          </>
        )}
      </div>
    </article>
  )
}

export default SportsWidget
