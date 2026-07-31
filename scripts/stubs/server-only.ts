/**
 * Stub de `server-only` para os scripts de linha de comando.
 *
 * O pacote real é fornecido pelo Next durante o build: ele existe para EXPLODIR
 * se um módulo servidor for arrastado para o bundle do cliente. Fora do Next não
 * há bundle de cliente nem resolução para ele — e os scripts importam módulos
 * que o declaram (`lib/admin/seed.ts` e companhia).
 *
 * O stub é aplicado só por `tsconfig.scripts.json`, nunca pelo tsconfig do app:
 * mapear `server-only` globalmente desarmaria a proteção onde ela importa.
 */
export {}
