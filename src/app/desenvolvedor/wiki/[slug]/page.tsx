import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getWiki } from "@/lib/repos/dev"
import { MetaRow } from "@/components/dev/ui/dev-primitives"

/** A folha é fechada: todos os documentos são conhecidos em build. */
export async function generateStaticParams() {
  const docs = await getWiki()
  return docs.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = (await getWiki()).find((d) => d.slug === slug)
  if (!doc) return { title: "Documento não encontrado" }
  return { title: doc.title, description: `${doc.category} — base de conhecimento técnico.` }
}

export default async function WikiDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const docs = await getWiki()
  const doc = docs.find((d) => d.slug === slug)
  if (!doc) notFound()

  // Os vizinhos de categoria: um acervo técnico se lê em vizinhança, não em
  // ordem alfabética — quem abre "Convenções de CSS" costuma querer o
  // checklist de revisão logo em seguida.
  const vizinhos = docs.filter((d) => d.category === doc.category && d.slug !== doc.slug)

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/desenvolvedor/wiki" className="dv-out">
        voltar à wiki
      </Link>

      <header className="mt-4">
        <p className="dv-kicker">
          <span className="tok-fn">doc</span>(<span className="tok-str">&quot;{doc.category}&quot;</span>)
        </p>
        <h1 className="dv-title">{doc.title}</h1>
      </header>

      <div className="mt-3">
        <MetaRow
          items={[
            { k: "categoria", v: doc.category },
            { k: "id", v: doc.slug },
          ]}
        />
      </div>

      {/* `dv-prose` já estiliza h2, código, lista e link do realm. O GFM entra
          pela tabela: metade dos documentos usa uma. */}
      <div className="dv-prose mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.body}</ReactMarkdown>
      </div>

      {vizinhos.length > 0 && (
        <footer className="dv-section">
          <div className="dv-section-head">
            <span className="dv-section-id" aria-hidden>
              §
            </span>
            <h2>Ainda em {doc.category}</h2>
          </div>
          <ul className="dv-section-body dv-stack-tight">
            {vizinhos.map((v) => (
              <li key={v.slug}>
                <Link href={`/desenvolvedor/wiki/${v.slug}`} className="dv-out">
                  {v.title}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  )
}
