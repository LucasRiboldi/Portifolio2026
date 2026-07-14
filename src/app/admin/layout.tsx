import type { ReactNode } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { requireAdmin, githubLogin } from "@/lib/auth/is-admin"

export const metadata = { title: "Admin", robots: { index: false, follow: false } }

// O painel é sempre dinâmico (dados ao vivo, sessão por request).
export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <AdminSidebar login={githubLogin(user)} />
      <main className="flex-1 overflow-x-auto p-6 lg:p-10">{children}</main>
    </div>
  )
}
