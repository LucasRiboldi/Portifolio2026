/**
 * Constantes de UI do upload de mídia — seguras para o client.
 *
 * Ficam separadas de `media-validate.ts` (que é `server-only`): o `accept` e o
 * texto de ajuda são só conveniência para o usuário escolher o arquivo certo.
 * A validação que vale é a do servidor, por magic bytes.
 */

/** Filtro do seletor de arquivos. Espelha os formatos aceitos no servidor. */
export const ACCEPT_ATTR = "image/png,image/jpeg,image/gif,image/webp,image/avif"

export const ACCEPTED_HINT = "PNG, JPEG, GIF, WebP ou AVIF · até 5 MB"
