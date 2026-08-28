import 'server-only';

import type { ProjectRow } from '@/lib/firebase/types';
import { projects as seed, type Project } from '@/data/projects';
import { CACHE_TAGS } from './tags';
import { publishedReader } from './utils';

type ProjectRowExt = ProjectRow & {
  slug?: string | null;
  readme?: string | null;
};

function rowToProject(r: ProjectRowExt): Project {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags ?? [],
    coverImage: r.cover_image ?? '',
    href: r.href ?? undefined,
    featured: r.featured,
    slug: r.slug ?? undefined,
    readme: r.readme ?? undefined,
  };
}

/** Projetos publicados para o site público (cacheado, com fallback ao seed). */
export const getProjects = publishedReader<ProjectRowExt, Project>(
  'projects',
  CACHE_TAGS.projects,
  {
    order: 'sort',
    secondaryOrder: 'created_at',
    seed,
    // 0 projetos publicados de verdade é um resultado válido — só null/erro
    // caem no seed, ao contrário dos demais leitores desta camada.
    treatEmptyAsPublished: true,
    map: rowToProject,
  }
);

/** Um projeto pelo slug (usa a lista cacheada). */
export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}
