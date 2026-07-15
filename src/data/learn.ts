/**
 * Base de conhecimento de aprendizado de linguagens.
 *
 * Estrutura pensada para crescer: cada linguagem é um objeto `LearnLanguage`
 * autocontido (roteiro por fases, boas práticas, erros comuns, recursos).
 * Para adicionar uma nova linguagem, basta acrescentar um item em
 * `LEARN_LANGUAGES` — a página `/dev/learn` monta tudo automaticamente.
 *
 * Origem do conteúdo de C: github.com/LucasRiboldi/Aprendendo_C
 */

export interface LearnTopic {
  /** Rótulo do tópico. Suporta `code` entre crases para destaque monoespaçado. */
  label: string
}

export interface LearnPhase {
  id: string
  title: string
  topics: LearnTopic[]
}

export interface LearnError {
  error: string
  cause: string
}

export interface LearnResource {
  label: string
  href: string
}

export interface LearnRoutineRow {
  day: string
  activity: string
}

export type LearnStatus = "available" | "coming-soon"

export interface LearnLanguage {
  /** Identificador estável usado em URLs e no localStorage. */
  id: string
  name: string
  emoji: string
  /** Cor de destaque — variável CSS do tema dracula. */
  accent: string
  tagline: string
  status: LearnStatus
  course?: string
  courseHref?: string
  phases: LearnPhase[]
  practices: string[]
  errors: LearnError[]
  resources: LearnResource[]
  routine?: LearnRoutineRow[]
}

const C_LANG: LearnLanguage = {
  id: "c",
  name: "C",
  emoji: "🔵",
  accent: "var(--d-cyan)",
  tagline: "A base de tudo — ponteiros, memória e controle absoluto da máquina.",
  status: "available",
  course: "Programe seu Futuro — Programação com Linguagem C",
  courseHref:
    "https://www.udemy.com/course/programe-seu-futuro-curso-de-programacao-com-a-linguagem-c/",
  phases: [
    {
      id: "fundamentos",
      title: "Fase 1 — Fundamentos",
      topics: [
        { label: "Estrutura de um programa (`#include`, `main`, `return`)" },
        { label: "Tipos de dados (`int`, `float`, `double`, `char`)" },
        { label: "Variáveis e constantes (`const`, `#define`)" },
        { label: "Entrada e saída (`printf`, `scanf`) e especificadores (`%d`, `%f`, `%c`, `%s`)" },
        { label: "Operadores (aritméticos, relacionais, lógicos)" },
      ],
    },
    {
      id: "fluxo",
      title: "Fase 2 — Controle de Fluxo",
      topics: [
        { label: "Condicionais (`if`, `else if`, `else`)" },
        { label: "`switch / case`" },
        { label: "Laços (`while`, `do-while`, `for`)" },
        { label: "`break` e `continue`" },
      ],
    },
    {
      id: "estrutura",
      title: "Fase 3 — Estruturando o código",
      topics: [
        { label: "Funções (parâmetros, retorno, escopo)" },
        { label: "Recursão" },
        { label: "Arrays (vetores e matrizes)" },
        { label: "Strings (arrays de `char`, `<string.h>`)" },
      ],
    },
    {
      id: "ponteiros",
      title: "Fase 4 — O coração do C",
      topics: [
        { label: "Ponteiros (o assunto mais importante e mais temido)" },
        { label: "Passagem por valor vs. por referência" },
        { label: "Ponteiros + arrays" },
        { label: "Alocação dinâmica (`malloc`, `calloc`, `free`)" },
      ],
    },
    {
      id: "compostos",
      title: "Fase 5 — Dados compostos e arquivos",
      topics: [
        { label: "`struct`, `typedef`, `union`, `enum`" },
        { label: "Manipulação de arquivos (`fopen`, `fprintf`, `fscanf`, `fclose`)" },
        { label: "Organização em múltiplos arquivos (`.h` / `.c`)" },
      ],
    },
    {
      id: "projetos",
      title: "Fase 6 — Projetos práticos",
      topics: [
        { label: "Calculadora completa" },
        { label: "Sistema de cadastro (CRUD em memória)" },
        { label: "Jogo simples (adivinhação / forca no terminal)" },
        { label: "Cadastro persistido em arquivo" },
      ],
    },
  ],
  practices: [
    "Sempre inicializar variáveis antes de usar",
    "Verificar retorno de `scanf` e `malloc`",
    "Todo `malloc` tem um `free` correspondente",
    "Indentar e nomear variáveis com clareza",
    "Compilar com avisos ligados: `gcc -Wall -Wextra arquivo.c -o programa`",
    "Ler a mensagem de erro com calma antes de pedir ajuda",
  ],
  errors: [
    { error: "segmentation fault", cause: "Acessou memória inválida (ponteiro/índice errado)" },
    { error: "undefined reference to main", cause: "Faltou a função `main` ou erro no nome" },
    { error: "expected ';'", cause: "Esqueceu o ponto e vírgula na linha anterior" },
    {
      error: "implicit declaration of function",
      cause: "Usou função sem incluir o header (`#include`)",
    },
    { error: "Lê valor errado no scanf", cause: "Esqueceu o `&` antes da variável" },
  ],
  resources: [
    { label: "godbolt.org — compilador online", href: "https://godbolt.org" },
    { label: "onlinegdb.com — compilador online", href: "https://www.onlinegdb.com" },
    { label: "cppreference (seção C)", href: "https://en.cppreference.com/w/c" },
    { label: "Repositório Aprendendo_C", href: "https://github.com/LucasRiboldi/Aprendendo_C" },
  ],
  routine: [
    { day: "Estudo", activity: "Assistir 2–3 aulas + anotar o conceito-chave" },
    { day: "Prática", activity: "Reescrever o exemplo da aula sem olhar" },
    { day: "Desafio", activity: "Resolver 1 exercício novo do tema" },
    { day: "Revisão", activity: "Pedir code review e anotar o que errou" },
  ],
}

