import { describe, it, expect } from "vitest"

import { DISCIPLINAS } from "@/data/estudos"
import {
  AULAS_POR_SEMESTRE,
  FERIADOS_2026,
  INICIO_SEMESTRE,
  comoISO,
  dataBR,
  datasDasAulas,
  proximaAula,
  situacao,
} from "@/lib/estudos/calendario"

/**
 * O CALENDÁRIO — a única parte do módulo de estudos com lógica de verdade.
 *
 * Vinte datas por disciplina, cinco disciplinas: cem datas que ninguém digitou
 * e que ninguém confere a olho. Um erro de um dia aqui não quebra o build nem
 * aparece na tela — só faz o aluno estudar o assunto errado na semana errada.
 * É exatamente o tipo de falha silenciosa que só um teste pega.
 */

describe("datasDasAulas", () => {
  it("a primeira aula cai no dia da semana declarado", () => {
    // 27/07/2026 é segunda. Cada disciplina abre no seu dia daquela semana.
    const esperado: Record<number, string> = {
      1: "2026-07-27",
      2: "2026-07-28",
      3: "2026-07-29",
      4: "2026-07-30",
      5: "2026-07-31",
    }
    for (const dia of [1, 2, 3, 4, 5] as const) {
      expect(datasDasAulas({ diaSemana: dia })[0], `dia ${dia}`).toBe(esperado[dia])
    }
  })

  it("toda data cai no mesmo dia da semana da disciplina", () => {
    for (const dia of [1, 2, 3, 4, 5] as const) {
      for (const iso of datasDasAulas({ diaSemana: dia })) {
        expect(new Date(`${iso}T00:00:00.000Z`).getUTCDay(), iso).toBe(dia)
      }
    }
  })

  it("devolve exatamente o total pedido, sem repetir data", () => {
    const datas = datasDasAulas({ diaSemana: 4 })
    expect(datas).toHaveLength(AULAS_POR_SEMESTRE)
    expect(new Set(datas).size).toBe(AULAS_POR_SEMESTRE)
  })

  it("as datas saem em ordem crescente", () => {
    const datas = datasDasAulas({ diaSemana: 3 })
    expect([...datas].sort()).toEqual(datas)
  })

  it("nenhuma aula cai em feriado", () => {
    for (const dia of [1, 2, 3, 4, 5] as const) {
      const datas = datasDasAulas({ diaSemana: dia })
      expect(datas.filter((d) => FERIADOS_2026.includes(d))).toEqual([])
    }
  })

  it("feriado empurra a aula uma semana, não muda o dia da semana", () => {
    // 07/09/2026 é segunda (Independência). A aula da semana some, e a
    // seguinte assume o número — não se remaneja para outro dia.
    const segundas = datasDasAulas({ diaSemana: 1 })
    expect(segundas).toContain("2026-08-31")
    expect(segundas).not.toContain("2026-09-07")
    expect(segundas).toContain("2026-09-14")
  })

  it("sem feriados, as datas ficam a exatamente sete dias uma da outra", () => {
    const datas = datasDasAulas({ diaSemana: 2, feriados: [] })
    for (let i = 1; i < datas.length; i++) {
      const dif = Date.parse(`${datas[i]}T00:00:00Z`) - Date.parse(`${datas[i - 1]}T00:00:00Z`)
      expect(dif).toBe(7 * 86_400_000)
    }
  })

  it("recusa início que não seja segunda-feira", () => {
    // Sem essa trava, um início em terça deslocaria todas as disciplinas em
    // silêncio e o erro só apareceria no calendário impresso.
    expect(() => datasDasAulas({ diaSemana: 1, inicio: "2026-07-28" })).toThrow(/segunda/i)
  })

  it("recusa data mal formada", () => {
    expect(() => datasDasAulas({ diaSemana: 1, inicio: "27/07/2026" })).toThrow(/AAAA-MM-DD/)
  })
})

describe("situacao e proximaAula", () => {
  it("classifica passado, presente e futuro", () => {
    expect(situacao("2026-08-10", "2026-08-17")).toBe("passada")
    expect(situacao("2026-08-17", "2026-08-17")).toBe("hoje")
    expect(situacao("2026-08-24", "2026-08-17")).toBe("futura")
  })

  it("a próxima aula é a de hoje quando hoje é dia de aula", () => {
    const datas = ["2026-08-03", "2026-08-10", "2026-08-17"]
    expect(proximaAula(datas, "2026-08-10")).toBe(1)
    expect(proximaAula(datas, "2026-08-05")).toBe(1)
    expect(proximaAula(datas, "2026-09-01")).toBe(-1)
  })
})

describe("formatação", () => {
  it("dataBR inverte a ordem sem mexer no dia", () => {
    // O bug clássico aqui é o fuso: `new Date('2026-07-27')` em horário local
    // a oeste de Greenwich devolve dia 26.
    expect(dataBR("2026-07-27")).toBe("27/07/2026")
    expect(dataBR("2026-01-01")).toBe("01/01/2026")
  })

  it("comoISO devolve o dia em UTC", () => {
    expect(comoISO(new Date("2026-07-27T00:00:00.000Z"))).toBe("2026-07-27")
  })
})

describe("o semestre configurado bate com as disciplinas", () => {
  it("o início declarado é uma segunda-feira", () => {
    expect(new Date(`${INICIO_SEMESTRE}T00:00:00.000Z`).getUTCDay()).toBe(1)
  })

  it("cada disciplina cai num dia útil diferente", () => {
    const dias = DISCIPLINAS.map((d) => d.diaSemana)
    expect(new Set(dias).size, "duas disciplinas no mesmo dia").toBe(dias.length)
  })

  it("toda disciplina consegue agendar todas as suas aulas", () => {
    for (const d of DISCIPLINAS) {
      const datas = datasDasAulas({ diaSemana: d.diaSemana, total: d.aulas.length })
      expect(datas, d.slug).toHaveLength(d.aulas.length)
    }
  })
})
