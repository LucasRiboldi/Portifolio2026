import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getSkills } from "@/lib/repos/skills"
import { SKILL_CATEGORY_META, type SkillCategory } from "@/data/skills"
import { DevSection, MetaRow } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Skills",
  description: "As skills instaladas no ambiente de desenvolvimento, por área — o que cada uma faz e como invocá-la.",
}

/**
 * O catálogo de skills.
 *
 * Página nova: a tabela era povoada pelo seed e editável no painel, mas
 * nenhum leitor existia no site — o conteúdo nunca teve para onde ir.
 *
 * A lista é longa (dezenas de entradas) e o que se procura nela é sempre um
 * comando. Por isso a forma é tabela densa por área, e não cartão: cartão
 * para sessenta itens vira rolagem infinita, e o comando — que é o dado
 * acionável — fica pequeno no meio da decoração.
 */
export default async function SkillsPage() {
  const skills = await getSkills()

  // Só as categorias que têm skill, na ordem declarada no meta — que agrupa
  // do mais usado no dia a dia para o mais eventual.
  const categorias = (Object.keys(SKILL_CATEGORY_META) as SkillCategory[]).filter((c) =>
    skills.some((s) => s.category === c),
  )

  return (
    <>
      <DevHeader
        fn="listar"
        title="Skills"
        accent="do ambiente"
        subtitle="O que está instalado no ambiente de desenvolvimento e como se invoca. Serve de índice: o problema não é ter a skill, é lembrar que ela existe na hora certa."
      />

      {skills.length === 0 ? (
        <DevEmpty>Nenhuma skill ainda — adicione em /admin/skills.</DevEmpty>
      ) : (
        <>
          <div className="mt-4">
            <MetaRow
              items={[
                { k: "skills", v: skills.length },
                { k: "áreas", v: categorias.length },
              ]}
            />
          </div>

          {categorias.map((cat, i) => {
            const meta = SKILL_CATEGORY_META[cat]
            const daCategoria = skills.filter((s) => s.category === cat)
            return (
              <DevSection
                key={cat}
                id={`skills-${cat}`}
                index={i + 1}
                title={meta.label}
                meta={`${daCategoria.length}`}
              >
                {/* Tabela de verdade: são dados tabulares (comando → o que faz),
                    e o leitor de tela precisa da relação entre coluna e valor. */}
                <div className="dv-table-wrap">
                  <table className="dv-table">
                    <caption className="sr-only">
                      Skills de {meta.label}: comando e descrição
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Comando</th>
                        <th scope="col">O que faz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daCategoria.map((s) => (
                        <tr key={s.name}>
                          <th scope="row">
                            <code style={{ color: meta.color }}>{s.command}</code>
                          </th>
                          <td>{s.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DevSection>
            )
          })}
        </>
      )}
    </>
  )
}
