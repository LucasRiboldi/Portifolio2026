/**
 * Portal de Entrada — persistência (localStorage).
 * Gate de "uma vez por navegador" para a rota `/portal`.
 */

export const PORTAL_KEY = "lr.portal.v1"

export function hasEntered(): boolean {
  try {
    return localStorage.getItem(PORTAL_KEY) === "1"
  } catch {
    return false
  }
}

export function markEntered(): void {
  try {
    localStorage.setItem(PORTAL_KEY, "1")
  } catch {
    /* localStorage indisponível — ignora */
  }
}
