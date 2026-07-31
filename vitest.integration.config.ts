import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

/**
 * Config dos testes de integração da camada de dados.
 *
 * Separado da suíte unitária porque estes testes exigem infraestrutura: o
 * emulador do Firestore precisa estar no ar. A unitária continua rodando sem
 * rede e sem credencial, que é a regra do projeto — misturar as duas tornaria
 * `npm run test:unit` dependente de um processo externo.
 *
 * Por que existem: os 535 testes unitários mockam `lib/firebase/query`, então
 * nada exercitava `collection.ts` de verdade. `criarDoc`, `atualizarOnde`,
 * `gravarLote` e o envelope de arrays aninhados eram código nunca executado
 * contra um Firestore real — e o envelope é justamente o tipo de coisa que um
 * mock não pega, porque o mock não tem a restrição que o motiva.
 *
 * Uso: `npm run test:integration` (sobe o emulador e roda).
 */
const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    name: "integration",
    environment: "node",
    include: ["tests-integration/**/*.test.ts"],
    // O emulador é um processo só: rodar arquivos em paralelo faria os testes
    // disputarem as mesmas coleções.
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
  resolve: {
    alias: {
      "@": path.join(dirname, "src"),
      "server-only": path.join(dirname, "tests/stubs/server-only.ts"),
    },
  },
})
