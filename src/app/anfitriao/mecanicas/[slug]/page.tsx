import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getMechanics, getMechanicBySlug } from "@/lib/repos/prophet"

export async function generateStaticParams() {
  return (await getMechanics()).map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = await getMechanicBySlug(slug)
  return m ? { title: m.title, description: m.summary } : { title: "Mecânica" }
}

export default async function MechanicDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = await getMechanicBySlug(slug)
  if (!m) notFound()

  return (
    <article>
      <Link href="/anfitriao/mecanicas" className="pr-link">
        ← Caderno das Mecânicas
      </Link>
      <p className="pr-kicker mt-3">Caderno das Mecânicas</p>
      <h1 className="pr-headline">{m.title}</h1>
      <p className="pr-stand">{m.summary}</p>
      <div className="mt-2">
        {m.tags.map((tag) => (
          <span key={tag} className="pr-tag">
            {tag}
          </span>
        ))}
      </div>
      <hr className="pr-rule" />
      <div className="pr-article">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.body || "_Sem conteúdo ainda._"}</ReactMarkdown>
      </div>
    </article>
  )
}
