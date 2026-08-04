import "server-only"

/**
 * Seed inicial — copia o conteúdo estático de `src/data/*.ts` (a fonte de
 * verdade histórica) para o Firestore. Idempotente: só popula coleções vazias.
 * Usa o Admin SDK. Chamado pela action do dashboard.
 */
import { contarDocs, gravarLote, idNatural } from "@/lib/firebase/collection"
import { projects } from "@/data/projects"
import { skills } from "@/data/skills"
import { tools } from "@/data/tools"
import { siteConfig } from "@/constants/site"
import {
  artworks,
  comics,
  movies,
  notes,
  strips,
  tracks,
  videos,
} from "@/data/criativo-zones"
import { devlogs, labExperiments, snippets } from "@/data/dev"
import { materias } from "@/data/anfitriao-materias"
import {
  prophetTutorials,
  prophetMechanics,
  prophetPrototypes,
  prophetResources,
} from "@/data/prophet-arcano"
import { REALMS, REALM_ORDER, DEFAULT_REALM } from "@/lib/realms"
import * as arcane from "@/lib/arcane-content"

export interface SeedReport {
  [table: string]: number | "já populada"
}

async function seedIfEmpty(
  table: string,
  rows: Record<string, unknown>[],
): Promise<number | "já populada"> {
  if ((await contarDocs(table)) > 0) return "já populada"
  try {
    await gravarLote(
      table,
      rows.map((dados) => ({ id: idNatural(dados), dados })),
    )
  } catch (err) {
    throw new Error(`${table}: ${err instanceof Error ? err.message : String(err)}`)
  }
  return rows.length
}

