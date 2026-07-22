import type { ReactNode } from "react"

/**
 * Primitivas de apresentação do tutorial holo: o passo numerado e o bloco
 * de código. Ficam separadas porque três arquivos as consomem — os passos
 * básicos, os avançados e o catálogo de raridades.
 */

/** Um passo numerado, com a demo opcional grudada à direita. */
export function Step({
  n,
  title,
  children,
  demo,
}: {
  n: number
  title: string
  children: ReactNode
  demo?: ReactNode
}) {
  return (
    <section className="border-t-2 border-white/12 pt-8" aria-label={`Passo ${n}: ${title}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(200px,260px)] lg:items-start">
        <div className="min-w-0">
          <h3 className="sv-display mb-3 text-xl uppercase text-white">
            <span className="text-[var(--sv-magenta)]">{String(n).padStart(2, "0")}.</span> {title}
          </h3>
          <div className="space-y-4 text-sm leading-relaxed text-white/75">{children}</div>
        </div>
        {demo ? <div className="lg:sticky lg:top-24">{demo}</div> : null}
      </div>
    </section>
  )
}

/** Caixa de destaque — a "nota de rodapé" dos passos. */
export function Nota({
  cor = "yellow",
  children,
}: {
  cor?: "yellow" | "cyan" | "magenta"
  children: ReactNode
}) {
  const borda = {
    yellow: "border-[var(--sv-yellow)]",
    cyan: "border-[var(--sv-cyan)]",
    magenta: "border-[var(--sv-magenta)]",
  }[cor]
  return (
    <p className={`rounded border-l-4 ${borda} bg-white/5 py-2 pl-3 text-[13px]`}>{children}</p>
  )
}

/**
 * Bloco de código do tutorial — sem dependência de highlighter.
 *
 * Só duas marcações, ambas com valor didático: as linhas listadas em
 * `highlight` (1-indexadas) ganham barra magenta, e comentários viram
 * cinza. Colorir palavra-chave por palavra-chave exigiria um parser e não
 * ajudaria a entender nenhum dos passos.
 */

function renderLinha(linha: string) {
  const i = linha.search(/\/\/|\/\*/)
  if (i === -1) return linha
  return (
    <>
      {linha.slice(0, i)}
      <span className="cmt">{linha.slice(i)}</span>
    </>
  )
}

export function Code({
  code,
  lang,
  highlight = [],
}: {
  code: string
  lang: "css" | "ts"
  highlight?: number[]
}) {
  const linhas = code.split("\n")
  const marcadas = new Set(highlight)

  // Um índice fora da faixa não quebra nada — simplesmente não realça, e o
  // erro passa despercebido numa revisão visual. Avisa em dev.
  if (process.env.NODE_ENV !== "production") {
    const fora = highlight.filter((n) => n < 1 || n > linhas.length)
    if (fora.length) {
      console.warn(
        `[tutorial] highlight fora da faixa: ${fora.join(", ")} — o bloco tem ${linhas.length} linhas`
      )
    }
  }

  return (
    <div className="relative">
      <span className="sv-heavy absolute right-2 top-2 text-[9px] uppercase tracking-widest text-white/30">
        {lang}
      </span>
      <pre className="tut-code">
        <code>
          {/* uma linha = um bloco; a quebra vem do layout, não de "\n" */}
          {linhas.map((linha, i) => (
            <span key={i} className={marcadas.has(i + 1) ? "ln hl" : "ln"}>
              {renderLinha(linha)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
