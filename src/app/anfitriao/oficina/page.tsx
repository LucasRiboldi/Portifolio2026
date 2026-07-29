import "@/styles/anfitriao-caderno.css"

import type { Metadata } from "next"

import { getTutorials } from "@/lib/repos/prophet"
import { Caderno, CadernoVazio } from "@/components/anfitriao/caderno"

export const metadata: Metadata = {
  title: "Oficina",
  description: "Tutoriais de bancada: prototipagem, corte, impressão e acabamento das peças de mesa.",
}

/**
 * A Oficina.
 *
 * Caderno novo: `getTutorials()` não era chamado em lugar nenhum do site. Os
 * tutoriais existiam no banco e no painel, sem página que os mostrasse.
 */

const DIFICULDADE: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

export default async function OficinaPage() {
  const tutoriais = await getTutorials()

  return (
    <Caderno
      caderno="Oficina"
      page="V"
      kicker="Caderno de Bancada"
      titulo="A OFICINA"
      olho="Do corte à cola: o que esta casa aprendeu fazendo, com o passo escrito para quem quiser repetir em casa."
    >
      {tutoriais.length === 0 ? (
        <CadernoVazio>
          A bancada está limpa nesta edição. Os tutoriais em preparo saem no próximo número.
        </CadernoVazio>
      ) : (
        <div className="dpx-verbetes">
          {tutoriais.map((t) => (
            <article key={t.id} className="dpx-verbete">
              <h3>{t.title}</h3>
              <p>{t.summary}</p>
              <dl className="dpx-verbete-dados">
                {t.difficulty && (
                  <div>
                    <dt>Grau</dt>
                    <dd>{DIFICULDADE[t.difficulty] ?? t.difficulty}</dd>
                  </div>
                )}
              </dl>
              {t.tags.length > 0 && (
                <ul className="dpx-etiquetas" aria-label="Assuntos">
                  {t.tags.map((tag) => (
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
