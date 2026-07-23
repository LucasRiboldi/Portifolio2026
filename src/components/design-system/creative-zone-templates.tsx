/* ------------------------------------------------------------------
   04.3 · Templates de zona — layouts prontos de página.
   ------------------------------------------------------------------
   Zonas de website montadas com as peças do realm (efeitos Comic FX, cores de
   dimensão, retícula, botões comic). São blocos copy-paste para montar uma
   página nova sem reinventar o ritmo: um hero split, uma grade de mundos e uma
   faixa de chamada. Cada um usa a paleta de uma dimensão via `--k-zone-bg`.
   ------------------------------------------------------------------ */
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"

/** Moldura de preview de template — só para o catálogo do DS. */
function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="sv-heavy mb-2 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-cyan)]">{label}</p>
      <div className="overflow-hidden rounded-lg border-[3px] border-black">{children}</div>
    </div>
  )
}

const WORLDS = [
  { n: "01", title: "Ateliê", fx: "kfx-3d", tint: "var(--k-lime)", desc: "Arte, vetor e pixel." },
  { n: "02", title: "Oficina", fx: "kfx-chrome", tint: "var(--k-cyan)", desc: "Código e componentes." },
  { n: "03", title: "Rádio", fx: "kfx-neon", tint: "var(--k-magenta)", desc: "Trilha e visualizador." },
]

export function CreativeZoneTemplates() {
  return (
    <section id="zone-templates" aria-label="04.3 · Templates de zona" className="mt-12 scroll-mt-24">
      <DsSectionTitle id="zone-templates" n="04.3">
        Templates de zona
      </DsSectionTitle>
      <DsLead>
        Zonas de página prontas, montadas com as peças do realm — efeitos de título,
        cores de dimensão, retícula e botões. Copie o bloco e troque o conteúdo.
      </DsLead>

      <div className="mt-6 space-y-8">
        {/* --- Template A: hero split (arte + texto) --------------------- */}
        <Frame label="A · Hero de dimensão (split arte + texto)">
          <div
            className="k-grain relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            style={{ background: "var(--k-zone-bg, linear-gradient(160deg,#3a1d6e,#7a2db0))", color: "var(--k-white)" }}
          >
            <div className="min-w-0">
              <p className="k-kicker text-[11px] text-[var(--k-cyan)]">Terra-1610 · Dimensão</p>
              <h3 className="kfx kfx-3d mt-3 text-[clamp(2rem,7vw,4rem)] leading-[0.9]">Novo mundo</h3>
              <p className="k-body mt-4 max-w-md text-sm opacity-85 sm:text-base">
                Um subtítulo curto que explica a dimensão em uma frase e convida a atravessar a fenda.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="k-btn k-sub px-5 py-2.5 text-sm">Explorar →</span>
                <span className="k-btn k-btn--ghost k-sub px-5 py-2.5 text-sm">Ver tudo</span>
              </div>
            </div>
            <div className="relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border-[3px] border-black bg-[#0c0a1c] lg:flex">
              <span className="kfx kfx-pixel text-5xl">02</span>
            </div>
          </div>
        </Frame>

        {/* --- Template B: grade de mundos ------------------------------ */}
        <Frame label="B · Grade de mundos (cards de dimensão)">
          <div className="grid gap-4 bg-[#0a0a12] p-5 sm:grid-cols-3">
            {WORLDS.map((w) => (
              <div key={w.n} className="relative overflow-hidden rounded-lg border-[3px] border-black bg-[#14122a] p-5">
                <span
                  className="k-title inline-flex border-[3px] border-black bg-white px-2.5 py-0.5 text-xl leading-none text-black"
                  style={{ boxShadow: "3px 3px 0 #000" }}
                >
                  {w.n}
                </span>
                <h4 className={`kfx ${w.fx} mt-4 text-3xl`}>{w.title}</h4>
                <p className="k-body mt-2 text-xs text-white/65">{w.desc}</p>
                <span className="mt-4 inline-block text-[11px] uppercase tracking-wide" style={{ color: w.tint }}>
                  Explorar →
                </span>
              </div>
            ))}
          </div>
        </Frame>

        {/* --- Template C: faixa de chamada (CTA) ----------------------- */}
        <Frame label="C · Faixa de chamada (CTA)">
          <div
            className="k-grain relative flex flex-col items-center gap-4 px-6 py-12 text-center"
            style={{ background: "linear-gradient(160deg,#ffd200,#ff6b1f 55%,#ff2d95)", color: "var(--k-ink)" }}
          >
            <h3 className="kfx kfx-outline text-[clamp(1.8rem,6vw,3.4rem)] leading-[0.9]">Bora criar?</h3>
            <p className="k-body max-w-md text-sm font-medium opacity-90">
              Uma frase de fecho que empurra para a ação — curta, direta, com um único botão.
            </p>
            <span className="k-btn k-sub mt-2 px-6 py-3 text-sm">Começar agora →</span>
          </div>
        </Frame>
      </div>

      <p className="mt-4 text-xs leading-snug text-white/55">
        Cada template herda a cor da dimensão por{" "}
        <code className="text-[var(--sv-cyan)]">--k-zone-bg</code> e usa os efeitos{" "}
        <code className="text-[var(--sv-cyan)]">.kfx-*</code> nos títulos — troque o efeito para
        mudar a “voz” da zona.
      </p>
    </section>
  )
}
