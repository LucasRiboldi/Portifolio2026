"use client"

import { upload as uploadParaBlob } from "@vercel/blob/client"

import { uploadMedia } from "@/app/admin/media/actions"
import {
  EXT_POR_TIPO,
  MAX_BYTES,
  PREFIX,
  SERVER_ACTION_LIMIT,
  type MediaClass,
} from "@/lib/admin/media-accept"

/**
 * A decisão de POR ONDE um arquivo sobe, num lugar só.
 *
 * ------------------------------------------------------------------
 * POR QUE ISTO É COMPARTILHADO
 * ------------------------------------------------------------------
 * Havia duas lógicas de upload em paralelo: a do `media-picker` (campo de
 * formulário), que sabia desviar arquivo grande para o Blob, e a do
 * `media-manager` (`/admin/media`), que não sabia e mandava tudo pela Server
 * Action. Conserto numa não alcançava a outra — e foi exatamente assim que o
 * teto de 4,5 MB ficou meio consertado.
 *
 * Agora as duas chamam isto. Uma regra, dois chamadores.
 */

export type ResultadoEnvio =
  | { ok: true; name: string; url: string }
  | { ok: false; error: string }

/**
 * Em que etapa o envio direto está.
 *
 * Existe porque "Enviando…" sozinho não é diagnóstico: um envio parado no
 * pedido do token e um parado na conclusão têm causas diferentes — o primeiro é
 * a nossa rota, o segundo é o webhook não conseguindo voltar — e a tela mostrava
 * a mesma coisa nos dois casos. Foi assim que um vídeo ficou "enviando" sem que
 * ninguém pudesse dizer onde.
 */
export type FaseEnvio = "autorizando" | "enviando" | "finalizando"

const ROTULO_DA_FASE: Record<FaseEnvio, string> = {
  autorizando: "pedindo autorização",
  enviando: "enviando o arquivo",
  finalizando: "concluindo",
}

/**
 * Sem nenhum sinal por este tempo, o envio é abortado.
 *
 * Preferir abortar a pendurar: um erro que nomeia a etapa é informação; um
 * "Enviando…" eterno não é, e o usuário não tem como distinguir de lentidão.
 * Generoso de propósito — arquivo grande em rede ruim passa longos silêncios
 * entre eventos de progresso.
 */
const MS_SEM_SINAL = 45_000

/**
 * Envia um arquivo pelo caminho certo e devolve a URL pública.
 *
 * `onProgress` só é chamado no caminho direto: pela Server Action o corpo sobe
 * de uma vez e não existe evento intermediário para reportar.
 */
export async function enviarMidia(
  file: File,
  classes: MediaClass[],
  onProgress?: (percentual: number) => void,
  onFase?: (fase: FaseEnvio) => void,
): Promise<ResultadoEnvio> {
  const tetoDoCampo = Math.max(...classes.map((c) => MAX_BYTES[c]))
  if (file.size > tetoDoCampo) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    return {
      ok: false,
      error: `Arquivo de ${mb} MB excede ${Math.round(tetoDoCampo / 1024 / 1024)} MB.`,
    }
  }

  // Vídeo vai sempre direto, mesmo pequeno: `validateMedia` precisa do arquivo
  // inteiro em memória, e vídeo é justamente o que não cabe.
  const direto = file.type.startsWith("video/") || file.size > SERVER_ACTION_LIMIT

  if (!direto) {
    const fd = new FormData()
    fd.set("file", file)
    fd.set("classes", classes.join(","))
    const res = await uploadMedia(fd)
    return res.ok ? { ok: true, name: res.data.name, url: res.data.url } : res
  }

  const ext = EXT_POR_TIPO[file.type]
  if (!ext) {
    // O `accept` do input filtra antes, mas arrastar-e-soltar escapa disso, e o
    // navegador às vezes entrega `type` vazio.
    return {
      ok: false,
      error: `Formato não aceito para envio direto: ${file.type || "tipo desconhecido"}.`,
    }
  }

  const name = `${crypto.randomUUID()}.${ext}`

  /**
   * O relógio de silêncio.
   *
   * O envio direto tem três etapas e só a do meio emite eventos. Marcar cada
   * transição e abortar quando nada acontece por muito tempo é o que transforma
   * "travou" em "travou ao pedir autorização" — que é uma pista, não um relato.
   */
  const controle = new AbortController()
  let fase: FaseEnvio = "autorizando"
  let ultimoSinal = Date.now()

  onFase?.(fase)
  const relogio = setInterval(() => {
    if (Date.now() - ultimoSinal > MS_SEM_SINAL) controle.abort()
  }, 5_000)

  try {
    const blob = await uploadParaBlob(`${PREFIX}/${name}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
      contentType: file.type,
      abortSignal: controle.signal,
      onUploadProgress: ({ percentage }) => {
        ultimoSinal = Date.now()
        const pct = Math.round(percentage)

        // O primeiro evento prova que o token saiu: a etapa anterior passou.
        if (fase === "autorizando") {
          fase = "enviando"
          onFase?.(fase)
        }
        // 100% dos bytes não é fim: falta a conclusão do lado do Blob, que é
        // justamente onde o webhook pode não voltar.
        if (pct >= 100 && fase === "enviando") {
          fase = "finalizando"
          onFase?.(fase)
        }
        onProgress?.(pct)
      },
    })

    return { ok: true, name, url: blob.url }
  } catch (err) {
    if (controle.signal.aborted) {
      return {
        ok: false,
        error:
          `O envio parou em "${ROTULO_DA_FASE[fase]}" e foi cancelado após ` +
          `${MS_SEM_SINAL / 1000}s sem resposta. Nada foi gravado.`,
      }
    }
    return {
      ok: false,
      error:
        `Falha em "${ROTULO_DA_FASE[fase]}": ` +
        (err instanceof Error ? err.message : "erro desconhecido"),
    }
  } finally {
    clearInterval(relogio)
  }
}
