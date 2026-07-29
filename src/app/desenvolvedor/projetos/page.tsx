import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getProjects } from "@/lib/repos/projects"
import { getPageContent } from "@/lib/repos/page-content"
import {
  DevPanel,
  DevPanelHead,
  DevPanelFoot,
  DevExternalLink,
  DevInternalLink,
  TagList,
} from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Projetos",
  description: "Aplicações e produtos construídos, com stack, README e repositório.",
}

const CATEGORY: Record<string, string> = {
  code: "Código",
  design: "Design",
  art: "Arte",
  image: "Imagem",
}

export default async function DevProjectsPage() {
  const [projects, c] = await Promise.all([getProjects(), getPageContent("dev.projetos")])

  return (
    <>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {projects.length === 0 ? (
        <DevEmpty>Nenhum projeto ainda — adicione em /admin/projects.</DevEmpty>
      ) : (
        <div className="dv-objects mt-7">
          {projects.map((p) => (
            <DevPanel key={p.id} className="flex flex-col">
              {p.coverImage ? (
                /* Dimensões e `aspect-ratio` vêm da classe `.dv-cover`: a capa
                   entrava sem reserva de espaço e empurrava o card inteiro ao
                   carregar (CLS). `loading`/`decoding` tiram a imagem do
                   caminho crítico — a grade pode ter dezenas de capas. */
                // eslint-disable-next-line @next/next/no-img-element -- capa vem de URL externa arbitrária do admin, fora dos domínios liberados no next/image
                <img
                  src={p.coverImage}
                  alt=""
                  className="dv-cover mb-3"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="dv-cover dv-cover-empty mb-3" aria-hidden>
                  {"</>"} {p.title}
                </div>
              )}
              <DevPanelHead
                title={p.title}
                href={p.slug ? `/desenvolvedor/projetos/${p.slug}` : undefined}
                badge={<span className="dv-tag">{CATEGORY[p.category] ?? p.category}</span>}
              />
              <p className="flex-1">{p.description}</p>
              <TagList items={p.tags} />
              {(p.slug || p.href) && (
                <DevPanelFoot>
                  {p.slug && <DevInternalLink href={`/desenvolvedor/projetos/${p.slug}`}>ver README</DevInternalLink>}
                  {p.href && <DevExternalLink href={p.href}>repositório</DevExternalLink>}
                </DevPanelFoot>
              )}
            </DevPanel>
          ))}
        </div>
      )}
    </>
  )
}
