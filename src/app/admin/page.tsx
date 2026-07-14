import Link from "next/link"

import { getAdminStats } from "@/lib/admin/stats"
import { SeedButton } from "@/components/admin/seed-button"

const CARDS = [
  { key: "projects", label: "Projetos", href: "/admin/projects" },
  { key: "posts", label: "Posts", href: "/admin/posts" },
  { key: "skills", label: "Skills", href: "/admin/skills" },
  { key: "tools", label: "Ferramentas", href: "/admin/tools" },
]

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-white/50">Visão geral do conteúdo do site.</p>
      </header>

      {!stats.configured && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Supabase não configurado neste ambiente. O site está usando o conteúdo
          estático (seed). Configure as variáveis de ambiente para ativar o CMS.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25"
          >
            <p className="text-3xl font-bold">{stats.counts[c.key] ?? 0}</p>
            <p className="text-sm text-white/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/messages"
        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25"
      >
        <span className="text-sm text-white/50">Mensagens não lidas</span>
        <span className="text-2xl font-bold">{stats.unreadMessages}</span>
      </Link>

      {stats.configured && stats.empty && (
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5">
          <h2 className="font-semibold">Banco vazio — importe o conteúdo atual</h2>
          <p className="mb-3 mt-1 text-sm text-white/50">
            Copia projetos, posts, skills, ferramentas, config e realms do código
            para o Supabase. Só popula tabelas vazias.
          </p>
          <SeedButton />
        </section>
      )}
    </div>
  )
}
