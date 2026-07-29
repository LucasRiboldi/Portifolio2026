import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getPosts } from "@/lib/repos/posts"
import { formatarData } from "@/lib/format-date"
import { DevPanel, DevPanelHead, DevPanelFoot, DevInternalLink, TagList } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre construção de interface, design systems, performance e as decisões por trás deste site.",
}

/**
 * O blog.
 *
 * Os artigos existiam há tempo em `src/data/posts.ts`, o seed os levava ao
 * banco e o painel tinha a tela "Blog" — mas nenhuma rota os lia. Escrever e
 * publicar não levava a lugar nenhum.
 *
 * Mora no realm dev porque o conteúdo é ofício técnico e este realm é o
 * arquivo de conhecimento do site; herda o cabeçalho e o dock sem página
 * nova de navegação.
 */
export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <DevHeader
        fn="escrever"
        title="Blog"
        accent="e ensaios"
        subtitle="Texto longo sobre o que foi construído e por quê — as decisões que não cabem num commit."
      />

      {posts.length === 0 ? (
        <DevEmpty>Nenhum artigo ainda — adicione em /admin/posts.</DevEmpty>
      ) : (
        <div className="dv-objects mt-7">
          {posts.map((p) => (
            <DevPanel key={p.slug} className="flex flex-col">
              <DevPanelHead
                title={p.title}
                href={`/desenvolvedor/blog/${p.slug}`}
                badge={<span className="dv-tag">{p.readingMinutes} min</span>}
              />
              <p className="flex-1">{p.excerpt}</p>
              <TagList items={p.tags} label="Assuntos" />
              <DevPanelFoot>
                {/* `dateTime` com a data ISO crua: o texto é para o leitor, o
                    atributo é para máquina e leitor de tela. */}
                <time dateTime={p.date} className="dv-count">
                  {formatarData(p.date)}
                </time>
                <DevInternalLink href={`/desenvolvedor/blog/${p.slug}`}>ler artigo</DevInternalLink>
              </DevPanelFoot>
            </DevPanel>
          ))}
        </div>
      )}
    </>
  )
}

