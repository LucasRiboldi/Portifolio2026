/* ------------------------------------------------------------------
   04.3 · Templates de zona — layouts prontos de página.
   ------------------------------------------------------------------
   Zonas de website montadas com as peças do realm (efeitos Comic FX, cores de
   dimensão, retícula, botões comic). São blocos copy-paste para montar uma
   página nova sem reinventar o ritmo: um hero split, uma grade de mundos e uma
   faixa de chamada. Cada um usa a paleta de uma dimensão via `--k-zone-bg`.
   ------------------------------------------------------------------ */
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { Counter } from "@/components/comic/counter"

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

/** CR-T2 · depoimentos em balão comic. */
const QUOTES = [
  { text: "Cada dimensão parece um mundo inteiro. Nunca vi um portfólio assim.", who: "— Visitante da Terra-1610", tint: "var(--k-cyan)" },
  { text: "O nível de capricho no detalhe é absurdo. Vira referência.", who: "— Colega de design", tint: "var(--k-magenta)" },
]

/** CR-T4 · faixa de estatísticas (contadores animados). */
const STATS = [
  { to: 8, suffix: "", label: "Dimensões" },
  { to: 32, suffix: "", label: "Efeitos de título" },
  { to: 138, suffix: "", label: "Anomalias mapeadas" },
  { to: 100, suffix: "%", label: "Feito à mão" },
]

/** CR-T5 · timeline de dimensões em quadros. */
const TIMELINE = [
  { n: "01", title: "A fenda abre", desc: "O portal de entrada e os três realms." },
  { n: "02", title: "O multiverso", desc: "Oito dimensões criativas ganham cor." },
  { n: "03", title: "A anomalia", desc: "Terra-138 quebra a grade — o glitch." },
]

