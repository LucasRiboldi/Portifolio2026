import { describe, it, expect } from "vitest"

import { BASE_ESTUDOS, DISCIPLINAS, buscarDisciplina } from "@/data/estudos"
import { buscar, montarIndice, normalizar } from "@/lib/estudos/busca"
import { calcular, PROGRESSO_VAZIO } from "@/lib/estudos/progresso"

/**
 * INTEGRIDADE DO MÓDULO DE ESTUDOS.
 *
 * O conteúdo é escrito à mão em arquivo de configuração, e é aí que moram os
 * erros que ninguém vê: dois exercícios com o mesmo id (o progresso de um
 * apagaria o do outro), uma aula fora de ordem, um slug repetido. Nada disso
 * quebra o build — e todos quebram o uso.
 */

describe("registro das disciplinas", () => {
  it("as cinco disciplinas do 3º semestre estão registradas", () => {
    expect(DISCIPLINAS).toHaveLength(5)
    expect(DISCIPLINAS.map((d) => d.slug).sort()).toEqual([
      "banco-de-dados",
      "engenharia-de-software-i",
      "estrutura-de-dados",
      "poo-i",
      "sistemas-operacionais",
    ])
  })

  it("nenhum slug se repete e todos servem como segmento de URL", () => {
    const slugs = DISCIPLINAS.map((d) => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s, s).toMatch(/^[a-z0-9-]+$/)
  })

  it("buscarDisciplina encontra pelo slug e devolve undefined no resto", () => {
    expect(buscarDisciplina("banco-de-dados")?.nome).toBe("Banco de Dados")
    expect(buscarDisciplina("inexistente")).toBeUndefined()
  })

  it("a base das rotas é a que o dock e a página usam", () => {
    expect(BASE_ESTUDOS).toBe("/desenvolvedor/estudos")
  })
})

describe("ficha oficial", () => {
  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» tem a identificação completa do plano de ensino",
    (_slug, d) => {
      expect(d.nome.length).toBeGreaterThan(3)
      expect(d.periodo).toBe(3)
      expect(d.cargaHorariaAula).toBe(80)
      expect(d.cargaHorariaRelogio).toBe(66)
      expect(d.preRequisito).not.toBe("")
      expect(d.ementa.length).toBeGreaterThan(50)
      expect(d.objetivoGeral.length).toBeGreaterThan(50)
    },
  )

  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» tem conteúdo programático e as duas bibliografias",
    (_slug, d) => {
      expect(d.conteudoPrograma.length).toBeGreaterThan(0)
      expect(d.bibliografia.basica.length).toBeGreaterThan(0)
      expect(d.bibliografia.complementar.length).toBeGreaterThan(0)
    },
  )
})

describe("aulas", () => {
  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» tem 20 aulas numeradas de 1 a 20, em ordem",
    (_slug, d) => {
      expect(d.aulas).toHaveLength(20)
      expect(d.aulas.map((a) => a.numero)).toEqual(
        Array.from({ length: 20 }, (_, i) => i + 1),
      )
    },
  )

  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» dá assunto e unidade a toda aula",
    (_slug, d) => {
      for (const a of d.aulas) {
        expect(a.assunto.trim(), `aula ${a.numero}`).not.toBe("")
        expect(a.unidade.trim(), `aula ${a.numero}`).not.toBe("")
      }
    },
  )

  /**
   * Toda `unidade` precisa existir no conteúdo programático oficial.
   *
   * É esta a trava contra inventar assunto: se alguém acrescentar uma aula de
   * um tema que o plano não prevê, a unidade dela não vai bater com nenhum
   * tópico e o teste falha. As duas exceções de POO I estão declaradas no
   * próprio arquivo da disciplina — vêm da ementa e do objetivo geral, que são
   * igualmente oficiais.
   */
  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» só usa unidades que constam do plano",
    (_slug, d) => {
      const oficiais = new Set(d.conteudoPrograma.map((t) => t.titulo))
      const daEmenta = (u: string) => u.startsWith("Ementa —") || u.startsWith("Objetivo geral —")
      const forasteiras = d.aulas
        .map((a) => a.unidade)
        .filter((u) => !oficiais.has(u) && !daEmenta(u))
        // Subunidades no formato "Bloco — detalhe" valem pelo bloco.
        .filter((u) => !oficiais.has(u.split(" — ")[0]!))
      expect([...new Set(forasteiras)]).toEqual([])
    },
  )
})

