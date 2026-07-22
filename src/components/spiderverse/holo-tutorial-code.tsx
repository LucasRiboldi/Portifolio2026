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
