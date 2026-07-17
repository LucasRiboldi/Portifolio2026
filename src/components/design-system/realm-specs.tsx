import type { Spec } from "@/design-system/realms"

/**
 * Blocos de "spec" compartilhados pelo corpo do guia de realm.
 *
 * Extraídos de realms/[realm]/page.tsx para poderem ser reusados também pelo
 * corpo próprio do _Dev (developer-guide.tsx), que ordena as seções na ordem
 * do índice em vez da sequência genérica. Fonte única — se a grelha do realm
 * muda, muda nos dois lugares de uma vez.
 */

/** O contrato --r-*: mesmo nome nos três realms, valor resolvido por escopo. */
export const REALM_TOKENS = [
  { token: "--r-bg", role: "Fundo da página" },
  { token: "--r-bg-2", role: "Fundo de painel" },
  { token: "--r-ink", role: "Tinta" },
  { token: "--r-ink-mut", role: "Tinta secundária" },
  { token: "--r-accent", role: "Ação primária" },
  { token: "--r-accent-2", role: "Ação secundária" },
  { token: "--r-accent-3", role: "Chamada" },
  { token: "--r-border", role: "Traço" },
]

/**
 * As amostras vivem DENTRO do `scope`, então cada var resolve no valor real
 * daquele realm — não há hex copiado aqui. Se realm-tokens.css mudar, muda aqui.
 */
export function RealmTokenGrid({ scope }: { scope: string }) {
  return (
    <div className={scope}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {REALM_TOKENS.map((t) => (
          <div key={t.token} className="overflow-hidden rounded-md border-2 border-black">
            <div className="h-12 w-full" style={{ background: `var(${t.token})` }} />
            <div className="bg-[var(--sv-ink-2)] p-2">
              <p className="font-mono text-[10px] text-[var(--sv-cyan)]">{t.token}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/60">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SpecTable({ rows }: { rows: Spec[] }) {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-white/10 last:border-0">
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--sv-cyan)]">{r.name}</td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-white/70">{r.value}</td>
              <td className="px-3 py-2 text-white/60">{r.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
