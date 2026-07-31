import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

import { camposDe } from "@/lib/firebase/schema"
import { paraFirestore, doFirestore } from "@/lib/firebase/nested"

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

describe("persistência no Firestore", () => {
  const LEITOR = semComentarios(ler("src/lib/repos/anfitriao-materias.ts"))
  const SYNC = semComentarios(ler("src/lib/admin/sync-content.ts"))
  const SEED = semComentarios(ler("src/lib/admin/seed.ts"))
  const DADOS = ler("src/data/anfitriao-materias.ts")

  /** Os campos da matéria, lidos da interface — a fonte da verdade. */
  const camposDaMateria = (() => {
    const bloco = DADOS.match(/export interface Materia \{([\s\S]*?)\n\}/)![1]!
    return [...bloco.matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]!)
  })()

  it("a interface tem os campos que a página usa", () => {
    expect(camposDaMateria).toContain("bylineRole")
    expect(camposDaMateria).toContain("openLine")
    expect(camposDaMateria.length).toBeGreaterThan(15)
  })

  /**
   * O risco desta migração não é o banco: é a tradução.
   *
   * A tabela fala snake_case, o componente fala camelCase, e um campo
   * esquecido no meio do caminho não gera erro nenhum — a matéria
   * simplesmente perde a assinatura, ou o olho, ou o colofão, e ninguém
   * percebe até ler a página inteira. Os três testes seguintes fecham as três
   * pontas: leitor, escritor e tabela.
   */
  it("o leitor traduz TODOS os campos da matéria", () => {
    const ausentes = camposDaMateria.filter((c) => !new RegExp(`\\b${c}:`).test(LEITOR))
    expect(ausentes, "campos que o leitor esqueceu de mapear").toEqual([])
  })

  it("o sync escreve TODOS os campos da matéria", () => {
    // No sync os nomes são de COLUNA (snake_case); a comparação converte.
    const paraColuna = (c: string) => c.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`)
    const ausentes = camposDaMateria
      .filter((c) => c !== "slug")
      .filter((c) => !new RegExp(`\\b${paraColuna(c)}:`).test(SYNC))
    expect(ausentes.map(paraColuna), "colunas que o sync não preenche").toEqual([])
  })

  it("a coleção declara campo para toda propriedade da matéria", () => {
    const paraColuna = (c: string) => c.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`)
    const declarados = camposDe("prophet_materias")
    const ausentes = camposDaMateria.filter((c) => !declarados.includes(paraColuna(c)))
    expect(ausentes.map(paraColuna), "campos fora de lib/firebase/schema.ts").toEqual([])
  })

  it("a tabela é publicável pelo seed e pelo sync", () => {
    expect(SYNC).toContain('"prophet_materias"')
    expect(SEED).toContain('"prophet_materias"')
  })

  it("a folha não abre vazia quando o banco falha", () => {
    // Mesmo contrato das zonas do criativo: página de jornal sem matéria não
    // é estado vazio legítimo, é folha em branco.
    expect(LEITOR).toContain("materiasSeed")
    expect(LEITOR).toMatch(/!data \|\| data\.length === 0\) return materiasSeed/)
  })

  it("a matriz aninhada sobrevive à ida e volta do Firestore", () => {
    // O CHECK de jsonb_typeof que garantia a forma no Postgres não tem
    // equivalente no Firestore, que é schemaless. O risco mudou de lugar: aqui
    // o perigo não é forma errada, é o banco RECUSAR `boxes[].rows`, que é
    // array dentro de array. `lib/firebase/nested.ts` envelopa na gravação e
    // desenvelopa na leitura — e é essa volta que precisa ser fiel.
    const original = { blocos: [{ tipo: "p" }], boxes: [{ rows: [["a", "b"], ["c"]] }] }
    const ida = paraFirestore(original)
    const gravado = ida.boxes[0]?.rows as unknown[]
    expect(Array.isArray(gravado[0])).toBe(false)
    expect(doFirestore(ida)).toEqual(original)
  })

  it("a rota lê do repositório, não do arquivo de dados", () => {
    expect(ROTA).toContain('from "@/lib/repos/anfitriao-materias"')
    expect(ROTA).not.toMatch(/import \{[^}]*\bmaterias\b[^}]*\} from "@\/data\/anfitriao-materias"/)
  })

  it("publicar revalida todas as tags, não uma lista escrita à mão", () => {
    // A lista manual ficou para trás a cada tabela nova: o conteúdo entrava
    // no banco e a página seguia servindo o cache antigo, sem erro nenhum.
    const ACTIONS = semComentarios(ler("src/app/admin/actions.ts"))
    expect(ACTIONS).toContain("Object.values(CACHE_TAGS)")
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
