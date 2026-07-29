import "@/styles/anfitriao-caderno.css"

import type { Metadata } from "next"

import { getPrototypes } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"
import { Caderno, CadernoVazio } from "@/components/anfitriao/caderno"

export const metadata: Metadata = {
  title: "Laboratório",
  description: "Os protótipos na bancada desta casa, do conceito ao publicado.",
}

/**
 * O Laboratório.
 *
 * Reescrito. A página usava classes `pr-*` de `prophet.css` — folha que a rota
 * `/anfitriao` NÃO carrega, e cujas variáveis vivem sob o escopo `.prophet`,
 * que esta rota também não tem. As duas coisas juntas faziam a página abrir
 * sem estilo nenhum: cartões sem moldura, títulos sem face, tudo em cima do
 * papel do jornal.
 *
 * Agora fala o vocabulário `dpx-*` da folha atual, como os outros cadernos.
 */

const ESTADO: Record<string, string> = {
  conceito: "Conceito",
  prototipo: "Protótipo",
  playtest: "Em playtest",
  publicado: "Publicado",
}

export default async function LabPage() {
  const [prototipos, c] = await Promise.all([
    getPrototypes(),
    getPageContent("prophet.laboratorio"),
  ])

  return (
    <Caderno
      caderno="Laboratório"
      page="IV"
      kicker={c.kicker}
      titulo={c.title}
      olho={c.subtitle}
    >
      {prototipos.length === 0 ? (
        <CadernoVazio>Nenhum protótipo na bancada nesta edição.</CadernoVazio>
      ) : (
        <div className="dpx-verbetes">
          {prototipos.map((p) => (
            <article key={p.id} className="dpx-verbete">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <dl className="dpx-verbete-dados">
                <div>
                  <dt>Estado</dt>
                  <dd>
                    <span className="dpx-selo" data-estado={p.status}>
                      {ESTADO[p.status] ?? p.status}
                    </span>
                  </dd>
                </div>
                {p.players && (
                  <div>
                    <dt>Jogadores</dt>
                    <dd>{p.players}</dd>
                  </div>
                )}
                {p.playtime && (
                  <div>
                    <dt>Duração</dt>
                    <dd>{p.playtime}</dd>
                  </div>
                )}
              </dl>
              {p.tags.length > 0 && (
                <ul className="dpx-etiquetas" aria-label="Assuntos">
                  {p.tags.map((tag) => (
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
