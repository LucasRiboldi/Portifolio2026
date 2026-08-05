/**
 * DEV — peças do acervo de referência.
 *
 * Todas montam sobre `.dv-card` e as primitivas de `dev-primitives`: o realm já
 * tem superfície, tag, link de saída e cabeçalho de painel resolvidos, e criar
 * uma segunda linguagem visual aqui faria a página parecer dois sites colados.
 * O CSS novo em `dracula.css` cobre só o que não existia — grade de badges,
 * trilha do roadmap e a lombada dos livros.
 *
 * Nenhuma delas usa estado: são todas server components. O que precisa de
 * interação (filtro, copiar código) já existe em componentes próprios do realm.
 */

import type { ReactNode } from "react"

import type { Certificacao, Livro, RoadmapEtapa } from "@/data/dev"
import type { Noticia, RepoEstrelado } from "@/lib/repos/tech-feed"
import { DevExternalLink, DevPanel, DevPanelFoot, DevPanelHead, TagList } from "./ui/dev-primitives"

/* ────────────────────────────────────────────────────────────────────────
   NOTÍCIAS
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Data relativa curta ("3 h", "2 d").
 *
 * Notícia é sobre recência, e "há 3 horas" responde isso mais rápido do que uma
 * data absoluta que o leitor teria de comparar mentalmente com hoje. Acima de um
 * mês a distância deixa de importar e a data absoluta volta a ser mais honesta.
 */
