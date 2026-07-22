/**
 * Tipos e helpers zod compartilhados pela configuração de recursos do /admin.
 * Extraídos de resources.ts para manter cada arquivo sob 500 linhas — os dois
 * arquivos de definição (resource-defs-*) e o próprio resources.ts os reusam.
 */
import { z } from "zod"

import { type CacheTag } from "@/lib/repos/tags"

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "select"
  | "tags"
  | "boolean"
  | "media"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
  help?: string
}

export interface ResourceConfig {
  slug: string
  label: string
  singular: string
  tag: CacheTag
  /** colunas exibidas na listagem */
  columns: { name: string; label: string }[]
  /** ordenação da listagem */
  orderBy: { column: string; ascending: boolean }
  fields: FieldConfig[]
  schema: z.ZodTypeAny
}

export const tagList = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.split(",").map((s) => s.trim()).filter(Boolean)
      : Array.isArray(v)
        ? v
        : [],
  z.array(z.string()),
)

export const bool = z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean())
export const int = z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int())
export const optText = z.preprocess((v) => (v === "" ? null : v), z.string().nullable())
