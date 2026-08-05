import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { isAdmin } from "@/lib/auth/is-admin"
import { isSafeObjectName } from "@/lib/admin/media-validate"
import { CLASS_OF, CONTENT_TYPE, MAX_BYTES, PREFIX, extDoNome } from "@/lib/admin/media-accept"

/**
 * Handshake do upload direto ao Vercel Blob — para arquivo de qualquer espécie.
 *
 * Por que existe: **a plataforma corta o corpo do request em ~4,5 MB**, antes
 * do Next ver o pedido, e estourar esse teto devolve ao navegador um "An
 * unexpected response was received from the server", que não diz nada. O
 * `bodySizeLimit` do `next.config.ts` não protege disso — ele só limita o que
 * já chegou. Aqui o arquivo vai do navegador direto para o Blob e só o token
 * passa pelo nosso servidor.
 *
 * Servia só a vídeo até 04/08/2026. Estava errado: o corte da plataforma vale
 * para todo mundo, então imagem, áudio e PDF acima de 4 MB morriam na Server
 * Action. Agora qualquer espécie acima de `SERVER_ACTION_LIMIT` vem por aqui.
 *
 * O QUE SE PERDE, e é preciso ser honesto sobre isso: sem o arquivo em mãos,
 * não há como conferir os magic bytes antes de gravar — a garantia que
 * `media-validate.ts` dá aos uploads pequenos. O que resta é o `contentType`
 * declarado pelo cliente, restrito pelo `allowedContentTypes` do token, que sai
 * apertado no tipo exato derivado da extensão.
 *
 * Por que é aceitável: só sai token para quem já passou por `isAdmin()`, ou
 * seja, o dono do site. O modelo de ameaça do upload é "arquivo hostil de
 * terceiro", e terceiro nenhum chega até aqui. Arquivo pequeno continua indo
 * pela Server Action justamente para NÃO abrir mão da validação por conteúdo —
 * é a maioria dos uploads, e sai de graça.
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

        /**
         * O que o token autoriza sai da EXTENSÃO do caminho, não de um campo à
         * parte mandado pelo cliente.
         *
         * A extensão já passou por `isSafeObjectName`, que só aceita as que nós
         * geramos — então não há entrada nova para confiar. Um segundo campo
         * ("classe", vindo do cliente) seria mais uma coisa a validar, e poderia
         * discordar do caminho.
         *
         * O token sai apertado no tipo exato: um `.mp3` autoriza `audio/mpeg` e
         * nada mais. Antes isto era fixo nos três tipos de vídeo, o que impedia
         * áudio e PDF grandes de usarem este caminho — o defeito que mandava
         * arquivo de 5 MB morrer na Server Action.
         */
        const ext = extDoNome(nome)
        if (!ext) throw new Error("Extensão de arquivo não reconhecida.")

        return {
          allowedContentTypes: [CONTENT_TYPE[ext]],
          maximumSizeInBytes: MAX_BYTES[CLASS_OF[ext]],
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
