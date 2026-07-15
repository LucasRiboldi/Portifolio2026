import Link from "next/link"
import { Bell, ExternalLink } from "lucide-react"

/** Barra superior do painel (estilo MaterialM). */
export function AdminTopbar({ login }: { login: string | null }) {
  const initial = (login ?? "A").charAt(0).toUpperCase()
  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b px-6"
      style={{ background: "var(--mm-surface)", borderColor: "var(--mm-border)" }}
    >
      <div className="text-sm" style={{ color: "var(--mm-text-2)" }}>
        Painel de administração
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="mm-btn mm-btn-ghost !py-2 text-xs"
          title="Abrir o site"
        >
          <ExternalLink className="size-4" /> Ver site
        </Link>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full transition-colors"
          style={{ color: "var(--mm-text-2)", background: "var(--mm-hover)" }}
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>
        <div
          className="grid size-10 place-items-center rounded-full font-semibold text-white"
          style={{ background: "var(--mm-primary)" }}
          title={login ? `@${login}` : undefined}
        >
          {initial}
        </div>
      </div>
    </header>
  )
}
