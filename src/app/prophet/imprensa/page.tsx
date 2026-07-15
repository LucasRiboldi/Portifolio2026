import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getResources } from "@/lib/repos/prophet"

export const metadata = { title: "Imprensa do Inventor" }

const TYPE: Record<string, string> = {
  pnp: "Print & Play",
  cartas: "Cartas",
  tabuleiro: "Tabuleiro",
  regras: "Regras",
  outro: "Material",
}

export default async function ImprensaPage() {
  const resources = await getResources()

  return (
    <div>
      <ProphetHeader
        kicker="Imprensa do Inventor"
        headline="Para imprimir e jogar"
        standfirst="Materiais faça-você-mesmo, print & play, cartas, tabuleiros e recursos para download."
      />
      {resources.length === 0 ? (
        <ProphetEmpty>A prensa ainda não rodou nenhum material.</ProphetEmpty>
      ) : (
        <div className="pr-grid">
          {resources.map((r) => (
            <article key={r.id} className="pr-card">
              <span className="pr-badge">{TYPE[r.type] ?? r.type}</span>
              <h3 className="mt-2">{r.title}</h3>
              <p>{r.description}</p>
              {r.file_url && (
                <a href={r.file_url} target="_blank" rel="noreferrer" className="pr-link mt-2 inline-block">
                  ↓ baixar material
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
