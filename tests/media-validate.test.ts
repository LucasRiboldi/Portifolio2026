import { describe, it, expect } from "vitest"

import { sniffImage, validateImage, isSafeObjectName, MAX_BYTES } from "@/lib/admin/media-validate"

/**
 * O upload confia no CONTEÚDO, nunca no que o cliente declara. Estes testes
 * existem para garantir que um arquivo malicioso renomeado para .png continue
 * sendo rejeitado — que é o ataque que a validação antiga (`accept="image/*"`)
 * não pegava.
 */

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(
    parts.flatMap((p) => (typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p)),
  )

const PNG = bytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], [1, 2, 3])
const JPG = bytes([0xff, 0xd8, 0xff, 0xe0], [1, 2, 3])
const GIF = bytes("GIF89a", [1, 2, 3])
const WEBP = bytes("RIFF", [1, 2, 3, 4], "WEBP", [1, 2])
const AVIF = bytes([0, 0, 0, 0], "ftyp", "avif", [1, 2])

describe("sniffImage — formatos legítimos", () => {
  it.each([
    ["png", PNG],
    ["jpg", JPG],
    ["gif", GIF],
    ["webp", WEBP],
    ["avif", AVIF],
  ])("reconhece %s pelo conteúdo", (kind, buf) => {
    expect(sniffImage(buf)).toBe(kind)
  })
})

describe("sniffImage — payloads hostis", () => {
  it("rejeita HTML com script (mesmo salvo como .png)", () => {
    expect(sniffImage(bytes("<html><script>alert(1)</script>"))).toBeNull()
  })

  it("rejeita SVG — é XML executável num bucket público", () => {
    expect(sniffImage(bytes('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>'))).toBeNull()
  })

  it("rejeita executável PE/EXE", () => {
    expect(sniffImage(bytes([0x4d, 0x5a, 0x90, 0x00]))).toBeNull()
  })

  it("rejeita arquivo vazio", () => {
    expect(sniffImage(new Uint8Array())).toBeNull()
  })

  it("não estoura com arquivo menor que a assinatura", () => {
    expect(sniffImage(bytes([0x89, 0x50]))).toBeNull()
  })
})

describe("validateImage", () => {
  it("aceita PNG dentro do limite", () => {
    const r = validateImage(PNG)
    expect(r).toMatchObject({ kind: "png", contentType: "image/png" })
  })

  it("recusa acima de 5 MB, mesmo sendo PNG de verdade", () => {
    const big = new Uint8Array(MAX_BYTES + 1)
    big.set(PNG, 0)
    const r = validateImage(big)
    expect(r).toHaveProperty("error")
    expect((r as { error: string }).error).toContain("5 MB")
  })

  it("recusa arquivo vazio", () => {
    expect(validateImage(new Uint8Array())).toHaveProperty("error")
  })
})

describe("isSafeObjectName — barra path traversal e sufixo duplo", () => {
  it("aceita o nome que nós geramos", () => {
    expect(isSafeObjectName("a1b2c3d4-e5f6-7890-abcd-ef1234567890.png")).toBe(true)
  })

  it.each([
    "../../etc/passwd",
    "foto.png.html",
    "pasta/arquivo.png",
    "foto.svg",
    "arquivo.exe",
    "",
  ])("rejeita %j", (name) => {
    expect(isSafeObjectName(name)).toBe(false)
  })
})
