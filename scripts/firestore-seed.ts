#!/usr/bin/env tsx
/**
 * Popula o Firestore com o conteúdo versionado em `src/data/*.ts`.
 *
 * Existe por causa de um ovo-e-galinha: o painel `/admin` já tem o botão
 * "Popular banco", mas ele exige estar logado — e o login depende do Firebase
 * Auth estar habilitado e do conteúdo do site já responder. Num projeto novo
 * nada disso vale ainda. Este script faz o mesmo trabalho pela linha de
 * comando, usando a service account direto.
 *
 * Reaproveita `seedDatabase()` de propósito: duplicar as regras de conversão
 * aqui seria criar uma segunda verdade que diverge na primeira manutenção.
 *
 * Uso:
 *   npm run db:seed          # popula coleções vazias (idempotente)
 *   npm run db:seed -- --sync  # insere o que falta em coleções já populadas
 *
 * Credencial: `serviceAccountKey.json` na raiz, ou FIREBASE_CLIENT_EMAIL +
 * FIREBASE_PRIVATE_KEY no ambiente. Ver `src/lib/firebase/admin.ts`.
 */
import { seedDatabase } from "@/lib/admin/seed"
import { syncNewContent } from "@/lib/admin/sync-content"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"

async function main() {
  if (!isFirebaseAdminConfigured) {
    console.error(
      "✗ Firebase Admin não configurado.\n" +
        "  Coloque serviceAccountKey.json na raiz do projeto, ou defina\n" +
        "  FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no ambiente.",
    )
    process.exit(1)
  }

  const sync = process.argv.includes("--sync")

  if (sync) {
    console.log("Sincronizando conteúdo novo…\n")
    const report = await syncNewContent()
    for (const [colecao, itens] of Object.entries(report.inseridos)) {
      if (itens.length) console.log(`✓ ${colecao}: ${itens.length} inserido(s)`)
    }
    const falhas = Object.entries(report.falhas)
    if (falhas.length) {
      console.log("")
      for (const [colecao, motivo] of falhas) console.error(`✗ ${colecao}: ${motivo}`)
      process.exit(1)
    }
    console.log("\nSincronização concluída.")
    return
  }

  console.log("Populando coleções vazias…\n")
  const report = await seedDatabase()
  for (const [colecao, resultado] of Object.entries(report)) {
    const texto = resultado === "já populada" ? "já tinha conteúdo, intacta" : `${resultado} documento(s)`
    console.log(`${resultado === "já populada" ? "•" : "✓"} ${colecao}: ${texto}`)
  }
  console.log("\nSeed concluído.")
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err)
  process.exit(1)
})
