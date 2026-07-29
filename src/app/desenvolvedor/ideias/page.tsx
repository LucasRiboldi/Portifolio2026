import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getIdeas } from "@/lib/repos/dev"
import { DevSection, DevPanel, DevPanelHead, TagList } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Ideias",
  description: "O backlog honesto: o que está em construção, o que espera e o que foi decidido não fazer.",
}

/**
 * O backlog.
 *
 * Página nova: `getIdeas()` não era chamado em lugar nenhum do site, então as
 * ideias existiam apenas no banco e no painel.
 *
 * Agrupar por estado é o que dá sentido à lista — um backlog em ordem de
 * cadastro não responde à única pergunta que se faz a ele: o que está em pé
 * agora?
 */

const ESTADOS = [
  { id: "building", label: "Em construção", nota: "Trabalho em andamento agora." },
  { id: "mvp", label: "Em prova", nota: "Existe o suficiente para julgar se vale seguir." },
  { id: "idea", label: "Na fila", nota: "Registrado, ainda não começado." },
  { id: "paused", label: "Pausado", nota: "Parou por decisão, não por esquecimento — a razão está em cada uma." },
  { id: "done", label: "Entregue", nota: "Saiu do papel e está no ar." },
] as const

export default async function IdeasPage() {
  const ideias = await getIdeas()

  return (
    <>
      <DevHeader
        fn="listar"
        title="Ideias"
        accent="e backlog"
        subtitle="Inclui o que provavelmente não vai sair do papel. Um backlog que só guarda o que virou código não é backlog, é currículo — e esconde a informação útil: o que foi considerado, e por que parou."
      />

      {ideias.length === 0 ? (
        <DevEmpty>Nenhuma ideia ainda — adicione em /admin/ideas.</DevEmpty>
      ) : (
        ESTADOS.filter((e) => ideias.some((i) => i.status === e.id)).map((estado, n) => {
          const doEstado = ideias.filter((i) => i.status === estado.id)
          return (
            <DevSection
              key={estado.id}
              id={`ideias-${estado.id}`}
              index={n + 1}
              title={estado.label}
              meta={`${doEstado.length}`}
              note={estado.nota}
            >
              <div className="dv-objects">
                {doEstado.map((i) => (
                  <DevPanel key={i.id}>
                    <DevPanelHead
                      title={i.title}
                      badge={<span className={`dv-status ${i.status}`}>{estado.label}</span>}
                    />
                    <p>{i.description}</p>
                    <TagList items={i.tags} label="Assuntos" />
                  </DevPanel>
                ))}
              </div>
            </DevSection>
          )
        })
      )}
    </>
  )
}
