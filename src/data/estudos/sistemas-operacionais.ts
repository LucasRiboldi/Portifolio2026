import type { Aula, Disciplina } from "./tipos"

/**
 * SISTEMAS OPERACIONAIS — 3º semestre, terça-feira.
 *
 * Ficha transcrita do Programa de Disciplina oficial. O plano não traz
 * metodologia nem critérios de avaliação, e a página omite essas seções em vez
 * de preenchê-las.
 */

const AULAS: Aula[] = [
  { numero: 1, assunto: "Organização geral do computador", unidade: "Organização geral do computador" },
  { numero: 2, assunto: "Introdução aos sistemas operacionais: objetivos", unidade: "Introdução a sistemas operacionais" },
  { numero: 3, assunto: "Visão do usuário", unidade: "Introdução a sistemas operacionais" },
  { numero: 4, assunto: "Histórico dos sistemas operacionais", unidade: "Introdução a sistemas operacionais" },
  { numero: 5, assunto: "Conceitos fundamentais de processos", unidade: "Conceitos fundamentais de processos" },
  { numero: 6, assunto: "Threads", unidade: "Conceitos fundamentais de processos" },
  { numero: 7, assunto: "Comunicação entre processos e threads", unidade: "Conceitos fundamentais de processos" },
  { numero: 8, assunto: "Escalonamento de processos e threads: conceitos", unidade: "Conceitos fundamentais de processos" },
  { numero: 9, assunto: "Escalonamento: algoritmos clássicos", unidade: "Conceitos fundamentais de processos" },
  { numero: 10, assunto: "Hierarquia de memória", unidade: "Noções de gerência de memória" },
  { numero: 11, assunto: "Paginação", unidade: "Noções de gerência de memória" },
  { numero: 12, assunto: "Segmentação", unidade: "Noções de gerência de memória" },
  { numero: 13, assunto: "Memória virtual", unidade: "Noções de gerência de memória" },
  { numero: 14, assunto: "Sistemas de arquivos: arquivos", unidade: "Sistemas de arquivos" },
  { numero: 15, assunto: "Diretórios", unidade: "Sistemas de arquivos" },
  { numero: 16, assunto: "Implementação do sistema de arquivos", unidade: "Sistemas de arquivos" },
  { numero: 17, assunto: "Gerenciamento e otimização dos sistemas de arquivos", unidade: "Sistemas de arquivos" },
  { numero: 18, assunto: "Exemplos de sistemas de arquivos", unidade: "Sistemas de arquivos" },
  { numero: 19, assunto: "Entrada e saída: princípios de software e dispositivos periféricos", unidade: "Entrada e saída" },
  { numero: 20, assunto: "Estudos de caso: Windows e Linux", unidade: "Estudos de Caso" },
]

export const SISTEMAS_OPERACIONAIS: Disciplina = {
  slug: "sistemas-operacionais",
  nome: "Sistemas Operacionais",
  nomeCurto: "sist. op.",
  diaSemana: 2,

  curso: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas",
  periodo: 3,
  cargaHorariaAula: 80,
  cargaHorariaRelogio: 66,
  preRequisito: "Arquitetura de Computadores e Programação Estruturada",

  ementa:
    "Objetivos e evolução. Estrutura e o contexto dentro do software básico. Gerenciamento de processos e da CPU. Gerenciamento de memória (real e virtual). Gerenciamento de entrada/saída. Gerência de arquivos. Estudos de casos.",

  objetivoGeral:
    "O objetivo geral da disciplina é permitir que o aluno compreenda os conceitos básicos de sistemas operacionais, descrevendo os componentes básicos de um sistema operacional convencional: programação concorrente e gerenciamento de processos, programação de entrada e saída, gerência de memória e gerência de arquivos.",

  conteudoPrograma: [
    { titulo: "Organização geral do computador" },
    {
      titulo: "Introdução a sistemas operacionais",
      subtopicos: ["Objetivos", "Visão do usuário", "Histórico"],
    },
    {
      titulo: "Conceitos fundamentais de processos",
      subtopicos: [
        "Processos e threads",
        "Comunicação entre processos e threads",
        "Escalonamento de processos e threads",
      ],
    },
    {
      titulo: "Noções de gerência de memória",
      subtopicos: ["Hierarquia de memória", "Paginação e segmentação", "Memória virtual"],
    },
    {
      titulo: "Sistemas de arquivos",
      subtopicos: [
        "Arquivos",
        "Diretórios",
        "Implementação do sistema de arquivos",
        "Gerenciamento e otimização dos sistemas de arquivos",
        "Exemplos de sistemas de arquivos",
      ],
    },
    {
      titulo: "Entrada e saída",
      subtopicos: [
        "Princípios básicos de software de entrada e saída",
        "Dispositivos periféricos típicos",
      ],
    },
    {
      titulo: "Estudos de Caso",
      subtopicos: ["Sistema Operacional Windows", "Sistema Operacional Linux"],
    },
  ],

  bibliografia: {
    basica: [
      {
        autor: "OLIVEIRA, R. S.; CARISSIMI, A. S.; TOSCANI, S. S.",
        titulo: "Sistemas Operacionais",
        detalhes: "4. ed. Porto Alegre: Bookman, 2010.",
      },
      {
        autor: "SILBERSCHATZ, A.; GALVIN, P. B.; GAGNE, G.",
        titulo: "Fundamentos de Sistemas Operacionais",
        detalhes: "8. ed. Rio de Janeiro: LTC, 2010.",
      },
      {
        autor: "TANENBAUM, A.",
        titulo: "Sistemas Operacionais Modernos",
        detalhes: "3. ed. São Paulo: Pearson Prentice Hall, 2010.",
      },
    ],
    complementar: [
      {
        autor: "DANESH, Arman",
        titulo: "Dominando o Linux: a bíblia",
        detalhes: "São Paulo: Makron Books, 1999. 602 p.",
      },
      {
        autor: "DEITEL, Harvey M.; DEITEL, Paul J.; CHOFNES, David R.",
        titulo: "Sistemas Operacionais",
        detalhes: "3. ed. São Paulo: Pearson, 2005.",
      },
      {
        autor: "DULANEY, Emmett; BARKAKATI, Naba",
        titulo: "Linux — Referência Completa Para Leigos",
        detalhes: "Rio de Janeiro: Alta Books, 2009.",
      },
      {
        autor: "LAUREANO, Marcos Aurélio Pchek; OLSEN, Diogo Roberto",
        titulo: "Sistemas Operacionais",
        detalhes: "Curitiba: Livro Técnico, 2011.",
      },
      {
        autor: "MACHADO, Francis Berenger; MAIA, Luiz Paulo",
        titulo: "Arquitetura de Sistemas Operacionais",
        detalhes: "4. ed. Rio de Janeiro: LTC, 2007.",
      },
      {
        autor: "SILBERSCHATZ, A.; GALVIN, P. B.; GAGNE, G.",
        titulo: "Sistemas Operacionais com Java",
        detalhes: "7. ed. Rio de Janeiro: Campus, 2008.",
      },
      {
        autor: "STATO FILHO, André",
        titulo: "Domínio Linux — Do Básico a Servidores",
        detalhes: "2. ed. São Paulo: Visual Books, 2005.",
      },
      {
        autor: "TANENBAUM, A. S.; WOODHULL, A. S.",
        titulo: "Sistemas Operacionais: Projeto e Implementação",
        detalhes: "3. ed. Rio de Janeiro: Bookman, 2008.",
      },
    ],
  },

  aulas: AULAS,
}
