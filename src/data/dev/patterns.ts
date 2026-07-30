/**
 * Design patterns — cartões de consulta.
 *
 * Cada cartão responde três perguntas na ordem em que elas aparecem na cabeça
 * de quem está decidindo: que problema isto resolve, como se parece em código, e
 * quando NÃO usar. A terceira é a que falta na maioria das referências, e é a que
 * evita o padrão aplicado por entusiasmo — o modo mais comum de um catálogo de
 * padrões piorar um sistema.
 *
 * Fora do Supabase pelo mesmo motivo do `java.ts`; ver aquele cabeçalho.
 */

export type PatternCategoria = "criacional" | "estrutural" | "comportamental"

export interface DesignPattern {
  nome: string
  categoria: PatternCategoria
  /** O problema, em uma frase, antes de qualquer jargão. */
  problema: string
  /** A ideia da solução — não o diagrama UML, a intuição. */
  solucao: string
  /** Esqueleto mínimo em Java. Curto de propósito: cartão não é tutorial. */
  codigo: string
  /** Quando o padrão custa mais do que entrega. */
  evitar: string
  /** Onde ele aparece em código que a gente usa todo dia. */
  no_mundo: string
}

export const designPatterns: DesignPattern[] = [
  {
    nome: "Factory Method",
    categoria: "criacional",
    problema: "O código precisa criar objetos, mas não deveria saber a classe concreta.",
    solucao: "Delegar a criação a um método que as subclasses (ou implementações) decidem.",
    codigo: `interface Transporte { void entregar(); }

abstract class Logistica {
  abstract Transporte criar();          // o factory method

  void planejar() { criar().entregar(); }
}

class PorTerra extends Logistica {
  Transporte criar() { return new Caminhao(); }
}`,
    evitar: "Quando existe uma implementação só e nenhuma perspectiva de segunda — vira indireção pura.",
    no_mundo: "Calendar.getInstance(), que devolve a implementação certa para o locale.",
  },
  {
    nome: "Builder",
    categoria: "criacional",
    problema: "Construtor com muitos parâmetros opcionais fica ilegível e fácil de trocar de ordem.",
    solucao: "Montar o objeto por passos nomeados e só então fechar a construção.",
    codigo: `var pedido = Pedido.builder()
    .cliente("Ana")
    .item("café", 2)
    .entregaExpressa(true)
    .build();`,
    evitar: "Com três ou quatro campos obrigatórios: um record resolve com menos cerimônia.",
    no_mundo: "StringBuilder e HttpRequest.newBuilder() no cliente HTTP do próprio JDK.",
  },
  {
    nome: "Singleton",
    categoria: "criacional",
    problema: "Um recurso precisa existir uma vez só no processo inteiro.",
    solucao: "A própria classe controla a instância e não deixa ninguém construir outra.",
    codigo: `public enum Config {
  INSTANCIA;
  private final Properties props = carregar();
  public String get(String chave) { return props.getProperty(chave); }
}`,
    evitar:
      "Quase sempre. Vira estado global, esconde dependência e quebra teste — injeção de dependência entrega o mesmo sem o acoplamento.",
    no_mundo: "Runtime.getRuntime(). O enum é a forma segura em Java, imune a serialização e reflexão.",
  },
  {
    nome: "Adapter",
    categoria: "estrutural",
    problema: "Duas peças úteis não se encaixam porque as interfaces não batem.",
    solucao: "Uma classe traduz a interface de uma para o formato que a outra espera.",
    codigo: `class GatewayLegado { void cobrar(int centavos) { /* ... */ } }

class GatewayAdapter implements Pagamento {
  private final GatewayLegado legado;
  public void pagar(BigDecimal valor) {
    legado.cobrar(valor.movePointRight(2).intValueExact());
  }
}`,
    evitar: "Quando dá para mudar a fonte. Adapter sobre código próprio costuma ser refatoração adiada.",
    no_mundo: "Arrays.asList(), que faz um array parecer List.",
  },
  {
    nome: "Decorator",
    categoria: "estrutural",
    problema: "Acrescentar comportamento a um objeto sem herdar dele nem alterar a classe.",
    solucao: "Embrulhar o objeto em outro que implementa a mesma interface e delega.",
    codigo: `class ComCache implements Repositorio {
  private final Repositorio origem;
  private final Map<Long, Registro> cache = new HashMap<>();

  public Registro buscar(long id) {
    return cache.computeIfAbsent(id, origem::buscar);
  }
}`,
    evitar: "Empilhar muitos decorators — o stack trace vira sopa e a ordem passa a importar em silêncio.",
    no_mundo: "BufferedReader embrulhando FileReader.",
  },
  {
    nome: "Strategy",
    categoria: "comportamental",
    problema: "Um mesmo passo tem várias implementações e o if/else cresce a cada nova.",
    solucao: "Cada variação vira um objeto com a mesma interface, escolhido em tempo de execução.",
    codigo: `interface Frete { BigDecimal calcular(Pedido p); }

class Entrega {
  private final Frete frete;   // injetado
  BigDecimal total(Pedido p) {
    return p.subtotal().add(frete.calcular(p));
  }
}`,
    evitar: "Com duas variações estáveis que nunca mudam — um if honesto é mais legível.",
    no_mundo: "Comparator passado para sort(). É strategy, só que sem o nome.",
  },
  {
    nome: "Observer",
    categoria: "comportamental",
    problema: "Vários interessados precisam reagir a uma mudança, sem que a origem os conheça.",
    solucao: "Os interessados se inscrevem; a origem apenas anuncia o evento.",
    codigo: `class Estoque {
  private final List<Consumer<Item>> ouvintes = new ArrayList<>();

  void aoMudar(Consumer<Item> ouvinte) { ouvintes.add(ouvinte); }
  void repor(Item i) { ouvintes.forEach(o -> o.accept(i)); }
}`,
    evitar: "Sem remover inscrição: é vazamento de memória, e o ouvinte morto segue recebendo.",
    no_mundo: "addEventListener no DOM e os listeners do Swing.",
  },
  {
    nome: "Template Method",
    categoria: "comportamental",
    problema: "Vários fluxos têm o mesmo esqueleto e diferem em um ou dois passos.",
    solucao: "A classe base fixa a ordem dos passos e deixa os variáveis como abstratos.",
    codigo: `abstract class Importador {
  final void importar() {      // final: a ORDEM é o que o padrão protege
    var dados = ler();
    validar(dados);
    gravar(dados);
  }
  abstract List<Linha> ler();
  void validar(List<Linha> d) { }   // gancho opcional
  abstract void gravar(List<Linha> d);
}`,
    evitar: "Quando a variação é grande — herança prende, e composição com Strategy solta.",
    no_mundo: "AbstractList, que implementa quase tudo sobre get() e size().",
  },
]
