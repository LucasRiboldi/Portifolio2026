/* ------------------------------------------------------------------
   Seções de fundação do guia "O Anfitrião", em folha de jornal.
   ------------------------------------------------------------------
   As mesmas seções que antes vinham dos componentes comic compartilhados
   (masthead, introduction, tokens, colors, motion, brand), reescritas na
   língua da folha: serifa, tinta sépia, fios e capitulares. Mesmos dados de
   `realms.ts`. Reaproveita Chapter/Folha de arcane-chapters — mesmo compasso.
   ------------------------------------------------------------------ */
import type { RealmDesign, Swatch } from "@/design-system/realms"
import { Chapter, Folha } from "./arcane-chapters"

/** Uma linha de amostra de cor, no tom da folha: sem neon, só tinta. */
function InkRow({ s }: { s: Swatch }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--dp-rule)]/40 py-2 first:border-0">
      <span
        className="size-8 shrink-0 border border-[var(--dp-rule)]"
        style={{ background: s.value }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm" style={{ color: "var(--dp-ink)" }}>
          {s.name}
        </span>
        <span className="block text-[11px]" style={{ color: "var(--dp-ink-3)" }}>
          {s.role}
        </span>
      </span>
      <code className="shrink-0 font-mono text-[10px]" style={{ color: "var(--dp-sepia)" }}>
        {s.token}
      </code>
      <code
        className="hidden shrink-0 font-mono text-[10px] sm:block"
        style={{ color: "var(--dp-ink-3)" }}
      >
        {s.value}
      </code>
    </div>
  )
}

/**
 * O masthead — a primeira página. É aqui que vive o único <h1> do guia: o
 * nome do jornal, em tipo de madeira. Data, preço e lema fecham o cabeçalho.
 */
export function ArcaneMasthead({ d }: { d: RealmDesign }) {
  return (
    <header className="scroll-mt-24 text-center">
      <div className="dp-rule dp-rule--hair" />
      <p
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-1.5 text-[10px] uppercase tracking-[0.18em]"
        style={{ color: "var(--dp-ink-3)" }}
      >
        <span>Vol. III · Nº 1</span>
        <span>·</span>
        <span>Terra-2026</span>
        <span>·</span>
        <span>Preço: um token</span>
      </p>
      <div className="dp-rule dp-rule--thick" />

      <p
        className="mt-3 text-sm uppercase tracking-[0.2em]"
        style={{ color: "var(--dp-sepia)", fontFamily: "var(--dp-head)" }}
      >
        Design System · The Daily Prophet
      </p>
      {/* O nameplate na Mugglenews — a letra de jornal do universo mágico,
          pedida para o cabeçalho. Não é uppercase: a Mugglenews já traz a caixa
          e o desenho próprios, e forçar maiúsculas partiria o desenho da letra.
          Runas ladeiam o nome (ornamento, aria-hidden) para o ar de mistério. */}
      <h1
        className="mt-1 flex items-center justify-center gap-4 text-6xl leading-[0.9] sm:text-8xl"
        style={{ fontFamily: "var(--dp-nameplate)", color: "var(--dp-ink)" }}
      >
        <span aria-hidden className="text-2xl sm:text-4xl" style={{ fontFamily: "var(--dp-runic)", color: "var(--dp-gold)" }}>
          ᚨᚾ
        </span>
        O Anfitrião
        <span aria-hidden className="text-2xl sm:text-4xl" style={{ fontFamily: "var(--dp-runic)", color: "var(--dp-gold)" }}>
          ᚠᚱ
        </span>
      </h1>
      <p
        className="mx-auto mt-3 max-w-2xl text-sm italic leading-snug"
        style={{ color: "var(--dp-ink-2)", fontFamily: "var(--dp-body)" }}
      >
        {d.tagline}
      </p>
      <div className="mt-3 dp-rule dp-rule--double" />
    </header>
  )
}