export async function seedDatabase(): Promise<SeedReport> {
  const report: SeedReport = {}

  report.projects = await seedIfEmpty(
    "projects",
    projects.map((p, i) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags,
      cover_image: p.coverImage,
      href: p.href ?? null,
      featured: p.featured ?? false,
      published: true,
      sort: i,
    })),
  )

  report.skills = await seedIfEmpty(
    "skills",
    skills.map((s, i) => ({
      name: s.name,
      command: s.command,
      description: s.description,
      category: s.category,
      sort: i,
    })),
  )

  report.tools = await seedIfEmpty(
    "tools",
    tools.map((t, i) => ({
      name: t.name,
      description: t.description,
      type: t.type,
      stack: t.stack,
      emoji: t.emoji,
      demo_url: t.demoUrl ?? null,
      github_url: t.githubUrl ?? null,
      sort: i,
    })),
  )

  report.site_config = await seedIfEmpty("site_config", [
    {
      id: "default",
      name: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      github: siteConfig.github,
      linkedin: siteConfig.linkedin,
      email: siteConfig.email,
      location: siteConfig.location,
    },
  ])

  report.realms = await seedIfEmpty(
    "realms",
    REALM_ORDER.map((id, i) => {
      const r = REALMS[id]
      return {
        id,
        label: r.label,
        glyph: r.glyph,
        enabled: true,
        is_default: id === DEFAULT_REALM,
        morph_label: "",
        aria: r.aria,
        arcane_content:
          id === "arcane"
            ? {
                prophet: arcane.prophet,
                leadArticle: arcane.leadArticle,
                columns: arcane.columns,
                sidebar: arcane.sidebar,
                almanac: arcane.almanac,
              }
            : null,
        sort: i,
      }
    }),
  )

  // ─── Zonas da landing /criativo ──────────────────────────────────────
  // Os seeds já têm a forma da tabela (só `id` é descartado, porque o banco
  // gera o seu), então uma passagem genérica dá conta das sete.
  // `{ id: string }` e não `Record<string, unknown>`: as interfaces dos seeds
  // não têm index signature, e só o `id` é lido aqui (para ser descartado).
  const zones: [string, { id: string }[]][] = [
    ["artworks", artworks],
    ["comics", comics],
    ["movies", movies],
    ["tracks", tracks],
    ["videos", videos],
    ["notes", notes],
    ["strips", strips],
  ]

  for (const [table, rows] of zones) {
    report[table] = await seedIfEmpty(
      table,
      rows.map(({ id: _id, ...rest }, i) => ({ ...rest, published: true, sort: i })),
    )
  }

  // ─── Realm dev ────────────────────────────────────────────────────────
  // Banco novo já nasce com o acervo técnico. Em banco existente estas
  // tabelas não estarão vazias depois do primeiro sync, e `seedIfEmpty`
  // desiste — que é o comportamento correto: o painel manda.
  report.devlogs = await seedIfEmpty(
    "devlogs",
    devlogs.map((d, i) => ({
      slug: d.slug,
      title: d.title,
      date: d.date,
      summary: d.summary,
      body: d.body,
      tags: d.tags,
      published: true,
      sort: i,
    })),
  )

  report.lab_experiments = await seedIfEmpty(
    "lab_experiments",
    labExperiments.map((x, i) => ({
      title: x.title,
      description: x.description,
      status: x.status,
      stack: x.stack,
      demo_url: x.demoUrl ?? null,
      repo_url: x.repoUrl ?? null,
      published: true,
      sort: i,
    })),
  )

  report.snippets = await seedIfEmpty(
    "snippets",
    snippets.map((s, i) => ({
      title: s.title,
      language: s.language,
      description: s.description,
      code: s.code,
      tags: s.tags,
      published: true,
      sort: i,
    })),
  )

  // ─── Matérias das páginas internas do jornal (migration 0008) ─────────
  report.prophet_materias = await seedIfEmpty(
    "prophet_materias",
    materias.map((m, i) => ({
      slug: m.slug,
      caderno: m.caderno,
      page: m.page,
      kicker: m.kicker,
      headline: m.headline,
      subhead: m.subhead,
      standfirst: m.standfirst,
      byline: m.byline,
      byline_role: m.bylineRole,
      dateline: m.dateline,
      continua_de: m.continuaDe ?? null,
      dropcap: m.dropcap,
      open_line: m.openLine,
      blocos: m.blocos,
      pullquote: m.pullquote,
      figure: m.figure,
      boxes: m.boxes,
      sign: m.sign,
      colofao: m.colofao,
      remissoes: m.remissoes,
      published: true,
      sort: i,
    })),
  )

  // ─── Cadernos do realm arcano ──────────────────────────────────────────
  // As quatro nunca tiveram conteúdo — nem no Postgres. As páginas públicas
  // (`/anfitriao/oficina`, `/mecanicas`, `/laboratorio`, `/imprensa`) já
  // existiam e renderizavam vazias, porque os leitores fazem `data ?? []`,
  // sem fallback no seed.

  report.prophet_tutorials = await seedIfEmpty(
    "prophet_tutorials",
    prophetTutorials.map((t, i) => ({
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      body: t.body,
      difficulty: t.difficulty,
      tags: t.tags,
      published: true,
      sort: i,
    })),
  )

  report.prophet_mechanics = await seedIfEmpty(
    "prophet_mechanics",
    prophetMechanics.map((m, i) => ({
      slug: m.slug,
      title: m.title,
      summary: m.summary,
      body: m.body,
      tags: m.tags,
      published: true,
      sort: i,
    })),
  )

  report.prophet_prototypes = await seedIfEmpty(
    "prophet_prototypes",
    prophetPrototypes.map((p, i) => ({
      title: p.title,
      description: p.description,
      status: p.status,
      players: p.players,
      playtime: p.playtime,
      tags: p.tags,
      published: true,
      sort: i,
    })),
  )

  report.prophet_resources = await seedIfEmpty(
    "prophet_resources",
    prophetResources.map((r, i) => ({
      title: r.title,
      description: r.description,
      type: r.type,
      file_url: r.fileUrl,
      published: true,
      sort: i,
    })),
  )

  return report
}