describe("exercícios", () => {
  it.each(DISCIPLINAS.map((d) => [d.slug, d] as const))(
    "«%s» não repete id de exercício",
    (_slug, d) => {
      // Id repetido faz duas caixas marcarem e desmarcarem juntas, porque a
      // persistência é indexada por id.
      const ids = d.aulas.flatMap((a) => (a.exercicios ?? []).map((e) => e.id))
      const repetidos = ids.filter((x, i) => ids.indexOf(x) !== i)
      expect([...new Set(repetidos)]).toEqual([])
    },
  )

  it("nenhum id de exercício se repete entre disciplinas diferentes", () => {
    const ids = DISCIPLINAS.flatMap((d) =>
      d.aulas.flatMap((a) => (a.exercicios ?? []).map((e) => e.id)),
    )
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("todo exercício traz enunciado, dica, resolução e resposta", () => {
    for (const d of DISCIPLINAS) {
      for (const a of d.aulas) {
        for (const e of a.exercicios ?? []) {
          expect(e.enunciado.trim(), e.id).not.toBe("")
          expect(e.dica.trim(), e.id).not.toBe("")
          expect(e.resolucao.trim(), e.id).not.toBe("")
          expect(e.resposta.trim(), e.id).not.toBe("")
        }
      }
    }
  })

  it("aula com conteúdo escrito também tem exercícios e resumo", () => {
    // Meio caminho é pior que nada aqui: a aula parece completa e não é.
    for (const d of DISCIPLINAS) {
      for (const a of d.aulas.filter((x) => x.conteudo)) {
        expect(a.exercicios?.length ?? 0, `${d.slug} aula ${a.numero}`).toBeGreaterThan(0)
        expect(a.resumo, `${d.slug} aula ${a.numero}`).toBeDefined()
      }
    }
  })
})

describe("progresso", () => {
  it("começa em zero e conta aulas e exercícios juntos", () => {
    const d = buscarDisciplina("banco-de-dados")!
    const zero = calcular(d.aulas, PROGRESSO_VAZIO)
    expect(zero.percentual).toBe(0)
    expect(zero.concluidas).toBe(0)
    expect(zero.restantes).toBe(20)
    expect(zero.totalAulas).toBe(20)

    const tudo = calcular(d.aulas, {
      concluidas: Object.fromEntries(d.aulas.map((a) => [a.numero, true])),
      revisadas: {},
      exercicios: Object.fromEntries(
        d.aulas.flatMap((a) => (a.exercicios ?? []).map((e) => [e.id, true])),
      ),
    })
    expect(tudo.percentual).toBe(100)
    expect(tudo.restantes).toBe(0)
  })
})

describe("busca", () => {
  it("ignora acento e caixa", () => {
    expect(normalizar("Árvore Binária")).toBe("arvore binaria")
  })

  it("acha um termo do conteúdo e aponta a aula certa", () => {
    const d = buscarDisciplina("banco-de-dados")!
    const achados = buscar(montarIndice(d), "redundancia")
    expect(achados.length).toBeGreaterThan(0)
    expect(achados.some((o) => o.ancora === "aula-1")).toBe(true)
  })

  it("busca dentro das anotações", () => {
    const d = buscarDisciplina("banco-de-dados")!
    const achados = buscar(montarIndice(d), "revisar", "lembrete: revisar antes da prova")
    expect(achados.some((o) => o.tipo === "anotacao" && o.ancora === "anotacoes")).toBe(true)
  })

  it("um caractere não dispara busca", () => {
    const d = buscarDisciplina("banco-de-dados")!
    expect(buscar(montarIndice(d), "a")).toEqual([])
  })
})
