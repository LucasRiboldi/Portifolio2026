import Link from "next/link"
import { notFound } from "next/navigation"

import { PAGE_GROUPS } from "@/lib/admin/pages-catalog"

export default async function PagesListByRealm({
  params,
}: {
  params: Promise<{ realm: string }>
}) {
  const { realm } = await params
  const group = PAGE_GROUPS.find((g) => g.realm === realm)
  if (!group) notFound()

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">{group.section}</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">
          Edite os textos de cabeçalho de cada página deste realm.
        </p>
      </header>

      <div className="mm-card overflow-hidden">
        <table className="mm-table">
          <thead>
            <tr>
              <th>Página</th>
              <th>Título atual</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {group.pages.map((p) => (
              <tr key={p.key}>
                <td className="font-medium">{p.label}</td>
                <td className="text-[color:var(--mm-text-2)]">{p.title}</td>
                <td className="text-right">
                  <Link
                    href={`/admin/pages/${realm}/${encodeURIComponent(p.key)}`}
                    className="font-medium hover:underline"
                    style={{ color: "var(--mm-primary)" }}
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
