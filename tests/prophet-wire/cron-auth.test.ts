import { describe, expect, it } from "vitest"

import { authorizeCron } from "@/lib/prophet-wire/cron-auth"

/**
 * Este é o portão do endpoint que dispara o pipeline na internet aberta. Um
 * erro aqui deixa qualquer um forçar execuções (custo de rede/IA) ou escrever
 * no acervo. Os testes prendem sobretudo a FALHA FECHADA: sem segredo
 * configurado, nada passa.
 */

const SECRET = "segredo-de-teste-bem-longo-1234567890"

describe("authorizeCron — falha fechada", () => {
  it("recusa quando não há segredo configurado, mesmo com header plausível", () => {
    expect(authorizeCron("Bearer qualquer-coisa", undefined)).toEqual({
      authorized: false,
      reason: "sem-segredo-configurado",
    })
  })

  it("recusa quando o segredo configurado é vazio ou só espaços", () => {
    expect(authorizeCron("Bearer x", "").authorized).toBe(false)
    expect(authorizeCron("Bearer x", "   ").authorized).toBe(false)
  })

  it("recusa mesmo que o header repita um segredo vazio", () => {
    // Caso clássico de bypass: header "Bearer " com segredo "" no ambiente.
    expect(authorizeCron("Bearer ", "").authorized).toBe(false)
  })
})

describe("authorizeCron — cabeçalho", () => {
  it("autoriza com o segredo correto", () => {
    expect(authorizeCron(`Bearer ${SECRET}`, SECRET)).toEqual({ authorized: true })
  })

  it("recusa header ausente", () => {
    expect(authorizeCron(null, SECRET)).toEqual({ authorized: false, reason: "cabecalho-ausente" })
  })

  it("recusa esquema errado (Basic) e prefixo sem espaço", () => {
    expect(authorizeCron(`Basic ${SECRET}`, SECRET).authorized).toBe(false)
    expect(authorizeCron(`Bearer${SECRET}`, SECRET).authorized).toBe(false)
  })

  it("recusa segredo só parecido", () => {
    expect(authorizeCron(`Bearer ${SECRET}x`, SECRET)).toEqual({
      authorized: false,
      reason: "segredo-invalido",
    })
    expect(authorizeCron(`Bearer ${SECRET.slice(0, -1)}`, SECRET).authorized).toBe(false)
  })

  it("é sensível a maiúsculas e a espaços em volta", () => {
    expect(authorizeCron(`Bearer ${SECRET.toUpperCase()}`, SECRET).authorized).toBe(false)
    expect(authorizeCron(`Bearer ${SECRET} `, SECRET).authorized).toBe(false)
  })

  it("tolera segredos de tamanhos diferentes sem lançar", () => {
    // timingSafeEqual lança se os buffers têm tamanhos distintos; comparamos
    // digests de tamanho fixo justamente para que este caso seja só "false".
    expect(() => authorizeCron("Bearer curto", SECRET)).not.toThrow()
    expect(authorizeCron("Bearer curto", SECRET).authorized).toBe(false)
  })
})
