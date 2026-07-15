import "server-only"

import { unstable_cache } from "next/cache"

import { createPublicClient } from "@/lib/supabase/public"
import { CACHE_TAGS } from "./tags"

export interface TutorialRow {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  difficulty: string
  tags: string[]
}
export interface MechanicRow {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  tags: string[]
}
export interface PrototypeRow {
  id: string
  title: string
  description: string
  status: string
  players: string
  playtime: string
  tags: string[]
}
export interface ResourceRow {
  id: string
  title: string
  description: string
  type: string
  file_url: string | null
}
export interface ProphetAbout {
  author: string
  intro: string
  passion: string
  proposal: string
}

function reader<T>(table: string, tag: string, order: string, asc: boolean) {
  return unstable_cache(
    async (): Promise<T[]> => {
      const supabase = createPublicClient()
      if (!supabase) return []
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("published", true)
        .order(order, { ascending: asc })
      if (error || !data) return []
      return data as T[]
    },
    [table],
    { tags: [tag] },
  )
}

export const getTutorials = reader<TutorialRow>("prophet_tutorials", CACHE_TAGS.tutorials, "sort", true)
export const getMechanics = reader<MechanicRow>("prophet_mechanics", CACHE_TAGS.mechanics, "sort", true)

export async function getTutorialBySlug(slug: string): Promise<TutorialRow | undefined> {
  return (await getTutorials()).find((t) => t.slug === slug)
}
export async function getMechanicBySlug(slug: string): Promise<MechanicRow | undefined> {
  return (await getMechanics()).find((m) => m.slug === slug)
}
export const getPrototypes = reader<PrototypeRow>("prophet_prototypes", CACHE_TAGS.prototypes, "sort", true)
export const getResources = reader<ResourceRow>("prophet_resources", CACHE_TAGS.resources, "sort", true)

const FALLBACK_ABOUT: ProphetAbout = {
  author: "Lucas Riboldi",
  intro: "Designer de jogos que transforma regras em rituais jogáveis.",
  passion:
    "Uma paixão antiga por jogos de tabuleiro, card games e RPG — e pela mágica de ver estranhos virarem rivais e amigos ao redor de uma mesa.",
  proposal:
    "Este jornal reúne tutoriais, mecânicas comentadas, protótipos em teste e materiais para você imprimir e jogar.",
}

export const getProphetAbout = unstable_cache(
  async (): Promise<ProphetAbout> => {
    const supabase = createPublicClient()
    if (!supabase) return FALLBACK_ABOUT
    const { data, error } = await supabase
      .from("prophet_about")
      .select("*")
      .eq("id", "default")
      .maybeSingle()
    if (error || !data) return FALLBACK_ABOUT
    return {
      author: data.author || FALLBACK_ABOUT.author,
      intro: data.intro || FALLBACK_ABOUT.intro,
      passion: data.passion || FALLBACK_ABOUT.passion,
      proposal: data.proposal || FALLBACK_ABOUT.proposal,
    }
  },
  ["prophet-about"],
  { tags: [CACHE_TAGS.prophetAbout] },
)
