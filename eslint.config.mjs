// Flat config (ESLint 9) — ESM.
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * Faz a ponte para o shareable config eslintrc do Next via FlatCompat,
 * preservando "next/core-web-vitals". Inclui as regras do Storybook.
 */
const config = [
  ...compat.extends("next/core-web-vitals"),
  ...storybook.configs["flat/recommended"],
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "node_modules/**",
      "next-env.d.ts",
      // /public é asset servido, não código nosso: inclui o sistema
      // poke-holo vendorizado e os clones de referência dos efeitos holo.
      // (o tsconfig exclui a mesma pasta, pelo mesmo motivo)
      "public/**",
    ],
  },
];

export default config;
