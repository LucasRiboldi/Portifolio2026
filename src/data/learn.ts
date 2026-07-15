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

export type Difficulty = "básico" | "intermediário" | "avançado"

export interface LearnExercise {
  id: string
  title: string
  /** Enunciado curto do desafio. */
  prompt: string
  difficulty: Difficulty
  /** id da fase relacionada (opcional). */
  phase?: string
}

/** XP concedido ao concluir um tópico do roadmap. */
export const XP_TOPIC = 10
/** XP por exercício resolvido, por dificuldade. */
export const XP_EXERCISE: Record<Difficulty, number> = {
  "básico": 15,
  "intermediário": 25,
  "avançado": 40,
}

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
  exercises: LearnExercise[]
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
  exercises: [
    { id: "c-hello", title: "Olá, mundo", prompt: "Imprima `Olá, mundo!` na tela com `printf`.", difficulty: "básico", phase: "fundamentos" },
    { id: "c-soma", title: "Soma de dois números", prompt: "Leia dois inteiros e mostre a soma.", difficulty: "básico", phase: "fundamentos" },
    { id: "c-media", title: "Média de 3 notas", prompt: "Leia 3 notas `float` e imprima a média com 2 casas.", difficulty: "básico", phase: "fundamentos" },
    { id: "c-par", title: "Par ou ímpar", prompt: "Leia um inteiro e diga se é par ou ímpar.", difficulty: "básico", phase: "fluxo" },
    { id: "c-maior3", title: "Maior de três", prompt: "Leia 3 números e imprima o maior usando `if`.", difficulty: "básico", phase: "fluxo" },
    { id: "c-tabuada", title: "Tabuada", prompt: "Leia N e imprima a tabuada de N (1 a 10) com `for`.", difficulty: "básico", phase: "fluxo" },
    { id: "c-fatorial", title: "Fatorial", prompt: "Calcule o fatorial de N com um laço.", difficulty: "intermediário", phase: "fluxo" },
    { id: "c-primo", title: "Número primo", prompt: "Verifique se um número lido é primo.", difficulty: "intermediário", phase: "estrutura" },
    { id: "c-vogais", title: "Contar vogais", prompt: "Conte quantas vogais há numa string.", difficulty: "intermediário", phase: "estrutura" },
    { id: "c-inverter", title: "Inverter vetor", prompt: "Leia 5 inteiros e imprima na ordem inversa.", difficulty: "intermediário", phase: "estrutura" },
    { id: "c-bubble", title: "Bubble sort", prompt: "Ordene um vetor de inteiros do menor ao maior.", difficulty: "intermediário", phase: "estrutura" },
    { id: "c-swap", title: "Troca por referência", prompt: "Escreva `void troca(int *a, int *b)` que troca dois valores.", difficulty: "avançado", phase: "ponteiros" },
    { id: "c-matriz", title: "Matriz dinâmica", prompt: "Aloque uma matriz NxM com `malloc` e libere com `free`.", difficulty: "avançado", phase: "ponteiros" },
    { id: "c-lista", title: "Lista encadeada", prompt: "Implemente inserção no fim de uma lista simplesmente encadeada.", difficulty: "avançado", phase: "compostos" },
    { id: "c-arquivo", title: "Cadastro em arquivo", prompt: "Grave e leia registros de um `struct` em arquivo texto.", difficulty: "avançado", phase: "compostos" },
    { id: "c-hanoi", title: "Torre de Hanói", prompt: "Resolva a Torre de Hanói de forma recursiva.", difficulty: "avançado", phase: "projetos" },
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
  tagline: "Orientação a objetos, JVM e um ecossistema gigante — do primeiro objeto ao backend.",
  status: "available",
  course: "Java do zero — orientação a objetos e JVM",
  courseHref: "https://dev.java/learn/",
  phases: [
    {
      id: "fundamentos",
      title: "Fase 1 — Fundamentos",
      topics: [
        { label: "Estrutura de um programa (`class`, `public static void main`)" },
        { label: "Compilar e executar (`javac`, `java`) e a JVM" },
        { label: "Tipos primitivos (`int`, `double`, `boolean`, `char`) e `String`" },
        { label: "Variáveis, `final` e conversão de tipos (casting)" },
        { label: "Entrada e saída (`System.out.println`, `Scanner`)" },
        { label: "Operadores (aritméticos, relacionais, lógicos)" },
      ],
    },
    {
      id: "fluxo",
      title: "Fase 2 — Controle de Fluxo",
      topics: [
        { label: "Condicionais (`if`, `else if`, `else`)" },
        { label: "`switch` (clássico e expressão `->`)" },
        { label: "Laços (`for`, `while`, `do-while`, for-each)" },
        { label: "`break`, `continue` e escopo de bloco" },
      ],
    },
    {
      id: "metodos",
      title: "Fase 3 — Métodos e arrays",
      topics: [
        { label: "Métodos (parâmetros, retorno, `static`)" },
        { label: "Sobrecarga (overloading) e recursão" },
        { label: "Arrays e arrays multidimensionais" },
        { label: "Métodos utilitários de `String` e `Math`" },
      ],
    },
    {
      id: "oop",
      title: "Fase 4 — Orientação a Objetos",
      topics: [
        { label: "Classes, objetos, atributos e construtores" },
        { label: "Encapsulamento (`private`, getters/setters)" },
        { label: "Herança (`extends`) e `super`" },
        { label: "Polimorfismo e `@Override`" },
        { label: "Classes abstratas e interfaces" },
        { label: "`enum`, `record` e classes internas" },
      ],
    },
    {
      id: "colecoes",
      title: "Fase 5 — Coleções, genéricos e exceções",
      topics: [
        { label: "`List`, `Set`, `Map` (e implementações)" },
        { label: "Generics (`<T>`) e wildcards" },
        { label: "Iteradores e for-each em coleções" },
        { label: "Streams, lambdas e `Optional`" },
        { label: "Tratamento de exceções (`try/catch/finally`, `throws`)" },
      ],
    },
    {
      id: "projetos",
      title: "Fase 6 — Prática e ecossistema",
      topics: [
        { label: "Organização em pacotes (`package`, `import`)" },
        { label: "Leitura/escrita de arquivos (`java.nio`, `Files`)" },
        { label: "Build com Maven ou Gradle" },
        { label: "Testes com JUnit" },
        { label: "Projeto: CRUD de console + persistência em arquivo" },
      ],
    },
  ],
  exercises: [
    { id: "j-hello", title: "Hello World", prompt: "Imprima `Hello, World!` com `System.out.println`.", difficulty: "básico", phase: "fundamentos" },
    { id: "j-soma", title: "Soma com Scanner", prompt: "Leia dois inteiros com `Scanner` e mostre a soma.", difficulty: "básico", phase: "fundamentos" },
    { id: "j-media", title: "Média de notas", prompt: "Leia 3 notas `double` e imprima a média formatada.", difficulty: "básico", phase: "fundamentos" },
    { id: "j-par", title: "Par ou ímpar", prompt: "Leia um inteiro e diga se é par ou ímpar.", difficulty: "básico", phase: "fluxo" },
    { id: "j-maior3", title: "Maior de três", prompt: "Leia 3 números e imprima o maior.", difficulty: "básico", phase: "fluxo" },
    { id: "j-tabuada", title: "Tabuada", prompt: "Imprima a tabuada de N (1 a 10) com `for`.", difficulty: "básico", phase: "fluxo" },
    { id: "j-fatorial", title: "Fatorial", prompt: "Calcule o fatorial de N com um laço.", difficulty: "intermediário", phase: "metodos" },
    { id: "j-fib", title: "Fibonacci", prompt: "Imprima os N primeiros termos de Fibonacci.", difficulty: "intermediário", phase: "metodos" },
    { id: "j-vogais", title: "Contar vogais", prompt: "Conte as vogais de uma `String`.", difficulty: "intermediário", phase: "metodos" },
    { id: "j-ordenar", title: "Ordenar lista", prompt: "Ordene uma `List<Integer>` com `Collections.sort`.", difficulty: "intermediário", phase: "colecoes" },
    { id: "j-primo", title: "Número primo", prompt: "Verifique se um número lido é primo.", difficulty: "intermediário", phase: "metodos" },
    { id: "j-conta", title: "Conta bancária (OOP)", prompt: "Crie a classe `Conta` com saldo, depositar e sacar (encapsulado).", difficulty: "avançado", phase: "oop" },
    { id: "j-heranca", title: "Herança Animal", prompt: "Crie `Animal` e `Cachorro` sobrescrevendo `emitirSom()`.", difficulty: "avançado", phase: "oop" },
    { id: "j-interface", title: "Interface e polimorfismo", prompt: "Defina `Forma` com `area()` e implemente em `Circulo` e `Retangulo`.", difficulty: "avançado", phase: "oop" },
    { id: "j-streams", title: "Streams: filtrar e somar", prompt: "Some os pares de uma lista usando `stream().filter().mapToInt().sum()`.", difficulty: "avançado", phase: "colecoes" },
    { id: "j-arquivo", title: "Ler/gravar arquivo", prompt: "Grave linhas num arquivo com `Files.write` e leia com `Files.readAllLines`.", difficulty: "avançado", phase: "projetos" },
  ],
  practices: [
    "Seguir convenções: `PascalCase` para classes, `camelCase` para métodos/variáveis",
    "Preferir composição a herança quando possível",
    "Programar para interfaces (`List<String> l = new ArrayList<>()`)",
    "Tratar exceções de forma específica — evitar `catch (Exception e)` genérico",
    "Todo recurso (arquivo, conexão) fecha com try-with-resources",
    "Tornar campos `private` e imutáveis (`final`) sempre que der",
    "Compilar sem warnings e usar `@Override` ao sobrescrever",
  ],
  errors: [
    { error: "NullPointerException", cause: "Acesso a método/campo de uma referência `null`" },
    {
      error: "ArrayIndexOutOfBoundsException",
      cause: "Índice fora dos limites do array (0..length-1)",
    },
    { error: "ClassCastException", cause: "Cast para um tipo incompatível em runtime" },
    {
      error: "cannot find symbol",
      cause: "Variável/método não declarado ou `import` faltando",
    },
    {
      error: "incompatible types",
      cause: "Atribuição entre tipos incompatíveis sem cast válido",
    },
    {
      error: "NumberFormatException",
      cause: "`Integer.parseInt` em texto que não é número",
    },
  ],
  resources: [
    { label: "dev.java — tutoriais oficiais", href: "https://dev.java/learn/" },
    { label: "Documentação da API (Javadoc)", href: "https://docs.oracle.com/en/java/javase/21/docs/api/" },
    { label: "OpenJDK — baixar a JDK", href: "https://openjdk.org/" },
    { label: "JDoodle — compilador Java online", href: "https://www.jdoodle.com/online-java-compiler/" },
  ],
  routine: [
    { day: "Estudo", activity: "Aprender 1 conceito de POO + anotar em código" },
    { day: "Prática", activity: "Reescrever a classe da aula sem olhar" },
    { day: "Desafio", activity: "Resolver 1 exercício com coleções ou herança" },
    { day: "Revisão", activity: "Rodar os testes JUnit e revisar o que quebrou" },
  ],
}

export const LEARN_LANGUAGES: LearnLanguage[] = [C_LANG, JAVA_LANG]

export function getLanguage(id: string): LearnLanguage | undefined {
  return LEARN_LANGUAGES.find((l) => l.id === id)
}

export function countTopics(lang: LearnLanguage): number {
  return lang.phases.reduce((n, p) => n + p.topics.length, 0)
}
