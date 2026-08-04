import type { Aula, Disciplina } from "./tipos"

/**
 * ENGENHARIA DE SOFTWARE I — 3º semestre, sexta-feira.
 *
 * Ficha transcrita do Programa de Disciplina oficial. O plano não traz
 * metodologia nem critérios de avaliação, e a página omite essas seções.
 */

const AULAS: Aula[] = [
  { numero: 1, assunto: "Conceitos e paradigmas de Engenharia de Software", unidade: "Introdução à Engenharia de Software" },
  { numero: 2, assunto: "Crise do software", unidade: "Introdução à Engenharia de Software" },
  { numero: 3, assunto: "Processo de desenvolvimento e fases da Engenharia de Software", unidade: "Introdução à Engenharia de Software" },
  { numero: 4, assunto: "Modelos de processo: cascata e espiral", unidade: "Modelos de Processo de Desenvolvimento de Software" },
  { numero: 5, assunto: "Prototipação evolutiva", unidade: "Modelos de Processo de Desenvolvimento de Software" },
  { numero: 6, assunto: "Processo Unificado", unidade: "Modelos de Processo de Desenvolvimento de Software" },
  { numero: 7, assunto: "Conceitos ágeis: timebox, sprints, velocidade, pronto e kanban", unidade: "Desenvolvimento Ágil de Software" },
  { numero: 8, assunto: "Scrum: papéis", unidade: "Desenvolvimento Ágil de Software" },
  { numero: 9, assunto: "Scrum: cerimônias e artefatos", unidade: "Desenvolvimento Ágil de Software" },
  { numero: 10, assunto: "User stories e estimativas com planning poker", unidade: "Desenvolvimento Ágil de Software" },
  { numero: 11, assunto: "Controle de versões: conceitos, fluxo e tipos", unidade: "Controle de Versões" },
  { numero: 12, assunto: "GIT: workflow e aplicação prática", unidade: "Controle de Versões" },
  { numero: 13, assunto: "Engenharia de requisitos: conceitos e tipos", unidade: "Engenharia de requisitos" },
  { numero: 14, assunto: "Fases da engenharia de requisitos", unidade: "Engenharia de requisitos" },
  { numero: 15, assunto: "Técnicas de elicitação de requisitos", unidade: "Engenharia de requisitos" },
  { numero: 16, assunto: "Modelo de requisitos: documento de visão, glossário e requisitos não funcionais", unidade: "Engenharia de requisitos" },
  { numero: 17, assunto: "Casos de uso: representação UML e especificação", unidade: "Engenharia de requisitos" },
  { numero: 18, assunto: "Diagrama de casos de uso", unidade: "Engenharia de requisitos" },
  { numero: 19, assunto: "Modelagem visual e diagrama de atividade", unidade: "Modelagem Visual" },
  { numero: 20, assunto: "Diagrama de máquina de estados e diagrama de classes", unidade: "Modelagem Visual" },
]

