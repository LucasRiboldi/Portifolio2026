import { AlertTriangle, CheckCircle2, Clock, Database, Rss, Inbox } from "lucide-react"

import { defaultRepository } from "@/data/prophet-wire"
import { defaultRunStore } from "@/lib/prophet-wire/run-store"
import { nextRunFromCron } from "@/lib/prophet-wire/schedule"
import { SOURCES, activeSources } from "@/lib/prophet-wire/sources"
import { config } from "@/lib/prophet-wire/config"

/**
 * Painel do Prophet Wire (Parte 13).
 *
 * Mostra o estado real do agregador: última e próxima execução, contadores,
 * problemas, fila de rascunhos, acervo e fontes registradas.
 *
 * Sobre os avisos no topo: eles não são decorativos. Enquanto o repositório e o
 * histórico forem in-memory (Parte 10 pendente), cada instância serverless tem
 * sua própria cópia e um cold start zera tudo — o painel diz isso em vez de
 * exibir números que aparentam permanência.
 */

export const metadata = { title: "Prophet Wire" }

/** Formata um instante em horário de Brasília, com o rótulo do fuso. */
function fmt(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso))
}

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`
  const s = ms / 1000
  return s < 60 ? `${s.toFixed(1)} s` : `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`
}

export default async function ProphetWirePanel() {
  const repo = defaultRepository()
  const [drafts, published, total, lastRun] = await Promise.all([
    repo.listDrafts(),
    repo.listPublished(),
    repo.count(),
    defaultRunStore().last(),
  ])

  const nextRun = nextRunFromCron(config.cron, new Date())
  const cronSecretSet = Boolean(process.env.CRON_SECRET?.trim())
  const active = activeSources()

  const stats = [
    { label: "No acervo", value: total, icon: Database, color: "var(--mm-primary)", light: "var(--mm-light-primary)" },
    { label: "Aguardando publicação", value: drafts.length, icon: Inbox, color: "var(--mm-warning)", light: "var(--mm-light-warning)" },
    { label: "Publicadas", value: published.length, icon: CheckCircle2, color: "var(--mm-success)", light: "var(--mm-light-success)" },
    { label: "Fontes ativas", value: `${active.length}/${SOURCES.length}`, icon: Rss, color: "var(--mm-secondary)", light: "var(--mm-light-secondary)" },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Prophet Wire</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">
          Agregador automático de notícias de board games que abastece a primeira página.
        </p>
      </header>

      {/* ─── Avisos honestos sobre o estágio atual ─── */}
      {!cronSecretSet && (
        <div
          className="mm-card flex items-start gap-3 p-4 text-sm"
          style={{ background: "var(--mm-light-warning)", borderColor: "transparent", color: "#8a6100" }}
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            <b>CRON_SECRET não definido neste ambiente.</b> O gatilho{" "}
            <code>/api/prophet-wire/run</code> recusa todas as chamadas (falha fechada), então
            o agendamento diário não executa. Defina a variável nas configurações da Vercel.
          </span>
        </div>
      )}

      <div
        className="mm-card flex items-start gap-3 p-4 text-sm"
        style={{ background: "var(--mm-light-primary)", borderColor: "transparent" }}
      >
        <Database className="mt-0.5 size-4 shrink-0" style={{ color: "var(--mm-primary)" }} />
        <span style={{ color: "var(--mm-text-2)" }}>
          <b style={{ color: "var(--mm-text)" }}>Persistência ainda em memória.</b> O acervo e
          o histórico de execuções vivem apenas enquanto a instância do servidor existir — um
          reinício zera ambos, e instâncias diferentes não compartilham dados. Os números
          abaixo são reais, mas não permanentes. Isso muda quando o repositório do Firestore
          entrar (Parte 10).
        </span>
      </div>

      {/* ─── Números ─── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="mm-card p-5">
              <span className="mm-chip" style={{ background: s.light, color: s.color }}>
                <Icon className="size-5" />
              </span>
              <p className="mt-4 text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-[color:var(--mm-text-2)]">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* ─── Execuções ─── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="mm-card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Clock className="size-4" style={{ color: "var(--mm-text-2)" }} />
            Execução
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Última</dt>
              <dd className="font-medium">{lastRun ? fmt(lastRun.finishedAt) : "nenhuma nesta instância"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Duração</dt>
              <dd className="font-medium">{lastRun ? fmtDuration(lastRun.durationMs) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Próxima</dt>
              <dd className="font-medium">
                {nextRun ? fmt(nextRun.toISOString()) : `não sei calcular (${config.cron})`}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Agendamento</dt>
              <dd className="font-mono text-xs">{config.cron} (UTC)</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Modo</dt>
              <dd className="font-medium">
                {config.publishMode === "automatico" ? "publicação automática" : "rascunho"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--mm-text-2)]">Janela</dt>
              <dd className="font-medium">últimas {config.collectWindowHours}h</dd>
            </div>
          </dl>

          {lastRun && (
            <div className="mt-4 grid grid-cols-4 gap-2 border-t pt-4 text-center" style={{ borderColor: "var(--mm-border)" }}>
              {(
                [
                  ["Coletadas", lastRun.counters.fetched],
                  ["Descartadas", lastRun.counters.discarded],
                  ["Publicadas", lastRun.counters.published],
                  ["Erros", lastRun.counters.errors],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-[11px] text-[color:var(--mm-text-2)]">{label}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── Problemas da última execução ─── */}
        <section className="mm-card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4" style={{ color: "var(--mm-text-2)" }} />
            Problemas da última execução
          </h2>

          {!lastRun ? (
            <p className="mt-4 text-sm text-[color:var(--mm-text-2)]">
              Nenhuma execução registrada nesta instância.
            </p>
          ) : lastRun.problems.length === 0 ? (
            <p className="mt-4 text-sm text-[color:var(--mm-text-2)]">
              Nenhum aviso ou erro — execução limpa.
            </p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {lastRun.problems.slice(0, 12).map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="mm-chip shrink-0 text-[10px] uppercase"
                    style={{
                      background: p.level === "error" ? "var(--mm-light-error)" : "var(--mm-light-warning)",
                      color: p.level === "error" ? "var(--mm-error)" : "#8a6100",
                    }}
                  >
                    {p.level}
                  </span>
                  <span>
                    {p.message}
                    {p.context ? (
                      <span className="text-[color:var(--mm-text-2)]"> · {JSON.stringify(p.context)}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ─── Fila de publicação ─── */}
      <section className="mm-card p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Inbox className="size-4" style={{ color: "var(--mm-text-2)" }} />
          Aguardando publicação ({drafts.length})
        </h2>

        {drafts.length === 0 ? (
          <p className="mt-4 text-sm text-[color:var(--mm-text-2)]">
            Nada na fila. No modo <b>{config.publishMode}</b>, notícias novas
            {config.publishMode === "rascunho" ? " entram aqui para revisão." : " vão direto ao ar."}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[color:var(--mm-text-2)]">
                <tr>
                  <th className="pb-2 font-medium">Título</th>
                  <th className="pb-2 font-medium">Categoria</th>
                  <th className="pb-2 font-medium">Fonte</th>
                  <th className="pb-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {drafts.slice(0, 25).map((n) => (
                  <tr key={n.slug} className="border-t" style={{ borderColor: "var(--mm-border)" }}>
                    <td className="py-2 pr-4">{n.title}</td>
                    <td className="py-2 pr-4 text-[color:var(--mm-text-2)]">{n.category}</td>
                    <td className="py-2 pr-4 text-[color:var(--mm-text-2)]">
                      <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {n.sourceName}
                      </a>
                    </td>
                    <td className="py-2 text-[color:var(--mm-text-2)]">{fmt(n.publishedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ─── Fontes ─── */}
      <section className="mm-card p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Rss className="size-4" style={{ color: "var(--mm-text-2)" }} />
          Fontes registradas ({SOURCES.length})
        </h2>
        <p className="mt-1 text-xs text-[color:var(--mm-text-2)]">
          Fontes marcadas <code>html</code>/<code>api</code> ainda dependem de extractors
          próprios — o parser cobre feeds RSS e Atom.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <span
              key={s.id}
              className="mm-chip text-xs"
              style={{
                background: s.enabled ? "var(--mm-light-success)" : "var(--mm-light-warning)",
                color: s.enabled ? "var(--mm-success)" : "#8a6100",
              }}
              title={`${s.url} · ${s.kind}`}
            >
              {s.name} · {s.kind}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}
