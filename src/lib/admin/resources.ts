/**
 * Configuração declarativa dos recursos de conteúdo do /admin.
 * Um único config dirige: colunas da lista, campos do formulário, validação
 * (zod) e a tag de cache a revalidar. Adicionar uma entidade = uma entrada
 * num dos arquivos de definição.
 *
 * A configuração foi partida em três para respeitar o teto de 500 linhas:
 *  - resource-types.ts       — tipos (FieldConfig/ResourceConfig) e helpers zod
 *  - resource-defs-content.ts — os 10 recursos de conteúdo textual
 *  - resource-defs-media.ts   — os 10 recursos de mídia / realm Anfitrião
 * Este arquivo continua sendo a porta pública: reexporta os tipos e monta o
 * mapa RESOURCES, mantendo resourceTable()/getResource() e os imports antigos
 * (`@/lib/admin/resources`) intactos.
 */
import type { ResourceConfig } from "./resource-types"
import { CONTENT_RESOURCES } from "./resource-defs-content"
import { MEDIA_RESOURCES } from "./resource-defs-media"

export type { FieldType, FieldConfig, ResourceConfig } from "./resource-types"

export const RESOURCES: Record<string, ResourceConfig> = {
  ...CONTENT_RESOURCES,
  ...MEDIA_RESOURCES,
}

/** Recurso destino do "table" no Supabase (nem sempre == slug). */
const TABLE_MAP: Record<string, string> = {
  lab: "lab_experiments",
  tutorials: "prophet_tutorials",
  mechanics: "prophet_mechanics",
  prototypes: "prophet_prototypes",
  resources: "prophet_resources",
}
export function resourceTable(slug: string): string {
  return TABLE_MAP[slug] ?? slug
}

export function getResource(slug: string): ResourceConfig | null {
  return RESOURCES[slug] ?? null
}