function quando(iso: string): string {
  const ms = Date.now() - Date.parse(iso)
  if (Number.isNaN(ms)) return ""
  const h = Math.floor(ms / 3_600_000)
  if (h < 1) return "agora há pouco"
  if (h < 24) return `há ${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `há ${d} d`
  return new Date(iso).toLocaleDateString("pt-BR")
}

export function PainelNoticias({
  titulo,
  fonte,
  noticias,
  vazio,
}: {
  titulo: string
  /** Origem, dita uma vez no cabeçalho em vez de repetida em cada item. */
  fonte: string
  noticias: readonly Noticia[]
  /** Texto quando a fonte não respondeu. */
  vazio: string
}) {
  return (
    <DevPanel className="dv-feed">
      <DevPanelHead title={titulo} badge={<span className="dv-status">{fonte}</span>} />
      {noticias.length === 0 ? (
        <p className="dv-empty">{vazio}</p>
      ) : (
        <ol className="dv-feed-list">
          {noticias.map((n) => (
            <li key={n.id} className="dv-feed-item">
              <a href={n.url} target="_blank" rel="noreferrer" className="dv-feed-link">
                {n.titulo}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
              <p className="dv-feed-meta">
                <time dateTime={n.data}>{quando(n.data)}</time>
                {n.pontos != null && <span className="dv-feed-pontos">▲ {n.pontos}</span>}
                {n.autor && <span className="dv-feed-autor">{n.autor}</span>}
              </p>
            </li>
          ))}
        </ol>
      )}
    </DevPanel>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   REPOSITÓRIOS ESTRELADOS
   ──────────────────────────────────────────────────────────────────────── */

export function GradeEstrelados({ repos }: { repos: readonly RepoEstrelado[] }) {
  if (repos.length === 0) {
    return <p className="dv-empty">A API do GitHub não respondeu agora. A lista volta na próxima revalidação.</p>
  }
  return (
    <div className="dv-objects">
      {repos.map((r) => (
        <DevPanel key={r.id}>
          <DevPanelHead
            title={r.nomeCompleto}
            badge={
              <span className="dv-status" title={`${r.estrelas} estrelas`}>
                ★ {r.estrelas.toLocaleString("pt-BR")}
              </span>
            }
          />
          {r.descricao && <p>{r.descricao}</p>}
          {r.topicos.length > 0 && <TagList items={r.topicos} label="Tópicos" />}
          <DevPanelFoot>
            {r.linguagem && <span className="dv-feed-autor">{r.linguagem}</span>}
            <DevExternalLink href={r.url}>abrir no GitHub</DevExternalLink>
          </DevPanelFoot>
        </DevPanel>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ROADMAP
   ──────────────────────────────────────────────────────────────────────── */

const ROTULO_ETAPA = {
  concluido: "concluído",
  estudando: "estudando",
  planejado: "planejado",
} as const

/**
 * `<ol>` porque a ordem é o conteúdo: uma trilha embaralhada não é uma trilha.
 * O `aria-current` marca onde o estudo está agora — informação que a cor
 * sozinha daria só a quem enxerga.
 */
export function TrilhaJava({ etapas }: { etapas: readonly RoadmapEtapa[] }) {
  return (
    <ol className="dv-trilha">
      {etapas.map((e) => (
        <li
          key={e.ordem}
          className="dv-trilha-etapa"
          data-status={e.status}
          aria-current={e.status === "estudando" ? "step" : undefined}
        >
          <div className="dv-trilha-marco" aria-hidden>
            {String(e.ordem).padStart(2, "0")}
          </div>
          <div className="dv-trilha-corpo">
            <div className="dv-panel-head">
              <h3>{e.titulo}</h3>
              <span className={`dv-status ${e.status === "concluido" ? "done" : ""}`.trim()}>
                {ROTULO_ETAPA[e.status]}
              </span>
            </div>
            <p className="dv-prose">{e.objetivo}</p>
            <TagList items={e.topicos} label={`Tópicos de ${e.titulo}`} />
            <p className="dv-trilha-criterio">
              <strong>Pronto quando:</strong> {e.criterio}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   CERTIFICAÇÕES
   ──────────────────────────────────────────────────────────────────────── */

/**
 * O badge é um selo, e selo sem verificação é enfeite — por isso quem tem `url`
 * vira link e quem não tem fica explicitamente sem. O status entra como texto,
 * não só como cor: "obtida" e "planejada" precisam se distinguir no leitor de
 * tela e no daltonismo.
 */
export function GradeBadges({ itens }: { itens: readonly Certificacao[] }) {
  return (
    <ul className="dv-badges">
      {itens.map((c) => {
        const miolo = (
          <>
            <span className="dv-badge-sigla" aria-hidden>
              {c.sigla}
            </span>
            <span className="dv-badge-nome">{c.nome}</span>
            <span className="dv-badge-emissor">
              {c.emissor} · {c.ano}
            </span>
            <span className={`dv-status ${c.status === "obtida" ? "done" : ""}`.trim()}>{c.status}</span>
          </>
        )
        return (
          <li key={c.nome} className="dv-badge" data-status={c.status}>
            {c.url ? (
              <a href={c.url} target="_blank" rel="noreferrer" className="dv-badge-face">
                {miolo}
                <span className="sr-only"> — verificar (abre em nova aba)</span>
              </a>
            ) : (
              <div className="dv-badge-face">{miolo}</div>
            )}
            <p className="dv-badge-nota">{c.nota}</p>
          </li>
        )
      })}
    </ul>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ESTANTE
   ──────────────────────────────────────────────────────────────────────── */

const ROTULO_LIVRO = { lido: "lido", lendo: "lendo", fila: "na fila" } as const

export function Estante({ livros, titulo }: { livros: readonly Livro[]; titulo: string }) {
  if (livros.length === 0) return null
  return (
    <div className="dv-estante-bloco">
      <h3 className="dv-estante-titulo">
        {titulo} <span className="dv-count">{livros.length}</span>
      </h3>
      <ul className="dv-estante">
        {livros.map((l) => (
          <li key={l.titulo} className="dv-livro" data-status={l.status}>
            <div className="dv-livro-topo">
              <h4>{l.titulo}</h4>
              <span className="dv-status">{ROTULO_LIVRO[l.status]}</span>
            </div>
            <p className="dv-livro-autor">
              {l.autor} · {l.area}
            </p>
            {/* Nota 0 significa "não lido", e estrela vazia comunicaria
                "achei ruim" — que é uma afirmação que ninguém fez. */}
            {l.nota > 0 && (
              <p className="dv-livro-nota" aria-label={`nota ${l.nota} de 5`}>
                <span aria-hidden>{"★".repeat(l.nota) + "☆".repeat(5 - l.nota)}</span>
              </p>
            )}
            <p className="dv-prose">{l.comentario}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   ÍNDICE DO REPOSITÓRIO VIVO
   ──────────────────────────────────────────────────────────────────────── */

export interface EntradaConhecimento {
  href: string
  titulo: string
  descricao: string
  /** Quantos itens existem lá dentro. Responde "vale a pena entrar?". */
  total: number
  unidade: string
}

export function IndiceConhecimento({ entradas }: { entradas: readonly EntradaConhecimento[] }) {
  return (
    <div className="dv-objects">
      {/* `key` pelo título e não pelo href: duas coleções podem legitimamente
          apontar para a mesma rota (a trilha de Java e as folhas de consulta
          moram ambas em /java), e o href repetido colidia a chave. */}
      {entradas.map((e) => (
        <DevPanel key={e.titulo}>
          <DevPanelHead
            title={e.titulo}
            href={e.href}
            badge={
              <span className="dv-count">
                {e.total} {e.unidade}
              </span>
            }
          />
          <p>{e.descricao}</p>
        </DevPanel>
      ))}
    </div>
  )
}

/** Envelope de bloco para as páginas novas, com o mesmo respiro das seções. */
export function BlocoAcervo({ children }: { children: ReactNode }) {
  return <div className="dv-stack">{children}</div>
}
