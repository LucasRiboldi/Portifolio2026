import { describe, it, expect } from "vitest"

import { materias } from "@/data/anfitriao-materias"
import {
  blocosParaTexto,
  textoParaBlocos,
  jsonParaTexto,
  blocosField,
  boxesField,
  figureField,
  colofaoField,
  remissoesField,
} from "@/lib/admin/materia-format"
import { getResource, resourceTable } from "@/lib/admin/resources"

/**
 * O CONTRATO DO CRUD DE MATÉRIAS.
 *
 * O corpo da matéria é jsonb no banco e texto no formulário, e a tradução
 * acontece nas duas direções toda vez que alguém abre a tela de edição. O
 * perigo aqui não é o erro barulhento — é o silencioso: abrir uma matéria no
 * painel, salvar sem mudar NADA e a matéria voltar diferente. Um intertítulo
 * perdido, um parágrafo colado no anterior, e ninguém percebe até ler a folha.
 *
 * Por isso o teste central é a ida e volta sobre o conteúdo REAL, não sobre
 * exemplos inventados: são as matérias publicadas que passam por essa
 * tradução em produção.
 */

describe("ida e volta do corpo", () => {
  it.each(materias.map((m) => [m.slug, m] as const))(
    "«%s» sobrevive a abrir e salvar sem alteração",
    (_slug, m) => {
      const texto = blocosParaTexto(m.blocos)
      expect(textoParaBlocos(texto)).toEqual(m.blocos)
    },
  )

  it("preserva o número de blocos e de parágrafos", () => {
    for (const m of materias) {
      const volta = textoParaBlocos(blocosParaTexto(m.blocos))
      expect(volta.length, `${m.slug}: blocos`).toBe(m.blocos.length)
      expect(
        volta.map((b) => b.paragraphs.length),
        `${m.slug}: parágrafos por bloco`,
      ).toEqual(m.blocos.map((b) => b.paragraphs.length))
    }
  })

  it("a segunda volta é idêntica à primeira", () => {
    // Se a tradução não fosse estável, cada salvamento mudaria um pouco o
    // texto — o tipo de erro que só aparece depois de meia dúzia de edições.
    for (const m of materias) {
      const um = blocosParaTexto(m.blocos)
      const dois = blocosParaTexto(textoParaBlocos(um))
      expect(dois, m.slug).toBe(um)
    }
  })
})

describe("o formato do corpo", () => {
  it("`## ` abre bloco com intertítulo", () => {
    const blocos = textoParaBlocos("Abertura.\n\n## Título\n\nDepois.")
    expect(blocos).toEqual([
      { paragraphs: ["Abertura."] },
      { subhead: "Título", paragraphs: ["Depois."] },
    ])
  })

  it("aceita quebra de linha do Windows", () => {
    // O painel roda no navegador do usuário; texto colado no Windows chega
    // com \r\n, e sem normalizar o `## ` não seria reconhecido.
    const blocos = textoParaBlocos("Abertura.\r\n\r\n## Título\r\n\r\nDepois.")
    expect(blocos).toHaveLength(2)
    expect(blocos[1]!.subhead).toBe("Título")
  })

  it("descarta intertítulo sem parágrafo — seria cabeça solta no impresso", () => {
    expect(textoParaBlocos("## Só o título")).toEqual([])
  })

  it("texto vazio não vira bloco fantasma", () => {
    expect(textoParaBlocos("")).toEqual([])
    expect(textoParaBlocos("\n\n   \n\n")).toEqual([])
  })

  it("um corpo sem parágrafo nenhum é recusado pela validação", () => {
    const r = blocosField.safeParse("")
    expect(r.success).toBe(false)
  })
})

