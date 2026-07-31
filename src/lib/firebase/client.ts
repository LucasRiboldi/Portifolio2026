"use client"

/**
 * SDK web do Firebase — usado **exclusivamente para autenticação**.
 *
 * Nenhum dado é lido do Firestore pelo browser: os repositórios rodam no
 * servidor via Admin SDK. O que acontece aqui é o popup do GitHub OAuth; o ID
 * token resultante é trocado por um cookie de sessão em `/auth/callback`, e daí
 * em diante quem manda é o servidor.
 *
 * ------------------------------------------------------------------
 * POR QUE OS IMPORTS SÃO DINÂMICOS
 * ------------------------------------------------------------------
 * O pacote `firebase` é ESM puro. Um componente cliente é renderizado no
 * servidor para gerar o HTML inicial — "use client" delimita a hidratação, não
 * impede o SSR —, então um `import` estático aqui faria o módulo ESM ser
 * carregado no servidor. No bundle serverless da Vercel isso vira um `require()`
 * de ESM e o runtime recusa:
 *
 *   Error: require() of ES Module /var/task/node_modules/...
 *
 * Isso não aparece em `next dev`, em `next build` nem em `next start`: o Node
 * resolve os dois formatos sem ajuda. Só quebrou em produção, e só no `/login`
 * — a única rota dinâmica que renderiza um componente cliente que toca este
 * módulo. As demais páginas que usam o estado de login são estáticas, então o
 * SSR delas aconteceu no build.
 *
 * Carregar sob demanda resolve na raiz: o SDK só é buscado quando alguém
 * realmente vai autenticar, no browser. De brinde, sai do bundle inicial.
 */
import type { FirebaseApp } from "firebase/app"
import type { Auth, GithubAuthProvider } from "firebase/auth"

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  isFirebaseConfigured,
} from "./config"

async function app(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase não configurado (defina NEXT_PUBLIC_FIREBASE_API_KEY / _AUTH_DOMAIN / _PROJECT_ID).",
    )
  }
  const { getApps, getApp, initializeApp } = await import("firebase/app")
  return getApps().length
    ? getApp()
    : initializeApp({
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
      })
}

/** Auth do browser. Lança quando o Firebase não está configurado. */
export async function getClientAuth(): Promise<Auth> {
  const { getAuth } = await import("firebase/auth")
  return getAuth(await app())
}

/**
 * Provider do GitHub. `read:user` basta para obter o login — é o dado que a
 * allowlist compara. Não pedimos escopo de repositório.
 */
export async function githubProvider(): Promise<GithubAuthProvider> {
  const { GithubAuthProvider } = await import("firebase/auth")
  const provider = new GithubAuthProvider()
  provider.addScope("read:user")
  return provider
}

/** Abre o popup de login. Reexportado para o chamador não importar o SDK. */
export async function signInComGithub() {
  const { signInWithPopup } = await import("firebase/auth")
  const auth = await getClientAuth()
  return { auth, credencial: await signInWithPopup(auth, await githubProvider()) }
}

/** Observa o estado de login. Devolve a função de cancelamento. */
export async function observarLogin(cb: (logado: boolean) => void): Promise<() => void> {
  const { onAuthStateChanged } = await import("firebase/auth")
  return onAuthStateChanged(await getClientAuth(), (user) => cb(Boolean(user)))
}
