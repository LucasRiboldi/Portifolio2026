import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { javaCheatSheets } from "@/data/dev"
import { DevInternalLink, DevSection } from "@/components/dev/ui/dev-primitives"

/**
 * Uma folha de consulta de Java.
 *
 * `generateStaticParams` porque o acervo é fixo em tempo de build — vem de
 * arquivo versionado, não do banco. Cada folha vira HTML estático e a rota
 * dinâmica não custa nada em runtime.
 */
export function generateStaticParams() {
  return javaCheatSheets.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const folha = javaCheatSheets.find((f) => f.slug === slug)
  if (!folha) return { title: "Folha não encontrada" }
  return { title: `${folha.titulo} · Java`, description: folha.resumo }
}

export default async function FolhaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const folha = javaCheatSheets.find((f) => f.slug === slug)
  if (!folha) notFound()

  return (
    <>
      <section className="dv-hero" aria-labelledby="folha-titulo">
        <p className="term">
          <span className="tok-fn">cheat</span>/<span className="tok-str">{folha.slug}</span>
        </p>
        <h1 id="folha-titulo">{folha.titulo}</h1>
        <p>{folha.resumo}</p>
      </section>

      <DevSection id="itens" index={1} title="Consulta" meta={`${folha.itens.length} itens`}>
        <div className="dv-cheat">
          {folha.itens.map((i) => (
            <article key={i.o_que} className="dv-cheat-item">
              <h3 className="dv-cheat-oque">{i.o_que}</h3>
              <pre className="dv-code">
                <code>{i.codigo}</code>
              </pre>
              {/* A nota é onde mora a armadilha — o que a assinatura não conta.
                  É o que separa esta folha de uma busca no Google. */}
              {i.nota && <p className="dv-cheat-nota">{i.nota}</p>}
            </article>
          ))}
        </div>
      </DevSection>

      <footer className="dv-section">
        <DevInternalLink href="/desenvolvedor/java">voltar para a trilha de Java</DevInternalLink>
      </footer>
    </>
  )
}
