/**
 * ESTUDOS — o contrato de uma disciplina.
 *
 * Este arquivo existe para que acrescentar uma disciplina seja escrever um
 * arquivo de dados, e nada mais: a rota é uma só (`/desenvolvedor/estudos/
 * [disciplina]`), a página é uma só, e os componentes leem tudo daqui. Nenhuma
 * lógica da aplicação conhece "Banco de Dados" pelo nome.
 *
 * O que é OFICIAL (ementa, objetivo, conteúdo programático, bibliografia, carga
 * horária) vem transcrito do Plano de Ensino e não se inventa. O que é DIDÁTICO
 * (explicações, exemplos, exercícios) aprofunda um tópico que já está no plano —
 * nunca acrescenta assunto que o plano não previu.
 */

/** Dia da semana em que a disciplina ocorre. 1 = segunda … 5 = sexta. */
export type DiaSemana = 1 | 2 | 3 | 4 | 5

/** Uma referência bibliográfica como o plano a escreve. */
export interface Referencia {
  autor: string
  titulo: string
  detalhes: string
}

export interface Bibliografia {
  basica: Referencia[]
  complementar: Referencia[]
}

/** Um item do conteúdo programático oficial, com os subtópicos do plano. */
export interface TopicoPrograma {
  titulo: string
  subtopicos?: string[]
}

export type NivelExercicio = "basico" | "intermediario" | "avancado" | "desafio"

export interface Exercicio {
  /** Único dentro da disciplina — é a chave de persistência do progresso. */
  id: string
  nivel: NivelExercicio
  enunciado: string
  dica: string
  /** Resolução comentada: o raciocínio, não só o resultado. */
  resolucao: string
  resposta: string
}

/**
 * Um exemplo. Com `codigo`, vira bloco destacado; `linhas` explica linha a
 * linha, que é o pedido para todo exemplo de programação.
 */
export interface Exemplo {
  titulo: string
  /** `sql`, `java`, `c`, `bash`… Ausente quando o exemplo é conceitual. */
  linguagem?: string
  codigo?: string
  /** Explicação geral do exemplo, antes do código. */
  descricao?: string
  /** Leitura guiada: cada entrada aponta um trecho e explica o que ele faz. */
  linhas?: { trecho: string; explicacao: string }[]
}

export interface Conceito {
  termo: string
  definicao: string
}

/** O corpo de uma aula. */
export interface ConteudoAula {
  resumo: string
  /** A versão sem jargão — a que se daria a quem nunca viu o assunto. */
  explicacaoSimples: string
  /** A versão com o vocabulário da área, que é o que a prova cobra. */
  explicacaoTecnica: string
  aplicacoes: string[]
  curiosidades: string[]
  conceitos: Conceito[]
  exemplos: Exemplo[]
}

/** O fechamento da aula. */
export interface ResumoAula {
  conceitosImportantes: string[]
  checklist: string[]
  palavrasChave: string[]
  pontosRevisao: string[]
}

export interface Aula {
  /** 1-based. A data NÃO fica aqui: é calculada em `lib/estudos/calendario`. */
  numero: number
  assunto: string
  /** A qual bloco do conteúdo programático oficial esta aula pertence. */
  unidade: string
  conteudo?: ConteudoAula
  exercicios?: Exercicio[]
  resumo?: ResumoAula
}

export interface Disciplina {
  /** Segmento da URL e prefixo de toda chave de persistência. */
  slug: string
  nome: string
  /** Rótulo curto, para o dock e a navegação. */
  nomeCurto: string
  diaSemana: DiaSemana
  /* ─── Identificação, como consta no Plano de Ensino ─── */
  curso: string
  periodo: number
  cargaHorariaAula: number
  cargaHorariaRelogio: number
  preRequisito: string
  /* ─── Corpo do plano ─── */
  ementa: string
  objetivoGeral: string
  conteudoPrograma: TopicoPrograma[]
  bibliografia: Bibliografia
  /* ─── Didático ─── */
  aulas: Aula[]
}

/** Rótulo de cada dia, na ordem do `DiaSemana`. */
export const DIAS: Record<DiaSemana, string> = {
  1: "segunda-feira",
  2: "terça-feira",
  3: "quarta-feira",
  4: "quinta-feira",
  5: "sexta-feira",
}

export const NIVEIS: Record<NivelExercicio, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
  desafio: "Desafio",
}
