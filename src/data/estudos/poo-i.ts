import type { Aula, Disciplina } from "./tipos"

/**
 * LINGUAGEM DE PROGRAMAÇÃO ORIENTADA A OBJETOS I — 3º semestre, quarta-feira.
 *
 * Ficha transcrita do Programa de Disciplina oficial. O plano não traz
 * metodologia nem critérios de avaliação, e a página omite essas seções.
 *
 * As aulas 19 e 20 cobrem "estrutura todo-parte, comunicação e associação" e o
 * desenvolvimento de programas de complexidade média — os dois estão na ementa
 * e no objetivo geral, e não na lista de conteúdos; por isso a `unidade` deles
 * aponta para a ementa, e não para um item do programa.
 */

const AULAS: Aula[] = [
  { numero: 1, assunto: "A essência da orientação a objetos", unidade: "Orientação a Objetos" },
  { numero: 2, assunto: "Metodologias orientadas a objetos", unidade: "Orientação a Objetos" },
  { numero: 3, assunto: "Evolução das linguagens de programação orientada a objetos", unidade: "Orientação a Objetos" },
  { numero: 4, assunto: "Bancos de dados orientados a objetos", unidade: "Orientação a Objetos" },
  { numero: 5, assunto: "Classes e objetos", unidade: "Linguagens de Programação Orientadas a Objetos" },
  { numero: 6, assunto: "Objetos ou instâncias", unidade: "Orientação a Objetos — implementação" },
  { numero: 7, assunto: "Atributos ou propriedades", unidade: "Orientação a Objetos — implementação" },
  { numero: 8, assunto: "Construtores", unidade: "Orientação a Objetos — implementação" },
  { numero: 9, assunto: "Métodos", unidade: "Orientação a Objetos — implementação" },
  { numero: 10, assunto: "Encapsulamento", unidade: "Orientação a Objetos — implementação" },
  { numero: 11, assunto: "Encapsulamento: modificadores de acesso", unidade: "Orientação a Objetos — implementação" },
  { numero: 12, assunto: "Herança", unidade: "Orientação a Objetos — implementação" },
  { numero: 13, assunto: "Herança: reescrita de métodos", unidade: "Orientação a Objetos — implementação" },
  { numero: 14, assunto: "Especialização, generalização e associação", unidade: "Linguagens de Programação Orientadas a Objetos" },
  { numero: 15, assunto: "Polimorfismo: conceito", unidade: "Linguagens de Programação Orientadas a Objetos" },
  { numero: 16, assunto: "Polimorfismo por sobrecarga", unidade: "Orientação a Objetos — implementação" },
  { numero: 17, assunto: "Polimorfismo por sobreposição", unidade: "Orientação a Objetos — implementação" },
  { numero: 18, assunto: "Acoplamento tardio e ligação dinâmica", unidade: "Linguagens de Programação Orientadas a Objetos" },
  { numero: 19, assunto: "Estrutura todo-parte, comunicação e associação", unidade: "Ementa — implementação de estruturas todo-parte" },
  { numero: 20, assunto: "Desenvolvimento de um programa orientado a objetos de complexidade média", unidade: "Objetivo geral — programas de complexidade simples e média" },
]

export const POO_I: Disciplina = {
  slug: "poo-i",
  nome: "Linguagem de Programação Orientada a Objetos I",
  nomeCurto: "poo i",
  diaSemana: 3,

  curso: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas",
  periodo: 3,
  cargaHorariaAula: 80,
  cargaHorariaRelogio: 66,
  preRequisito: "Programação Estruturada",

  ementa:
    "Implementação de classes, objetos, herança, polimorfismo, estrutura todo-parte, comunicação e associação.",

  objetivoGeral:
    "O objetivo geral da disciplina é permitir que o aluno estabeleça relações entre o raciocínio procedimental e o orientado a objetos, e consiga entender o que são e como os objetos podem ser construídos usando uma linguagem de programação orientada a objetos. A disciplina ainda tem como objetivo introduzir os conceitos básicos de orientação a objetos, de forma a propiciar aos alunos o desenvolvimento de programas orientados a objetos de complexidade simples e média.",

  conteudoPrograma: [
    {
      titulo: "Orientação a Objetos",
      subtopicos: [
        "A Essência da Orientação a Objetos",
        "Metodologias Orientadas a Objetos",
        "Bancos de Dados Orientados a Objetos",
        "Evolução das Linguagens de Programação Orientada a Objetos",
      ],
    },
    {
      titulo: "Linguagens de Programação Orientadas a Objetos",
      subtopicos: [
        "Classes e Objetos",
        "Polimorfismo",
        "Especialização X Generalização X Associação",
        "Acoplamento Tardio e Ligação Dinâmica",
      ],
    },
    {
      titulo: "Orientação a Objetos — implementação",
      subtopicos: [
        "Classes",
        "Objetos ou Instâncias",
        "Atributos ou Propriedades",
        "Construtores e Métodos",
        "Polimorfismo",
        "Herança",
        "Encapsulamento",
      ],
    },
  ],

  bibliografia: {
    basica: [
      {
        autor: "SEBESTA, Robert W.",
        titulo: "Conceitos de linguagens de programação",
        detalhes: "9. ed. Porto Alegre: Bookman, 2010. 638 p.",
      },
      {
        autor: "FURGERI, Sérgio",
        titulo: "Java 6: ensino didático: desenvolvendo e implementando aplicações",
        detalhes: "São Paulo: Érica, 2008. 352 p.",
      },
      {
        autor: "HORSTMANN, C. S.; CORNELL, G.",
        titulo: "Core Java 2: fundamentos",
        detalhes: "São Paulo: Makron Books, 2005. v. 1. 654 p. (Coleção Java).",
      },
    ],
    complementar: [
      {
        autor: "BERTAGNOLLI, Sílvia de Castro",
        titulo: "Fundamentos de programação orientada a objetos com Java 1.6",
        detalhes: "Porto Alegre: UniRitter, 2009. 233 p.",
      },
      {
        autor: "ECKEL, B.",
        titulo: "Thinking in Java",
        detalhes: "Livro de distribuição livre — http://www.mindview.net/javabook.html",
      },
      {
        autor: "HORSTMANN, Cay S.; CORNELL, Gary",
        titulo: "Core JAVA",
        detalhes: "8. ed. São Paulo: Pearson, 2010. 383 p.",
      },
      {
        autor: "HORSTMANN, Cay S.; CORNELL, Gary",
        titulo: "Core JAVA: volume 2: advanced features",
        detalhes: "8th ed. California, U.S.A.: Pearson, 2012. 1032 p.",
      },
      {
        autor: "HORSTMANN, Cay S.",
        titulo: "Conceitos de computação com Java",
        detalhes: "5. ed. Porto Alegre: Bookman, 2009. 720 p.",
      },
    ],
  },

  aulas: AULAS,
}
