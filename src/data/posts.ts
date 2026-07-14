/**
 * Posts do blog — conteúdo file-based tipado (frontmatter + markdown).
 * Para adicionar um artigo, basta acrescentar um objeto aqui.
 */
export interface Post {
  slug: string
  title: string
  excerpt: string
  date: string // ISO
  readingMinutes: number
  tags: string[]
  accent: "magenta" | "cyan" | "lime" | "violet"
  body: string // markdown
}

export const posts: Post[] = [
  {
    slug: "design-system-comic-first",
    title: "Design System comic-first: do token ao delírio",
    excerpt:
      "Como construí o Aranhaverso — um design system que nasce dos tokens e vai até uma ala experimental de anomalias.",
    date: "2026-07-12",
    readingMinutes: 6,
    tags: ["Design System", "Tokens", "Aranhaverso"],
    accent: "magenta",
    body: `Um design system nasce dos **tokens**. Antes de qualquer componente, você
define os valores atômicos — cor, espaço, forma e movimento — em uma fonte única
de verdade.

## 1. Comece pelos tokens

Três camadas: primitivos, semânticos e de componente. Cada nível referencia o
anterior, garantindo consistência e temas trocáveis.

- **Primitivo** — \`--c-primary-500: #ff2d95\`
- **Semântico** — \`--color-primary\`, \`--text-muted\`
- **Componente** — aplicado via Tailwind/CSS

## 2. Componha com composição

Prefira subcomponentes compostos a props booleanas infinitas. Use CVA para
variantes e mantenha a lógica de negócio fora da UI.

> Um bom design system é invisível: ele acelera sem impor.

## 3. Deixe espaço para o delírio

A regra de ouro do Aranhaverso: cada tela funciona como interface **e** página de
quadrinho **e** pôster ilustrado. A ala Lab existe justamente para romper as
próprias regras com propósito.`,
  },
  {
    slug: "imperfeicao-controlada",
    title: "Imperfeição controlada: por que interfaces perfeitas são chatas",
    excerpt:
      "Textura, grão, tinta escorrida e bordas tremidas — como adicionar alma sem sacrificar usabilidade.",
    date: "2026-07-13",
    readingMinutes: 5,
    tags: ["Direção de Arte", "Textura", "UX"],
    accent: "cyan",
    body: `Interfaces excessivamente limpas parecem template. A **imperfeição
controlada** devolve a sensação de algo feito à mão.

## O sistema .art-*

Criei uma camada de utilitários leves — texturas, halftones plurais, contornos
coloridos, sombras desenhadas e pós-processamento discreto. Tudo em CSS/SVG, com
\`prefers-reduced-motion\`.

## Regras que sigo

1. Nenhuma superfície grande 100% lisa.
2. Contorno deixa de ser preto por padrão — vira cor.
3. Movimento mesmo no estático: linhas cinéticas, ghosting.
4. Narrativa **com propósito** (setas, carimbos), nunca decoração gratuita.

O resultado: cada tela ganha personalidade sem perder legibilidade nem
performance.`,
  },
  {
    slug: "tokens-para-figma-e-codigo",
    title: "Um pipeline de tokens que serve Figma e código ao mesmo tempo",
    excerpt:
      "Fonte única em TS, export W3C DTCG e Figma Tokens Studio, e um teste de sincronização no CI.",
    date: "2026-07-14",
    readingMinutes: 4,
    tags: ["Tokens", "Figma", "DX"],
    accent: "lime",
    body: `Tokens só valem se **designers e devs** consomem os mesmos valores.

## A fonte única

Mantenho os valores em \`src/design-system/tokens.ts\` (tipado) espelhando o
runtime em \`tokens.css\`.

## Export

Um script gera dois formatos:

- \`design-tokens.json\` — **W3C DTCG** (\`$value\`/\`$type\`)
- \`design-tokens.figma.json\` — **Tokens Studio** (plugin do Figma)

## Sincronia garantida

\`npm run tokens:check\` valida que \`tokens.ts\` e \`tokens.css\` batem — rodável
no CI. Fim das divergências silenciosas entre design e código.`,
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
