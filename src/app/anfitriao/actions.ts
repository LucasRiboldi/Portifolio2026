"use server"

/**
 * O CUPOM DE ASSINATURA — a única escrita pública da folha.
 *
 * ------------------------------------------------------------------
 * O QUE ESTA ACTION CONSERTA
 * ------------------------------------------------------------------
 * O cupom era um `<form>` sem `action` nem `onSubmit`, com um botão
 * `type="submit"`. Clicar em "Assinar esta folha" disparava um GET para a
 * própria página com os campos na barra de endereço, perdia a posição de
 * rolagem e não devolvia aviso nenhum. Era o único elemento da folha que
 * prometia algo e não cumpria.
 *
 * ------------------------------------------------------------------
 * POR QUE `contact_messages`, E NÃO UMA TABELA NOVA
 * ------------------------------------------------------------------
 * A coleção já existe e tem um inbox pronto em `/admin/messages`. O que havia
 * sumido era o lado da escrita — `lib/repos/messages.ts` registra que "a
 * escrita saiu junto com a página /contact". A infraestrutura ficou esperando
 * um formulário público; o cupom é ele.
 *
 * Criar tabela para isto seria duplicar caixa de entrada: o Lucas passaria a
 * ter dois lugares para conferir quem escreveu.
 *
 * ------------------------------------------------------------------
 * VALIDAÇÃO
 * ------------------------------------------------------------------
 * Esta é uma fronteira de sistema aberta ao mundo: qualquer visitante pode
 * disparar esta action. Toda a validação acontece AQUI, no servidor, e não no
 * formulário: o cliente é conselho, o servidor é lei. Os tetos de tamanho
 * existem para que um envio automatizado não use o campo de recado como
 * depósito.
 *
 * Antes a escrita anônima era autorizada por uma policy de RLS
 * (`messages_public_insert`). Agora ela grava pelo Admin SDK — a permissão
 * deixou de ser declarativa no banco e passou a ser esta função, que é a única
 * porta e valida antes de gravar. As Storage/Firestore Rules negam escrita
 * direta de cliente justamente para que esta continue sendo a única entrada.
 */

import { z } from "zod"

import { criarDoc } from "@/lib/firebase/collection"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { coupon } from "@/lib/anfitriao-prophet"

/**
 * O que o formulário devolve à interface. Um estado, não uma exceção.
 *
 * `values` existe por causa de um comportamento do React 19: um `<form action>`
 * REINICIA os campos não controlados assim que a action termina — inclusive
 * quando ela recusa. Sem devolver o que foi digitado, uma recusa por um campo
 * apagava os outros cinco, e o leitor recomeçava do zero para corrigir uma
 * letra. O estado carrega os valores de volta e os campos os recebem como
 * `defaultValue`.
 */
export type CouponState =
  | { status: "idle" }
  | { status: "ok"; message: string }
  | {
      status: "error"
      message: string
      fields?: Record<string, string>
      values?: Record<string, string>
    }

const cadences = coupon.cadence.options.map((o) => o.id) as [string, ...string[]]

const schema = z.object({
  nome: z.string().trim().min(2, "Diga o nome que sai no rótulo.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Sem endereço, a folha não chega.")
    .max(200)
    .pipe(z.email("Esse endereço não parece de entrega.")),
  praca: z.string().trim().min(2, "Diga a praça e a rua.").max(200),
  cadencia: z.enum(cadences).catch(cadences[0]),
  // Os cadernos avulsos chegam como "on"/ausente, a forma do checkbox em HTML.
  classificados: z.coerce.boolean().catch(false),
  oficina: z.coerce.boolean().catch(false),
  recado: z.string().trim().max(500, "O recado passou de duas linhas.").optional(),
  /**
   * Armadilha de robô: um campo que a folha esconde do leitor e que só um
   * preenchedor automático toca. Vindo preenchido, o envio é descartado em
   * silêncio — responder "recusado" ensinaria o robô a contornar.
   */
  fecho: z.string().max(0).optional(),
})

/** Compõe o recado no idioma da casa — é isto que o admin lê no inbox. */
function compor(d: z.infer<typeof schema>) {
  const cadencia = coupon.cadence.options.find((o) => o.id === d.cadencia)?.label ?? d.cadencia
  const cadernos = [
    d.classificados && coupon.extras.options[0]?.label,
    d.oficina && coupon.extras.options[1]?.label,
  ].filter(Boolean)

  return [
    "Cupom de assinatura — O Anfitrião",
    `Praça e rua: ${d.praca}`,
    `Periodicidade: ${cadencia}`,
    `Cadernos avulsos: ${cadernos.length ? cadernos.join(", ") : "nenhum"}`,
    d.recado ? `\nRecado ao expedidor:\n${d.recado}` : null,
  ]
    .filter(Boolean)
    .join("\n")
}

/** O que o leitor digitou, para devolver intacto quando o cupom é recusado. */
function digitado(formData: FormData): Record<string, string> {
  const campos = ["nome", "email", "praca", "cadencia", "classificados", "oficina", "recado"]
  const out: Record<string, string> = {}
  for (const c of campos) {
    const v = formData.get(c)
    if (typeof v === "string") out[c] = v
  }
  return out
}

export async function assinarFolha(
  _anterior: CouponState,
  formData: FormData
): Promise<CouponState> {
  const parsed = schema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    praca: formData.get("praca"),
    cadencia: formData.get("cadencia"),
    classificados: formData.get("classificados"),
    oficina: formData.get("oficina"),
    recado: formData.get("recado"),
    fecho: formData.get("fecho"),
  })

  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const campo = String(issue.path[0] ?? "")
      if (campo && !fields[campo]) fields[campo] = issue.message
    }
    return {
      status: "error",
      message: "O cupom voltou do balcão: falta acertar o que está marcado.",
      fields,
      values: digitado(formData),
    }
  }

  // Armadilha tocada: agradece e não grava. Ver o comentário no schema.
  if (parsed.data.fecho) {
    return { status: "ok", message: "Cupom recebido. A primeira edição sai no próximo fecho." }
  }

  if (!isFirebaseAdminConfigured) {
    // Sem Firebase configurado o site inteiro roda em semente estática (ver
    // `lib/firebase/admin`). Dizer "enviado" aqui seria mentir ao leitor.
    return {
      status: "error",
      message: "O balcão está fechado nesta edição. Tente pelo endereço do expediente.",
      values: digitado(formData),
    }
  }

  try {
    await criarDoc("contact_messages", {
      name: parsed.data.nome,
      email: parsed.data.email,
      message: compor(parsed.data),
      read: false,
    })
  } catch {
    return {
      status: "error",
      message: "O cupom não chegou ao balcão. Tente de novo em instantes.",
      values: digitado(formData),
    }
  }

  return { status: "ok", message: "Cupom recebido. A primeira edição sai no próximo fecho." }
}
