/**
 * PROPHET WIRE — autenticação do gatilho de cron (Parte 12).
 *
 * O endpoint que dispara o pipeline é público na internet: sem proteção,
 * qualquer um poderia forçar execuções (custo de IA, rede, escrita no acervo).
 * A Vercel Cron envia `Authorization: Bearer $CRON_SECRET` em cada chamada
 * agendada; este módulo valida esse cabeçalho.
 *
 * Duas decisões deliberadas de segurança:
 *
 *   • FALHA FECHADA — sem `CRON_SECRET` no ambiente, NADA é autorizado. Um
 *     segredo ausente nunca vira "libera geral".
 *   • COMPARAÇÃO EM TEMPO CONSTANTE — compara digests SHA-256 de tamanho fixo
 *     com `timingSafeEqual`, para não vazar o segredo por diferença de tempo
 *     (e para tolerar tamanhos distintos, que fariam `timingSafeEqual` lançar).
 *
 * O segredo nunca é logado nem devolvido em resposta.
 */

import { createHash, timingSafeEqual } from "node:crypto"

/** Motivo da recusa — para o endpoint responder e logar sem vazar o segredo. */
export type CronAuthResult =
  | { authorized: true }
  | { authorized: false; reason: "sem-segredo-configurado" | "cabecalho-ausente" | "segredo-invalido" }

/** Digest de tamanho fixo, para comparar sem revelar o comprimento do segredo. */
function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest()
}

/** Compara dois textos em tempo constante. */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b))
}

/**
 * Autoriza (ou não) uma chamada ao gatilho do pipeline.
 *
 * @param authorizationHeader valor cru do cabeçalho `Authorization`
 * @param secret segredo esperado; por padrão `process.env.CRON_SECRET`
 */
export function authorizeCron(
  authorizationHeader: string | null,
  secret: string | undefined = process.env.CRON_SECRET,
): CronAuthResult {
  // Falha fechada: sem segredo configurado, ninguém entra.
  if (!secret || !secret.trim()) {
    return { authorized: false, reason: "sem-segredo-configurado" }
  }

  const prefix = "Bearer "
  if (!authorizationHeader || !authorizationHeader.startsWith(prefix)) {
    return { authorized: false, reason: "cabecalho-ausente" }
  }

  const presented = authorizationHeader.slice(prefix.length)
  if (!safeEqual(presented, secret)) {
    return { authorized: false, reason: "segredo-invalido" }
  }

  return { authorized: true }
}
