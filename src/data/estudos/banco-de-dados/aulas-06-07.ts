import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 6 e 7.
 *
 * Fecha a unidade "Modelo Entidade-Relacionamento (E-R)": cardinalidade e
 * restrições, mecanismos de abstração e o uso de uma ferramenta de modelagem.
 */
export const AULAS_06_07: Aula[] = [
  {
    numero: 6,
    assunto: "Cardinalidade e restrições de integridade no modelo E-R",
    unidade: "Modelo Entidade-Relacionamento (E-R)",
    conteudo: {
      resumo:
        "Como se lê e se anota a cardinalidade de um relacionamento, a diferença entre cardinalidade máxima e mínima, e por que a mínima é a que carrega a regra de negócio mais esquecida.",
      explicacaoSimples:
        "Cardinalidade responde a duas perguntas sobre cada ponta do relacionamento: quantos, no máximo, e quantos, no mínimo. \"Um cliente pode ter vários pedidos\" responde ao máximo. \"Todo pedido precisa ter um cliente\" responde ao mínimo. A segunda pergunta é a que quase todo mundo esquece de fazer — e é dela que saem os campos que aceitam vazio quando não deviam.",
      explicacaoTecnica:
        "A cardinalidade máxima indica quantas ocorrências de uma entidade podem se associar a uma ocorrência da outra: 1:1, 1:N ou N:N. A cardinalidade mínima indica quantas ocorrências devem existir — 0 quando a participação é opcional (parcial) e 1 quando é obrigatória (total). Anota-se o par (mín, máx) em cada ponta, e a leitura é cruzada: a cardinalidade anotada de um lado descreve quantas ocorrências daquele lado se ligam a UMA ocorrência do outro. Participação total desenha-se com linha dupla na notação de Chen. A cardinalidade máxima determina como o relacionamento será implementado no modelo relacional — 1:N vira chave estrangeira no lado N, N:N obriga tabela associativa. A cardinalidade mínima determina se essa chave estrangeira aceita NULL. São, portanto, decisões de modelagem com consequência direta e verificável no DDL.",
      aplicacoes: [
        "A cardinalidade mínima é o que vira NOT NULL na chave estrangeira; errá-la produz o clássico pedido órfão, sem cliente.",
        "Descobrir que um relacionamento é N:N e não 1:N muda a estrutura do banco inteiro — é o erro de modelagem mais caro de corrigir depois.",
        "Perguntar \"pode existir sem?\" ao usuário final é a forma mais rápida de levantar a cardinalidade mínima, que ele nunca informa espontaneamente.",
      ],
      curiosidades: [
        "A notação pé de galinha (crow's foot) nasceu num relatório técnico de Gordon Everest em 1976; o \"pé\" representa o lado N, e os traços e círculos junto dele marcam a cardinalidade mínima.",
        "Um relacionamento 1:1 com participação total dos dois lados é quase sempre sinal de que as duas entidades deveriam ser uma só — a exceção legítima é quando os dados são separados por segurança ou por frequência de acesso.",
      ],
      conceitos: [
        {
          termo: "Cardinalidade máxima",
          definicao:
            "Número máximo de ocorrências de uma entidade que podem se associar a uma ocorrência da outra. Produz os tipos 1:1, 1:N e N:N.",
        },
        {
          termo: "Cardinalidade mínima",
          definicao:
            "Número mínimo exigido: 0 para participação opcional, 1 para obrigatória. É o que determina se a chave estrangeira aceita NULL.",
        },
        {
          termo: "Participação total",
          definicao:
            "Cardinalidade mínima 1: toda ocorrência da entidade precisa participar do relacionamento. Desenha-se com linha dupla.",
        },
        {
          termo: "Participação parcial",
          definicao:
            "Cardinalidade mínima 0: a ocorrência pode existir sem participar do relacionamento.",
        },
        {
          termo: "Atributo de relacionamento",
          definicao:
            "Propriedade que não pertence a nenhuma das entidades, e sim à associação entre elas — a nota de um aluno numa disciplina, por exemplo.",
        },
      ],
      exemplos: [
        {
          titulo: "As três cardinalidades máximas, lidas em voz alta",
          descricao:
            "A leitura é sempre cruzada. Escrever a frase antes de desenhar evita metade dos erros.",
          linguagem: "text",
          codigo: `1:1  Funcionario -- gerencia --> Departamento
     "Um funcionário gerencia no máximo UM departamento."
     "Um departamento é gerenciado por no máximo UM funcionário."

1:N  Cliente -- faz --> Pedido
     "Um cliente faz VÁRIOS pedidos."
     "Um pedido é feito por UM cliente."

N:N  Aluno -- matricula-se --> Disciplina
     "Um aluno se matricula em VÁRIAS disciplinas."
     "Uma disciplina recebe VÁRIOS alunos."`,
          linhas: [
            {
              trecho: "1:1 gerencia",
              explicacao:
                "Repare que nem todo funcionário gerencia algo: a cardinalidade mínima do lado do funcionário é 0. Máxima e mínima são perguntas independentes.",
            },
            {
              trecho: "1:N faz",
              explicacao:
                "No relacional, o lado N recebe a chave estrangeira. Pedido guarda o id do cliente — nunca o contrário.",
            },
            {
              trecho: "N:N matricula-se",
              explicacao:
                "Nenhum dos dois lados consegue guardar a referência do outro. Obriga tabela associativa, e é nela que cabem atributos do relacionamento como a nota.",
            },
          ],
        },
        {
          titulo: "A cardinalidade mínima virando DDL",
          descricao:
            "A mesma decisão de modelagem, escrita duas vezes: uma no diagrama, outra no banco.",
          linguagem: "sql",
          codigo: `-- (1,1) do lado do pedido: TODO pedido tem cliente.
CREATE TABLE pedido (
  id         INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES cliente(id),
  data       DATE    NOT NULL
);

-- (0,1): um funcionário PODE não gerenciar departamento nenhum.
CREATE TABLE departamento (
  id          INTEGER PRIMARY KEY,
  gerente_id  INTEGER NULL REFERENCES funcionario(id)
);`,
          linhas: [
            {
              trecho: "cliente_id INTEGER NOT NULL",
              explicacao:
                "O NOT NULL é a cardinalidade mínima 1 traduzida. Sem ele, o banco aceita pedido sem cliente — e o relatório de faturamento por cliente perde linhas em silêncio.",
            },
            {
              trecho: "REFERENCES cliente(id)",
              explicacao:
                "A chave estrangeira é a cardinalidade máxima traduzida: um pedido aponta para no máximo um cliente, porque a coluna guarda um valor só.",
            },
            {
              trecho: "gerente_id INTEGER NULL",
              explicacao:
                "Aqui o NULL é intencional e documentado: departamento sem gerente é situação real, e não erro de cadastro.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a6-e1",
        nivel: "basico",
        enunciado:
          "Determine a cardinalidade máxima: (a) Autor e Livro; (b) Estado e Cidade; (c) Pessoa e CPF.",
        dica: "Leia dos dois lados antes de responder.",
        resolucao:
          "(a) N:N — um autor escreve vários livros e um livro pode ter vários autores. (b) 1:N — um estado tem várias cidades, mas cada cidade pertence a um só estado. (c) 1:1 — uma pessoa tem um CPF e um CPF pertence a uma só pessoa.",
        resposta: "(a) N:N; (b) 1:N; (c) 1:1.",
      },
      {
        id: "bd-a6-e2",
        nivel: "intermediario",
        enunciado:
          "Explique a diferença prática entre participação total e parcial, dizendo o que muda no banco de dados gerado.",
        dica: "Pense na coluna da chave estrangeira.",
        resolucao:
          "Participação total significa cardinalidade mínima 1: toda ocorrência da entidade obrigatoriamente participa do relacionamento. Participação parcial significa mínima 0: a ocorrência pode existir isolada. No banco, a diferença aparece na chave estrangeira: participação total vira NOT NULL, participação parcial permite NULL. Se um pedido tem participação total no relacionamento com cliente, a coluna cliente_id é NOT NULL e o SGBD passa a recusar qualquer tentativa de gravar pedido sem dono — a regra de negócio deixa de depender da aplicação lembrar de validá-la.",
        resposta:
          "Total = mínima 1 = chave estrangeira NOT NULL; parcial = mínima 0 = chave estrangeira aceita NULL.",
      },
      {
        id: "bd-a6-e3",
        nivel: "avancado",
        enunciado:
          "Uma escola quer registrar a nota do aluno em cada disciplina. Onde a nota deve ficar? Justifique.",
        dica: "De quem é a nota: do aluno, da disciplina, ou de outra coisa?",
        resolucao:
          "A nota não pertence ao aluno nem à disciplina. Colocada em Aluno, haveria uma nota só, e o aluno cursa várias disciplinas. Colocada em Disciplina, haveria uma nota só para a turma inteira. A nota pertence ao encontro entre os dois — é atributo do relacionamento matricula-se, que é N:N. No modelo E-R ela se desenha ligada ao losango do relacionamento. Na tradução para o relacional, o relacionamento N:N vira uma tabela associativa (matricula), cuja chave primária é o par (aluno_id, disciplina_id), e a nota é uma coluna comum dessa tabela. A regra geral que fica: todo atributo que só faz sentido quando as duas pontas estão presentes é atributo do relacionamento, não das entidades.",
        resposta:
          "No relacionamento matricula-se, como atributo de relacionamento — que vira coluna da tabela associativa (aluno_id, disciplina_id, nota).",
      },
      {
        id: "bd-a6-e4",
        nivel: "desafio",
        enunciado:
          "Um analista modelou Pessoa e Passaporte como 1:1 com participação total nos dois lados. Critique a decisão e diga quando ela seria correta.",
        dica: "Toda pessoa tem passaporte?",
        resolucao:
          "A crítica principal é factual: participação total do lado de Pessoa afirma que toda pessoa cadastrada tem passaporte, o que é falso na esmagadora maioria dos domínios. O correto seria (0,1) do lado da pessoa e (1,1) do lado do passaporte — todo passaporte pertence a alguém, mas nem toda pessoa tem passaporte. Modelado como está, ou o cadastro de pessoa fica impossível sem antes emitir um passaporte, ou a regra é ignorada na implementação e o modelo passa a mentir sobre o sistema. Há ainda a questão estrutural: quando um 1:1 tem participação total dos dois lados, as duas entidades sempre aparecem juntas e a recomendação usual é fundi-las numa só tabela, já que separá-las só acrescenta uma junção sem ganho. As exceções legítimas para manter separado são duas: quando os dados têm requisitos de segurança diferentes (dados sensíveis numa tabela com permissão restrita) e quando têm frequências de acesso muito diferentes (um bloco grande e raramente lido separado do núcleo consultado o tempo todo). Neste caso concreto, porém, nada disso se aplica — o problema real é que a cardinalidade mínima do lado da pessoa está simplesmente errada.",
        resposta:
          "A participação total do lado de Pessoa está errada: deveria ser (0,1), pois nem toda pessoa tem passaporte. E 1:1 total dos dois lados normalmente pede fusão numa tabela só, salvo separação por segurança ou por frequência de acesso.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Cardinalidade máxima gera 1:1, 1:N e N:N e determina como o relacionamento vira tabela.",
        "Cardinalidade mínima (0 ou 1) determina se a chave estrangeira aceita NULL.",
        "Participação total = obrigatória; parcial = opcional.",
        "Atributo que só existe quando as duas pontas existem é atributo do relacionamento.",
      ],
      checklist: [
        "Sei ler a cardinalidade em voz alta, dos dois lados.",
        "Sei dizer o que muda no DDL entre participação total e parcial.",
        "Sei identificar um atributo de relacionamento.",
        "Sei justificar quando um 1:1 deveria virar uma tabela só.",
      ],
      palavrasChave: ["cardinalidade", "1:N", "N:N", "participação total", "atributo de relacionamento"],
      pontosRevisao: [
        "Por que a cardinalidade mínima é a mais esquecida e a que mais gera bug.",
        "Por que N:N sempre exige tabela associativa.",
      ],
    },
  },

  {
    numero: 7,
    assunto: "Mecanismos de abstração: generalização, especialização e agregação",
    unidade: "Modelo Entidade-Relacionamento (E-R)",
    conteudo: {
      resumo:
        "Os mecanismos que organizam o modelo quando entidades compartilham atributos ou quando um relacionamento precisa participar de outro relacionamento.",
      explicacaoSimples:
        "Às vezes várias entidades têm quase os mesmos atributos. Pessoa Física e Pessoa Jurídica são clientes: as duas têm nome, endereço e telefone, e cada uma tem os seus campos próprios. Repetir os campos comuns nas duas é convite a esquecer de alterar um deles. A generalização junta o que é comum numa entidade genérica, e deixa em cada especializada só o que a distingue.",
      explicacaoTecnica:
        "Generalização é o processo de abstrair, a partir de entidades semelhantes, uma entidade genérica que reúne seus atributos comuns; especialização é o caminho inverso, partindo da genérica para as específicas. A hierarquia resultante tem herança: toda ocorrência da especializada é também ocorrência da genérica e possui todos os seus atributos. A hierarquia classifica-se por duas dimensões independentes. Quanto à cobertura, é total quando toda ocorrência da genérica pertence a alguma especializada, e parcial quando pode existir ocorrência que não pertence a nenhuma. Quanto à disjunção, é exclusiva (disjunta) quando uma ocorrência pertence a no máximo uma especializada, e compartilhada (sobreposta) quando pode pertencer a várias. Agregação é o mecanismo que trata um relacionamento inteiro como se fosse uma entidade, para que ele possa participar de outro relacionamento — necessário quando algo se relaciona não com uma entidade, mas com a associação entre duas.",
      aplicacoes: [
        "Cliente pessoa física e jurídica é o caso mais comum de generalização em sistemas comerciais brasileiros.",
        "Um catálogo de produtos com tipos muito diferentes (livro, eletrônico, alimento) resolve-se por especialização, evitando uma tabela com dezenas de colunas quase sempre nulas.",
        "Agregação aparece quando é preciso registrar algo sobre um relacionamento: o técnico que atendeu determinada peça em determinado equipamento.",
      ],
      curiosidades: [
        "A generalização no E-R e a herança da orientação a objetos resolvem o mesmo problema conceitual, mas com uma diferença importante: no E-R a hierarquia é sobre conjuntos de ocorrências, não sobre comportamento — não há métodos a herdar.",
        "Existem três formas usuais de traduzir uma hierarquia para tabelas, e nenhuma é a certa em todos os casos: uma tabela por classe, uma tabela única com coluna discriminadora, ou uma tabela só para as folhas.",
      ],
      conceitos: [
        {
          termo: "Generalização",
          definicao:
            "Abstração que reúne, numa entidade genérica, os atributos comuns a entidades semelhantes.",
        },
        {
          termo: "Especialização",
          definicao:
            "Caminho inverso: a partir de uma entidade genérica, definem-se subconjuntos com atributos próprios.",
        },
        {
          termo: "Cobertura total ou parcial",
          definicao:
            "Total: toda ocorrência da genérica está em alguma especializada. Parcial: pode não estar em nenhuma.",
        },
        {
          termo: "Disjunção exclusiva ou compartilhada",
          definicao:
            "Exclusiva: a ocorrência pertence a no máximo uma especializada. Compartilhada: pode pertencer a várias ao mesmo tempo.",
        },
        {
          termo: "Agregação",
          definicao:
            "Trata um relacionamento como entidade, para que ele possa participar de outro relacionamento.",
        },
      ],
      exemplos: [
        {
          titulo: "Uma hierarquia com as duas dimensões declaradas",
          descricao:
            "Cobertura e disjunção são perguntas separadas, e as quatro combinações existem. Não declarar é deixar a regra implícita.",
          linguagem: "text",
          codigo: `                +-----------+
                |  Pessoa   |   nome, endereco, telefone
                +-----+-----+
                      |
                    (t, x)     total e exclusiva
              +-------+-------+
              |               |
      +-------+------+  +-----+--------+
      | PessoaFisica |  | PessoaJuridica|
      +--------------+  +---------------+
       cpf, nascimento   cnpj, razao_social

  t = toda pessoa é física OU jurídica (cobertura total)
  x = nenhuma é as duas ao mesmo tempo (exclusiva)`,
          linhas: [
            {
              trecho: "nome, endereco, telefone em Pessoa",
              explicacao:
                "Os atributos comuns sobem para a genérica. Alterar a regra do telefone passa a ser uma alteração só, e não duas que podem divergir.",
            },
            {
              trecho: "(t, x)",
              explicacao:
                "As duas dimensões declaradas. Aqui a cobertura é total e a disjunção é exclusiva — o caso mais comum, mas não o único possível.",
            },
            {
              trecho: "cpf apenas em PessoaFisica",
              explicacao:
                "O que distingue fica só na especializada. Numa tabela única, essa coluna ficaria nula em toda linha de pessoa jurídica.",
            },
          ],
        },
        {
          titulo: "Agregação: quando o relacionamento precisa se relacionar",
          descricao:
            "Sem agregação, não há como dizer que o técnico atendeu a uma combinação específica de equipamento e defeito.",
          linguagem: "text",
          codigo: `SEM AGREGAÇÃO (não expressa o que se quer):
   Equipamento -- apresenta --> Defeito
   Tecnico     -- atende ----> ???   (atende o quê? o equipamento? o defeito?)

COM AGREGAÇÃO:
   +------------------------------------+
   |  Equipamento -- apresenta --> Defeito |   <- o relacionamento inteiro,
   +------------------------------------+       tratado como uma entidade
                     |
                  atende
                     |
                 +---------+
                 | Tecnico |
                 +---------+`,
          linhas: [
            {
              trecho: "atende --> ???",
              explicacao:
                "O problema: ligar o técnico só ao equipamento perde o defeito; ligar só ao defeito perde o equipamento. É a combinação dos dois que ele atendeu.",
            },
            {
              trecho: "o retângulo em volta do relacionamento",
              explicacao:
                "É a notação da agregação: o relacionamento apresenta passa a ser tratado como uma entidade, e como tal pode participar de outro relacionamento.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a7-e1",
        nivel: "basico",
        enunciado:
          "Numa universidade há Alunos e Professores, e ambos têm nome, CPF e endereço. Proponha uma generalização.",
        dica: "O que é comum sobe; o que distingue fica.",
        resolucao:
          "Cria-se a entidade genérica Pessoa, com nome, CPF e endereço. Aluno e Professor tornam-se especializações: Aluno acrescenta matrícula e semestre; Professor acrescenta titulação e regime de trabalho. A cobertura é parcial se a universidade puder cadastrar pessoas que não sejam nem aluno nem professor (um visitante, por exemplo), e a disjunção é compartilhada se alguém puder ser aluno e professor ao mesmo tempo — situação real em pós-graduação.",
        resposta:
          "Pessoa (nome, CPF, endereço) como genérica; Aluno (matrícula, semestre) e Professor (titulação, regime) como especializações.",
      },
      {
        id: "bd-a7-e2",
        nivel: "intermediario",
        enunciado:
          "Classifique quanto a cobertura e disjunção: (a) Veículo em Carro e Moto; (b) Funcionário em Gerente e Técnico, sabendo que há funcionários que não são nem um nem outro e que ninguém acumula os dois papéis.",
        dica: "São duas perguntas independentes.",
        resolucao:
          "(a) Cobertura total e disjunção exclusiva: todo veículo é carro ou moto, e nenhum é os dois. (b) Cobertura parcial, porque existem funcionários fora das duas categorias, e disjunção exclusiva, porque ninguém acumula os papéis. O enunciado de (b) informa exatamente as duas dimensões — é assim que elas devem ser levantadas com o cliente: perguntando \"existe algum que não seja nenhum dos dois?\" e \"pode ser os dois ao mesmo tempo?\".",
        resposta: "(a) total e exclusiva; (b) parcial e exclusiva.",
      },
      {
        id: "bd-a7-e3",
        nivel: "avancado",
        enunciado:
          "Explique quando usar agregação em vez de simplesmente transformar o relacionamento numa entidade.",
        dica: "Compare o que cada solução preserva do modelo original.",
        resolucao:
          "As duas soluções resolvem o mesmo problema e produzem, na prática, tabelas muito parecidas. A agregação é preferível quando se quer preservar no modelo a informação de que aquilo é um relacionamento entre duas entidades, e não um conceito autônomo do domínio — o vínculo entre equipamento e defeito continua sendo um vínculo, e a agregação o mantém legível como tal, com sua cardinalidade explícita. Transformar em entidade é preferível quando o conceito ganha nome próprio no vocabulário do negócio, atributos próprios e identidade independente: quando as pessoas passam a falar em \"a ocorrência\", \"o chamado\", \"o atendimento\", o conceito já se emancipou e insistir na agregação torna o diagrama mais difícil de ler do que precisaria. O critério prático é linguístico: se o negócio tem um substantivo para aquilo, é entidade; se só consegue descrevê-lo como \"a ligação entre X e Y\", é agregação.",
        resposta:
          "Agregação quando o vínculo continua sendo um relacionamento e se quer preservar isso no modelo; entidade quando o conceito ganha nome próprio, atributos e identidade no vocabulário do negócio.",
      },
      {
        id: "bd-a7-e4",
        nivel: "desafio",
        enunciado:
          "Uma hierarquia de Produto tem 12 especializações, cada uma com 3 a 8 atributos próprios. Discuta as três estratégias de tradução para tabelas e recomende uma.",
        dica: "Pense em quantas colunas nulas e quantas junções cada opção produz.",
        resolucao:
          "A primeira estratégia é a tabela única com coluna discriminadora: uma tabela Produto com o tipo e todas as colunas de todas as especializações. Com 12 especializações e até 8 atributos cada, chega-se a algo em torno de 60 colunas, das quais cada linha preenche poucas — o resto é NULL. A consulta fica simples e sem junção, mas a integridade se perde: nada impede gravar um livro com prazo de validade, porque a coluna existe para todos, e restrições NOT NULL tornam-se impossíveis nos atributos específicos. A segunda é uma tabela por especialização, sem tabela para a genérica: cada tipo com suas colunas próprias mais as comuns repetidas. Ganha-se integridade e não há coluna nula, mas perde-se a genérica — listar todos os produtos exige UNION de 12 tabelas, e nenhuma chave estrangeira consegue apontar para \"um produto qualquer\". A terceira é uma tabela para a genérica e uma para cada especializada, ligadas por chave primária compartilhada. Não há coluna nula, a integridade específica é declarável, existe uma tabela Produto para as chaves estrangeiras apontarem, e listar tudo é ler uma tabela só. O custo é uma junção sempre que se quer o registro completo de um tipo. Com 12 especializações e atributos numerosos, recomendo a terceira: os problemas das outras duas crescem com o número de especializações, enquanto o custo da terceira é constante — uma junção — e é o mais fácil de aceitar. A primeira só se justificaria com poucas especializações e pouquíssimos atributos próprios.",
        resposta:
          "Tabela única gera ~60 colunas quase sempre nulas e impede restrições; tabela por especializada impede referenciar \"um produto qualquer\" e exige UNION. Com 12 especializações, recomendo genérica + uma por especializada com chave compartilhada: custo fixo de uma junção.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Generalização reúne o comum; especialização define os subconjuntos.",
        "Cobertura (total/parcial) e disjunção (exclusiva/compartilhada) são dimensões independentes.",
        "Agregação permite que um relacionamento participe de outro relacionamento.",
        "Há três estratégias de tradução de hierarquia para tabelas, cada uma com um custo diferente.",
      ],
      checklist: [
        "Sei propor uma generalização a partir de entidades semelhantes.",
        "Sei classificar uma hierarquia nas duas dimensões.",
        "Sei reconhecer a situação que exige agregação.",
        "Sei comparar as estratégias de tradução de hierarquia.",
      ],
      palavrasChave: [
        "generalização",
        "especialização",
        "cobertura total",
        "disjunção exclusiva",
        "agregação",
        "herança",
      ],
      pontosRevisao: [
        "As duas perguntas que definem cobertura e disjunção.",
        "O critério linguístico entre agregação e entidade.",
      ],
    },
  },
]
