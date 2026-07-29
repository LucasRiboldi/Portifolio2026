/**
 * Data ISO (só o dia) → texto em português.
 *
 * `timeZone: "UTC"` não é detalhe: a data dos artigos e devlogs é um DIA, sem
 * hora. Sem fixar o fuso, `new Date("2026-03-01")` é meia-noite UTC, e para
 * quem está a oeste de Greenwich — o Brasil inteiro — isso cai em 28 de
 * fevereiro. O post publicado no dia primeiro apareceria datado do dia
 * anterior, e só para alguns leitores.
 */
export function formatarData(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}
