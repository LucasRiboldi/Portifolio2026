import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

/**
 * Config dos testes unitários (node, lógica pura).
 *
 * Separado de `vitest.config.ts` de propósito: aquele carrega o plugin do
 * Storybook (browser + playwright), que é pesado e hoje falha na inicialização
 * por uma dependência quebrada do react-docgen. Um teste de função pura não
 * deve depender disso para rodar.
 *
 * Uso: `npm run test:unit`
 */
const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    name: "unit",
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.join(dirname, "src"),
      // `server-only` é um shim do Next e não resolve fora dele.
      "server-only": path.join(dirname, "tests/stubs/server-only.ts"),
    },
  },
})
