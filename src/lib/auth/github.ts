import "server-only"

/**
 * Resolve o *login* do GitHub a partir do id numérico que o Firebase guarda
 * como `providerData[].uid`.
 *
 * Existe porque o Firebase não propaga o username do GitHub para o ID token —
 * só o id numérico, que é imutável. A API pública `/user/{id}` faz a tradução.
 * É consultada apenas na criação da sessão; depois o valor vira custom claim.
 *
 * Usar o id numérico como âncora é, aliás, mais robusto que o arranjo anterior:
 * se você renomear a conta no GitHub, a identidade continua a mesma.
 */

const GITHUB_API = "https://api.github.com/user"

export async function githubLoginFromProviderId(providerId: string): Promise<string | null> {
  if (!/^\d+$/.test(providerId)) return null

  try {
    const res = await fetch(`${GITHUB_API}/${providerId}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portifolio-admin",
        // Opcional: eleva o rate limit de 60/h para 5000/h quando disponível.
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      // O login é estável; um dia de cache evita gastar rate limit à toa.
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { login?: string }
    return data.login ?? null
  } catch {
    return null
  }
}
