import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { CACHE_TAGS } from "./tags"
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
} from "@/data/criativo-zones"

/**
 * Leitores das zonas da landing /criativo.
 *
 * Cada um cai no seed de `data/criativo-zones.ts` quando não há Supabase
 * configurado ou a consulta falha — a página nunca aparece vazia, nem em
 * ambiente novo. É o mesmo contrato que `repos/projects.ts` já usava; os
 * leitores do realm Dev devolvem `[]` nesse caso porque lá a secção some
 * inteira, aqui a zona faz parte da narrativa da página.
 */
function publishedReader<T>(
  table: string,
  tag: string,
  order: string,
  ascending: boolean,
  seed: T[],
) {
  return unstable_cache(
    async (): Promise<T[]> => {
      const supabase = createPublicClient()
      if (!supabase) return seed

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("published", true)
        .order(order, { ascending })
        .order("created_at", { ascending: true })

      if (error || !data || data.length === 0) return seed
      return data as T[]
    },
    [table],
    { tags: [tag] },
  )
}

export const getArtworks = publishedReader<Artwork>(
  "artworks", CACHE_TAGS.artworks, "sort", true, artworksSeed,
)
export const getComics = publishedReader<Comic>(
  "comics", CACHE_TAGS.comics, "sort", true, comicsSeed,
)
export const getMovies = publishedReader<Movie>(
  "movies", CACHE_TAGS.movies, "sort", true, moviesSeed,
)
export const getTracks = publishedReader<Track>(
  "tracks", CACHE_TAGS.tracks, "sort", true, tracksSeed,
)
export const getVideos = publishedReader<Video>(
  "videos", CACHE_TAGS.videos, "sort", true, videosSeed,
)
export const getNotes = publishedReader<Note>(
  // Fixados primeiro: o mural começa pelo que deve ser lido antes.
  "notes", CACHE_TAGS.notes, "pinned", false, notesSeed,
)
export const getStrips = publishedReader<Strip>(
  "strips", CACHE_TAGS.strips, "sort", true, stripsSeed,
)

export type { Artwork, Comic, Movie, Note, Strip, Track, Video }
