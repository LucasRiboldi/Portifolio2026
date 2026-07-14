import Link from "next/link"
import { redirect } from "next/navigation"

import { GithubLoginButton } from "@/components/auth/github-login-button"
import { isAdmin } from "@/lib/auth/is-admin"
import { isSupabaseConfigured } from "@/lib/supabase/config"

export const metadata = { title: "Entrar" }

const ERRORS: Record<string, string> = {
  auth: "Não foi possível completar o login. Tente novamente.",
  forbidden: "Esta conta do GitHub não tem acesso ao painel.",
  config: "O backend (Supabase) ainda não foi configurado neste ambiente.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; next?: string }>
}) {
  const { e, next } = await searchParams

  // Já é admin? vai direto pro painel.
  if (await isAdmin()) redirect(next ?? "/admin")

  const message = e ? ERRORS[e] : null

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900/60 p-8 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Área restrita</p>
        <h1 className="mt-2 text-2xl font-bold">Painel de administração</h1>
        <p className="mt-2 text-sm text-white/60">
          Acesso exclusivo do dono do site. Entre com a conta GitHub autorizada.
        </p>

        <div className="mt-6">
          {isSupabaseConfigured ? (
            <GithubLoginButton next={next} />
          ) : (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
              Configure o Supabase (.env) para habilitar o login.
            </p>
          )}
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {message}
          </p>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-xs text-white/40 underline-offset-4 hover:text-white/70 hover:underline"
        >
          ← Voltar ao site
        </Link>
      </div>
    </main>
  )
}
