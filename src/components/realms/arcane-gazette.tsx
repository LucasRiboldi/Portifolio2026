import {
  gazette,
  leadArticle,
  columns,
  sidebar,
  almanac,
} from "@/lib/arcane-content"

/**
 * Quebra um texto em letras animáveis (efeito "jornal mágico": a tinta
 * treme/assenta letra a letra). Espaços viram gaps não-animados.
 * Cada letra recebe --i para escalonar a animação via CSS.
 */
function InkLetters({
  text,
  className,
  gild,
}: {
  text: string
  className: string
  /** letras a "dourar" (como o P do Daily Prophet), case-insensitive */
  gild?: string
}) {
  let idx = 0
  const gildSet = new Set((gild ?? "").toLowerCase())
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden> </span>
        ) : (
          <span
            key={i}
            aria-hidden
            className={gildSet.has(ch.toLowerCase()) ? "arc-ltr arc-gold" : "arc-ltr"}
            style={{ "--i": idx++ } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
    </span>
  )
}

/**
 * ArcaneGazette — a home do realm ARCANE (Game Design) diagramada como
 * um jornal antigo ("The Daily Prophet"). Renderiza apenas quando
 * data-realm="arcane" (gating por CSS em realms.css, .realm-only-arcane).
 * Server component; as animações mágicas são CSS puro.
 */
export function ArcaneGazette({ className }: { className?: string }) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date())

  return (
    <article className={`arc-gazette ${className ?? ""}`} aria-label="The Arcane Gazette — Game Design">
      {/* ---------- Masthead ---------- */}
      <header className="arc-masthead">
        <div className="arc-masthead-rule">
          <span>{gazette.edition}</span>
          <span className="arc-cap">{today}</span>
          <span>{gazette.price}</span>
        </div>
        <h1 className="arc-title">
          <InkLetters text={gazette.masthead} className="arc-ink" gild="P" />
        </h1>
        <p className="arc-motto">{gazette.motto} — {gazette.place}</p>
      </header>

      {/* ---------- Corpo em colunas ---------- */}
      <div className="arc-body">
        {/* Matéria de capa */}
        <section className="arc-lead">
          <p className="arc-kicker">{leadArticle.kicker}</p>
          <h2 className="arc-headline">
            <InkLetters text={leadArticle.headline} className="arc-settle" />
          </h2>
          <p className="arc-standfirst">{leadArticle.standfirst}</p>
          {leadArticle.byline && <p className="arc-byline">{leadArticle.byline}</p>}
          <div className="arc-cols">
            {leadArticle.body.map((p, i) => (
              <p key={i} className={i === 0 ? "arc-dropcap" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Barra lateral — grimório */}
        <aside className="arc-sidebar" aria-label={sidebar.title}>
          <h3 className="arc-sidebar-title">{sidebar.title}</h3>
          <dl className="arc-grimoire">
            {sidebar.items.map((it) => (
              <div key={it.term}>
                <dt>{it.term}</dt>
                <dd>{it.note}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {/* ---------- Colunas de serviço ---------- */}
      <div className="arc-rule-double" aria-hidden />
      <section className="arc-columns">
        {columns.map((c) => (
          <article key={c.kicker} className="arc-column">
            <p className="arc-kicker">{c.kicker}</p>
            <h3 className="arc-col-headline">{c.headline}</h3>
            <p className="arc-col-stand">{c.standfirst}</p>
            {c.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        ))}
      </section>

      {/* ---------- Almanaque ---------- */}
      <div className="arc-rule-double" aria-hidden />
      <footer className="arc-almanac">
        {almanac.map((a) => (
          <div key={a.label} className="arc-stat">
            <span className="arc-stat-value">{a.value}</span>
            <span className="arc-stat-label">{a.label}</span>
          </div>
        ))}
      </footer>
    </article>
  )
}
