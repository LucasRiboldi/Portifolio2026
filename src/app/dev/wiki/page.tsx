import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getWiki, type WikiRow } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Wiki" }

export default async function WikiPage() {
  const [pages, c] = await Promise.all([getWiki(), getPageContent("dev.wiki")])

  const byCategory = pages.reduce<Record<string, WikiRow[]>>((acc, p) => {
    ;(acc[p.category] ??= []).push(p)
    return acc
  }, {})

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {pages.length === 0 ? (
        <DevEmpty>Nenhuma página ainda — adicione em /admin/wiki.</DevEmpty>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(byCategory).map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--d-orange)" }}>
                {category}
              </h2>
              <div className="dv-grid" style={{ marginTop: 0 }}>
                {items.map((w) => (
                  <article key={w.id} className="dv-card">
                    <h3>{w.title}</h3>
                    <p className="line-clamp-3">{w.body.replace(/[#*`>_-]/g, "").slice(0, 160)}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
