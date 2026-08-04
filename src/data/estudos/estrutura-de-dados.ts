import type { Aula, Disciplina } from "./tipos"

/**
 * ESTRUTURA DE DADOS — 3º semestre, segunda-feira.
 *
 * Ficha transcrita do Programa de Disciplina oficial. O plano não traz
 * metodologia nem critérios de avaliação; por isso a página não exibe essas
 * seções, em vez de preenchê-las por conta própria.
 *
 * A sequência das aulas é a ordem dos conteúdos do plano distribuída pelos
 * vinte encontros do semestre — cada `unidade` corresponde a um item do
 * conteúdo programático.
 */

const AULAS: Aula[] = [
  { numero: 1, assunto: "Conceitos básicos sobre estruturas de dados", unidade: "Conceitos básicos sobre estruturas de dados" },
  { numero: 2, assunto: "Tipos abstratos de dados", unidade: "Tipos abstratos de dados" },
  { numero: 3, assunto: "Alocação dinâmica de memória", unidade: "Alocação Dinâmica de Memória" },
  { numero: 4, assunto: "Vetores e matrizes dinâmicas", unidade: "Alocação Dinâmica de Memória" },
  { numero: 5, assunto: "Manipulação de arquivos", unidade: "Manipulação de arquivos" },
  { numero: 6, assunto: "Pilhas: definição e operações", unidade: "Estruturas Lineares — Pilhas" },
  { numero: 7, assunto: "Pilhas: aplicações", unidade: "Estruturas Lineares — Pilhas" },
  { numero: 8, assunto: "Filas: definição e operações", unidade: "Estruturas Lineares — Filas" },
  { numero: 9, assunto: "Filas: aplicações", unidade: "Estruturas Lineares — Filas" },
  { numero: 10, assunto: "Listas simplesmente encadeadas", unidade: "Estruturas Lineares — Listas encadeadas" },
  { numero: 11, assunto: "Listas circulares", unidade: "Estruturas Lineares — Listas encadeadas" },
  { numero: 12, assunto: "Listas duplamente encadeadas", unidade: "Estruturas Lineares — Listas encadeadas" },
  { numero: 13, assunto: "Árvores: definição e terminologia", unidade: "Estruturas não-lineares — Árvores" },
  { numero: 14, assunto: "Árvores binárias e percursos", unidade: "Estruturas não-lineares — Árvores" },
  { numero: 15, assunto: "Árvores binárias de busca", unidade: "Estruturas não-lineares — Árvores" },
  { numero: 16, assunto: "Grafos: definição e representação", unidade: "Estruturas não-lineares — Grafos" },
  { numero: 17, assunto: "Grafos: percursos em largura e profundidade", unidade: "Estruturas não-lineares — Grafos" },
  { numero: 18, assunto: "Algoritmos de ordenação elementares", unidade: "Algoritmos de ordenação" },
  { numero: 19, assunto: "Algoritmos de ordenação eficientes", unidade: "Algoritmos de ordenação" },
  { numero: 20, assunto: "Métodos de busca e escolha da estrutura adequada", unidade: "Algoritmos de ordenação" },
]

export const ESTRUTURA_DE_DADOS: Disciplina = {
  slug: "estrutura-de-dados",
  nome: "Estrutura de Dados",
  nomeCurto: "estruturas",
  diaSemana: 1,

  curso: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas",
  periodo: 3,
  cargaHorariaAula: 80,
  cargaHorariaRelogio: 66,
  preRequisito: "Programação Estruturada",

  ementa:
    "Estruturas de dados na resolução de problemas computacionais, trabalhando com tipos abstratos de dados, arquivos, alocação de memória, vetores e matrizes dinâmicas. Estruturas de dados lineares e não-lineares: a lista e suas variantes. Métodos de ordenação e de busca.",

  objetivoGeral:
    "O objetivo geral da disciplina é fazer com que o aluno consiga desenvolver soluções computacionais utilizando recursos avançados de estruturas de dados em seus programas, independente da linguagem de programação que for utilizada.",

  conteudoPrograma: [
    { titulo: "Conceitos básicos sobre estruturas de dados" },
    { titulo: "Tipos abstratos de dados" },
    { titulo: "Alocação Dinâmica de Memória" },
    { titulo: "Manipulação de arquivos" },
    {
      titulo: "Estruturas Lineares",
      subtopicos: [
        "Pilhas: definição, operações e aplicações",
        "Filas: definição, operações e aplicações",
        "Listas encadeadas: simplesmente encadeadas, circulares e duplamente encadeadas",
      ],
    },
    { titulo: "Estruturas não-lineares", subtopicos: ["Árvores", "Grafos"] },
    { titulo: "Algoritmos de ordenação" },
  ],

  bibliografia: {
    basica: [
      { autor: "VELOSO, Paulo", titulo: "Estruturas de Dados", detalhes: "Rio de Janeiro: Campus, 2004." },
      {
        autor: "DROZDEK, Adam",
        titulo: "Estrutura de Dados e Algoritmos em C++",
        detalhes: "São Paulo: Cengage Learning, 2009.",
      },
      {
        autor: "SCHILDT, Herbert",
        titulo: "C, Completo e Total",
        detalhes: "3. ed. São Paulo: Makron Book, 1997.",
      },
    ],
    complementar: [
      {
        autor: "ASCENCIO, Ana F. G.; ARAUJO, Graziela S. A.",
        titulo: "Estruturas de Dados: Análise da Complexidade e Implementações em JAVA e C/C++",
        detalhes: "São Paulo: Pearson Prentice Hall, 2010.",
      },
      {
        autor: "KERNIGHAM, Brian W.; RITCHIE, Dennis M.",
        titulo: "C a Linguagem de Programação",
        detalhes: "Rio de Janeiro: Campus, 2002.",
      },
      {
        autor: "DEITEL, H. M.; DEITEL, P. J.",
        titulo: "Como Programar em C",
        detalhes: "Rio de Janeiro: LTC, 1999.",
      },
      {
        autor: "CELES, Waldemar; CERQUEIRA, Renato; RANGEL, José Lucas",
        titulo: "Introdução a estruturas de dados: com técnicas de programação em C",
        detalhes: "Rio de Janeiro: Elsevier, 2004. 294 p.",
      },
      {
        autor: "DEITEL, M. H.; DEITEL, P. J.",
        titulo: "C++ Como Programar",
        detalhes: "São Paulo: Pearson Prentice Hall, 2006.",
      },
      {
        autor: "PREISS, Bruno R.",
        titulo: "Estrutura de Dados e Algoritmos",
        detalhes: "Rio de Janeiro: Campus, 2001.",
      },
    ],
  },

  aulas: AULAS,
}
