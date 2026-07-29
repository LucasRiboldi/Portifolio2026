import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

import { materias, getMateria } from "@/data/anfitriao-materias"

/**
 * O CONTRATO DAS PÁGINAS INTERNAS.
 *
 * A folha tinha uma página só. A matéria de capa abria, dava três parágrafos e
 * terminava — e um "continua na pág. II" teria sido mentira tipográfica,
 * porque a página II não existia. Estas páginas são a continuação de verdade.
 *
 * O que se trava aqui são as ligações e as convenções que já quebraram neste
 * projeto: remissão apontando para matéria inexistente (link morto que nada
 * acusa), e a regra de níveis de heading do realm — a `h1` do documento é o
 * nome do jornal, declarada uma única vez no layout, e o conteúdo começa em
 * `h2`. A primeira versão desta rota trazia a própria `h1` e a página passou a
 * ter duas.
 */

const RAIZ = path.join(import.meta.dirname, "..")
const ler = (p: string) => readFileSync(path.join(RAIZ, p), "utf8")

const semComentarios = (s: string) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/^\s*\/\/.*$/gm, "")

const ROTA = semComentarios(ler("src/app/anfitriao/materia/[slug]/page.tsx"))
const CAPA = semComentarios(ler("src/app/anfitriao/page.tsx"))
const CSS_MATERIA = ler("src/styles/anfitriao-materia.css")
const CSS_FOLHA = ler("src/styles/anfitriao-newspaper.css")

describe("as matérias existem e se ligam", () => {
  it("há mais de uma página interna", () => {
    expect(materias.length).toBeGreaterThan(1)
  })

  it("nenhum slug se repete", () => {
    const slugs = materias.map((m) => m.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it("toda remissão aponta para uma matéria que existe", () => {
    const mortas = materias.flatMap((m) =>
      m.remissoes.filter((r) => !getMateria(r.slug)).map((r) => `${m.slug} → ${r.slug}`),
    )
    expect(mortas).toEqual([])
  })

  it("nenhuma matéria remete a si mesma", () => {
    const narcisas = materias.filter((m) => m.remissoes.some((r) => r.slug === m.slug))
    expect(narcisas.map((m) => m.slug)).toEqual([])
  })

  it("a capa leva à continuação, e a continuação existe", () => {
    const chamada = CAPA.match(/\/anfitriao\/materia\/([a-z-]+)/)
    expect(chamada, "a primeira página não chama nenhuma página interna").not.toBeNull()
    expect(getMateria(chamada![1]!)).toBeDefined()
  })
})

describe("anatomia do impresso", () => {
  it.each(materias.map((m) => [m.slug, m] as const))(
    "«%s» tem as peças que uma página interna precisa ter",
    (_slug, m) => {
      expect(m.headline.length, "manchete").toBeGreaterThan(8)
      expect(m.standfirst.length, "olho").toBeGreaterThan(40)
      expect(m.dropcap, "capitular é uma letra só").toHaveLength(1)
      expect(m.blocos.length, "blocos de corpo").toBeGreaterThan(1)
      expect(m.pullquote.length, "olho de citação").toBeGreaterThan(20)
      expect(m.figure.caption, "legenda da gravura").toContain("Fig.")
      expect(m.boxes.length, "caixas de apoio").toBeGreaterThan(0)
    },
  )

  it("a capitular casa com a primeira letra da abertura", () => {
    // A capitular é impressa fora do fluxo e a abertura começa na SEGUNDA
    // letra da palavra ("H" + "á um estado..."). Se as duas divergirem, a
    // palavra sai partida no impresso.
    const erradas = materias.filter((m) => {
      const palavra = m.dropcap + m.openLine
      return !/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-zà-ú]/.test(palavra)
    })
    expect(erradas.map((m) => m.slug)).toEqual([])
  })

  it("cada matéria declara caderno e página", () => {
    const semFolio = materias.filter((m) => !m.caderno || !/^[IVX]+$/.test(m.page))
    expect(semFolio.map((m) => m.slug)).toEqual([])
  })
})

describe("convenções do realm", () => {
  it("a rota não declara `h1` — a do documento é o nome do jornal", () => {
    expect(ROTA).not.toMatch(/<h1[\s>]/)
    expect(ROTA).toMatch(/<h2>\{m\.headline\}<\/h2>/)
  })

  it("os intertítulos são `h3`, subordinados à manchete", () => {
    expect(ROTA).toMatch(/<h3>\{bloco\.subhead\}<\/h3>/)
  })

  it("a capitular não parte a palavra para o leitor de tela", () => {
    // A letra é `aria-hidden` no visual e volta em `sr-only` no texto.
    expect(ROTA).toContain("aria-hidden")
    expect(ROTA).toContain("sr-only")
  })

  it("a matéria atravessa a grelha de seis colunas do original", () => {
    // Sem isto a página cai numa célula: em 320px a mancha ficava com 160px.
    expect(CSS_MATERIA).toMatch(/\.dpx-mat\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/)
    expect(ROTA).toContain('className="dpx-mat wrapper"')
  })

  it("os links da matéria vencem o `.newspaper a` do original", () => {
    // `.newspaper a` tem especificidade 0,1,1 e apagava o sublinhado de
    // qualquer classe solta. As regras de link precisam do mesmo escopo.
    for (const regra of [".dpx-mat-remissoes a", ".dpx-mat-volta"]) {
      expect(CSS_MATERIA, regra).toContain(`.newspaper ${regra}`)
    }
    expect(CSS_FOLHA).toContain(".newspaper .dpx-mat-continua")
  })

  it("a chamada da capa mora na folha que a capa carrega", () => {
    // `anfitriao-materia.css` só é pedida dentro de /anfitriao/materia; a
    // chamada declarada lá apareceria sem estilo na primeira página.
    expect(CSS_FOLHA).toContain(".dpx-mat-continua")
    expect(CSS_MATERIA).not.toMatch(/^\.newspaper \.dpx-mat-continua/m)
  })
})

/**
 * FORA DE COBERTURA (verificação manual, precisa de navegador):
 * - medida por coluna entre 34 e 46 caracteres nos vários tamanhos;
 * - intertítulo órfão no pé da coluna (`break-after`) em conteúdo real;
 * - a mancha não transbordar em 320px.
 * Os três foram medidos no navegador em 29/07/2026: 36 caracteres em 320px,
 * 39 por coluna em 1440px, três colunas, sem transbordo.
 */