const JAVA_LANG: LearnLanguage = {
  id: "java",
  name: "Java",
  emoji: "☕",
  accent: "var(--d-orange)",
  tagline: "Orientação a objetos, JVM e ecossistema corporativo. Em construção.",
  status: "coming-soon",
  phases: [
    {
      id: "fundamentos",
      title: "Fase 1 — Fundamentos",
      topics: [
        { label: "Estrutura (`class`, `main`, `System.out.println`)" },
        { label: "Tipos primitivos e `String`" },
        { label: "Variáveis, `final` e casting" },
        { label: "Operadores e entrada com `Scanner`" },
      ],
    },
    {
      id: "oop",
      title: "Fase 2 — Orientação a Objetos",
      topics: [
        { label: "Classes, objetos e construtores" },
        { label: "Encapsulamento (`private`, getters/setters)" },
        { label: "Herança e polimorfismo" },
        { label: "Interfaces e classes abstratas" },
      ],
    },
    {
      id: "colecoes",
      title: "Fase 3 — Coleções e genéricos",
      topics: [
        { label: "`List`, `Map`, `Set`" },
        { label: "Generics" },
        { label: "Streams e lambdas" },
        { label: "Tratamento de exceções (`try/catch`)" },
      ],
    },
  ],
  practices: [
    "Seguir convenções de nomenclatura (CamelCase, camelCase)",
    "Preferir composição a herança quando possível",
    "Tratar exceções de forma específica, não genérica",
  ],
  errors: [
    { error: "NullPointerException", cause: "Acesso a referência nula" },
    { error: "ClassNotFoundException", cause: "Classe não encontrada no classpath" },
    { error: "cannot find symbol", cause: "Variável/método não declarado ou import faltando" },
  ],
  resources: [
    { label: "dev.java — documentação oficial", href: "https://dev.java/learn/" },
    { label: "OpenJDK", href: "https://openjdk.org/" },
  ],
}

export const LEARN_LANGUAGES: LearnLanguage[] = [C_LANG, JAVA_LANG]

export function getLanguage(id: string): LearnLanguage | undefined {
  return LEARN_LANGUAGES.find((l) => l.id === id)
}

export function countTopics(lang: LearnLanguage): number {
  return lang.phases.reduce((n, p) => n + p.topics.length, 0)
}
