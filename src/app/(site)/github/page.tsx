import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader } from "@/components/spiderverse/decor"
import { GithubIcon } from "@/components/ui/social-icons"
import { siteConfig } from "@/constants/site"

export const metadata = { title: "GitHub" }

const stats = [
  { label: 'Repositórios', value: '30+' },
  { label: 'Commits / ano', value: '1.2k' },
  { label: 'Stack principal', value: 'TS' },
  { label: 'Open source', value: '∞' },
]

export default function GitHubPage() {
  return (
    <SvCanvas dimension="2099">
      <ComicHeader
        kicker="Terra-928 · Nueva York 2099"
        title="GitHub"
        highlight="2099"
        subtitle="Brutalismo futurista — grid holográfico da Spider-Society."
      />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`sv-panel sv-tilt-${(i % 3) + 1} flex flex-col items-center justify-center py-8 text-center`}>
            <span className="sv-display text-5xl text-[var(--sv-cyan)]">{s.value}</span>
            <span className="sv-heavy mt-2 text-[10px] uppercase tracking-widest opacity-70">{s.label}</span>
          </div>
        ))}
      </div>
      <a
        href={siteConfig.github}
        target="_blank"
        rel="noopener noreferrer"
        className="sv-display mt-8 inline-flex items-center gap-2 border-[3px] border-[var(--sv-cyan)] bg-[rgba(0,229,255,0.1)] px-6 py-3 text-lg uppercase text-[var(--sv-cyan)] shadow-[0_0_18px_rgba(0,229,255,0.4)] transition-transform hover:-translate-y-1"
      >
        <GithubIcon className="h-5 w-5" /> Abrir GitHub ↗
      </a>
    </SvCanvas>
  )
}
