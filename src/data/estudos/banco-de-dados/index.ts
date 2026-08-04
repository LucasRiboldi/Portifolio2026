import type { Disciplina } from "../tipos"
import { AULAS_01_03 } from "./aulas-01-03"
import { AULAS_04_05 } from "./aulas-04-05"
import { AULAS_06_07 } from "./aulas-06-07"
import { AULA_08 } from "./aula-08"
import { AULAS_09_10 } from "./aulas-09-10"
import { AULA_11 } from "./aula-11"
import { AULAS_12_13 } from "./aulas-12-13"
import { AULA_14 } from "./aula-14"
import { AULAS_15_16 } from "./aulas-15-16"
import { AULAS_17_18 } from "./aulas-17-18"
import { AULAS_19_20 } from "./aulas-19-20"

/**
 * BANCO DE DADOS — 3º semestre, quinta-feira.
 *
 * Ementa, objetivo, conteúdo programático e bibliografia transcritos do
 * Programa de Disciplina oficial. Não se alterou redação, não se acrescentou
 * tópico e não se inventou critério de avaliação — o plano não traz metodologia
 * nem avaliação, e por isso a página não exibe essas seções.
 */
export const BANCO_DE_DADOS: Disciplina = {
  slug: "banco-de-dados",
  nome: "Banco de Dados",
  nomeCurto: "banco",
  diaSemana: 4,

  curso: "Superior de Tecnologia em Análise e Desenvolvimento de Sistemas",
  periodo: 3,
  cargaHorariaAula: 80,
  cargaHorariaRelogio: 66,
  preRequisito: "Programação Estruturada",

  ementa:
    "Características e vantagens de Sistemas Gerenciadores de Bancos de Dados (SGBDs), modelagem entidade-relacionamento, modelo relacional, normalização de relações, linguagens de consulta estruturada (Structured Query Language - SQL) e Álgebra Relacional.",

  objetivoGeral:
    "O objetivo geral da disciplina é permitir que o aluno adquira os conhecimentos básicos sobre bancos de dados e SGBD, ressaltando os aspectos de modelagem e manipulação de dados.",

  conteudoPrograma: [
    {
      titulo: "Introdução aos SGBDs",
      subtopicos: [
        "Gerência de dados antes do conceito de BD",
        "Conceitos de BD e SGBD",
        "Noções gerais de um sistema de BD",
      ],
    },
    {
      titulo: "Modelo Entidade-Relacionamento (E-R)",
      subtopicos: [
        "Modelagem Conceitual",
        "Primitivas básicas do modelo E-R",
        "Restrições de Integridade",
        "Mecanismos de Abstração",
        "Uso de uma ferramenta de modelagem",
      ],
    },
    {
      titulo: "Modelo Relacional",
      subtopicos: [
        "Conceitos Básicos",
        "Regras de Integridade",
        "Transformação de Diagramas ER para Modelo Relacional",
      ],
    },
    { titulo: "Normalização de relações até a Terceira Forma Normal" },
    {
      titulo: "Linguagem de Consulta Estruturada — SQL",
      subtopicos: [
        "Linguagem de Definição de Dados (DDL): CREATE TABLE, ALTER TABLE e DROP TABLE",
        "Linguagem de Manipulação de Dados (DML): SELECT, INSERT, UPDATE e DELETE",
        "Visões e Linguagem de Controle de Dados (DCL): CREATE VIEW, DROP VIEW, GRANT e REVOKE",
      ],
    },
    { titulo: "Otimização de Consultas com álgebra relacional" },
  ],

  bibliografia: {
    basica: [
      {
        autor: "ELMASRI, R.; NAVATHE, S. B.",
        titulo: "Sistemas de Bancos de Dados",
        detalhes: "4. ed. São Paulo: Pearson Addison, 2005.",
      },
      {
        autor: "KORTH, Henry F.; SILBERSCHATZ, Abraham",
        titulo: "Sistema de Banco de Dados",
        detalhes: "São Paulo: Makron Books, 2006.",
      },
      {
        autor: "HEUSER, C. A.",
        titulo: "Projeto de Banco de Dados",
        detalhes: "6. ed. Porto Alegre: Bookman, 2009.",
      },
    ],
    complementar: [
      {
        autor: "DATE, C. J.",
        titulo: "Introdução a Sistemas de Bancos de Dados",
        detalhes: "Rio de Janeiro: Campus, 2000.",
      },
      {
        autor: "GROFF, J. R.; WEINBERG, P. N.",
        titulo: "SQL: The Complete Reference",
        detalhes: "2. ed. New York: McGraw-Hill, 2002.",
      },
      {
        autor: "OLIVEIRA, C. H. C.",
        titulo: "SQL: Curso Prático",
        detalhes: "São Paulo: Novatec, 2002.",
      },
      {
        autor: "ULLMAN, J. D.; WIDOM, J.",
        titulo: "A First Course in Data Base Systems",
        detalhes: "São Paulo: Prentice Hall, 1997.",
      },
      {
        autor: "WATSON, R. T.",
        titulo: "Data Management: Banco de Dados e Organizações",
        detalhes: "3. ed. Rio de Janeiro: LTC, 2004.",
      },
    ],
  },

  aulas: [...AULAS_01_03, ...AULAS_04_05, ...AULAS_06_07, ...AULA_08, ...AULAS_09_10, ...AULA_11, ...AULAS_12_13, ...AULA_14, ...AULAS_15_16, ...AULAS_17_18, ...AULAS_19_20],
}
