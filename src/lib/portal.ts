/** Persistência da porta de entrada (uma vez por navegador). */
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
