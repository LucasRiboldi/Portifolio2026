import 'server-only';

import { unstable_cache } from 'next/cache';

import { buscarLinhas } from '@/lib/firebase/query';

interface PublishedReaderOptions<T, R> {
  /** Campo de ordenação primário. */
  order: string;
  /** Ascendente por padrão; `false` para descendente. */
  asc?: boolean;
  /** Ordenação secundária, para desempate estável (ex.: 'created_at'). */
  secondaryOrder?: string;
  /** Devolvido quando não há nada publicado. Sem isto, o leitor devolve `[]`. */
  seed?: R[];
  /**
   * `true`: uma lista publicada vazia é o resultado real, não cai no seed —
   * só `null`/erro caem. `false` (padrão): lista vazia também é tratada como
   * "nada publicado ainda".
   */
  treatEmptyAsPublished?: boolean;
  /** Transforma cada linha crua antes de devolver (ex.: `rowToProject`). */
  map?: (row: T) => R;
}

/**
 * Cria um leitor público cacheado (`published=true`) para uma tabela, com
 * fallback opcional ao seed quando não há nada publicado.
 *
 * Extraído em 28/08/2026: `repos/dev.ts`, `repos/criativo.ts`,
 * `repos/prophet.ts` e `repos/projects.ts` reimplementavam esta mesma leitura
 * com pequenas variações. Nenhuma delas teve o comportamento alterado nesta
 * extração — inclusive a diferença entre `projects.ts` (só `null` cai no
 * seed) e os demais (lista vazia também cai) foi preservada via
 * `treatEmptyAsPublished`.
 */
export function publishedReader<T, R = T>(
  table: string,
  tag: string,
  options: PublishedReaderOptions<T, R>
) {
  const {
    order,
    asc = true,
    secondaryOrder,
    seed,
    treatEmptyAsPublished = false,
    map,
  } = options;

  return unstable_cache(
    async (): Promise<R[]> => {
      const orderBy = secondaryOrder
        ? [{ campo: order, asc }, { campo: secondaryOrder }]
        : [{ campo: order, asc }];
      const data = await buscarLinhas<T>(table, {
        where: [{ campo: 'published', valor: true }],
        orderBy,
      });

      const semNada = treatEmptyAsPublished
        ? !data
        : !data || data.length === 0;
      if (semNada) return seed ?? [];

      return map ? data!.map(map) : (data as unknown as R[]);
    },
    [table],
    { tags: [tag] }
  );
}
