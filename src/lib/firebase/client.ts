"use client"

/**
 * SDK web do Firebase — usado **exclusivamente para autenticação**.
 *
 * Nenhum dado é lido do Firestore pelo browser: os repositórios rodam no
 * servidor via Admin SDK. O que acontece aqui é o popup do GitHub OAuth; o ID
 * token resultante é trocado por um cookie de sessão em `/auth/callback`, e daí
 * em diante quem manda é o servidor.
 */
import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, GithubAuthProvider, type Auth } from "firebase/auth"

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  isFirebaseConfigured,
} from "./config"

function app(): FirebaseApp {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase não configurado (defina NEXT_PUBLIC_FIREBASE_API_KEY / _AUTH_DOMAIN / _PROJECT_ID).",
    )
  }
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
export function getClientAuth(): Auth {
  return getAuth(app())
}

/**
 * Provider do GitHub. `read:user` basta para obter o login — é o dado que a
 * allowlist compara. Não pedimos escopo de repositório.
 */
export function githubProvider(): GithubAuthProvider {
  const provider = new GithubAuthProvider()
  provider.addScope("read:user")
  return provider
}
