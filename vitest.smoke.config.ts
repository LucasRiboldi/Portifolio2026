import { defineConfig } from "vitest/config"

/**
 * Config da suíte de fumaça — exercita os portões contra o Next de verdade.
 *
 * Separada das outras duas pelo mesmo motivo que a de integração: depende de
 * infraestrutura (aqui, um servidor no ar). `npm run test:unit` continua sem
 * rede, sem credencial e sem processo externo, que é a regra do projeto.
 *
 * Não usa alias de `@`: os testes falam com o app por HTTP, não importam nada
 * de `src/`. É de propósito — assim a suíte enxerga o app como o navegador
 * enxerga, e não pelo lado de dentro.
 */
export default defineConfig({
  test: {
    name: "smoke",
    environment: "node",
    include: ["tests-smoke/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