describe("os campos de estrutura", () => {
  it("aceitam o que o banco devolve e o que o formulário manda", () => {
    const m = materias[0]!
    // Do banco: estrutura pronta. Do formulário: o mesmo, serializado.
    expect(figureField.safeParse(m.figure).success).toBe(true)
    expect(figureField.safeParse(jsonParaTexto(m.figure)).success).toBe(true)
    expect(boxesField.safeParse(jsonParaTexto(m.boxes)).success).toBe(true)
    expect(colofaoField.safeParse(jsonParaTexto(m.colofao)).success).toBe(true)
    expect(remissoesField.safeParse(jsonParaTexto(m.remissoes)).success).toBe(true)
  })

  it("JSON malformado vira erro com o nome do campo, não exceção", () => {
    const r = boxesField.safeParse("{ isto não é json")
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues.map((i) => i.message).join(" ")).toContain("Caixas")
    }
  })

  it("campo vazio cai no valor neutro em vez de falhar", () => {
    expect(boxesField.parse("")).toEqual([])
    expect(figureField.parse("")).toEqual({ caption: "", credit: "" })
    expect(remissoesField.parse("")).toEqual([])
  })

  it("forma errada é recusada", () => {
    // Um objeto onde a folha espera lista quebraria a renderização.
    expect(boxesField.safeParse('{"title":"x"}').success).toBe(false)
    expect(remissoesField.safeParse('[{"slug":"x"}]').success).toBe(false)
  })
})

describe("o recurso no painel", () => {
  const res = getResource("materias")!

  it("está registrado e aponta para a tabela certa", () => {
    expect(res).toBeTruthy()
    expect(resourceTable("materias")).toBe("prophet_materias")
  })

  it("tem campo para todo campo que o formulário salva", () => {
    // Campo de fora do formulário nunca é preenchido: a coluna fica no
    // default do banco e a matéria sai capenga, sem erro nenhum.
    const nomes = res.fields.map((f) => f.name)
    for (const obrigatorio of [
      "slug",
      "headline",
      "standfirst",
      "byline_role",
      "open_line",
      "blocos",
      "figure",
      "boxes",
      "colofao",
      "remissoes",
    ]) {
      expect(nomes, `falta o campo ${obrigatorio}`).toContain(obrigatorio)
    }
  })

  it("o slug é validado como URL", () => {
    // `continua_de: ""` porque é o que o formulário manda: `readForm` percorre
    // TODOS os campos do recurso e nunca omite chave. Omitir aqui testaria um
    // caminho que não existe no painel.
    const base = {
      headline: "X",
      blocos: "Um parágrafo.",
      continua_de: "",
      published: "on",
      sort: "0",
    }
    expect(res.schema.safeParse({ ...base, slug: "com espaço" }).success).toBe(false)
    expect(res.schema.safeParse({ ...base, slug: "Com-Maiuscula" }).success).toBe(false)
    expect(res.schema.safeParse({ ...base, slug: "valido-2026" }).success).toBe(true)
  })

  it("a capitular é uma letra só e a página é romana", () => {
    const base = {
      slug: "x",
      headline: "X",
      blocos: "Um parágrafo.",
      continua_de: "",
      published: "on",
      sort: "0",
    }
    expect(res.schema.safeParse({ ...base, dropcap: "AB" }).success).toBe(false)
    expect(res.schema.safeParse({ ...base, page: "12" }).success).toBe(false)
    expect(res.schema.safeParse({ ...base, page: "IV" }).success).toBe(true)
  })

  it("uma matéria real passa inteira pela validação do painel", () => {
    // O caminho que o usuário percorre: matéria do banco → formulário →
    // validação → banco. Se algum campo se perdesse na serialização, é aqui
    // que apareceria.
    const m = materias[0]!
    const doFormulario = {
      slug: m.slug,
      caderno: m.caderno,
      page: m.page,
      kicker: m.kicker,
      headline: m.headline,
      subhead: m.subhead,
      standfirst: m.standfirst,
      byline: m.byline,
      byline_role: m.bylineRole,
      dateline: m.dateline,
      continua_de: m.continuaDe ?? "",
      dropcap: m.dropcap,
      open_line: m.openLine,
      blocos: blocosParaTexto(m.blocos),
      pullquote: m.pullquote,
      figure: jsonParaTexto(m.figure),
      boxes: jsonParaTexto(m.boxes),
      sign: m.sign,
      colofao: jsonParaTexto(m.colofao),
      remissoes: jsonParaTexto(m.remissoes),
      published: "on",
      sort: "0",
    }

    const r = res.schema.safeParse(doFormulario)
    expect(r.success ? null : r.error.issues).toBeNull()
    if (r.success) {
      const salvo = r.data as Record<string, unknown>
      expect(salvo.blocos).toEqual(m.blocos)
      expect(salvo.boxes).toEqual(m.boxes)
      expect(salvo.remissoes).toEqual(m.remissoes)
      expect(salvo.byline_role).toBe(m.bylineRole)
    }
  })
})
