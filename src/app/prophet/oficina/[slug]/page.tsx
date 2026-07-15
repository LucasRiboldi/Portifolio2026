import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { getTutorials, getTutorialBySlug } from "@/lib/repos/prophet"

const DIFF: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

export async function generateStaticParams() {
  return (await getTutorials()).map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getTutorialBySlug(slug)
  return t ? { title: t.title, description: t.summary } : { title: "Tutorial" }
}

export default async function TutorialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getTutorialBySlug(slug)
  if (!t) notFound()

  return (
    <article>
      <Link href="/prophet/oficina" className="pr-link">
        ← Oficina do Inventor
      </Link>
      <p className="pr-kicker mt-3">Oficina · {DIFF[t.difficulty] ?? t.difficulty}</p>
      <h1 className="pr-headline">{t.title}</h1>
      <p className="pr-stand">{t.summary}</p>
      <div className="mt-2">
        {t.tags.map((tag) => (
          <span key={tag} className="pr-tag">
            {tag}
          </span>
        ))}
      </div>
      <hr className="pr-rule" />
      <div className="pr-article">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.body || "_Sem conteúdo ainda._"}</ReactMarkdown>
      </div>
    </article>
  )
}
