import { describe, it, expect } from "vitest"

import {
  CLASS_OF,
  CONTENT_TYPE,
  EXT_POR_TIPO,
  MAX_BYTES,
  SERVER_ACTION_LIMIT,
  acceptedHint,
  extDoNome,
} from "@/lib/admin/media-accept"

/**
 * Por onde cada arquivo sobe, e por quê.
 *
 * ------------------------------------------------------------------
 * O DEFEITO QUE ISTO GUARDA
 * ------------------------------------------------------------------
 * `SERVER_ACTION_LIMIT` valia 25 MB, alinhado ao `bodySizeLimit: "26mb"` do
 * `next.config.ts`. A premissa era falsa: **o `bodySizeLimit` não manda** — a
 * plataforma corta o corpo antes do Next ver o request.
 *
 * Medido em produção em 04/08/2026 contra `/api/admin/blob-upload`, que lê o
 * corpo antes de responder 401:
 *
 *     1 MB → 401   (nosso código rodou)
 *     4 MB → 401   (nosso código rodou)
 *     6 MB → 413   FUNCTION_PAYLOAD_TOO_LARGE
 *    20 MB → 413   FUNCTION_PAYLOAD_TOO_LARGE
 *
 * Com 25 MB, tudo entre 4,5 e 25 MB ia para a Server Action morrer com "An
 * unexpected response was received from the server" — mensagem que não menciona
 * tamanho. Foi assim que um PDF de 4,52 MB falhou em 01/08 e a interface seguiu
 * anunciando um teto de 25 MB que não existia.
 *
 * Se alguém subir esta constante de novo, é aqui que o CI reclama.
 */

/** O corte medido da plataforma. Não é escolha nossa — é o que ela impõe. */
const CORTE_DA_PLATAFORMA = 4.5 * 1024 * 1024

describe("SERVER_ACTION_LIMIT", () => {
  it("fica abaixo do corte da plataforma", () => {
    expect(SERVER_ACTION_LIMIT).toBeLessThan(CORTE_DA_PLATAFORMA)
  })

  it("deixa folga para o overhead do multipart", () => {
    // O corpo que viaja é maior que o arquivo: há cabeçalhos de parte e
    // fronteiras junto. Encostar em 4,5 MB voltaria a estourar por pouco.
    expect(CORTE_DA_PLATAFORMA - SERVER_ACTION_LIMIT).toBeGreaterThanOrEqual(256 * 1024)
  })

  it("não é tão baixo a ponto de mandar toda imagem pelo caminho direto", () => {
    // O caminho direto abre mão da conferência por magic bytes. A maioria dos
    // uploads é imagem pequena, e ela deve continuar sendo validada.
    expect(SERVER_ACTION_LIMIT).toBeGreaterThanOrEqual(2 * 1024 * 1024)
  })
})

describe("tetos anunciados são alcançáveis", () => {
  // Antes do conserto o hint prometia "até 25 MB" para áudio e PDF, e nada
  // acima de 4,5 MB subia. Um teto que a interface anuncia e o sistema recusa é
  // pior que um teto baixo: manda o usuário tentar de novo.
  it.each(["audio", "video", "document", "image"] as const)(
    "%s: se o teto passa do corte, o caminho direto conhece a espécie",
    (classe) => {
      const teto = MAX_BYTES[classe]
      if (teto <= SERVER_ACTION_LIMIT) return // cabe na Server Action, nada a provar

      // Passa do corte: só sobe pelo caminho direto, e o caminho direto precisa
      // saber nomear o arquivo. Se `EXT_POR_TIPO` não cobrir a espécie, o
      // upload falha com "Formato não aceito" — que foi o defeito real com
      // áudio e PDF acima de 25 MB.
      const extensoesDaClasse = Object.values(EXT_POR_TIPO).filter(
        (ext) => CLASS_OF[ext] === classe,
      )
      expect(extensoesDaClasse.length).toBeGreaterThan(0)
    },
  )

  it("o texto de ajuda cita o teto real da espécie", () => {
    expect(acceptedHint(["document"])).toContain("25 MB")
  })
})

describe("EXT_POR_TIPO", () => {
  it("é o inverso exato de CONTENT_TYPE", () => {
    // Derivar em vez de escrever à mão é o que impede o cliente de nomear um
    // arquivo com extensão que o token da rota depois recusa.
    for (const [ext, tipo] of Object.entries(CONTENT_TYPE)) {
      expect(EXT_POR_TIPO[tipo]).toBe(ext)
    }
  })

  it("cobre as quatro espécies, não só vídeo", () => {
    // O defeito original: o caminho direto só conhecia vídeo, então áudio e PDF
    // grandes não tinham por onde passar.
    const classes = new Set(Object.values(EXT_POR_TIPO).map((ext) => CLASS_OF[ext]))
    expect([...classes].sort()).toEqual(["audio", "document", "image", "video"])
  })
})

describe("extDoNome", () => {
  it("lê a extensão do nome que nós geramos", () => {
    expect(extDoNome("eec0125e-e88b-4085-9814-d5e19789d43c.mp3")).toBe("mp3")
    expect(extDoNome("23518572-f505-461e-bb11-86c38f84d502.avif")).toBe("avif")
  })

  it("recusa extensão desconhecida", () => {
    // É o que faz a rota do token negar em vez de autorizar às cegas.
    expect(extDoNome("arquivo.exe")).toBeNull()
    expect(extDoNome("arquivo.svg")).toBeNull()
    expect(extDoNome("sem-extensao")).toBeNull()
  })

  it("não se confunde com maiúsculas", () => {
    expect(extDoNome("ARQUIVO.MP3")).toBe("mp3")
  })
})
