/**
 * Java — trilha de estudo e folhas de consulta.
 *
 * Os dois vivem no mesmo arquivo porque são a mesma matéria vista de dois
 * ângulos: o roadmap responde "em que ordem aprender", a cheat sheet responde
 * "como se escreve isto mesmo". Separá-los obrigaria a manter as duas listas em
 * sincronia manual — e é justamente quando divergem que deixam de servir.
 *
 * ## Por que não vai para o Supabase
 *
 * O resto do realm dev (devlogs, lab, snippets, wiki, ideas) é lido por
 * `publishedReader` e publicado pelo /admin. Este acervo NÃO segue esse
 * caminho, de propósito: é material de referência revisado por commit, não
 * conteúdo editorial que muda sozinho. Pôr no banco custaria migration, seed,
 * sync e CRUD no painel para um conteúdo que se edita melhor em pull request —
 * e `tests/conteudo-publicavel.test.ts` fixa exatamente as cinco tabelas atuais,
 * então acrescentar tabela é decisão consciente, não efeito colateral.
 */

export type EtapaStatus = "concluido" | "estudando" | "planejado"

export interface RoadmapEtapa {
  /** Ordem de estudo. Também é a numeração exibida. */
  ordem: number
  titulo: string
  /** O que a etapa entrega — em uma frase, do ponto de vista de capacidade. */
  objetivo: string
  status: EtapaStatus
  /** Assuntos concretos. É o que transforma "aprender Java" em algo verificável. */
  topicos: string[]
  /** Como saber que a etapa acabou. Sem isto, trilha nenhuma termina. */
  criterio: string
}

export const javaRoadmap: RoadmapEtapa[] = [
  {
    ordem: 1,
    titulo: "Fundamentos da linguagem",
    objetivo: "Ler e escrever um programa Java sem consultar sintaxe a cada linha.",
    status: "concluido",
    topicos: [
      "JVM, JDK e JRE — o que cada sigla faz",
      "Tipos primitivos e wrappers",
      "Controle de fluxo e escopo",
      "Arrays e String (imutabilidade)",
      "javac, java e a estrutura de pacotes",
    ],
    criterio: "Escrever um CLI que lê argumentos, valida entrada e imprime relatório.",
  },
  {
    ordem: 2,
    titulo: "Orientação a objetos de verdade",
    objetivo: "Modelar um domínio com classes que escondem estado em vez de expô-lo.",
    status: "concluido",
    topicos: [
      "Classe, instância e construtor",
      "Encapsulamento e os limites do getter/setter",
      "Herança vs. composição — quando cada uma mente",
      "Interfaces e classes abstratas",
      "equals, hashCode e toString como contrato",
    ],
    criterio: "Modelar um carrinho de compras sem nenhum campo público.",
  },
  {
    ordem: 3,
    titulo: "Coleções e generics",
    objetivo: "Escolher a estrutura de dados pelo custo, não pelo hábito.",
    status: "estudando",
    topicos: [
      "List, Set, Map e quando cada um é a resposta",
      "ArrayList vs. LinkedList — o custo real",
      "HashMap: hashing, colisão e carga",
      "Generics, wildcards e type erasure",
      "Comparable, Comparator e ordenação estável",
    ],
    criterio: "Justificar por escrito a escolha de coleção em três cenários diferentes.",
  },
  {
    ordem: 4,
    titulo: "Exceções e I/O",
    objetivo: "Tratar falha como caminho previsto, não como acidente.",
    status: "planejado",
    topicos: [
      "Checked vs. unchecked — a decisão de projeto por trás",
      "try-with-resources e AutoCloseable",
      "Criar exceção própria que carrega contexto",
      "java.nio.file.Path e Files",
      "Serialização e seus riscos",
    ],
    criterio: "Ler um CSV grande tratando arquivo ausente, linha malformada e encoding.",
  },
  {
    ordem: 5,
    titulo: "Java moderno",
    objetivo: "Escrever no Java de hoje, não no de 2011.",
    status: "planejado",
    topicos: [
      "Lambdas e interfaces funcionais",
      "Stream API — map, filter, collect, reduce",
      "Optional sem virar null com outro nome",
      "var, records, sealed e pattern matching",
      "Text blocks e switch expressions",
    ],
    criterio: "Reescrever um laço aninhado antigo como pipeline de stream legível.",
  },
  {
    ordem: 6,
    titulo: "Concorrência",
    objetivo: "Entender por que código correto quebra com dois usuários.",
    status: "planejado",
    topicos: [
      "Thread, Runnable e o custo de criar thread",
      "synchronized, volatile e o modelo de memória",
      "ExecutorService e pools",
      "CompletableFuture",
      "Virtual threads (Project Loom)",
    ],
    criterio: "Demonstrar uma race condition e depois corrigi-la com teste que prova.",
  },
  {
    ordem: 7,
    titulo: "Build, testes e ecossistema",
    objetivo: "Entregar um artefato que outra pessoa consegue rodar.",
    status: "planejado",
    topicos: [
      "Maven e Gradle — ciclo de vida e dependências",
      "JUnit 5 e AssertJ",
      "Mockito e o limite do mock",
      "Cobertura: o que ela mede e o que não mede",
      "Empacotar um JAR executável",
    ],
    criterio: "Projeto com build reprodutível e suíte que roda em CI.",
  },
  {
    ordem: 8,
    titulo: "Spring e persistência",
    objetivo: "Construir uma API que fala com banco sem virar bola de barro.",
    status: "planejado",
    topicos: [
      "Injeção de dependência e inversão de controle",
      "Spring Boot: autoconfiguração e profiles",
      "REST com Spring Web e tratamento de erro",
      "JPA/Hibernate, o N+1 e o mapeamento",
      "Migrations com Flyway",
    ],
    criterio: "API CRUD com testes de integração subindo banco real em container.",
  },
]

