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
  const body = (await request.json()) as HandleUploadBody

  /**
   * DOIS remetentes chegam neste endpoint, e cada um se autentica de um jeito.
   * Exigir sessão dos dois — como estava — barrava o segundo com 401:
   *
   *   • `blob.generate-client-token` vem do NAVEGADOR pedindo permissão de
   *     upload. Aqui a sessão de admin é a autenticação, e é obrigatória:
   *     sem ela qualquer um emitiria token de escrita no nosso store.
   *
   *   • `blob.upload-completed` é WEBHOOK dos servidores da Vercel, avisando
   *     que o arquivo subiu. Não tem cookie nenhum — autentica-se pelo
   *     cabeçalho `x-vercel-signature`, que o próprio `handleUpload` confere
   *     contra o `BLOB_READ_WRITE_TOKEN`. Deixar passar daqui não afrouxa
   *     nada: quem valida é o SDK, logo abaixo.
   *
   * Hoje o `onUploadCompleted` é vazio, então o 401 não quebrava o upload —
   * só produzia retentativa e ruído no log. Mas é armadilha: no dia em que
   * alguém puser lógica ali (registrar o blob no Firestore, por exemplo), ela
   * silenciosamente nunca rodaria.
   */
  if (body.type === "blob.generate-client-token" && !(await isAdmin())) {
    // `requireAdmin` redireciona, o que não serve para endpoint chamado por
    // fetch — aqui a resposta certa é 401.
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  // Depois da autorização, de propósito: esta resposta diz QUAL variável falta,
  // e isso é diagnóstico de ambiente. Respondê-la antes contaria a um chamador
  // anônimo como o deploy está configurado.
  //
  // Diferente do upload por Server Action, que também funciona por OIDC
  // (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`): emitir token de CLIENTE exige o
  // token estático. Sem ele o SDK falharia com mensagem genérica.
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
