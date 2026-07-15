import "@/styles/admin.css"

import type { ReactNode } from "react"
import { Plus_Jakarta_Sans } from "next/font/google"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopbar } from "@/components/admin/admin-topbar"
import { requireAdmin, githubLogin } from "@/lib/auth/is-admin"

export const metadata = { title: "Admin", robots: { index: false, follow: false } }

// O painel é sempre dinâmico (dados ao vivo, sessão por request).
export const dynamic = "force-dynamic"

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-mm" })

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin()
  const login = githubLogin(user)

  return (
    <div className={`mm-root flex min-h-screen ${jakarta.variable}`}>
      <AdminSidebar login={login} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar login={login} />
        <main className="flex-1 overflow-x-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
