import Link from "next/link"
import { FolderKanban, FileText, Sparkles, Wrench, Mail, ArrowUpRight } from "lucide-react"

import { getAdminStats } from "@/lib/admin/stats"
import { SeedButton } from "@/components/admin/seed-button"

const CARDS = [
  { key: "projects", label: "Projetos", href: "/admin/projects", icon: FolderKanban, color: "var(--mm-primary)", light: "var(--mm-light-primary)" },
  { key: "posts", label: "Posts", href: "/admin/posts", icon: FileText, color: "var(--mm-secondary)", light: "var(--mm-light-secondary)" },
  { key: "skills", label: "Skills", href: "/admin/skills", icon: Sparkles, color: "var(--mm-success)", light: "var(--mm-light-success)" },
  { key: "tools", label: "Ferramentas", href: "/admin/tools", icon: Wrench, color: "var(--mm-warning)", light: "var(--mm-light-warning)" },
]

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      {/* Banner de boas-vindas */}
      <section
        className="mm-card flex flex-col items-start justify-between gap-4 overflow-hidden p-6 md:flex-row md:items-center"
        style={{ background: "linear-gradient(100deg, var(--mm-primary), var(--mm-secondary))", border: "none" }}
      >
        <div className="text-white">
          <h1 className="text-2xl font-bold">Bem-vindo de volta 👋</h1>
          <p className="mt-1 text-sm text-white/85">
            Gerencie todo o conteúdo do portfólio a partir daqui.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="mm-btn bg-white/95 text-[var(--mm-primary)] hover:bg-white"
        >
          Gerenciar projetos <ArrowUpRight className="size-4" />
        </Link>
      </section>

      {!stats.configured && (
        <div
          className="mm-card p-4 text-sm"
          style={{ background: "var(--mm-light-warning)", borderColor: "transparent", color: "#8a6100" }}
        >
          Supabase não configurado neste ambiente — exibindo conteúdo estático.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => {
          const Icon = c.icon
          return (
            <Link key={c.key} href={c.href} className="mm-card group p-5 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="mm-chip" style={{ background: c.light, color: c.color }}>
                  <Icon className="size-5" />
                </span>
                <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--mm-text-2)" }} />
              </div>
              <p className="mt-4 text-3xl font-bold">{stats.counts[c.key] ?? 0}</p>
              <p className="text-sm" style={{ color: "var(--mm-text-2)" }}>{c.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Mensagens */}
        <Link href="/admin/messages" className="mm-card flex items-center justify-between p-6 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="mm-chip" style={{ background: "var(--mm-light-info)", color: "var(--mm-info)" }}>
              <Mail className="size-5" />
            </span>
            <div>
              <p className="text-sm" style={{ color: "var(--mm-text-2)" }}>Mensagens não lidas</p>
              <p className="text-2xl font-bold">{stats.unreadMessages}</p>
            </div>
          </div>
        </Link>

        {/* Seed / status */}
        <div className="mm-card p-6 lg:col-span-2">
          {stats.configured && stats.empty ? (
            <>
              <h2 className="font-semibold">Banco vazio — importe o conteúdo atual</h2>
              <p className="mb-4 mt-1 text-sm" style={{ color: "var(--mm-text-2)" }}>
                Copia projetos, posts, skills, ferramentas, config e realms do código
                para o Supabase. Só popula tabelas vazias.
              </p>
              <SeedButton />
            </>
          ) : (
            <>
              <h2 className="font-semibold">Tudo sincronizado</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--mm-text-2)" }}>
                O conteúdo do site é servido do banco. Edições publicam em segundos.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
