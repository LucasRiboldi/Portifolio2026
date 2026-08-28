import 'server-only';

import { CACHE_TAGS } from './tags';
import { publishedReader } from './utils';
import {
  artworks as artworksSeed,
  comics as comicsSeed,
  movies as moviesSeed,
  notes as notesSeed,
  strips as stripsSeed,
  tracks as tracksSeed,
  videos as videosSeed,
  type Artwork,
  type Comic,
  type Movie,
  type Note,
  type Strip,
  type Track,
  type Video,
} from '@/data/criativo-zones';

/**
 * Leitores das zonas da landing /criativo.
 *
 * Cada um cai no seed de `data/criativo-zones.ts` quando não há Supabase
 * configurado ou a consulta falha — a página nunca aparece vazia, nem em
 * ambiente novo. É o mesmo contrato que `repos/projects.ts` já usava; os
 * leitores do realm Dev devolvem `[]` nesse caso porque lá a secção some
 * inteira, aqui a zona faz parte da narrativa da página.
 */
export const getArtworks = publishedReader<Artwork>('artworks', CACHE_TAGS.artworks, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: artworksSeed,
});
export const getComics = publishedReader<Comic>('comics', CACHE_TAGS.comics, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: comicsSeed,
});
export const getMovies = publishedReader<Movie>('movies', CACHE_TAGS.movies, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: moviesSeed,
});
export const getTracks = publishedReader<Track>('tracks', CACHE_TAGS.tracks, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: tracksSeed,
});
export const getVideos = publishedReader<Video>('videos', CACHE_TAGS.videos, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: videosSeed,
});
export const getNotes = publishedReader<Note>('notes', CACHE_TAGS.notes, {
  // Fixados primeiro: o mural começa pelo que deve ser lido antes.
  order: 'pinned',
  asc: false,
  secondaryOrder: 'created_at',
  seed: notesSeed,
});
export const getStrips = publishedReader<Strip>('strips', CACHE_TAGS.strips, {
  order: 'sort',
  asc: true,
  secondaryOrder: 'created_at',
  seed: stripsSeed,
});

export type { Artwork, Comic, Movie, Note, Strip, Track, Video };
