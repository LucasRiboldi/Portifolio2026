/**
 * DEV — zonas da home.
 *
 * Todas server components, como as peças do acervo: nenhuma delas tem estado.
 * O movimento que ganham vem de `MotorDeMovimento`, que enriquece este HTML
 * depois de montado — por isso os atributos `data-revelar`, `data-contador` e
 * `data-spot` aparecem aqui sem nenhum `useEffect` por perto.
 *
 * Compõem com `.dv-card` e as primitivas do realm. O CSS novo mora em
 * `dev-home.css` e cobre só o que não existia: o mosaico da bancada, o gráfico
 * de barras do pulso e a lista numerada do radar.
 */

import type { Commit, Noticia, PulsoRepo } from "@/lib/repos/tech-feed"
import { DevExternalLink, DevInternalLink, DevPanelFoot } from "./ui/dev-primitives"

/**
 * Data relativa curta ("há 3 h", "há 2 d").
 *
 * Notícia e commit são sobre recência, e "há 3 h" responde isso mais rápido do
 * que uma data absoluta que o leitor teria de comparar com hoje. Acima de um
 * mês a distância deixa de importar e a data absoluta volta a ser mais honesta.
 */
export function quando(iso: string): string {
  const ms = Date.now() - Date.parse(iso)
  if (Number.isNaN(ms)) return ""
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return "agora há pouco"
  if (h < 24) return `há ${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `há ${d} d`
  return new Date(iso).toLocaleDateString("pt-BR")
}

/* ────────────────────────────────────────────────────────────────────────
   RADAR

   Antes eram dois painéis lado a lado com cinco itens cada — dez manchetes
   competindo por atenção no meio da página, todas em inglês. Virou uma lista
   ordenada de três, porque três é o que alguém realmente lê de passagem, e a
   POSIÇÃO passou a ser desenhada: o número grande à esquerda diz que existe
   uma ordem ali, coisa que uma lista de dez pontos não conseguia dizer.

   O selo de idioma é a parte que não é enfeite: ele torna visível a regra de
   que este radar prioriza português, e avisa antes do clique quando um item
   veio de fora — que só acontece se as fontes brasileiras falharem.
   ──────────────────────────────────────────────────────────────────────── */
export function RadarBrasil({ noticias }: { noticias: readonly Noticia[] }) {
  if (noticias.length === 0) {
    return <p className="dv-empty">Nenhuma fonte respondeu agora. O radar volta na próxima revalidação.</p>
  }
  return (
    <ol className="dv-radar" data-spot>
      {noticias.map((n, i) => (
        <li key={n.id} className="dv-radar-item" data-spot-item data-revelar>
          <span className="dv-radar-pos" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="dv-radar-corpo">
            <a href={n.url} target="_blank" rel="noreferrer" className="dv-radar-link">
              {n.titulo}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            <p className="dv-radar-meta">
              <span className="dv-radar-fonte">{n.fonte}</span>
              <span className="dv-radar-idioma" data-idioma={n.idioma}>
                {n.idioma}
              </span>
              <time dateTime={n.data}>{quando(n.data)}</time>
              {n.pontos != null && <span className="dv-feed-pontos">▲ {n.pontos}</span>}
              {n.autor && <span className="dv-feed-autor">{n.autor}</span>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   PULSO DO REPOSITÓRIO

   Duas leituras da mesma matéria-prima. O gráfico responde "esta coisa está
   viva?" em meio segundo; a lista responde "vivo fazendo o quê?".

   As barras crescem quando entram na tela (a altura sai de zero por CSS sob
   `[data-visivel]`), e o `role="img"` com rótulo existe porque um gráfico de
   catorze `<span>` não significa nada para quem não o enxerga — o texto do
   rótulo carrega a mesma conclusão.
   ──────────────────────────────────────────────────────────────────────── */
function BarrasAtividade({ atividade }: { atividade: PulsoRepo["atividade"] }) {
  const pico = Math.max(1, ...atividade.map((a) => a.total))
  return (
    <div
      className="dv-pulso-grafico"
      role="img"
      aria-label={`Commits por dia nos últimos ${atividade.length} dias. Pico de ${pico} num único dia.`}
      data-revelar
    >
      {atividade.map((a) => (
        <span
          key={a.dia}
          className="dv-pulso-barra"
          data-vazio={a.total === 0 || undefined}
          /* A altura é dado, não estilo: por isso vive numa custom property
             que o CSS anima, em vez de `height` escrito direto — assim a
             transição de entrada continua sendo responsabilidade da folha. */
          style={{ "--h": `${Math.round((a.total / pico) * 100)}%` } as React.CSSProperties}
          title={`${a.dia}: ${a.total} commit${a.total === 1 ? "" : "s"}`}
        />
      ))}
    </div>
  )
}

function LinhaCommit({ commit }: { commit: Commit }) {
  return (
    <li className="dv-commit">
      <a href={commit.url} target="_blank" rel="noreferrer" className="dv-commit-link">
        <code className="dv-commit-sha">{commit.sha}</code>
        <span className="dv-commit-msg">{commit.titulo}</span>
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      <time className="dv-commit-quando" dateTime={commit.data}>
        {quando(commit.data)}
      </time>
    </li>
  )
}

export function PulsoRepositorio({ pulso }: { pulso: PulsoRepo }) {
  if (pulso.commits.length === 0) {
    return <p className="dv-empty">A API do GitHub não respondeu agora. O pulso volta na próxima revalidação.</p>
  }
  return (
    <div className="dv-pulso">
      <div className="dv-pulso-topo">
        <p className="dv-pulso-numero">
          {/* Sem `data-contador` quando é parcial: animar até um número que já
              vem com "+" daria ao valor uma precisão que ele não tem. */}
          <strong data-contador={pulso.parcial ? undefined : pulso.totalJanela}>
            {pulso.totalJanela}
            {pulso.parcial && "+"}
          </strong>
          <span>commits em {pulso.atividade.length} dias</span>
        </p>
        <span className="dv-pulso-selo">
          <span className="dv-pulso-led" aria-hidden />
          ao vivo
        </span>
      </div>
      <BarrasAtividade atividade={pulso.atividade} />
      <ol className="dv-commits">
        {pulso.commits.map((c) => (
          <LinhaCommit key={c.sha} commit={c} />
        ))}
      </ol>
      <DevPanelFoot>
        <DevExternalLink href={pulso.url}>ver todos os commits</DevExternalLink>
      </DevPanelFoot>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   BANCADA

   Projetos, experimentos e ferramentas na MESMA superfície, e de propósito.
   Separados em três seções, cada lista parecia curta e o leitor tinha de
   montar sozinho a ideia de que são três estágios da mesma coisa: uma
   ferramenta é um experimento que deu certo, um projeto é um experimento que
   cresceu. Juntos, com um selo de tipo em cada peça, isso se lê de uma vez.

   O primeiro item ocupa duas colunas: a bancada precisa ter uma peça em foco,
   senão vira uma grade regular de cartões iguais — que é o oposto de bancada.
   ──────────────────────────────────────────────────────────────────────── */
export interface PecaBancada {
  chave: string
  tipo: "projeto" | "experimento" | "ferramenta"
  titulo: string
  descricao: string
  tags: readonly string[]
  /** Rota interna ou URL externa. Sem link, a peça é só registro. */
  href?: string
  externo?: boolean
  /** Estado declarado do experimento; os outros tipos não têm. */
  estado?: string
}

const ROTULO_TIPO: Record<PecaBancada["tipo"], string> = {
  projeto: "projeto",
  experimento: "experimento",
  ferramenta: "ferramenta",
}

export function Bancada({ pecas }: { pecas: readonly PecaBancada[] }) {
  if (pecas.length === 0) return <p className="dv-empty">A bancada está vazia por enquanto.</p>
  return (
    <div className="dv-bancada" data-spot>
      {pecas.map((p, i) => (
        <article
          key={p.chave}
          className="dv-card dv-banca-peca"
          data-tipo={p.tipo}
          data-destaque={i === 0 || undefined}
          data-revelar
        >
          <div className="dv-banca-topo">
            <span className="dv-banca-tipo">{ROTULO_TIPO[p.tipo]}</span>
            {p.estado && <span className="dv-status">{p.estado}</span>}
          </div>
          <h3 className="dv-banca-titulo">{p.titulo}</h3>
          <p className="dv-banca-desc">{p.descricao}</p>
          {p.tags.length > 0 && (
            <ul className="dv-banca-tags" aria-label={`Tecnologias de ${p.titulo}`}>
              {p.tags.slice(0, 4).map((t) => (
                <li key={t} className="dv-tag">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {p.href && (
            <DevPanelFoot>
              {p.externo ? (
                <DevExternalLink href={p.href}>abrir</DevExternalLink>
              ) : (
                <DevInternalLink href={p.href}>abrir</DevInternalLink>
              )}
            </DevPanelFoot>
          )}
        </article>
      ))}
    </div>
  )
}
