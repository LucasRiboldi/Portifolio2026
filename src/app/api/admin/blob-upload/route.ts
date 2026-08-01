import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { isAdmin } from "@/lib/auth/is-admin"
import { isSafeObjectName } from "@/lib/admin/media-validate"
import { MAX_BYTES, PREFIX } from "@/lib/admin/media-accept"

/**
 * Handshake do upload direto de vídeo para o Vercel Blob.
 *
 * Por que existe: vídeo não cabe no corpo de uma Server Action. O
 * `bodySizeLimit` do Next é a barreira — estourá-lo devolve ao navegador um
 * "An unexpected response was received from the server", que não diz nada. Aqui
 * o arquivo vai do navegador direto para o Blob e só o token passa pelo nosso
 * servidor.
 *
 * O QUE SE PERDE, e é preciso ser honesto sobre isso: sem o arquivo em mãos,
 * não há como conferir os magic bytes antes de gravar — a garantia que
 * `media-validate.ts` dá aos outros uploads. O que resta é o `contentType`
 * declarado pelo cliente, restrito pelo `allowedContentTypes` do token.
 *
 * Por que é aceitável: só sai token para quem já passou por `isAdmin()`, ou
 * seja, o dono do site. O modelo de ameaça do upload é "arquivo hostil de
 * terceiro", e terceiro nenhum chega até aqui. Imagem e áudio seguem pela
 * Server Action justamente para NÃO abrirem mão da validação por conteúdo.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // `requireAdmin` redireciona, o que não serve para um endpoint chamado por
  // fetch — aqui a resposta certa é 401.
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  // Diferente do upload por Server Action, que também funciona por OIDC
  // (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`): emitir token de CLIENTE exige o
  // token estático. Sem ele o SDK falharia lá dentro com mensagem genérica —
  // melhor dizer exatamente o que falta.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Upload de vídeo indisponível: BLOB_READ_WRITE_TOKEN ausente neste ambiente. " +
          "Imagem, áudio e PDF continuam funcionando.",
      },
      { status: 503 },
    )
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // O caminho vem do cliente. Aceita só o formato que nós geramos
        // (UUID + extensão), sob o mesmo prefixo — é o que barra path
        // traversal e escrita fora da pasta de mídia.
        const nome = pathname.startsWith(`${PREFIX}/`)
          ? pathname.slice(PREFIX.length + 1)
          : null
        if (!nome || !isSafeObjectName(nome)) {
          throw new Error("Nome de arquivo inválido.")
        }

        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: MAX_BYTES.video,
          addRandomSuffix: false,
          cacheControlMaxAge: 31536000,
        }
      },
      // Nada a fazer depois do upload: a URL volta ao formulário pelo cliente.
      // O callback é obrigatório e, em localhost, nem chega a ser chamado.
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(jsonResponse)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha no upload." },
      { status: 400 },
    )
  }
}
