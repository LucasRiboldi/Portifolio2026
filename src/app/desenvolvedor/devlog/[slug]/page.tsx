import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getDevlogs, getDevlogBySlug } from "@/lib/repos/dev"
import { DevInternalLink, TagList } from "@/components/dev/ui/dev-primitives"

/**
 * Uma entrada do devlog.
 *
 * Mesmo desenho de `projetos/[slug]`: params estáticos gerados na build,
 * metadados por entrada e o markdown renderizado dentro de `.dv-prose`, que é
 * a única tipografia de texto longo do realm.
 *
 * O que esta página tem a mais é a navegação anterior/próxima. Num acervo
 * histórico ela não é conveniência: a entrada seguinte costuma ser a
 * consequência da anterior, e voltar à lista a cada leitura quebra justamente
 * a sequência que dá sentido ao registro.
 */
export async function generateStaticParams() {
  const devlogs = await getDevlogs()
  return devlogs.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const d = await getDevlogBySlug(slug)
  return d ? { title: d.title, description: d.summary } : { title: "Devlog" }
}

export default async function DevlogEntrada({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const devlogs = await getDevlogs()
  const i = devlogs.findIndex((d) => d.slug === slug)
  const entrada = devlogs[i]
  if (!entrada) notFound()

  /* A lista vem do mais recente para o mais antigo: o índice ANTERIOR é a
     entrada mais nova, e o seguinte é a mais velha. Os rótulos seguem o tempo,
     não a posição no array — "próxima" numa linha do tempo é a que veio
     depois. */
  const maisNova = devlogs[i - 1]
  const maisVelha = devlogs[i + 1]

  return (
    <>
      <section className="dv-hero" aria-labelledby="entrada-titulo">
        <p className="term">
          <span className="tok-fn">commit</span>{" "}
          <span className="tok-str">&quot;{entrada.slug}&quot;</span>
        </p>
        <h1 id="entrada-titulo">{entrada.title}</h1>
        <p>{entrada.summary}</p>
        <p className="dv-entrada-data">
          <time dateTime={entrada.date}>{entrada.date}</time>
        </p>
      </section>

      <article className="dv-section">
        <TagList items={entrada.tags ?? []} label="Assuntos desta entrada" />
        <div className="dv-prose dv-entrada-corpo">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entrada.body}</ReactMarkdown>
        </div>
      </article>

      {/* `<nav>` com rótulo: são três links de navegação entre irmãos, e sem
          landmark eles ficam indistinguíveis do corpo do texto. */}
      <nav className="dv-entrada-nav" aria-label="Outras entradas do devlog">
        <div>
          {maisVelha && (
            <DevInternalLink href={`/desenvolvedor/devlog/${maisVelha.slug}`}>
              anterior: {maisVelha.title}
            </DevInternalLink>
          )}
        </div>
        <DevInternalLink href="/desenvolvedor/devlog">todas as entradas</DevInternalLink>
        <div>
          {maisNova && (
            <DevInternalLink href={`/desenvolvedor/devlog/${maisNova.slug}`}>
              próxima: {maisNova.title}
            </DevInternalLink>
          )}
        </div>
      </nav>
    </>
  )
}