/** 01 · Introduction — a matéria de abertura: capitular, objetivo, filosofia. */
export function ArcaneIntro({ d }: { d: RealmDesign }) {
  return (
    <section id="introduction" aria-label="01 · Introduction" className="mt-12 scroll-mt-24">
      <p
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--dp-sepia)" }}
      >
        Editorial · Nº 01
      </p>
      <h2
        className="mt-1 text-3xl leading-none"
        style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}
      >
        Por que uma folha, e não uma tela
      </h2>
      <div className="my-3 dp-rule" />

      <p className="dp-lead-body" style={{ color: "var(--dp-ink)" }}>
        <span className="dp-cap">D</span>
        ar a {d.label} uma linguagem visual que se aplique sem adivinhação: as decisões já foram
        tomadas e estão impressas, então quem compõe uma página nova não recomeça do zero nem
        inventa mais uma variação do mesmo botão. Este guia documenta o que existe no código, não o
        que seria bom existir — cada exemplo usa as classes reais de daily-prophet.css. Se uma
        quebrar, quebra aqui, que é o ponto de uma folha viva: ela sai da prensa toda edição.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <Folha>
          <p
            className="mb-2 text-[11px] uppercase tracking-wide"
            style={{ color: "var(--dp-sepia)" }}
          >
            Os cinco princípios da casa
          </p>
          <ol className="space-y-2">
            {d.principles.map((p, i) => (
              <li key={p} className="flex gap-3 text-sm leading-snug" style={{ color: "var(--dp-ink-2)" }}>
                <span
                  className="shrink-0 text-xl leading-none"
                  style={{ fontFamily: "var(--dp-head)", color: "var(--dp-gold)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </Folha>

        <Folha>
          <p
            className="mb-2 text-[11px] uppercase tracking-wide"
            style={{ color: "var(--dp-sepia)" }}
          >
            Expediente
          </p>
          {/* `.dp-kv` já é exatamente isto: rótulo e valor nas pontas, com
              pontilhado a separar. Estava refeito à mão com flex + border. */}
          <div>
            <p className="dp-kv">
              <b>Composição</b> <span>Iowan · Playbill</span>
            </p>
            <p className="dp-kv">
              <b>Folhas</b> <span className="text-right">{d.css.join(" · ")}</span>
            </p>
            <p className="dp-kv">
              <b>Rota</b> <span>/anfitriao</span>
            </p>
          </div>
        </Folha>
      </div>
    </section>
  )
}

/** 03 · Design Tokens — a paleta de tinta: sépia, ocre, ouro e o fio. */
export function ArcaneTokens({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="tokens"
      n="03"
      title="Tintas & Tokens"
      lead="Token é o contrato: o nome dura, o valor muda. A folha quase não tem cor — a hierarquia vem do peso, do corpo e do fio. Sépia, ocre e ouro só pontuam; o preto do fio separa."
    >
      <Folha>
        <p className="mb-1 text-[10px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
          Acentos — usados com parcimônia
        </p>
        {d.palette.map((s) => (
          <InkRow key={s.token} s={s} />
        ))}
      </Folha>
    </Chapter>
  )
}

/** 05 · Colors — as superfícies: as duas folhas e as três tintas de texto. */
export function ArcaneColors({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="colors"
      n="05"
      title="As superfícies"
      lead="Duas folhas e três tintas. A folha (--dp-paper) é o fundo; a folha 2 (--dp-paper-2) recua caixas e anúncios. O texto desce em três pesos de tinta — e o contraste de cada um está medido na seção de acessibilidade, sobre as duas folhas."
    >
      <Folha>
        <p className="mb-1 text-[10px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
          Folhas & tintas
        </p>
        {d.surfaces.map((s) => (
          <InkRow key={s.token} s={s} />
        ))}
      </Folha>
    </Chapter>
  )
}

/** 08 · Motion — o realm mais parado dos três: papel não anima. */
export function ArcaneMotion({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="motion"
      n="08"
      title="Movimento"
      lead="A folha está parada sobre a mesa. Não há hover que levante, parallax nem spring — as outras interfaces são luz; esta finge ser papel. O único gesto é o filete que se revela sob um link, porque um link precisa se anunciar."
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
        <Folha className="flex flex-col items-center justify-center text-center">
          <span
            className="text-3xl"
            style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink-3)" }}
          >
            ❦
          </span>
          <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "var(--dp-ink-3)" }}>
            deliberadamente imóvel
          </p>
        </Folha>
        <Folha>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: "var(--dp-ink-2)" }}>
              <tbody>
                {d.motion.map((m) => (
                  <tr key={m.name} className="border-t border-[var(--dp-rule)]/40 first:border-0">
                    <td className="whitespace-nowrap py-1.5 pr-3" style={{ color: "var(--dp-ink)" }}>
                      {m.name}
                    </td>
                    <td className="whitespace-nowrap py-1.5 pr-3" style={{ color: "var(--dp-sepia)" }}>
                      {m.value}
                    </td>
                    <td className="py-1.5" style={{ color: "var(--dp-ink-3)" }}>
                      {m.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Folha>
      </div>
    </Chapter>
  )
}

/** 14 · Brand — o brasão do Prophet e o nome no tipo de madeira. */
export function ArcaneBrand({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="brand"
      n="14"
      title="Brasão & nome"
      lead="A marca do realm é o nameplate — o nome do jornal talhado em tipo de madeira — e o brasão que o assina no masthead."
    >
      <Folha className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--dp-sepia)" }}>
          The Daily Prophet
        </p>
        <p
          className="mt-1 text-4xl uppercase leading-none"
          style={{ fontFamily: "var(--dp-wood)", color: "var(--dp-ink)" }}
        >
          O Anfitrião
        </p>
        <div className="mx-auto my-2 max-w-xs dp-rule dp-rule--double" />
        <p className="mx-auto max-w-lg text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          {d.logo}
        </p>
      </Folha>

      {/* Área de proteção & redução */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Área de proteção
          </p>
          <div
            className="relative border border-dashed p-6 text-center"
            style={{ borderColor: "var(--dp-ink-3)", background: "var(--dp-paper)" }}
          >
            <span
              className="text-2xl uppercase leading-none"
              style={{ fontFamily: "var(--dp-wood)", color: "var(--dp-ink)" }}
            >
              O Anfitrião
            </span>
            <span
              className="absolute left-1 top-1 text-[9px]"
              style={{ color: "var(--dp-ink-3)" }}
            >
              ↕ 1 linha
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
            Uma linha de corpo em volta, de todos os lados. Nada de fio, texto ou anúncio invade
            essa margem — é o branco que faz o nameplate ser nameplate.
          </p>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Reduções
          </p>
          <div className="space-y-2" style={{ fontFamily: "var(--dp-wood)", color: "var(--dp-ink)" }}>
            <p className="text-3xl uppercase leading-none">O Anfitrião</p>
            <p className="text-xl uppercase leading-none">O Anfitrião</p>
            <p className="text-sm uppercase leading-none">O Anfitrião</p>
          </div>
          <p className="mt-2 text-[11px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
            Abaixo de 14px o tipo de madeira fecha os contraforma e vira borrão de tinta. Nesse
            tamanho, usa-se a slab (<code className="font-mono">--dp-head</code>) no lugar.
          </p>
        </Folha>
      </div>

      {/* Usos incorretos */}
      <Folha className="mt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
          Usos incorretos
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { amostra: <span className="inline-block scale-x-150 text-lg uppercase" style={{ fontFamily: "var(--dp-wood)" }}>Anfitrião</span>, o: "Não distorcer — o tipo foi talhado nessa proporção" },
            { amostra: <span className="text-lg uppercase" style={{ fontFamily: "var(--dp-wood)", color: "#8a3020" }}>Anfitrião</span>, o: "Não colorir — a folha imprime em tinta, não em cor" },
            { amostra: <span className="inline-block rotate-[-8deg] text-lg uppercase" style={{ fontFamily: "var(--dp-wood)" }}>Anfitrião</span>, o: "Não inclinar — a chapa é reta na prensa" },
            { amostra: <span className="text-lg uppercase" style={{ fontFamily: "var(--dp-body)" }}>Anfitrião</span>, o: "Não trocar a face — nameplate é tipo de madeira" },
          ].map((u, i) => (
            <div key={i} className="border-t border-[var(--dp-rule)]/30 pt-2 sm:border-0 sm:pt-0">
              <div
                className="mb-1 grid h-12 place-items-center overflow-hidden border border-[var(--dp-rule)]/40"
                style={{ background: "var(--dp-paper)", color: "var(--dp-ink)" }}
              >
                {u.amostra}
              </div>
              <p className="flex gap-1.5 text-[10px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
                <span style={{ color: "#8a3020" }}>✕</span>
                {u.o}
              </p>
            </div>
          ))}
        </div>
      </Folha>
    </Chapter>
  )
}
