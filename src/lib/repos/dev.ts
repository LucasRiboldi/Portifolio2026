import 'server-only';

import { devlogs as devlogsSeed } from '@/data/dev';
import { CACHE_TAGS } from './tags';
import { publishedReader } from './utils';

export interface DevlogRow {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string;
  tags: string[];
}
export interface SnippetRow {
  id: string;
  title: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
}
export interface LabRow {
  id: string;
  title: string;
  description: string;
  status: string;
  stack: string[];
  demo_url: string | null;
  repo_url: string | null;
}

const devlogsSeedComId = devlogsSeed.map((d) => ({ ...d, id: d.slug }));

/**
 * Devlogs — o único leitor deste arquivo com rede embaixo.
 *
 * Os três nasceram iguais: `data ?? []`, sem fallback. Isso bastava enquanto o
 * devlog era uma faixa opcional na home — lista vazia, seção some, ninguém
 * percebe. Com rota própria (`/desenvolvedor/devlog`) o cálculo mudou: uma
 * PÁGINA vazia é promessa quebrada, e "o site funciona com ou sem backend" é a
 * regra central deste projeto.
 *
 * `id` vira o slug porque o seed não tem identificador próprio — e o slug já é
 * a chave natural que o sync do /admin usa para comparar.
 *
 * Snippets e lab seguem sem fallback de propósito: os dois têm página que
 * trata o vazio com uma frase acionável ("adicione em /admin/…"), o que aqui
 * não caberia — o devlog versionado EXISTE, e escondê-lo seria mentir sobre o
 * acervo.
 */
export const getDevlogs = publishedReader<DevlogRow>(
  'devlogs',
  CACHE_TAGS.devlogs,
  { order: 'date', asc: false, seed: devlogsSeedComId }
);

/** Um devlog pelo slug (reaproveita a lista, que já é cacheada). */
export async function getDevlogBySlug(
  slug: string
): Promise<DevlogRow | undefined> {
  const todos = await getDevlogs();
  return todos.find((d) => d.slug === slug);
}

export const getSnippets = publishedReader<SnippetRow>(
  'snippets',
  CACHE_TAGS.snippets,
  { order: 'sort', asc: true }
);
export const getLab = publishedReader<LabRow>(
  'lab_experiments',
  CACHE_TAGS.lab,
  { order: 'sort', asc: true }
);
