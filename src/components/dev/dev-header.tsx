/** Cabeçalho padrão das páginas do realm Dev (estilo terminal). */
export function DevHeader({
  fn,
  title,
  accent,
  subtitle,
}: {
  fn: string
  title: string
  accent?: string
  subtitle?: string
}) {
  return (
    <header>
      <p className="dv-kicker">
        <span className="tok-fn">{fn}</span>(<span className="tok-str">&quot;{title}&quot;</span>)
      </p>
      <h1 className="dv-title">
        {title} {accent && <span className="accent">{accent}</span>}
      </h1>
      {subtitle && <p className="dv-sub">{subtitle}</p>}
    </header>
  )
}

export function DevEmpty({ children }: { children: React.ReactNode }) {
  return <div className="dv-empty">{children}</div>
}
