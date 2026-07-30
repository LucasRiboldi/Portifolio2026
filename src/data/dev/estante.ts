/**
 * Estante do realm dev — certificações e livros de referência.
 *
 * Os dois são acervo declarado: dizem em que o estudo foi investido e o que
 * sustenta as decisões técnicas do resto do site. Vivem em código pelo mesmo
 * motivo do `java.ts` — é material que se revisa em pull request, não conteúdo
 * editorial de painel. Ver o cabeçalho daquele arquivo para o raciocínio inteiro.
 */

export type CertStatus = "obtida" | "estudando" | "planejada"

export interface Certificacao {
  /** Nome oficial. É a chave visual do badge. */
  nome: string
  emissor: string
  /** Sigla curta estampada no badge — o nome inteiro não cabe. */
  sigla: string
  status: CertStatus
  /** Ano de obtenção, ou o alvo quando ainda não veio. */
  ano: number
  /** Página de verificação. Badge sem verificação é enfeite. */
  url?: string
  /** Por que ela está aqui — o que provou, não o que promete. */
  nota: string
}

export const certificacoes: Certificacao[] = [
  {
    nome: "Oracle Certified Associate — Java SE 8 Programmer",
    emissor: "Oracle",
    sigla: "OCA",
    status: "estudando",
    ano: 2026,
    nota: "O exame força a ler código como a JVM lê, não como a gente gostaria que fosse.",
  },
  {
    nome: "AWS Certified Cloud Practitioner",
    emissor: "Amazon Web Services",
    sigla: "CLF",
    status: "planejada",
    ano: 2026,
    nota: "Vocabulário comum de nuvem — o que cada serviço é antes de escolher qual usar.",
  },
  {
    nome: "Scrum Foundation Professional",
    emissor: "CertiProf",
    sigla: "SFPC",
    status: "obtida",
    ano: 2024,
    nota: "Menos sobre cerimônia e mais sobre por que o lote pequeno reduz risco.",
  },
  {
    nome: "Responsive Web Design",
    emissor: "freeCodeCamp",
    sigla: "RWD",
    status: "obtida",
    ano: 2023,
    url: "https://www.freecodecamp.org/certification/",
    nota: "300 horas de CSS na unha. É a base de tudo que virou os realms deste site.",
  },
  {
    nome: "JavaScript Algorithms and Data Structures",
    emissor: "freeCodeCamp",
    sigla: "JS",
    status: "obtida",
    ano: 2023,
    url: "https://www.freecodecamp.org/certification/",
    nota: "Onde recursão e complexidade deixaram de ser palavra e viraram custo medido.",
  },
  {
    nome: "SQL (Intermediate)",
    emissor: "HackerRank",
    sigla: "SQL",
    status: "obtida",
    ano: 2024,
    nota: "Join, window function e agregação — o que sustenta as consultas do Supabase aqui.",
  },
]

export type LivroStatus = "lido" | "lendo" | "fila"

export interface Livro {
  titulo: string
  autor: string
  /** Assunto, para filtrar a estante. */
  area: string
  status: LivroStatus
  /** 0 quando ainda não foi lido — nota de quem não leu não vale nada. */
  nota: number
  /** O que ficou do livro. Em livro na fila, por que ele entrou. */
  comentario: string
}

export const livros: Livro[] = [
  {
    titulo: "Código Limpo",
    autor: "Robert C. Martin",
    area: "Ofício",
    status: "lido",
    nota: 4,
    comentario:
      "Vale pelo capítulo de nomes e pelo de funções. O resto envelheceu, e discordar dele em pontos específicos é sinal de que a leitura funcionou.",
  },
  {
    titulo: "Refatoração",
    autor: "Martin Fowler",
    area: "Ofício",
    status: "lido",
    nota: 5,
    comentario:
      "O catálogo é a menor parte. O que importa é a disciplina: passo pequeno, teste verde, repetir.",
  },
  {
    titulo: "Padrões de Projeto (GoF)",
    autor: "Gamma, Helm, Johnson e Vlissides",
    area: "Arquitetura",
    status: "lido",
    nota: 4,
    comentario:
      "Denso e datado nos exemplos, mas é a origem do vocabulário. Ler para nomear o que já se faz sem saber.",
  },
  {
    titulo: "O Programador Pragmático",
    autor: "Andrew Hunt e David Thomas",
    area: "Ofício",
    status: "lido",
    nota: 5,
    comentario: "O livro que mais mudou como eu decido, e não como eu escrevo.",
  },
  {
    titulo: "Effective Java",
    autor: "Joshua Bloch",
    area: "Java",
    status: "lendo",
    nota: 0,
    comentario:
      "Cada item é uma decisão de projeto justificada. Lendo junto com a etapa 5 do roadmap.",
  },
  {
    titulo: "Projetando Aplicações com Uso Intensivo de Dados",
    autor: "Martin Kleppmann",
    area: "Sistemas",
    status: "lendo",
    nota: 0,
    comentario:
      "Explica o que replicação e consenso custam de verdade. Leitura lenta, de um capítulo por semana.",
  },
  {
    titulo: "Domain-Driven Design",
    autor: "Eric Evans",
    area: "Arquitetura",
    status: "fila",
    nota: 0,
    comentario: "Entrou porque modelar domínio é onde meus projetos ainda desandam primeiro.",
  },
  {
    titulo: "A Arquitetura Limpa",
    autor: "Robert C. Martin",
    area: "Arquitetura",
    status: "fila",
    nota: 0,
    comentario: "Para ler em par com o DDD e comparar onde os dois discordam.",
  },
  {
    titulo: "Java Concorrente na Prática",
    autor: "Brian Goetz",
    area: "Java",
    status: "fila",
    nota: 0,
    comentario: "Pré-requisito declarado da etapa 6 do roadmap.",
  },
  {
    titulo: "O Guia do SRE do Google",
    autor: "Beyer, Jones, Petoff e Murphy",
    area: "Operação",
    status: "fila",
    nota: 0,
    comentario: "Quero a parte de SLO e orçamento de erro antes de falar em confiabilidade.",
  },
]
