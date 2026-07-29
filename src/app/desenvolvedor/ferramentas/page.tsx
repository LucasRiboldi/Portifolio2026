import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getTools } from "@/lib/repos/tools"
import { getPageContent } from "@/lib/repos/page-content"
import { DevToolbox } from "@/components/dev/dev-toolbox"
import { DevSection, DevPanel, DevPanelFoot, DevExternalLink, TagList } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Ferramentas",
  description: "Utilitários que rodam no navegador e ferramentas publicadas, com demo e repositório.",
}

export default async function DevToolsPage() {
  const [tools, c] = await Promise.all([getTools(), getPageContent("dev.ferramentas")])

  return (
    <>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />

      <DevSection
        id="bancada"
        index={1}
        title="Bancada"
        meta="executa no navegador"
        note="Ferramentas que processam localmente — nada do que você digitar sai desta página."
      >
        <DevToolbox />
      </DevSection>

      <DevSection
        id="publicadas"
        index={2}
        title="Utilitários publicados"
        meta={`${tools.length} ${tools.length === 1 ? "item" : "itens"}`}
      >
        {tools.length === 0 ? (
          <DevEmpty>Nenhuma ferramenta ainda — adicione em /admin/tools.</DevEmpty>
        ) : (
          <div className="dv-objects">
            {tools.map((t) => (
              <DevPanel key={t.id}>
                <div className="dv-panel-head">
                  <h3>
                    <span aria-hidden>{t.emoji}</span> {t.name}
                  </h3>
                </div>
                <p>{t.description}</p>
                <TagList items={t.stack} />
                {(t.demoUrl || t.githubUrl) && (
                  <DevPanelFoot>
                    {t.demoUrl && <DevExternalLink href={t.demoUrl}>demo</DevExternalLink>}
                    {t.githubUrl && <DevExternalLink href={t.githubUrl}>repositório</DevExternalLink>}
                  </DevPanelFoot>
                )}
              </DevPanel>
            ))}
          </div>
        )}
      </DevSection>
    </>
  )
}
