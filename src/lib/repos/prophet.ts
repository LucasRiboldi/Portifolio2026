import 'server-only';

import { unstable_cache } from 'next/cache';

import { buscarPorId } from '@/lib/firebase/query';
import { CACHE_TAGS } from './tags';
import { publishedReader } from './utils';

export interface TutorialRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  difficulty: string;
  tags: string[];
}
export interface MechanicRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
}
export interface PrototypeRow {
  id: string;
  title: string;
  description: string;
  status: string;
  players: string;
  playtime: string;
  tags: string[];
}
export interface ResourceRow {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
}
export interface ProphetAbout {
  author: string;
  intro: string;
  passion: string;
  proposal: string;
}

export const getTutorials = publishedReader<TutorialRow>(
  'prophet_tutorials',
  CACHE_TAGS.tutorials,
  { order: 'sort', asc: true }
);
export const getMechanics = publishedReader<MechanicRow>(
  'prophet_mechanics',
  CACHE_TAGS.mechanics,
  { order: 'sort', asc: true }
);

export async function getTutorialBySlug(
  slug: string
): Promise<TutorialRow | undefined> {
  return (await getTutorials()).find((t) => t.slug === slug);
}
export async function getMechanicBySlug(
  slug: string
): Promise<MechanicRow | undefined> {
  return (await getMechanics()).find((m) => m.slug === slug);
}
export const getPrototypes = publishedReader<PrototypeRow>(
  'prophet_prototypes',
  CACHE_TAGS.prototypes,
  { order: 'sort', asc: true }
);
export const getResources = publishedReader<ResourceRow>(
  'prophet_resources',
  CACHE_TAGS.resources,
  { order: 'sort', asc: true }
);

const FALLBACK_ABOUT: ProphetAbout = {
  author: 'Lucas Riboldi',
  intro: 'Designer de jogos que transforma regras em rituais jogáveis.',
  passion:
    'Uma paixão antiga por jogos de tabuleiro, card games e RPG — e pela mágica de ver estranhos virarem rivais e amigos ao redor de uma mesa.',
  proposal:
    'Este jornal reúne tutoriais, mecânicas comentadas, protótipos em teste e materiais para você imprimir e jogar.',
};

export const getProphetAbout = unstable_cache(
  async (): Promise<ProphetAbout> => {
    const data = await buscarPorId<{
      author?: string;
      intro?: string;
      passion?: string;
      proposal?: string;
    }>('prophet_about', 'default');
    if (!data) return FALLBACK_ABOUT;
    return {
      author: data.author || FALLBACK_ABOUT.author,
      intro: data.intro || FALLBACK_ABOUT.intro,
      passion: data.passion || FALLBACK_ABOUT.passion,
      proposal: data.proposal || FALLBACK_ABOUT.proposal,
    };
  },
  ['prophet-about'],
  { tags: [CACHE_TAGS.prophetAbout] }
);
