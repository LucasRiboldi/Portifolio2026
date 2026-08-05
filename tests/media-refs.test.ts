import { describe, it, expect } from "vitest"

import { pathnameDeBlob, indexarUsos, descreverUsos } from "@/lib/admin/media-refs"

/**
 * Integridade referencial entre a biblioteca de mídia e os documentos.
 *
 * ------------------------------------------------------------------
 * POR QUE ESTE ARQUIVO EXISTE
 * ------------------------------------------------------------------
 * Em 01/08/2026 quatro arquivos referenciados por documentos sumiram do Vercel
 * Blob: dois mp3 de `tracks`, a capa de uma faixa e o pôster de um vídeo. O
 * diagnóstico de então culpou o upload — "o put() devolve URL sem persistir".
 *
 * Era falso. Em 04/08 a escrita foi reproduzida contra o store real: `put()`
 * persiste, `head()` e `list()` enxergam, e a URL pública devolve 200. E um
 * `put()` que falha LANÇA, então a action devolve erro e não grava URL nenhuma
 * — um upload quebrado não consegue produzir uma URL pendurada.
 *
 * A causa era outra: `/admin/media` lista o store cru e deixa apagar qualquer
 * arquivo com um clique, sem saber quais estão em uso. Como a URL chega aos
 * documentos por copiar-e-colar ("Copiar URL" na grade, campo de texto livre no
 * formulário), nada liga o arquivo ao documento que depende dele. Apagar em uso
 * era gesto de um clique, e o resultado era 404 no player e nas capas.
 *
 * O que estes testes guardam é o índice que passou a existir para impedir isso.
 * Eles são puros de propósito: a varredura do Firestore é uma casca fina em
 * volta de `indexarUsos`, e é aqui que a lógica mora.
 */

describe("pathnameDeBlob", () => {
  const URL_REAL =
    "https://g0beqyv00t1gw0xe.public.blob.vercel-storage.com/public-media/eec0125e-e88b-4085-9814-d5e19789d43c.mp3"

  it("extrai o caminho do objeto de uma URL do Blob", () => {
    expect(pathnameDeBlob(URL_REAL)).toBe(
      "public-media/eec0125e-e88b-4085-9814-d5e19789d43c.mp3",
    )
  })

  it("ignora a query string", () => {
    // `downloadUrl` do SDK acrescenta `?download=1` à mesma URL — é o mesmo
    // objeto, e contar como outro deixaria um arquivo em uso passar por livre.
    expect(pathnameDeBlob(`${URL_REAL}?download=1`)).toBe(pathnameDeBlob(URL_REAL))
  })

  it("devolve null para URL que não é do Blob", () => {
    expect(pathnameDeBlob("https://exemplo.com/musica/faixa.mp3")).toBeNull()
    expect(pathnameDeBlob("/musica/local.mp3")).toBeNull()
    expect(pathnameDeBlob("")).toBeNull()
  })

  it("não confunde um host que apenas TERMINA parecido", () => {
    // `naoblob.vercel-storage.com.evil.test` não é o nosso store.
    expect(
      pathnameDeBlob("https://blob.vercel-storage.com.evil.test/public-media/x.mp3"),
    ).toBeNull()
  })
})

describe("indexarUsos", () => {
  const MP3 =
    "https://g0beqyv00t1gw0xe.public.blob.vercel-storage.com/public-media/aaa.mp3"
  const JPG =
    "https://g0beqyv00t1gw0xe.public.blob.vercel-storage.com/public-media/bbb.jpg"

  it("acha a URL em campo simples e diz onde está", () => {
    const usos = indexarUsos([
      { colecao: "tracks", id: "t1", titulo: "Samurai Blue", dados: { audio_url: MP3 } },
    ])
    expect(usos.get("public-media/aaa.mp3")).toEqual([
      { colecao: "tracks", docId: "t1", campo: "audio_url", titulo: "Samurai Blue" },
    ])
  })

  it("acha a mesma URL usada por documentos diferentes", () => {
    const usos = indexarUsos([
      { colecao: "tracks", id: "t1", titulo: "Faixa", dados: { cover_image: JPG } },
      { colecao: "videos", id: "v1", titulo: "Vídeo", dados: { poster_image: JPG } },
    ])
    expect(usos.get("public-media/bbb.jpg")).toHaveLength(2)
  })

  it("acha URL aninhada em array dentro de objeto", () => {
    // Caso real: `prophet_materias.boxes[].rows`. Uma varredura rasa deixaria
    // apagar a imagem de uma matéria sem avisar.
    const usos = indexarUsos([
      {
        colecao: "prophet_materias",
        id: "m1",
        titulo: "Matéria",
        dados: { boxes: [{ rows: [{ figura: JPG }] }] },
      },
    ])
    expect(usos.get("public-media/bbb.jpg")).toEqual([
      {
        colecao: "prophet_materias",
        docId: "m1",
        campo: "boxes[0].rows[0].figura",
        titulo: "Matéria",
      },
    ])
  })

  it("ignora campos que não são URL do Blob", () => {
    const usos = indexarUsos([
      {
        colecao: "tracks",
        id: "t1",
        titulo: "Faixa",
        dados: { audio_url: "/musica/local.mp3", note: "texto qualquer", sort: 3 },
      },
    ])
    expect(usos.size).toBe(0)
  })

  it("não quebra com null, undefined nem data", () => {
    const usos = indexarUsos([
      {
        colecao: "tracks",
        id: "t1",
        titulo: "Faixa",
        dados: { a: null, b: undefined, c: new Date(), d: MP3 },
      },
    ])
    expect(usos.size).toBe(1)
  })
})

describe("descreverUsos", () => {
  it("nomeia os documentos que seguram o arquivo", () => {
    const texto = descreverUsos([
      { colecao: "tracks", docId: "t1", campo: "audio_url", titulo: "Samurai Blue" },
      { colecao: "videos", docId: "v1", campo: "poster_image", titulo: "Trailer" },
    ])
    // A mensagem precisa dizer QUAL documento — "arquivo em uso" sozinho manda
    // o usuário caçar entre 170 documentos.
    expect(texto).toContain("Samurai Blue")
    expect(texto).toContain("tracks")
    expect(texto).toContain("Trailer")
  })
})
