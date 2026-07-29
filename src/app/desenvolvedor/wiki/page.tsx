import type { Metadata } from "next"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getWiki } from "@/lib/repos/dev"
import { DevSection, DevPanel, DevPanelHead, DevPanelFoot, DevInternalLink } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Wiki",
  description: "Base de conhecimento técnico: arquitetura, convenções, operação, decisões e troubleshooting.",
}

/**
 * A base de conhecimento.
 *
 * Esta página não existia. Os documentos eram escritos, publicados e ficavam
 * inalcançáveis: `getWiki()` não era chamado em lugar nenhum do site.
 *
 * O agrupamento por categoria é o que faz um acervo técnico ser navegável —
 * uma lista corrida de vinte documentos obriga a ler todos os títulos para
 * achar o que se procura.
 */
export default async function WikiPage() {
  const docs = await getWiki()

  // Categorias na ordem em que aparecem, não em ordem alfabética: quem
  // escreveu o acervo ordenou os documentos por `sort`, e essa ordem carrega
  // a intenção de leitura.
  const categorias = [...new Set(docs.map((d) => d.category))]

  return (
    <>
      <DevHeader
        fn="consultar"
        title="Wiki"
        accent="técnica"
        subtitle="O que eu precisaria reler daqui a seis meses: decisões com a razão junto, armadilhas que já custaram tempo e as convenções que mantêm o sistema previsível."
      />

      {docs.length === 0 ? (
        <DevEmpty>Nenhum documento ainda — adicione em /admin/wiki.</DevEmpty>
      ) : (
        categorias.map((cat, i) => {
          const daCategoria = docs.filter((d) => d.category === cat)
          return (
            <DevSection
              key={cat}
              id={`wiki-${slugificar(cat)}`}
              index={i + 1}
              title={cat}
              meta={`${daCategoria.length} ${daCategoria.length === 1 ? "documento" : "documentos"}`}
            >
              <div className="dv-objects">
                {daCategoria.map((d) => (
                  <DevPanel key={d.id}>
                    <DevPanelHead title={d.title} href={`/desenvolvedor/wiki/${d.slug}`} />
                    <p>{resumir(d.body)}</p>
                    <DevPanelFoot>
                      <DevInternalLink href={`/desenvolvedor/wiki/${d.slug}`}>ler documento</DevInternalLink>
                    </DevPanelFoot>
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

/** Categoria → âncora utilizável em URL. */
function slugificar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Primeira frase útil do documento, para o cartão.
 *
 * O corpo é markdown: título, tabela e bloco de código não servem de resumo.
 * Pega-se a primeira linha de prosa de verdade.
 */
function resumir(body: string): string {
  const linha = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("```") && !l.startsWith("-"))
  if (!linha) return ""
  return linha.length > 160 ? `${linha.slice(0, 157)}…` : linha
}
