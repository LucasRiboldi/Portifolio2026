import "@/styles/anfitriao-caderno.css"

import type { Metadata } from "next"

import { getMechanics } from "@/lib/repos/prophet"
import { Caderno, CadernoVazio } from "@/components/anfitriao/caderno"

export const metadata: Metadata = {
  title: "Mecânicas",
  description: "Índice das mecânicas de jogo: o que cada uma faz na mesa e onde ela costuma aparecer.",
}

/**
 * O índice de mecânicas.
 *
 * Caderno novo: `getMechanics()` não era chamado em lugar nenhum. É o
 * companheiro do verbete técnico que já sai na primeira página — ali o termo
 * cabe em uma linha, aqui ele tem espaço para o que faz na mesa.
 */
export default async function MecanicasPage() {
  const mecanicas = await getMechanics()

  return (
    <Caderno
      caderno="Índice Técnico"
      page="VI"
      kicker="Verbetes desta Casa"
      titulo="AS MECÂNICAS"
      olho="O vocabulário do ofício, verbete a verbete: o que a mecânica faz com quem está sentado à mesa, e não apenas como ela funciona no papel."
    >
      {mecanicas.length === 0 ? (
        <CadernoVazio>
          O índice desta edição saiu incompleto. Os verbetes em revisão voltam no próximo número.
        </CadernoVazio>
      ) : (
        <div className="dpx-verbetes">
          {mecanicas.map((m) => (
            <article key={m.id} className="dpx-verbete">
              <h3>{m.title}</h3>
              <p>{m.summary}</p>
              {m.tags.length > 0 && (
                <ul className="dpx-etiquetas" aria-label="Assuntos">
                  {m.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </Caderno>
  )
}
