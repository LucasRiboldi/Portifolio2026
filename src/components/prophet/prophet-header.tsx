export function ProphetHeader({
  kicker,
  headline,
  standfirst,
  byline,
}: {
  kicker: string
  headline: string
  standfirst?: string
  byline?: string
}) {
  return (
    <header>
      <p className="pr-kicker">{kicker}</p>
      <h1 className="pr-headline">{headline}</h1>
      {standfirst && <p className="pr-stand">{standfirst}</p>}
      {byline && <p className="pr-byline">{byline}</p>}
      <hr className="pr-rule" />
    </header>
  )
}

export function ProphetEmpty({ children }: { children: React.ReactNode }) {
  return <div className="pr-empty">{children}</div>
}