/** CR-T3 · galeria masonry (alturas irregulares). */
const GALLERY = [
  { fx: "kfx-retro-gold", h: "h-40" },
  { fx: "kfx-holo", h: "h-28" },
  { fx: "kfx-web", h: "h-32" },
  { fx: "kfx-doubleexpose", h: "h-44" },
  { fx: "kfx-crown", h: "h-28" },
  { fx: "kfx-chrome", h: "h-36" },
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

        {/* --- Template D: faixa de estatísticas (CR-T4) ----------------- */}
        <Frame label="D · Faixa de estatísticas (contadores animados)">
          <div
            className="k-grain grid grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4"
            style={{ background: "linear-gradient(160deg,#0d1030,#241452)", color: "var(--k-white)" }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <Counter to={s.to} suffix={s.suffix} className="kfx kfx-3d text-4xl sm:text-5xl" />
                <p className="k-kicker mt-2 text-[10px] uppercase tracking-wide text-[var(--k-cyan)]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Frame>

        {/* --- Template E: depoimentos em balão comic (CR-T2) ------------ */}
        <Frame label="E · Depoimentos (balão de fala comic)">
          <div className="grid gap-6 bg-[#0a0a12] p-6 sm:grid-cols-2">
            {QUOTES.map((q) => (
              <figure key={q.who} className="relative">
                <blockquote
                  className="k-body relative rounded-lg border-[3px] border-black bg-white p-5 text-sm text-black"
                  style={{ boxShadow: "5px 5px 0 #000" }}
                >
                  “{q.text}”
                  <span
                    aria-hidden
                    className="absolute -bottom-3 left-8 h-4 w-4 rotate-45 border-b-[3px] border-r-[3px] border-black bg-white"
                  />
                </blockquote>
                <figcaption className="mt-5 pl-8 text-[11px] uppercase tracking-wide" style={{ color: q.tint }}>
                  {q.who}
                </figcaption>
              </figure>
            ))}
          </div>
        </Frame>

        {/* --- Template F: galeria masonry de arte (CR-T3) --------------- */}
        <Frame label="F · Galeria masonry (grade irregular)">
          <div className="[column-fill:balance] gap-4 bg-[#0a0a12] p-5 [columns:2] sm:[columns:3]">
            {GALLERY.map((g) => (
              <div
                key={g.fx}
                className={`mb-4 flex ${g.h} break-inside-avoid items-center justify-center overflow-hidden rounded-lg border-[3px] border-black bg-[radial-gradient(120%_100%_at_50%_0%,#171226,#08070d)]`}
              >
                <span className={`kfx ${g.fx} text-3xl`}>ART</span>
              </div>
            ))}
          </div>
        </Frame>

        {/* --- Template G: timeline de dimensões (CR-T5) ----------------- */}
        <Frame label="G · Timeline de dimensões (linha do tempo em quadros)">
          <ol className="grid gap-4 bg-[#0a0a12] p-6 sm:grid-cols-3">
            {TIMELINE.map((t, i) => (
              <li key={t.n} className="relative rounded-lg border-[3px] border-black bg-[#14122a] p-5">
                <span
                  className="k-title inline-flex border-[3px] border-black bg-[var(--k-cyan)] px-2 py-0.5 text-lg leading-none text-black"
                  style={{ boxShadow: "3px 3px 0 #000" }}
                >
                  {t.n}
                </span>
                <h4 className="kfx kfx-outline mt-4 text-2xl">{t.title}</h4>
                <p className="k-body mt-2 text-xs text-white/65">{t.desc}</p>
                {i < TIMELINE.length - 1 && (
                  <span aria-hidden className="absolute -right-3 top-1/2 hidden text-2xl text-[var(--k-cyan)] sm:block">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Frame>

        {/* --- Template H: split art+texto invertível (CR-T6) ----------- */}
        <Frame label="H · Split art + texto invertível (alterna o lado)">
          <div className="bg-[#0a0a12]">
            <div
              className="k-grain grid items-center gap-6 p-6 sm:grid-cols-2"
              style={{ background: "linear-gradient(160deg,#2a1052,#7a2db0)", color: "var(--k-white)" }}
            >
              <div className="flex aspect-video items-center justify-center rounded-lg border-[3px] border-black bg-[#0c0a1c]">
                <span className="kfx kfx-holo text-4xl">A</span>
              </div>
              <div>
                <h4 className="kfx kfx-3d text-3xl">Lado A</h4>
                <p className="k-body mt-2 text-sm opacity-85">Arte à esquerda, texto à direita.</p>
              </div>
            </div>
            <div
              className="k-grain grid items-center gap-6 p-6 sm:grid-cols-2"
              style={{ background: "linear-gradient(160deg,#0d2a3a,#116b7a)", color: "var(--k-white)" }}
            >
              <div className="sm:order-2 flex aspect-video items-center justify-center rounded-lg border-[3px] border-black bg-[#08161c]">
                <span className="kfx kfx-chrome text-4xl">B</span>
              </div>
              <div className="sm:order-1">
                <h4 className="kfx kfx-3d text-3xl">Lado B</h4>
                <p className="k-body mt-2 text-sm opacity-85">O bloco seguinte inverte: texto à esquerda, arte à direita.</p>
              </div>
            </div>
          </div>
        </Frame>

        {/* --- Template I: rodapé de dimensão (CR-T1) -------------------- */}
        <Frame label="I · Rodapé de dimensão (links + selo + redes)">
          <footer
            className="k-grain grid gap-6 px-6 py-8 sm:grid-cols-[1.4fr_1fr_1fr]"
            style={{ background: "linear-gradient(160deg,#12101f,#05040a)", color: "var(--k-white)" }}
          >
            <div>
              <span className="kfx kfx-crown text-3xl">CRIATIVO</span>
              <p className="k-body mt-3 max-w-xs text-xs text-white/55">
                Uma dimensão do multiverso. Feita à mão, faixa por faixa.
              </p>
            </div>
            <nav aria-label="Mapa" className="text-xs">
              <p className="k-kicker mb-2 text-[10px] uppercase text-[var(--k-cyan)]">Mapa</p>
              <ul className="space-y-1 text-white/70">
                <li>Ateliê</li>
                <li>Oficina</li>
                <li>Rádio</li>
              </ul>
            </nav>
            <div className="text-xs">
              <p className="k-kicker mb-2 text-[10px] uppercase text-[var(--k-magenta)]">Redes</p>
              <ul className="space-y-1 text-white/70">
                <li>GitHub</li>
                <li>Instagram</li>
                <li>E-mail</li>
              </ul>
            </div>
          </footer>
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
