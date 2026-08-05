import "server-only"

import { listarCampos } from "@/lib/firebase/collection"
import { COLECOES } from "@/lib/firebase/schema"

/**
 * Quem usa cada arquivo da biblioteca de mídia.
 *
 * ------------------------------------------------------------------
 * POR QUE ISTO EXISTE
 * ------------------------------------------------------------------
 * A URL de um arquivo chega ao documento por copiar-e-colar: a grade de
 * `/admin/media` oferece "Copiar URL" e o campo do formulário é texto livre.
 * Nada, em nenhum dos dois lados, sabia que o arquivo tinha dono.
 *
 * O preço apareceu em 01/08/2026: quatro arquivos referenciados sumiram do
 * store e viraram 404 no player e nas capas. O upload foi acusado, e era
 * inocente — `put()` persiste, e quando falha lança, sem gravar URL nenhuma.
 * O que faltava era este índice.
 *
 * Não há chave estrangeira no Firestore para delegar isso. A varredura é a
 * substituta: cara, mas só roda no painel, e um `/admin/media` que apaga
 * arquivo em uso custa mais.
 */

/** Um lugar onde uma URL de mídia aparece. */
export interface UsoDeMidia {
  colecao: string
  docId: string
  /** Caminho até o campo, com índices quando aninhado: `boxes[0].rows[1].figura`. */
  campo: string
  titulo: string
}

/** Documento já lido, pronto para varredura. */
export interface DocVarrido {
  colecao: string
  id: string
  titulo: string
  dados: Record<string, unknown>
}

/**
 * Extrai o caminho do objeto a partir de uma URL do Vercel Blob.
 * Devolve `null` para qualquer coisa que não seja do nosso store.
 */
export function pathnameDeBlob(valor: string): string | null {
  let u: URL
  try {
    u = new URL(valor)
  } catch {
    // Caminho relativo (`/musica/x.mp3`) e string vazia caem aqui — não são
    // do Blob, e é resposta certa.
    return null
  }

  // Compara o host inteiro, ancorado no fim. Um `endsWith` solto aceitaria
  // `blob.vercel-storage.com.dominio-de-terceiro.test`.
  const host = u.hostname.toLowerCase()
  if (host !== "blob.vercel-storage.com" && !host.endsWith(".blob.vercel-storage.com")) {
    return null
  }

  // A query fica de fora de propósito: `downloadUrl` é a mesma URL com
  // `?download=1`, e tratá-la como outro objeto deixaria um arquivo em uso
  // passar como livre.
  return decodeURIComponent(u.pathname.replace(/^\//, ""))
}

/** Título legível do documento, para a mensagem caber numa frase. */
function tituloDe(dados: Record<string, unknown>): string {
  for (const campo of ["title", "titulo", "name", "headline", "slug", "key"]) {
    const v = dados[campo]
    if (typeof v === "string" && v.trim()) return v
  }
  return "(sem título)"
}

/**
 * Indexa por caminho de objeto todos os usos encontrados nos documentos.
 *
 * Pura de propósito: é onde mora a lógica, e é o que os testes cobrem sem
 * precisar de rede nem credencial.
 */
export function indexarUsos(docs: DocVarrido[]): Map<string, UsoDeMidia[]> {
  const mapa = new Map<string, UsoDeMidia[]>()

  function andar(valor: unknown, doc: DocVarrido, caminho: string): void {
    if (typeof valor === "string") {
      const pathname = pathnameDeBlob(valor)
      if (!pathname) return
      const lista = mapa.get(pathname) ?? []
      lista.push({ colecao: doc.colecao, docId: doc.id, campo: caminho, titulo: doc.titulo })
      mapa.set(pathname, lista)
      return
    }
    if (Array.isArray(valor)) {
      valor.forEach((v, i) => andar(v, doc, `${caminho}[${i}]`))
      return
    }
    // `Date` (e o Timestamp do Firestore) são objetos sem campo de mídia
    // dentro; descer neles só gastaria passos.
    if (valor && typeof valor === "object" && !(valor instanceof Date)) {
      for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
        andar(v, doc, caminho ? `${caminho}.${k}` : k)
      }
    }
  }

  for (const doc of docs) andar(doc.dados, doc, "")
  return mapa
}

/** Frase que nomeia os documentos que seguram um arquivo. */
export function descreverUsos(usos: UsoDeMidia[]): string {
  return usos.map((u) => `${u.colecao} · "${u.titulo}" (${u.campo})`).join("; ")
}

/**
 * Varre as coleções declaradas e devolve o índice de usos.
 *
 * Lança se alguma coleção falhar, e quem chama deve **falhar fechado**: um
 * índice incompleto diria "livre" sobre arquivo em uso, que é exatamente o
 * defeito que isto existe para impedir.
 */
export async function mapearUsosDeMidia(): Promise<Map<string, UsoDeMidia[]>> {
  const docs: DocVarrido[] = []

  for (const [colecao, campos] of Object.entries(COLECOES)) {
    const linhas = await listarCampos<Record<string, unknown>>(colecao, [...campos])
    for (const linha of linhas) {
      docs.push({
        colecao,
        id: String(linha.id ?? ""),
        titulo: tituloDe(linha),
        dados: linha,
      })
    }
  }

  return indexarUsos(docs)
}
