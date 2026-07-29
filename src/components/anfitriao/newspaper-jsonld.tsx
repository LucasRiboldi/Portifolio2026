/**
 * Dados estruturados da folha (JSON-LD).
 *
 * A página tem, no HTML, tudo que descreve um periódico — nome, subtítulo,
 * volume, número, editoria, matéria de capa com autor — e nada disso chegava
 * aos buscadores como estrutura: era texto solto. Isto declara o que a folha
 * já é.
 *
 * ------------------------------------------------------------------
 * O QUE ESTE ARQUIVO NÃO DECLARA, E POR QUÊ
 * ------------------------------------------------------------------
 * Não há `datePublished`. A linha de data do jornal é composta com a data de
 * HOJE — é parte da ficção, e funciona na tela. Num dado estruturado seria
 * outra coisa: afirmar a um buscador que a matéria foi publicada hoje, todo
 * dia, sobre um texto que não muda. Dado estruturado é declaração, não
 * cenário; o que não é verdade fora da ficção fica de fora.
 *
 * Pelo mesmo motivo não se declaram as notícias do telégrafo como artigos
 * desta folha: elas são resumos com crédito à fonte, e reivindicá-las como
 * publicação própria seria atribuir-se conteúdo alheio.
 *
 * Um componente de servidor: o objeto é montado no build, a partir das mesmas
 * constantes que compõem a página. Fonte única — se a manchete mudar, o dado
 * estruturado muda com ela.
 */
import { paper, lead, signature } from "@/lib/anfitriao-prophet"

export function NewspaperJsonLd({ url }: { url: string }) {
  const editor = {
    "@type": "Person",
    name: signature.name,
    jobTitle: signature.role,
  }

  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Periodical",
        "@id": `${url}#periodico`,
        name: paper.masthead,
        alternateName: paper.mastheadSub,
        description: paper.mottoPt,
        inLanguage: "pt-BR",
        publisher: { "@type": "Organization", name: paper.masthead },
        editor,
      },
      {
        "@type": "PublicationIssue",
        "@id": `${url}#edicao`,
        issueNumber: paper.issue,
        isPartOf: { "@id": `${url}#periodico` },
      },
      {
        "@type": "NewsArticle",
        "@id": `${url}#materia-de-capa`,
        headline: `${lead.headline} — ${lead.kicker}`,
        description: lead.standfirst,
        articleSection: "Oficina",
        inLanguage: "pt-BR",
        author: editor,
        isPartOf: { "@id": `${url}#edicao` },
        mainEntityOfPage: url,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // O conteúdo é montado aqui, a partir de constantes do próprio
      // repositório — não há entrada de usuário nesta árvore. Ainda assim o
      // `<` é escapado: é o caractere que fecharia a tag e o único vetor de
      // injeção num bloco JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  )
}