export interface CheatSheetItem {
  /** O que se quer fazer, escrito como a pessoa pensaria ao procurar. */
  o_que: string
  codigo: string
  /** Armadilha, custo ou detalhe que a assinatura não revela. Opcional. */
  nota?: string
}

export interface CheatSheet {
  slug: string
  titulo: string
  resumo: string
  itens: CheatSheetItem[]
}

export const javaCheatSheets: CheatSheet[] = [
  {
    slug: "colecoes",
    titulo: "Coleções",
    resumo: "Criar, percorrer e transformar as estruturas do dia a dia.",
    itens: [
      {
        o_que: "Lista imutável a partir de valores",
        codigo: `List<String> cores = List.of("vermelho", "verde", "azul");`,
        nota: "List.of rejeita null e lança em qualquer tentativa de escrita — é imutável de verdade, não uma view.",
      },
      {
        o_que: "Lista mutável",
        codigo: `List<String> nomes = new ArrayList<>();
nomes.add("Ana");`,
      },
      {
        o_que: "Percorrer um Map",
        codigo: `for (Map.Entry<String, Integer> e : placar.entrySet()) {
  System.out.println(e.getKey() + " = " + e.getValue());
}`,
        nota: "entrySet evita o get() por chave dentro do laço, que refaz o hashing a cada volta.",
      },
      {
        o_que: "Valor padrão sem checar null",
        codigo: `int pontos = placar.getOrDefault("Ana", 0);`,
      },
      {
        o_que: "Acumular em Map",
        codigo: `contagem.merge(palavra, 1, Integer::sum);`,
        nota: "Substitui o par containsKey/put e roda uma travessia só.",
      },
      {
        o_que: "Ordenar por campo",
        codigo: `pessoas.sort(Comparator.comparing(Pessoa::nome)
    .thenComparing(Pessoa::idade).reversed());`,
      },
    ],
  },
  {
    slug: "streams",
    titulo: "Streams",
    resumo: "O pipeline que substitui o laço aninhado.",
    itens: [
      {
        o_que: "Filtrar e coletar",
        codigo: `List<Pessoa> maiores = pessoas.stream()
    .filter(p -> p.idade() >= 18)
    .toList();`,
        nota: "toList() (Java 16+) devolve lista imutável; collect(Collectors.toList()) não garante isso.",
      },
      {
        o_que: "Transformar",
        codigo: `List<String> nomes = pessoas.stream()
    .map(Pessoa::nome)
    .toList();`,
      },
      {
        o_que: "Agrupar",
        codigo: `Map<String, List<Pessoa>> porCidade = pessoas.stream()
    .collect(Collectors.groupingBy(Pessoa::cidade));`,
      },
      {
        o_que: "Somar",
        codigo: `int total = itens.stream().mapToInt(Item::preco).sum();`,
        nota: "mapToInt evita o boxing que map(Item::preco) faria em cada elemento.",
      },
      {
        o_que: "Juntar em texto",
        codigo: `String csv = nomes.stream().collect(Collectors.joining(", "));`,
      },
      {
        o_que: "Achatar listas aninhadas",
        codigo: `List<Item> todos = pedidos.stream()
    .flatMap(p -> p.itens().stream())
    .toList();`,
      },
    ],
  },
  {
    slug: "moderno",
    titulo: "Java moderno",
    resumo: "Recursos que encolhem código cerimonial.",
    itens: [
      {
        o_que: "Record — dados imutáveis",
        codigo: `public record Ponto(int x, int y) {}`,
        nota: "Gera construtor, acessores, equals, hashCode e toString. Substitui o POJO de 60 linhas.",
      },
      {
        o_que: "Validar dentro do record",
        codigo: `public record Idade(int valor) {
  public Idade {
    if (valor < 0) throw new IllegalArgumentException("negativa");
  }
}`,
      },
      {
        o_que: "Switch como expressão",
        codigo: `String rotulo = switch (dia) {
  case SAB, DOM -> "fim de semana";
  default -> "útil";
};`,
      },
      {
        o_que: "Pattern matching",
        codigo: `if (obj instanceof String s && !s.isBlank()) {
  System.out.println(s.strip());
}`,
      },
      {
        o_que: "Texto em bloco",
        codigo: `String json = """
    { "nome": "Ana" }
    """;`,
      },
      {
        o_que: "Optional sem virar null disfarçado",
        codigo: `return repo.buscar(id)
    .map(Pessoa::nome)
    .orElseThrow(() -> new NaoEncontrado(id));`,
        nota: "Optional é para RETORNO. Como campo ou parâmetro só acrescenta uma camada de nulo.",
      },
    ],
  },
  {
    slug: "excecoes",
    titulo: "Exceções e recursos",
    resumo: "Falhar de forma previsível e sempre fechar o que abriu.",
    itens: [
      {
        o_que: "Fechar recurso automaticamente",
        codigo: `try (var reader = Files.newBufferedReader(caminho)) {
  return reader.lines().toList();
}`,
        nota: "Fecha na ordem inversa da abertura, inclusive quando o corpo lança.",
      },
      {
        o_que: "Exceção própria com contexto",
        codigo: `public class NaoEncontrado extends RuntimeException {
  public NaoEncontrado(long id) {
    super("registro não encontrado: " + id);
  }
}`,
      },
      {
        o_que: "Preservar a causa",
        codigo: `catch (SQLException e) {
  throw new FalhaNoRepositorio("ao salvar pedido", e);
}`,
        nota: "Sem passar `e`, o stack trace da origem some e o log vira adivinhação.",
      },
      {
        o_que: "Ler arquivo inteiro",
        codigo: `String texto = Files.readString(Path.of("dados.txt"));`,
      },
    ],
  },
  {
    slug: "concorrencia",
    titulo: "Concorrência",
    resumo: "Executar em paralelo sem corromper estado.",
    itens: [
      {
        o_que: "Pool de threads",
        codigo: `try (var pool = Executors.newFixedThreadPool(4)) {
  pool.submit(() -> processar(lote));
}`,
        nota: "ExecutorService é AutoCloseable desde o Java 19 — antes disso era shutdown() na mão, e esquecer travava a JVM.",
      },
      {
        o_que: "Virtual threads",
        codigo: `try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {
  tarefas.forEach(pool::submit);
}`,
      },
      {
        o_que: "Encadear assíncrono",
        codigo: `CompletableFuture.supplyAsync(this::buscar)
    .thenApply(this::formatar)
    .exceptionally(e -> "falhou: " + e.getMessage());`,
      },
      {
        o_que: "Contador seguro",
        codigo: `var contador = new AtomicInteger();
contador.incrementAndGet();`,
        nota: "`count++` em campo compartilhado são três operações, e a JVM pode intercalá-las.",
      },
    ],
  },
]