export const ENGENHARIA_DE_SOFTWARE_I: Disciplina = {
  slug: "engenharia-de-software-i",
  nome: "Engenharia de Software I",
  nomeCurto: "eng. soft.",
  diaSemana: 5,

  curso: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas",
  periodo: 3,
  cargaHorariaAula: 80,
  cargaHorariaRelogio: 66,
  preRequisito: "Algoritmos",

  ementa:
    "Conceituação de Software e Engenharia de Software. Visão geral sobre processos de desenvolvimento de software, com ênfase no Processo Unificado e em Metodologias Ágeis. Engenharia de Requisitos: apresentação de abordagens sistemáticas para capturar, analisar, especificar, verificar e gerenciar os requisitos de um sistema. Controle e Gerenciamento de Versão (GIT). Técnicas e linguagens de modelagem para análise e projeto de sistemas: diagrama de casos de uso, de atividade, de máquina de estados e de classes.",

  objetivoGeral:
    "O objetivo geral desta disciplina é capacitar o aluno para atuar como engenheiro de software, dando uma visão geral do processo de desenvolvimento de software e das técnicas que podem ser utilizadas em cada fase do ciclo de vida do software, com foco na gestão de requisitos e na análise orientada a objetos.",

  conteudoPrograma: [
    {
      titulo: "Introdução à Engenharia de Software",
      subtopicos: [
        "Conceitos e Paradigmas de Engenharia de Software",
        "Crise de Software",
        "Processo de Desenvolvimento de Software",
        "Fases da Engenharia de Software",
      ],
    },
    {
      titulo: "Modelos de Processo de Desenvolvimento de Software",
      subtopicos: ["Cascata", "Espiral", "Prototipação Evolutiva", "Processo Unificado", "Metodologias Ágeis"],
    },
    {
      titulo: "Desenvolvimento Ágil de Software",
      subtopicos: [
        "Conceitos: timebox, sprints, velocidade, pronto, kanban",
        "Framework Scrum: papéis (dono do produto, scrum master e equipe), cerimônias (planejamento, revisão, retrospectiva e diária) e artefatos (produto backlog, sprint backlog e burndown)",
        "User Stories e estimativas (planning poker)",
      ],
    },
    {
      titulo: "Controle de Versões",
      subtopicos: [
        "Conceitos e utilidade",
        "Fluxo de processo",
        "Tipos: centralizado e descentralizado",
        "GIT: workflow e aplicação prática (interface de linha de comando)",
      ],
    },
    {
      titulo: "Engenharia de requisitos",
      subtopicos: [
        "Conceitos",
        "Tipos: negócio e sistemas (funcional e não funcional)",
        "Fases: elicitação, análise, documentação, validação e gerenciamento",
        "Técnicas: leitura de documentos, entrevistas, questionários, etc.",
        "Modelo de Requisitos: Documento de Visão, Glossário, Requisitos Não Funcionais",
        "Casos de Uso: Representação UML e especificação",
        "Diagrama de Casos de Uso",
      ],
    },
    {
      titulo: "Modelagem Visual",
      subtopicos: [
        "Definição de Modelos",
        "Tipos e categorias de diagramas da Linguagem de Modelagem Unificada (UML)",
        "Visões e diagramas UML",
        "Diagrama de atividade: ações, arestas, fluxo de controle, fluxo de objetos, nodos inicial e final, fluxos alternativos e concorrentes, partições e gerenciamento de exceções",
        "Diagrama de Máquina de Estados: estados, transições, tipos de eventos, tipos de estados, pontos de entrada e saída",
        "Diagrama de Classes: modelo de domínio",
      ],
    },
  ],

  bibliografia: {
    basica: [
      {
        autor: "SOMMERVILLE, Ian",
        titulo: "Engenharia de Software",
        detalhes: "8. ed. São Paulo: Pearson, 2007.",
      },
      {
        autor: "COCKBURN, Alistair",
        titulo: "Escrevendo Casos de Uso Eficazes",
        detalhes: "Porto Alegre: Artmed, 2004. 254 p.",
      },
      { autor: "FOWLER, Martin", titulo: "UML Essencial", detalhes: "3. ed. Bookman, 2004." },
    ],
    complementar: [
      {
        autor: "KRUCHTEN, Philippe",
        titulo: "Introdução ao RUP: Rational Unified Process",
        detalhes: "Rio de Janeiro: Ciência Moderna, 2003. 255 p.",
      },
      {
        autor: "PRESSMAN, R.",
        titulo: "Engenharia de Software",
        detalhes: "7. ed. McGraw-Hill, 2011.",
      },
      {
        autor: "BOOCH, Grady; JACOBSON, Ivan; RUMBAUGH, James",
        titulo: "UML: Guia do Usuário",
        detalhes: "Rio de Janeiro: Campus, 2005.",
      },
      {
        autor: "PFLEEGER, Shari Lawrence",
        titulo: "Engenharia de Software — Teoria e Prática",
        detalhes: "2. ed. Prentice Hall, 2003.",
      },
      {
        autor: "STEPPAT, Nico; KUNG, Fabio",
        titulo: "Introdução à Arquitetura e Design de Software",
        detalhes: "Rio de Janeiro: Campus.",
      },
    ],
  },

  aulas: AULAS,
}
