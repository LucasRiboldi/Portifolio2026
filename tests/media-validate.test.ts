import { describe, it, expect } from "vitest"

import { sniffMedia, validateMedia, isSafeObjectName } from "@/lib/admin/media-validate"
import { MAX_BYTES } from "@/lib/admin/media-accept"

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

const MP3_ID3 = bytes("ID3", [3, 0, 0, 0])
const MP3_SYNC = bytes([0xff, 0xfb, 0x90, 0x00])
const OGG = bytes("OggS", [0, 2, 0, 0])
const WAV = bytes("RIFF", [1, 2, 3, 4], "WAVE", [1, 2])
const M4A = bytes([0, 0, 0, 0], "ftyp", "M4A ", [1, 2])

const MP4 = bytes([0, 0, 0, 0], "ftyp", "isom", [1, 2])
const WEBM = bytes([0x1a, 0x45, 0xdf, 0xa3], [1, 2, 3])
const MOV = bytes([0, 0, 0, 0], "ftyp", "qt  ", [1, 2])

describe("sniffMedia — formatos legítimos", () => {
  it.each([
    ["png", PNG],
    ["jpg", JPG],
    ["gif", GIF],
    ["webp", WEBP],
    ["avif", AVIF],
    ["mp3", MP3_ID3],
    ["mp3", MP3_SYNC],
    ["ogg", OGG],
    ["wav", WAV],
    ["m4a", M4A],
    ["mp4", MP4],
    ["webm", WEBM],
    ["mov", MOV],
  ])("reconhece %s pelo conteúdo", (kind, buf) => {
    expect(sniffMedia(buf)).toBe(kind)
  })

  it("distingue WebP de WAV — mesmo container RIFF", () => {
    expect(sniffMedia(WEBP)).toBe("webp")
    expect(sniffMedia(WAV)).toBe("wav")
  })

  it("distingue AVIF, M4A e MP4 — todos são ftyp", () => {
    expect(sniffMedia(AVIF)).toBe("avif")
    expect(sniffMedia(M4A)).toBe("m4a")
    expect(sniffMedia(MP4)).toBe("mp4")
  })
})

describe("sniffMedia — payloads hostis", () => {
  it("rejeita HTML com script (mesmo salvo como .png)", () => {
    expect(sniffMedia(bytes("<html><script>alert(1)</script>"))).toBeNull()
  })

  it("rejeita SVG — é XML executável num bucket público", () => {
    expect(sniffMedia(bytes('<svg xmlns="http://www.w3.org/2000/svg"><script/></svg>'))).toBeNull()
  })

  it("rejeita executável PE/EXE", () => {
    expect(sniffMedia(bytes([0x4d, 0x5a, 0x90, 0x00]))).toBeNull()
  })

  it("rejeita arquivo vazio", () => {
    expect(sniffMedia(new Uint8Array())).toBeNull()
  })

  it("não estoura com arquivo menor que a assinatura", () => {
    expect(sniffMedia(bytes([0x89, 0x50]))).toBeNull()
  })
})

describe("validateMedia — espécie precisa ser permitida pelo campo", () => {
  it("aceita PNG num campo de imagem", () => {
    expect(validateMedia(PNG, ["image"])).toMatchObject({
      kind: "png",
      mediaClass: "image",
      contentType: "image/png",
    })
  })

  it("aceita MP3 num campo de áudio", () => {
    expect(validateMedia(MP3_ID3, ["audio"])).toMatchObject({
      kind: "mp3",
      mediaClass: "audio",
      contentType: "audio/mpeg",
    })
  })

  it("recusa MP3 num campo de imagem — era o bug do campo de capa", () => {
    const r = validateMedia(MP3_ID3, ["image"])
    expect(r).toHaveProperty("error")
  })

  it("recusa PNG num campo de áudio", () => {
    expect(validateMedia(PNG, ["audio"])).toHaveProperty("error")
  })

  it("aceita as duas espécies quando o campo declara as duas", () => {
    expect(validateMedia(PNG, ["image", "audio"])).toMatchObject({ kind: "png" })
    expect(validateMedia(OGG, ["image", "audio"])).toMatchObject({ kind: "ogg" })
  })

  it("sem espécie declarada, aceita só imagem — o padrão restritivo", () => {
    expect(validateMedia(PNG)).toMatchObject({ kind: "png" })
    expect(validateMedia(MP3_ID3)).toHaveProperty("error")
  })
})

describe("validateMedia — tamanho por espécie", () => {
  it("recusa imagem acima de 5 MB, mesmo sendo PNG de verdade", () => {
    const big = new Uint8Array(MAX_BYTES.image + 1)
    big.set(PNG, 0)
    const r = validateMedia(big, ["image"])
    expect(r).toHaveProperty("error")
    expect((r as { error: string }).error).toContain("5 MB")
  })

  it("aceita áudio acima do teto de imagem — o teto é por espécie", () => {
    const audio = new Uint8Array(MAX_BYTES.image + 1)
    audio.set(MP3_ID3, 0)
    expect(validateMedia(audio, ["audio"])).toMatchObject({ kind: "mp3" })
  })

  it("recusa áudio acima de 25 MB", () => {
    const big = new Uint8Array(MAX_BYTES.audio + 1)
    big.set(MP3_ID3, 0)
    const r = validateMedia(big, ["audio"])
    expect(r).toHaveProperty("error")
    expect((r as { error: string }).error).toContain("25 MB")
  })

  it("recusa arquivo vazio", () => {
    expect(validateMedia(new Uint8Array(), ["image"])).toHaveProperty("error")
  })
})

describe("isSafeObjectName — barra path traversal e sufixo duplo", () => {
  it.each(["png", "mp3", "ogg", "wav", "m4a", "mp4", "webm", "mov"])(
    "aceita o nome que nós geramos (.%s)",
    (ext) => {
      expect(isSafeObjectName(`a1b2c3d4-e5f6-7890-abcd-ef1234567890.${ext}`)).toBe(true)
    },
  )

  it.each([
    "../../etc/passwd",
    "foto.png.html",
    "pasta/arquivo.png",
    "foto.svg",
    "arquivo.exe",
    "musica.mp3.exe",
    "",
  ])("rejeita %j", (name) => {
    expect(isSafeObjectName(name)).toBe(false)
  })
})
