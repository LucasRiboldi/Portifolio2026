/**
 * Configuração/estado do Firebase compartilhado pelos clientes e repositórios.
 *
 * Como no arranjo anterior, o site funciona COM ou SEM Firebase conectado:
 * enquanto as env vars não existem, os repositórios caem no seed estático
 * (`src/data/*.ts`). O build permanece verde e o CMS "liga" quando o projeto
 * Firebase é configurado.
 *
 * Duas configurações independentes:
 *  - **client** (`NEXT_PUBLIC_FIREBASE_*`): só o Auth roda no browser.
 *  - **admin** (service account): todo acesso a dados. Ver `admin.ts`.
 */

export const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ""
export const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? ""
export const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""
export const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ""
export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? ""
export const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""

/** True quando o SDK web pode inicializar (login no browser). */
export const isFirebaseConfigured = Boolean(
  FIREBASE_API_KEY && FIREBASE_AUTH_DOMAIN && FIREBASE_PROJECT_ID,
)

// `isFirebaseAdminConfigured` mora em `admin.ts`: a detecção envolve o
// filesystem (serviceAccountKey.json) e este módulo é importado pelo browser.

/** Login do GitHub único autorizado no /admin. */
export const ADMIN_GITHUB_LOGIN = (process.env.ADMIN_GITHUB_LOGIN ?? "").toLowerCase()

/** Nome do cookie de sessão emitido pelo Admin SDK (ver `lib/auth/session.ts`). */
export const SESSION_COOKIE = "__session"

/** Validade do cookie de sessão. 5 dias é o teto que o Firebase aceita (14d). */
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000
