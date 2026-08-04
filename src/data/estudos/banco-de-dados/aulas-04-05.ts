import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 4 e 5.
 *
 * Abertura da unidade "Modelo Entidade-Relacionamento (E-R)": o que é modelar
 * conceitualmente e quais são as primitivas da notação.
 */
export const AULAS_04_05: Aula[] = [
  {
    numero: 4,
    assunto: "Modelagem conceitual e o modelo Entidade-Relacionamento",
    unidade: "Modelo Entidade-Relacionamento (E-R)",
    conteudo: {
      resumo:
        "O que é modelar conceitualmente, por que o modelo E-R é independente de SGBD e como se lê um diagrama E-R.",
      explicacaoSimples:
        "Antes de construir uma casa, desenha-se a planta. A planta não é feita de tijolos, e é justamente por isso que ela é útil: corrigir uma parede no papel custa um traço, e na obra custa uma demolição. O modelo E-R é a planta do banco de dados. Ele descreve o que existe no negócio — clientes, pedidos, produtos — e como essas coisas se ligam, sem falar de tabela, coluna ou SGBD.",
      explicacaoTecnica:
        "A modelagem conceitual produz uma descrição do minimundo independente de qualquer tecnologia de implementação. O modelo Entidade-Relacionamento, proposto por Peter Chen em 1976, é a notação mais usada para isso. Seus elementos são entidades (conjuntos de objetos do mundo real com existência própria), atributos (propriedades das entidades) e relacionamentos (associações entre entidades). O modelo é deliberadamente pobre em recursos de implementação: não tem tipo físico, não tem índice, não tem chave estrangeira — porque nada disso pertence à pergunta que ele responde, que é \"o que existe e como se liga\". A tradução para tabelas vem depois, no projeto lógico, e é mecânica o suficiente para ser feita por regras. Modelar conceitualmente antes é o que permite discutir o domínio com quem entende do negócio e não entende de banco.",
      aplicacoes: [
        "A entrevista com o cliente produz frases que viram entidades e relacionamentos quase diretamente: substantivos tendem a ser entidades, verbos tendem a ser relacionamentos.",
        "Ferramentas como brModelo, DBDesigner e o modo de modelagem do MySQL Workbench desenham E-R e geram o script SQL a partir dele.",
        "Revisar o E-R com o usuário final antes de programar é a forma mais barata de descobrir que o sistema entendeu o negócio errado.",
      ],
      curiosidades: [
        "O artigo de Peter Chen, \"The Entity-Relationship Model — Toward a Unified View of Data\", é um dos artigos de computação mais citados de todos os tempos.",
        "Existem várias notações para E-R: a original de Chen (losangos para relacionamentos), a de Engenharia da Informação (pé de galinha, ou crow's foot) e a de Barker. A do pé de galinha é a mais comum em ferramentas comerciais.",
      ],
      conceitos: [
        {
          termo: "Minimundo",
          definicao:
            "O recorte do mundo real que o banco de dados representa. Definir suas fronteiras é a primeira decisão da modelagem.",
        },
        {
          termo: "Entidade",
          definicao:
            "Conjunto de objetos do mundo real com existência independente e propriedades em comum — Cliente, Produto, Turma.",
        },
        {
          termo: "Atributo",
          definicao: "Propriedade que descreve uma entidade ou um relacionamento — nome, preço, data.",
        },
        {
          termo: "Relacionamento",
          definicao:
            "Associação entre ocorrências de entidades — um Cliente FAZ um Pedido.",
        },
        {
          termo: "Projeto conceitual",
          definicao:
            "Etapa que descreve o domínio sem compromisso com tecnologia. Precede o projeto lógico (tabelas) e o físico (armazenamento).",
        },
      ],
      exemplos: [
        {
          titulo: "Da entrevista ao modelo",
          descricao:
            "Um trecho de conversa com o cliente e a leitura que dele se faz. É o exercício central da modelagem conceitual.",
          linguagem: "text",
          codigo: `CLIENTE DIZ:
"Cada aluno se matricula em várias disciplinas por semestre.
 Toda disciplina é dada por um professor, e um professor
 pode dar mais de uma disciplina."

LEITURA:
  Entidades .......... Aluno, Disciplina, Professor
  Relacionamentos .... Aluno  -- matricula-se --> Disciplina
                       Professor -- leciona ----> Disciplina
  Cardinalidades ..... aluno:disciplina  = N:N
                       professor:disciplina = 1:N`,
          linhas: [
            {
              trecho: "Aluno, Disciplina, Professor",
              explicacao:
                "Os substantivos sobre os quais se quer guardar informação e que têm existência própria viram entidades.",
            },
            {
              trecho: "matricula-se, leciona",
              explicacao:
                "Os verbos que ligam dois substantivos viram relacionamentos. O nome do relacionamento sai da própria fala do cliente.",
            },
            {
              trecho: "\"em várias disciplinas\" e \"pode dar mais de uma\"",
              explicacao:
                "As expressões de quantidade são as que determinam a cardinalidade. É por isso que se anota a frase literal do cliente: ela carrega a regra.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a4-e1",
        nivel: "basico",
        enunciado:
          "Identifique as entidades e os relacionamentos: \"Uma editora publica vários livros. Cada livro é escrito por um ou mais autores.\"",
        dica: "Substantivos sobre os quais se guarda informação; verbos que ligam dois deles.",
        resolucao:
          "Entidades: Editora, Livro, Autor. Relacionamentos: Editora publica Livro; Autor escreve Livro. As expressões \"vários livros\" e \"um ou mais autores\" indicam as cardinalidades — 1:N entre editora e livro, N:N entre autor e livro.",
        resposta:
          "Entidades: Editora, Livro, Autor. Relacionamentos: publica (Editora–Livro) e escreve (Autor–Livro).",
      },
      {
        id: "bd-a4-e2",
        nivel: "intermediario",
        enunciado:
          "Por que o modelo conceitual não deve conter chaves estrangeiras nem tipos como VARCHAR(80)?",
        dica: "A que pergunta o modelo conceitual responde?",
        resolucao:
          "Porque nenhum dos dois pertence à pergunta que o modelo conceitual responde. Chave estrangeira é o mecanismo com que o modelo relacional implementa um relacionamento; num modelo conceitual o relacionamento já está representado diretamente, e antecipar a chave é misturar duas etapas. VARCHAR(80) é decisão de projeto físico, que depende do SGBD escolhido — e o modelo conceitual precisa sobreviver à troca de SGBD. Além disso, há uma razão prática: o modelo conceitual é o documento que se revisa com quem entende do negócio, e essa pessoa não tem como validar um tipo de dado, mas tem plena condição de dizer se um cliente pode ou não ter dois endereços.",
        resposta:
          "Porque ambos são decisões de implementação. O conceitual descreve o domínio e precisa sobreviver à troca de SGBD e ser validável por quem entende do negócio, não de banco.",
      },
      {
        id: "bd-a4-e3",
        nivel: "avancado",
        enunciado:
          "Um analista modelou \"Endereço\" como atributo de Cliente. Outro modelou como entidade. Em que situação cada decisão está certa?",
        dica: "Pergunte se o endereço tem existência e identidade próprias no negócio.",
        resolucao:
          "Endereço como atributo está certo quando o negócio trata o endereço como uma propriedade simples do cliente, sem existência própria: cada cliente tem um endereço, ninguém precisa consultar endereços independentemente de clientes, e não há dado a guardar sobre o endereço em si. É o caso de um cadastro simples de correspondência. Endereço como entidade está certo quando ele adquire identidade própria — quando um cliente pode ter vários (cobrança, entrega, fiscal), quando dois clientes podem compartilhar o mesmo endereço, quando é preciso guardar dados sobre o endereço (coordenadas, zona de entrega, restrição de acesso) ou quando outras entidades além de cliente também se ligam a endereços. O critério não é estético: é a existência independente. Se a resposta a \"faz sentido perguntar algo sobre este endereço sem falar de cliente nenhum?\" for sim, é entidade.",
        resposta:
          "Atributo quando o endereço é propriedade simples e única do cliente; entidade quando tem existência independente — vários por cliente, compartilhado, ou com dados próprios.",
      },
      {
        id: "bd-a4-e4",
        nivel: "desafio",
        enunciado:
          "Discuta esta afirmação: \"Como no final tudo vira tabela, modelar em E-R é perda de tempo — melhor já desenhar as tabelas.\"",
        dica: "O que se perde ao pular o desenho e ir direto para a obra?",
        resolucao:
          "A afirmação confunde o destino com o caminho, e três consequências mostram por quê. Primeira: o modelo E-R é o artefato que se valida com o especialista do domínio, que não lê DDL. Pulando-o, o erro de entendimento do negócio só aparece quando o sistema já está escrito — e é o erro mais caro que existe, porque nenhuma correção de código o resolve. Segunda: o E-R representa relacionamentos N:N diretamente, enquanto o modelo relacional exige tabela associativa. Desenhando tabelas de saída, essa tabela associativa é inventada antes de o relacionamento ter sido compreendido, e é comum ela nascer sem os atributos que o relacionamento tinha. Terceira: decisões que no E-R são explícitas — se algo é entidade ou atributo, se um relacionamento é obrigatório — ficam implícitas no DDL, escondidas em NOT NULL e em nomes de coluna, e deixam de ser discutíveis. Dito isso, a afirmação tem um fundo legítimo: em domínios pequenos e já conhecidos, um E-R cerimonioso e cheio de notação é burocracia. A resposta madura não é abandonar a modelagem conceitual, e sim ajustar seu rigor ao tamanho do problema — um rascunho de dez minutos num quadro já colhe quase todo o benefício.",
        resposta:
          "É falsa como regra: o E-R é o que se valida com o especialista do domínio, representa N:N diretamente e torna explícitas decisões que o DDL esconde. Mas o rigor da notação deve ser proporcional ao tamanho do problema.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Modelagem conceitual descreve o minimundo sem compromisso com tecnologia.",
        "O modelo E-R (Chen, 1976) tem três elementos: entidade, atributo e relacionamento.",
        "O conceitual precede o lógico (tabelas) e o físico (armazenamento).",
        "O modelo conceitual é o artefato validável por quem entende do negócio.",
      ],
      checklist: [
        "Sei extrair entidades e relacionamentos de uma descrição em texto.",
        "Sei justificar por que tipos e chaves estrangeiras não entram no conceitual.",
        "Sei decidir entre modelar algo como atributo ou como entidade.",
      ],
      palavrasChave: ["modelo E-R", "minimundo", "entidade", "atributo", "relacionamento", "projeto conceitual"],
      pontosRevisao: [
        "O critério da existência independente para separar entidade de atributo.",
        "O que se perde ao pular o modelo conceitual e desenhar tabelas direto.",
      ],
    },
  },

  {
    numero: 5,
    assunto: "Primitivas básicas do modelo E-R: entidades, atributos e relacionamentos",
    unidade: "Modelo Entidade-Relacionamento (E-R)",
    conteudo: {
      resumo:
        "As primitivas do modelo E-R em detalhe: tipos de atributo, identificadores, grau de relacionamento e entidades fracas.",
      explicacaoSimples:
        "Já sabemos que existem entidades, atributos e relacionamentos. Agora vêm as variações de cada um. Atributo pode ser simples ou composto (endereço se divide em rua, número e cidade), pode valer um só ou vários (uma pessoa tem vários telefones) e pode ser calculado a partir de outro (idade sai da data de nascimento). Entidade precisa de algo que a identifique. E relacionamento pode ligar duas entidades, três, ou uma entidade a ela mesma.",
      explicacaoTecnica:
        "Os atributos classificam-se em: simples ou compostos (decomponíveis em partes com significado próprio); monovalorados ou multivalorados (admitem um ou vários valores para a mesma ocorrência); armazenados ou derivados (calculáveis a partir de outros); e identificadores ou descritivos. O identificador — atributo-chave — é o que distingue univocamente cada ocorrência da entidade; quando nenhum atributo isolado basta, usa-se um identificador composto. O grau de um relacionamento é o número de entidades que ele associa: binário (dois), ternário (três) ou de grau n. O caso do autorrelacionamento, ou relacionamento recursivo, liga uma entidade a ela própria, e nele os papéis precisam ser nomeados para que a leitura não seja ambígua. Entidade fraca é a que não possui identificador próprio e depende da existência de outra entidade — a proprietária — para ser identificada, usando um identificador parcial combinado com a chave da proprietária.",
      aplicacoes: [
        "Telefone modelado como atributo multivalorado é o caso que mais frequentemente vira uma tabela separada na tradução para o relacional.",
        "Idade como atributo derivado da data de nascimento evita o clássico bug do cadastro que envelhece só quando alguém edita o registro.",
        "Item de nota fiscal é o exemplo canônico de entidade fraca: o item 1 só faz sentido dentro de uma nota específica.",
      ],
      curiosidades: [
        "Relacionamentos ternários são raros e frequentemente sinal de modelagem apressada: boa parte deles decompõe-se em três binários sem perda de informação — mas nem todos, e distinguir os casos é uma das análises mais difíceis da modelagem.",
        "O termo \"entidade fraca\" não sugere fragilidade: refere-se apenas à dependência de identificação, e essas entidades costumam ser as mais numerosas do banco.",
      ],
      conceitos: [
        {
          termo: "Atributo composto",
          definicao:
            "Decomponível em partes com significado próprio, como endereço em logradouro, número, cidade e CEP.",
        },
        {
          termo: "Atributo multivalorado",
          definicao:
            "Admite vários valores para a mesma ocorrência, como os telefones de um cliente.",
        },
        {
          termo: "Atributo derivado",
          definicao:
            "Calculável a partir de outros dados; guardá-lo é redundância, e mantê-lo desatualizado é o risco correspondente.",
        },
        {
          termo: "Identificador (chave)",
          definicao:
            "Atributo ou conjunto de atributos que distingue univocamente cada ocorrência da entidade.",
        },
        {
          termo: "Grau do relacionamento",
          definicao:
            "Quantidade de entidades que o relacionamento associa: binário, ternário ou n-ário.",
        },
        {
          termo: "Entidade fraca",
          definicao:
            "Não tem identificador próprio; é identificada pela combinação de um identificador parcial com a chave da entidade proprietária.",
        },
      ],
      exemplos: [
        {
          titulo: "Uma entidade com todos os tipos de atributo",
          descricao:
            "Cada linha marca uma classificação diferente. É o vocabulário que a prova cobra.",
          linguagem: "text",
          codigo: `ENTIDADE: Cliente

  cpf .................. identificador, simples, monovalorado
  nome ................. descritivo, simples, monovalorado
  endereco ............. descritivo, COMPOSTO
      +-- logradouro
      +-- numero
      +-- cidade
  telefone ............. descritivo, MULTIVALORADO  { }
  data_nascimento ...... descritivo, armazenado
  idade ................ DERIVADO  ( )  <- calculado de data_nascimento`,
          linhas: [
            {
              trecho: "cpf → identificador",
              explicacao:
                "É o que distingue uma ocorrência de outra. Na notação de Chen aparece sublinhado.",
            },
            {
              trecho: "endereco → composto",
              explicacao:
                "Tem partes com significado próprio. Decompor ou não é decisão: só decomponha se o negócio consultar as partes separadamente.",
            },
            {
              trecho: "telefone → multivalorado { }",
              explicacao:
                "Vários valores para o mesmo cliente. Na tradução para o relacional isto obrigatoriamente vira outra tabela — o modelo relacional não admite campo com vários valores.",
            },
            {
              trecho: "idade → derivado ( )",
              explicacao:
                "Calculado, não armazenado. Guardá-lo criaria um dado que fica errado sozinho na passagem de cada aniversário.",
            },
          ],
        },
        {
          titulo: "Autorrelacionamento com papéis",
          descricao:
            "Uma entidade ligada a ela mesma. Sem nomear os papéis, o diagrama fica ambíguo — não se sabe quem chefia quem.",
          linguagem: "text",
          codigo: `        +-------------+
        | Funcionario |
        +------+------+
          |         |
   (chefe)|         |(subordinado)
          |         |
        +---------------+
        |    supervisiona
        +---------------+

Leitura: um Funcionario, no papel de CHEFE, supervisiona
         N Funcionarios, no papel de SUBORDINADO.`,
          linhas: [
            {
              trecho: "(chefe) / (subordinado)",
              explicacao:
                "Os papéis. São obrigatórios em autorrelacionamento: sem eles, as duas pontas são indistinguíveis e o modelo não diz qual lado é qual.",
            },
            {
              trecho: "1:N",
              explicacao:
                "Um chefe supervisiona vários subordinados; cada subordinado tem um chefe. A cardinalidade se lê ponta a ponta, como em qualquer relacionamento binário.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a5-e1",
        nivel: "basico",
        enunciado:
          "Classifique os atributos de Livro: isbn, titulo, autores, ano_publicacao, idade_do_livro.",
        dica: "Um deles é identificador, um é multivalorado e um é derivado.",
        resolucao:
          "isbn: identificador, simples, monovalorado — distingue univocamente cada livro. titulo: descritivo, simples, monovalorado. autores: descritivo, multivalorado — um livro pode ter vários. ano_publicacao: descritivo, simples, armazenado. idade_do_livro: derivado — calculado do ano de publicação em relação ao ano corrente, e por isso não deve ser armazenado.",
        resposta:
          "isbn = identificador; titulo e ano_publicacao = descritivos simples; autores = multivalorado; idade_do_livro = derivado.",
      },
      {
        id: "bd-a5-e2",
        nivel: "intermediario",
        enunciado:
          "Explique o que é uma entidade fraca e dê um exemplo diferente do apresentado na aula, indicando o identificador parcial.",
        dica: "Procure algo cujo número recomeça do 1 dentro de cada 'pai'.",
        resolucao:
          "Entidade fraca é a que não tem identificador próprio e depende da existência de outra entidade — a proprietária — para ser identificada. Sua chave é a combinação de um identificador parcial com a chave da proprietária. Exemplo: Dependente de um funcionário num plano de saúde. O identificador parcial é o nome do dependente, que só é único dentro de um mesmo funcionário — existem muitos dependentes chamados \"João\" na empresa, mas apenas um entre os dependentes do funcionário 4021. A chave completa é, portanto, (matricula_funcionario, nome_dependente). Se o funcionário for removido, seus dependentes deixam de ter sentido e são removidos junto: a dependência é existencial, não apenas de identificação.",
        resposta:
          "É a entidade sem identificador próprio, identificada por um identificador parcial mais a chave da proprietária. Ex.: Dependente, com identificador parcial nome, dentro de Funcionário.",
      },
      {
        id: "bd-a5-e3",
        nivel: "avancado",
        enunciado:
          "Um sistema guarda o campo total do pedido, que é a soma dos itens. É um atributo derivado. Em que caso guardá-lo é a decisão certa?",
        dica: "O que acontece com o total de um pedido quando o preço do produto muda no ano seguinte?",
        resolucao:
          "Guardar é a decisão certa em dois casos. O primeiro é histórico: se o total for sempre recalculado a partir dos preços atuais, um pedido fechado em 2024 passa a exibir o valor de 2026 quando os preços subirem — o sistema reescreve o passado. Guardando o total (e os preços unitários praticados), o pedido registra o que de fato foi cobrado, que é um dado legal e contábil, não um cálculo. O segundo é de desempenho: um relatório que soma o faturamento de milhões de pedidos recalculando itens toda vez faz um trabalho enorme para chegar a um número que nunca mais muda. Nos dois casos a redundância deixa de ser descontrolada e passa a ser controlada — desde que a regra seja explícita: o total é congelado no fechamento do pedido e não é recalculado depois. O erro seria guardar o total e continuar permitindo edição de itens sem recalcular, aí sim criando um dado que mente em silêncio.",
        resposta:
          "Quando o valor é histórico (o que foi efetivamente cobrado, imune a mudanças futuras de preço) ou quando o custo de recalcular em relatórios é proibitivo — sempre com a regra de congelamento explícita.",
      },
      {
        id: "bd-a5-e4",
        nivel: "desafio",
        enunciado:
          "Modele: um médico atende um paciente em uma data, e nesse atendimento pode prescrever vários medicamentos. Discuta se o relacionamento é ternário e o que a alternativa mudaria.",
        dica: "Pergunte se \"atendimento\" tem atributos e existência próprios.",
        resolucao:
          "A tentação é modelar um relacionamento ternário entre Médico, Paciente e Medicamento. Ele é tecnicamente possível, mas esconde um problema: a data, o diagnóstico e as observações não pertencem a nenhuma das três entidades — são propriedades do encontro. E um relacionamento ternário só admite um conjunto de atributos por combinação das três pontas, o que impede, por exemplo, que o mesmo médico atenda o mesmo paciente duas vezes prescrevendo o mesmo medicamento em datas diferentes. A alternativa melhor é promover o encontro a entidade: Atendimento, com identificador próprio, ligada a Médico (1:N) e a Paciente (1:N), e ligada a Medicamento por um relacionamento N:N que carrega dose e posologia. Isso decompõe o ternário em binários, permite repetição ao longo do tempo, dá lugar natural aos atributos do encontro e ainda torna o modelo capaz de representar um atendimento sem nenhuma prescrição — situação perfeitamente real que o ternário não conseguiria registrar, já que um relacionamento ternário exige as três pontas presentes. A regra prática que fica: quando um relacionamento tem atributos próprios e pode se repetir no tempo, ele quer ser uma entidade.",
        resposta:
          "Não deve ser ternário. Atendimento deve virar entidade, ligada a Médico e Paciente por relacionamentos binários e a Medicamento por N:N — só assim cabem os atributos do encontro, a repetição no tempo e o atendimento sem prescrição.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Atributos: simples/composto, monovalorado/multivalorado, armazenado/derivado, identificador/descritivo.",
        "O identificador distingue univocamente cada ocorrência; pode ser composto.",
        "Grau do relacionamento: binário, ternário, n-ário; autorrelacionamento exige papéis nomeados.",
        "Entidade fraca não tem identificador próprio: usa identificador parcial + chave da proprietária.",
      ],
      checklist: [
        "Sei classificar qualquer atributo nas quatro dimensões.",
        "Sei identificar uma entidade fraca e sua chave.",
        "Sei nomear papéis num autorrelacionamento.",
        "Sei justificar quando um relacionamento deve virar entidade.",
      ],
      palavrasChave: [
        "atributo composto",
        "multivalorado",
        "derivado",
        "identificador",
        "entidade fraca",
        "autorrelacionamento",
      ],
      pontosRevisao: [
        "Por que atributo multivalorado sempre vira tabela no modelo relacional.",
        "O sinal de que um relacionamento deveria ser uma entidade.",
      ],
    },
  },
]
