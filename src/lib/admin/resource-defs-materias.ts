/**
 * Recurso das MATÉRIAS das páginas internas do jornal (realm Anfitrião).
 *
 * Em arquivo próprio pelo mesmo motivo que `resource-defs-content` e
 * `resource-defs-media` são separados: cada um cresce no seu ritmo e o teto do
 * projeto é 500 linhas. Esta matéria tem vinte campos, cinco deles estruturas
 * aninhadas — sozinha ocuparia um quarto do arquivo de mídia.
 *
 * O que a torna diferente dos outros recursos: o corpo não é texto simples nem
 * markdown, é uma sequência de blocos com intertítulo. O tipo de campo `prose`
 * dá a quem escreve um formato que se digita (`## intertítulo`, linha em branco
 * entre parágrafos) e guarda jsonb no banco — ver `materia-format.ts`.
 */
import { z } from "zod"

import { CACHE_TAGS } from "@/lib/repos/tags"
import type { ResourceConfig } from "./resource-types"
import { bool, int, optText } from "./resource-types"
import {
  blocosField,
  boxesField,
  colofaoField,
  figureField,
  remissoesField,
} from "./materia-format"

export const MATERIA_RESOURCES: Record<string, ResourceConfig> = {
  materias: {
    slug: "materias",
    label: "Matérias (páginas internas)",
    singular: "Matéria",
    tag: CACHE_TAGS.materias,
    orderBy: { column: "sort", ascending: true },
    columns: [
      { name: "headline", label: "Manchete" },
      { name: "caderno", label: "Caderno" },
      { name: "page", label: "Pág." },
    ],
    fields: [
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "a-regra-que-desaparece",
        help: "Endereço da matéria: /anfitriao/materia/<slug>. Mudar o slug quebra os links que já apontam para ela.",
      },
      { name: "caderno", label: "Caderno", type: "text", placeholder: "Oficina" },
      {
        name: "page",
        label: "Página",
        type: "text",
        placeholder: "II",
        help: "Numeração romana, como sai impressa no folio.",
      },

      { name: "kicker", label: "Chapéu", type: "text", placeholder: "Continuação da Primeira Página" },
      { name: "headline", label: "Manchete", type: "text", required: true },
      { name: "subhead", label: "Linha de apoio", type: "textarea" },
      {
        name: "standfirst",
        label: "Olho",
        type: "textarea",
        help: "O parágrafo entre filetes duplos, antes do corpo.",
      },

      { name: "byline", label: "Assinatura", type: "text", placeholder: "por Lucas Riboldi" },
      { name: "byline_role", label: "Cargo", type: "text", placeholder: "Editor desta folha" },
      { name: "dateline", label: "Data-local", type: "text", placeholder: "Da nossa bancada, ao anoitecer" },
      { name: "continua_de", label: "Continua de", type: "text", help: "Deixe vazio se a matéria abre aqui." },

      {
        name: "dropcap",
        label: "Capitular",
        type: "text",
        placeholder: "H",
        help: "Uma letra só — a primeira da abertura, que sai em corpo grande. A abertura começa na SEGUNDA letra da palavra.",
      },
      {
        name: "open_line",
        label: "Abertura",
        type: "textarea",
        help: "O resto da primeira frase, sem a capitular.",
      },
      {
        name: "blocos",
        label: "Corpo",
        type: "prose",
        help: "Linha em branco separa parágrafos. Uma linha começando com ## abre um bloco novo com intertítulo.",
      },
      { name: "pullquote", label: "Olho de citação", type: "textarea" },

      {
        name: "figure",
        label: "Gravura",
        type: "json",
        help: '{ "caption": "Fig. II — …", "credit": "Chapa da casa" }',
      },
      {
        name: "boxes",
        label: "Caixas de apoio",
        type: "json",
        help: 'Lista. Cada caixa tem "title" e uma destas: "body" (parágrafos), "items" (lista) ou "rows" (pares).',
      },
      { name: "sign", label: "Fecho", type: "text", placeholder: "— A Redação" },
      {
        name: "colofao",
        label: "Colofão",
        type: "json",
        help: '{ "composta": "…", "revisao": "…", "chapas": "…" }',
      },
      {
        name: "remissoes",
        label: "Remissões",
        type: "json",
        help: 'Lista de { "slug": "…", "label": "…" }. O slug precisa ser de uma matéria que existe, senão o link morre.',
      },

      { name: "published", label: "Publicada", type: "boolean" },
      { name: "sort", label: "Ordem", type: "number" },
    ],
    schema: z.object({
      slug: z
        .string()
        .min(1, "Slug obrigatório")
        // Sem acento, espaço ou maiúscula: o slug vira URL, e o que não
        // couber aqui quebra o endereço sem avisar.
        .regex(/^[a-z0-9-]+$/, "Slug só aceita minúsculas, números e hífen."),
      caderno: z.string().default("Oficina"),
      page: z
        .string()
        .regex(/^[IVXLC]+$/, "Página em numeração romana (II, III, IV…).")
        .default("II"),
      kicker: z.string().default(""),
      headline: z.string().min(1, "Manchete obrigatória"),
      subhead: z.string().default(""),
      standfirst: z.string().default(""),
      byline: z.string().default(""),
      byline_role: z.string().default(""),
      dateline: z.string().default(""),
      continua_de: optText,
      dropcap: z.string().max(1, "A capitular é uma letra só.").default(""),
      open_line: z.string().default(""),
      blocos: blocosField,
      pullquote: z.string().default(""),
      figure: figureField,
      boxes: boxesField,
      sign: z.string().default(""),
      colofao: colofaoField,
      remissoes: remissoesField,
      published: bool,
      sort: int,
    }),
  },
}
