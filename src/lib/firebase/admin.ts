import "server-only"

/**
 * Firebase Admin SDK — a única porta de entrada para o Firestore.
 *
 * Decisão de arquitetura: **todo acesso a dados passa por aqui**, no servidor.
 * O SDK web (`client.ts`) cuida apenas do login. Isso mantém a superfície de
 * ataque mínima — nenhum documento é lido pelo browser — e é por isso que as
 * Security Rules em `firestore.rules` podem ser tão restritivas: elas guardam a
 * porta que o app não usa, em vez de serem a defesa principal.
 *
 * O Storage do Firebase não é usado: exige o plano Blaze, e o projeto roda no
 * gratuito. A mídia do painel vai para o Vercel Blob — ver
 * `app/admin/media/actions.ts`.
 *
 * O Admin SDK ignora Security Rules por definição. A autorização real do painel
 * continua sendo `requireAdmin()`, chamado no topo de toda Server Action.
 *
 * Credencial, em ordem de preferência:
 *  1. `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` (produção/Vercel);
 *  2. `serviceAccountKey.json` na raiz (desenvolvimento — gitignored);
 *  3. Application Default Credentials (`GOOGLE_APPLICATION_CREDENTIALS`).
 */
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import { getAuth, type Auth } from "firebase-admin/auth"

import { FIREBASE_PROJECT_ID } from "./config"

const KEY_FILE = resolve(process.cwd(), "serviceAccountKey.json")

interface ServiceAccount {
  project_id: string
  client_email: string
  private_key: string
}

/** Lê a service account do arquivo local, se existir. */
function fromFile(): ServiceAccount | null {
  if (!existsSync(KEY_FILE)) return null
  try {
    return JSON.parse(readFileSync(KEY_FILE, "utf8")) as ServiceAccount
  } catch {
    return null
  }
}

/** Monta a service account a partir das env vars, se completas. */
function fromEnv(): ServiceAccount | null {
  const project_id = process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID
  const client_email = process.env.FIREBASE_CLIENT_EMAIL
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!project_id || !client_email || !raw) return null
  // A chave viaja em uma linha só nas env vars: os \n vêm escapados.
  return { project_id, client_email, private_key: raw.replace(/\\n/g, "\n") }
}

function serviceAccount(): ServiceAccount | null {
  return fromEnv() ?? fromFile()
}

/** True quando existe alguma credencial utilizável. Repos usam para cair no seed. */
export const isFirebaseAdminConfigured = Boolean(
  serviceAccount() || process.env.GOOGLE_APPLICATION_CREDENTIALS,
)

/**
 * App Admin como singleton. O Next reaproveita o módulo entre requests em dev
 * (HMR) e entre invocações em serverless — reinicializar lançaria erro.
 */
function app(): App {
  const existente = getApps()[0]
  if (existente) return existente

  const sa = serviceAccount()

  if (sa) {
    return initializeApp({
      credential: cert({
        projectId: sa.project_id,
        clientEmail: sa.client_email,
        privateKey: sa.private_key,
      }),
      projectId: sa.project_id,
    })
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
      projectId: FIREBASE_PROJECT_ID || undefined,
    })
  }

  throw new Error(
    "Firebase Admin não configurado: defina FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY " +
      "ou coloque serviceAccountKey.json na raiz do projeto.",
  )
}

/** Firestore administrativo. Lança se não houver credencial. */
export function getDb(): Firestore {
  return getFirestore(app())
}

/** Firestore, ou null quando não configurado — para os repos com fallback no seed. */
export function getDbOrNull(): Firestore | null {
  if (!isFirebaseAdminConfigured) return null
  try {
    return getDb()
  } catch {
    return null
  }
}

/** Auth administrativo (verificação de session cookie, custom claims). */
export function getAdminAuth(): Auth {
  return getAuth(app())
}

