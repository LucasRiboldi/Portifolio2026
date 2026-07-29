import { describe, it, expect } from "vitest"

import { compose, SPAN } from "@/design-system/comic-layout"

/**
 * A REGRA DA TIRA — a única invariante da diagramação da HQ.
 *
 * Numa página de quadrinhos a tira é a unidade de leitura, e ela fecha. Uma
 * tira que para a dois terços deixa o olho suspenso: não se sabe se desce ou
 * se falta alguma coisa ali. Era o que acontecia em sete das oito dimensões
 * do Criativo, porque a diagramação anterior (`beat`) decidia a largura de um
 * quadro olhando só para a posição dele, sem saber quantos havia.
 *
 * Este teste fixa a invariante: seja qual for o número de quadros que o banco
 * devolva, toda tira soma 12 colunas. É a regra que impede o buraco de voltar
 * quando alguém publicar mais uma ilustração.
 */

/** Parte a diagramação em tiras, somando larguras até fechar 12. */
function emTiras(total: number) {
  const tiras: number[][] = []
  let atual: number[] = []
  let soma = 0

  for (const q of compose(total)) {
    const l = q.span.lg ?? 12
    atual.push(l)
    soma += l
    if (soma >= 12) {
      tiras.push(atual)
      atual = []
      soma = 0
    }
  }
  // O que sobrar é uma tira aberta — exatamente o defeito que se quer proibir.
  if (atual.length) tiras.push(atual)
  return tiras
}

describe("compose — toda tira fecha", () => {
  // Vai bem além do que a página tem hoje: o banco cresce e a regra tem de
  // valer para o número que vier.
  const totais = Array.from({ length: 40 }, (_, i) => i + 1)

  it.each(totais)("%d quadros: nenhuma tira aberta", (n) => {
    for (const tira of emTiras(n)) {
      expect(tira.reduce((a, x) => a + x, 0)).toBe(12)
    }
  })

  it.each(totais)("%d quadros: devolve a mesma quantidade de diagramações", (n) => {
    expect(compose(n)).toHaveLength(n)
  })

  it("um quadro sozinho vira splash page, não meia página", () => {
    /**
     * A videoteca tem um vídeo. Com largura fixa de meia página, sobrava
     * metade da folha em branco à direita — e o vazio lia-se como falta de
     * conteúdo. Um quadro só ocupa a página inteira: é a resposta editorial,
     * e é o que uma HQ faz com a página de abertura.
     */
    expect(compose(1)[0]?.span.lg).toBe(12)
  })

  it("não deixa um quadro solto no meio da página", () => {
    /**
     * Resto 1 no FIM é splash e é bom. Resto 1 no MEIO é um quadro órfão numa
     * tira que não fecha — lê-se como erro de montagem.
     */
    for (let n = 2; n <= 40; n++) {
      const tiras = emTiras(n)
      const meio = tiras.slice(0, -1)
      expect(meio.every((t) => t.reduce((a, x) => a + x, 0) === 12)).toBe(true)
    }
  })

  it("nenhum quadro fica sem largura no telemóvel", () => {
    /**
     * A grelha tem 4 colunas abaixo de 640px. Um span de 3 ali daria ~60px —
     * largura de miniatura, não de requadro.
     */
    for (let n = 1; n <= 40; n++) {
      for (const q of compose(n)) {
        expect(q.span.base).toBeGreaterThanOrEqual(2)
        expect(q.span.base).toBeLessThanOrEqual(4)
      }
    }
  })

  it("quadros vizinhos não repetem o mesmo recorte", () => {
    /**
     * Uma página só de retângulos não lê como quadrinho; uma página em que
     * dois vizinhos têm o mesmo recorte lê-se como grade disfarçada.
     */
    const formas = compose(20).map((q) => q.shape)
    for (let i = 1; i < formas.length; i++) {
      expect(formas[i]).not.toBe(formas[i - 1])
    }
  })
})

describe("SPAN — o vocabulário de medidas", () => {
  it("toda medida cabe na grelha da sua faixa", () => {
    for (const [nome, s] of Object.entries(SPAN)) {
      expect(s.base, nome).toBeLessThanOrEqual(4)
      expect(s.sm, nome).toBeLessThanOrEqual(8)
      expect(s.lg, nome).toBeLessThanOrEqual(12)
    }
  })
})
