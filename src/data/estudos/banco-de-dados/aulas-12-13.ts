import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 12 e 13.
 *
 * Fecha a unidade de normalização e abre a de SQL com a linguagem de definição
 * de dados.
 */
export const AULAS_12_13: Aula[] = [
  {
    numero: 12,
    assunto: "Dependências funcionais e Primeira Forma Normal",
    unidade: "Normalização de relações até a Terceira Forma Normal",
    conteudo: {
      resumo:
        "O que é dependência funcional, quais anomalias a redundância provoca e o que exige a Primeira Forma Normal.",
      explicacaoSimples:
        "Normalizar é separar em tabelas o que fala de coisas diferentes. Quando uma tabela mistura dados de pedido com dados de cliente, o nome do cliente se repete em cada pedido dele — e aí três problemas aparecem: alterar o nome exige alterar em muitos lugares, apagar o último pedido apaga o cliente junto, e não há onde cadastrar um cliente que ainda não comprou. As formas normais são as regras que evitam isso, aplicadas em etapas.",
      explicacaoTecnica:
        "Uma dependência funcional X → Y existe quando, para cada valor de X, há exatamente um valor de Y. É a formalização de \"X determina Y\". A dependência é total quando Y depende de todo o X (relevante apenas quando X é composto) e parcial quando depende de apenas parte dele; é transitiva quando X → Y e Y → Z, com Y não sendo chave. A redundância decorrente de dependências mal alocadas produz três anomalias. A anomalia de atualização ocorre quando um mesmo fato está em várias tuplas e a alteração precisa atingir todas, sob pena de inconsistência. A de exclusão ocorre quando remover uma tupla elimina um fato não relacionado que só existia ali. A de inserção ocorre quando não se consegue registrar um fato por faltar outro que a chave exige. A Primeira Forma Normal exige que todos os valores sejam atômicos e que não haja grupos repetitivos — nem lista dentro de célula, nem colunas numeradas como telefone1, telefone2, telefone3.",
      aplicacoes: [
        "Colunas numeradas (produto1, produto2, produto3) são a violação de 1FN mais comum em planilhas migradas para banco.",
        "As três anomalias são o argumento a usar quando alguém propõe \"deixar tudo numa tabela só para não precisar de junção\".",
        "Identificar as dependências funcionais é o passo que torna a normalização mecânica em vez de intuitiva.",
      ],
      curiosidades: [
        "A 1FN é a única forma normal que faz parte da própria definição de relação de Codd — as demais são propriedades desejáveis de um esquema, não requisitos para ser relacional.",
        "Normalizar não é sempre o objetivo: bancos analíticos (data warehouses) usam esquema estrela, deliberadamente desnormalizado, porque ali o padrão de uso é ler muito e escrever pouco, e as anomalias de atualização quase não se aplicam.",
      ],
      conceitos: [
        {
          termo: "Dependência funcional",
          definicao:
            "X → Y: para cada valor de X existe exatamente um valor de Y. Lê-se \"X determina Y\".",
        },
        {
          termo: "Dependência parcial",
          definicao:
            "Y depende de apenas parte de uma chave composta X. Só existe quando a chave é composta.",
        },
        {
          termo: "Dependência transitiva",
          definicao:
            "X → Y e Y → Z, com Y não sendo chave. Z depende da chave por intermédio de Y.",
        },
        {
          termo: "Anomalia de atualização",
          definicao:
            "Um mesmo fato repetido em várias tuplas obriga a alterar todas; esquecer uma gera inconsistência.",
        },
        {
          termo: "Anomalia de exclusão",
          definicao:
            "Remover uma tupla apaga junto um fato não relacionado que só existia ali.",
        },
        {
          termo: "Anomalia de inserção",
          definicao:
            "Não se consegue registrar um fato porque a chave exige outro que ainda não existe.",
        },
        {
          termo: "Primeira Forma Normal",
          definicao:
            "Todos os valores atômicos e sem grupos repetitivos.",
        },
      ],
      exemplos: [
        {
          titulo: "As três anomalias numa tabela só",
          descricao:
            "Uma tabela que mistura pedido, cliente e produto. Cada anomalia é visível numa operação diferente.",
          linguagem: "text",
          codigo: `pedido_completo(num_pedido, data, cpf, nome_cliente, cidade,
                cod_prod, desc_prod, preco, qtd)

 num | data  | cpf | nome_cliente | cod | desc_prod | preco | qtd
 ----+-------+-----+--------------+-----+-----------+-------+----
 101 | 03/08 | 111 | Ana Lima     | P1  | Teclado   |  120  |  2
 101 | 03/08 | 111 | Ana Lima     | P2  | Mouse     |   80  |  1
 102 | 04/08 | 111 | Ana Lima     | P1  | Teclado   |  120  |  1

ATUALIZAÇÃO: Ana muda de nome -> alterar 3 linhas. Esquecer uma
             cria duas Anas com o mesmo CPF.
EXCLUSÃO:    apagar o pedido 102 (única linha de Ana? não, mas se
             fosse) apagaria o cadastro dela junto.
INSERÇÃO:    não há como cadastrar um produto novo que ainda não
             foi vendido — faltaria num_pedido, que é parte da chave.`,
          linhas: [
            {
              trecho: "'Ana Lima' repetido em 3 linhas",
              explicacao:
                "O nome do cliente é fato sobre o CLIENTE, não sobre o item de pedido. Está na tabela errada, e por isso se repete.",
            },
            {
              trecho: "desc_prod e preco repetidos",
              explicacao:
                "Mesma coisa com o produto. Repare que preco aqui é ambíguo: é o preço atual do produto ou o praticado na venda? A tabela não distingue, e isso é outro defeito.",
            },
            {
              trecho: "não há como cadastrar produto novo",
              explicacao:
                "A anomalia de inserção. A chave da tabela envolve num_pedido, então nenhum fato consegue entrar sem um pedido existir.",
            },
          ],
        },
        {
          titulo: "Violações de 1FN e suas correções",
          descricao:
            "As duas formas de violar a 1FN: valor não atômico e grupo repetitivo.",
          linguagem: "sql",
          codigo: `-- VIOLAÇÃO 1: valor não atômico
   cliente(id, nome, telefones)
   (1, 'Ana', '9999-0000; 8888-1111')

-- VIOLAÇÃO 2: grupo repetitivo (colunas numeradas)
   cliente(id, nome, telefone1, telefone2, telefone3)
   (1, 'Ana', '9999-0000', '8888-1111', NULL)

-- CORREÇÃO (serve para as duas)
   cliente(id, nome)
   telefone(cliente_id, numero)
       PK (cliente_id, numero)`,
          linhas: [
            {
              trecho: "telefone1, telefone2, telefone3",
              explicacao:
                "Parece atômico, mas é o mesmo defeito: impõe um limite artificial de três, desperdiça colunas nulas, e buscar um número exige testar as três colunas.",
            },
            {
              trecho: "telefone(cliente_id, numero)",
              explicacao:
                "Sem limite de quantidade, sem coluna nula, indexável, e a busca vira um WHERE simples. A tabela cresce em linhas, que é como banco de dados foi feito para crescer.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a12-e1",
        nivel: "basico",
        enunciado:
          "A tabela aluno(matricula, nome, curso, nome_curso) está em 1FN? Justifique.",
        dica: "1FN pergunta só sobre atomicidade e grupos repetitivos.",
        resolucao:
          "Sim, está em 1FN: todos os valores são atômicos e não há grupos repetitivos nem colunas numeradas. A tabela tem outros problemas — nome_curso depende de curso, e não da matrícula, o que é uma dependência transitiva e viola a 3FN —, mas a 1FN pergunta apenas sobre atomicidade. É um lembrete importante: estar em 1FN não significa estar bem modelado, significa apenas ter passado pela primeira das três verificações.",
        resposta:
          "Sim, está em 1FN (valores atômicos, sem grupos repetitivos), embora viole a 3FN por dependência transitiva.",
      },
      {
        id: "bd-a12-e2",
        nivel: "intermediario",
        enunciado:
          "Em item_pedido(num_pedido, cod_produto, desc_produto, quantidade), com chave (num_pedido, cod_produto), liste as dependências funcionais.",
        dica: "Pergunte, para cada atributo, de que ele depende de fato.",
        resolucao:
          "As dependências são: (num_pedido, cod_produto) → quantidade, porque a quantidade depende da combinação — é a quantidade daquele produto naquele pedido; e cod_produto → desc_produto, porque a descrição depende apenas do produto, independentemente do pedido. A segunda é uma dependência parcial: desc_produto depende de parte da chave, não dela inteira. É exatamente essa dependência parcial que viola a 2FN e que motiva separar produto numa tabela própria.",
        resposta:
          "(num_pedido, cod_produto) → quantidade (total) e cod_produto → desc_produto (parcial, viola a 2FN).",
      },
      {
        id: "bd-a12-e3",
        nivel: "avancado",
        enunciado:
          "Explique por que telefone1, telefone2, telefone3 viola a 1FN, se cada célula contém um único valor atômico.",
        dica: "O que a 1FN proíbe além de valor não atômico?",
        resolucao:
          "A 1FN proíbe duas coisas: valores não atômicos e grupos repetitivos. As três colunas são atômicas individualmente, mas formam um grupo repetitivo — o mesmo atributo conceitual, telefone, replicado em posições numeradas. Os sintomas mostram que é o mesmo defeito de guardar tudo numa célula. Primeiro, há um limite arbitrário: o cliente com quatro telefones não cabe, e acrescentar telefone4 é alteração de esquema para um fato que deveria ser um simples INSERT. Segundo, há desperdício: a maioria das linhas deixa colunas nulas. Terceiro, e mais grave, a consulta fica antinatural — buscar quem tem determinado número exige WHERE telefone1 = ? OR telefone2 = ? OR telefone3 = ?, que precisa de três índices e ainda assim é difícil de otimizar. Quarto, a posição passa a ter significado que ninguém definiu: telefone1 é o principal? E se o cliente apagar o primeiro, o segundo sobe? A raiz de tudo é a mesma: a multiplicidade foi codificada na estrutura da tabela, em vez de virar linhas, que é o único lugar onde o modelo relacional sabe representar quantidade variável.",
        resposta:
          "Porque a 1FN proíbe também grupos repetitivos, e as três colunas são o mesmo atributo replicado. O resultado é limite artificial, colunas nulas, consulta com OR entre colunas e significado indefinido para a posição.",
      },
      {
        id: "bd-a12-e4",
        nivel: "desafio",
        enunciado:
          "Um data warehouse guarda tabelas deliberadamente desnormalizadas. Como conciliar isso com tudo o que se disse sobre anomalias?",
        dica: "As anomalias dependem de uma operação específica. Qual?",
        resolucao:
          "As três anomalias são anomalias de escrita: a de atualização acontece ao alterar, a de exclusão ao apagar, a de inserção ao inserir. Nenhuma delas se manifesta em leitura. Isso explica a aparente contradição, porque os dois ambientes têm padrões de uso opostos. Um banco transacional (OLTP) recebe escritas o tempo todo, vindas de muitas transações concorrentes, e é exatamente ali que as anomalias custam caro — por isso se normaliza. Um data warehouse (OLAP) é carregado em lote, por um processo de ETL controlado, e depois é só lido, por consultas que agregam milhões de linhas. Ali, a anomalia de atualização praticamente não existe, porque ninguém atualiza linha a linha; e o custo que domina é o das junções, que a normalização multiplica. Desnormalizar troca um problema que não se tem por um ganho que se tem. Há três condições que tornam a troca legítima, e vale enunciá-las porque é a ausência delas que transforma desnormalização em bagunça: a carga precisa ser controlada por um processo único e reproduzível, de modo que a consistência seja garantida na origem e não na tabela; o dado precisa ser histórico e imutável, para que não haja atualização a propagar; e é preciso existir a fonte normalizada da qual o warehouse é derivado, para que ele possa ser reconstruído se estiver errado. Um banco transacional desnormalizado \"para evitar junção\" não cumpre nenhuma das três, e por isso a comparação com o warehouse não o justifica.",
        resposta:
          "As três anomalias são de escrita, e o warehouse quase só lê: é carregado em lote por ETL e depois consultado. A troca é legítima porque há carga controlada, dado histórico imutável e uma fonte normalizada da qual ele deriva — condições que um OLTP desnormalizado não cumpre.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "X → Y significa que X determina Y; a dependência pode ser parcial ou transitiva.",
        "As três anomalias (atualização, exclusão, inserção) são todas de escrita.",
        "1FN exige valores atômicos e proíbe grupos repetitivos.",
        "Colunas numeradas são grupo repetitivo, mesmo sendo atômicas uma a uma.",
      ],
      checklist: [
        "Sei escrever as dependências funcionais de uma tabela.",
        "Sei apontar cada uma das três anomalias num exemplo.",
        "Sei reconhecer as duas formas de violar a 1FN.",
        "Sei justificar quando desnormalizar é legítimo.",
      ],
      palavrasChave: [
        "dependência funcional",
        "1FN",
        "grupo repetitivo",
        "anomalia de atualização",
        "desnormalização",
      ],
      pontosRevisao: [
        "Por que as anomalias não se manifestam em leitura.",
        "As três condições que tornam a desnormalização legítima.",
      ],
    },
  },

  {
    numero: 13,
    assunto: "Segunda e Terceira Formas Normais",
    unidade: "Normalização de relações até a Terceira Forma Normal",
    conteudo: {
      resumo:
        "A 2FN elimina dependências parciais da chave; a 3FN elimina dependências transitivas. O processo completo, aplicado a um caso.",
      explicacaoSimples:
        "Depois da 1FN vêm duas perguntas. A segunda forma normal pergunta: cada coluna depende da chave inteira, ou só de um pedaço dela? A terceira pergunta: cada coluna depende da chave, ou depende de outra coluna que não é chave? Em ambos os casos, o que estiver no lugar errado sai para uma tabela própria. Feito isso, cada tabela fala de uma coisa só.",
      explicacaoTecnica:
        "Uma relação está na Segunda Forma Normal se está em 1FN e todo atributo não-chave depende funcionalmente da chave primária inteira, e não de parte dela. A verificação só é necessária quando a chave é composta: com chave simples, não existe \"parte da chave\", e uma relação em 1FN com chave simples está automaticamente em 2FN. Uma relação está na Terceira Forma Normal se está em 2FN e nenhum atributo não-chave depende de outro atributo não-chave — isto é, não há dependência transitiva. O procedimento de normalização é o mesmo nos dois casos: identifica-se a dependência indevida, extrai-se para uma nova relação o determinante junto com os atributos que ele determina, e deixa-se na relação original o determinante como chave estrangeira. A Forma Normal de Boyce-Codd (FNBC) é um reforço da 3FN que exige que todo determinante seja superchave; ela só difere da 3FN em relações com múltiplas chaves candidatas sobrepostas, e está fora do escopo do plano desta disciplina.",
      aplicacoes: [
        "A dependência parcial aparece quase sempre em tabelas associativas que absorveram atributos de uma das entidades.",
        "A dependência transitiva é o caso do CEP determinando cidade e estado dentro da tabela de clientes.",
        "Normalizar até a 3FN é o padrão da indústria para bancos transacionais; ir além raramente compensa.",
      ],
      curiosidades: [
        "A frase mnemônica clássica é que todo atributo deve depender \"da chave, da chave inteira e de nada além da chave\" — atribuída a Bill Kent, resume 1FN, 2FN e 3FN nessa ordem.",
        "Codd definiu a 3FN em 1971 e a reforçou com Boyce em 1974 justamente porque encontrou relações em 3FN que ainda apresentavam anomalias.",
      ],
      conceitos: [
        {
          termo: "Segunda Forma Normal",
          definicao:
            "Em 1FN e sem dependências parciais: todo atributo não-chave depende da chave inteira.",
        },
        {
          termo: "Terceira Forma Normal",
          definicao:
            "Em 2FN e sem dependências transitivas: nenhum atributo não-chave depende de outro atributo não-chave.",
        },
        {
          termo: "Determinante",
          definicao:
            "O lado esquerdo de uma dependência funcional — o atributo que determina outro.",
        },
        {
          termo: "Procedimento de decomposição",
          definicao:
            "Extrair o determinante e o que ele determina para uma nova relação, deixando o determinante como chave estrangeira na original.",
        },
      ],
      exemplos: [
        {
          titulo: "Normalização completa, de 1FN até 3FN",
          descricao:
            "O mesmo esquema atravessando as três etapas. Acompanhe qual dependência motivou cada decomposição.",
          linguagem: "text",
          codigo: `PARTIDA (em 1FN, chave composta)
  item(num_pedido, cod_prod, desc_prod, cod_categ, nome_categ, qtd)
  DFs:
    (num_pedido, cod_prod) -> qtd              total     OK
    cod_prod -> desc_prod, cod_categ           PARCIAL   viola 2FN
    cod_categ -> nome_categ                    (dentro de produto)

APÓS 2FN (extrai o que depende só de cod_prod)
  item(num_pedido, cod_prod, qtd)
  produto(cod_prod, desc_prod, cod_categ, nome_categ)
  DF restante:
    cod_categ -> nome_categ                    TRANSITIVA  viola 3FN

APÓS 3FN (extrai o que depende de não-chave)
  item(num_pedido, cod_prod, qtd)
  produto(cod_prod, desc_prod, cod_categ)
  categoria(cod_categ, nome_categ)`,
          linhas: [
            {
              trecho: "cod_prod -> desc_prod (parcial)",
              explicacao:
                "A descrição depende só do produto, não do par. Por isso se repetia em cada item de cada pedido — a anomalia de atualização em estado puro.",
            },
            {
              trecho: "cod_categ -> nome_categ (transitiva)",
              explicacao:
                "Já dentro de produto, o nome da categoria não depende do produto: depende da categoria. Renomear uma categoria exigiria alterar todos os produtos dela.",
            },
            {
              trecho: "categoria(cod_categ, nome_categ)",
              explicacao:
                "Cada tabela agora fala de uma coisa só: item fala do item, produto do produto, categoria da categoria. Renomear a categoria virou uma linha alterada.",
            },
          ],
        },
        {
          titulo: "Verificando a 3FN com o caso do CEP",
          descricao:
            "A dependência transitiva mais comum de todas — e a exceção que o negócio às vezes impõe.",
          linguagem: "sql",
          codigo: `-- VIOLA a 3FN: cep -> cidade, estado (transitiva)
CREATE TABLE cliente (
  id      INTEGER PRIMARY KEY,
  nome    VARCHAR(80),
  cep     CHAR(8),
  cidade  VARCHAR(60),   -- depende do cep, não do id
  estado  CHAR(2)        -- idem
);

-- EM 3FN
CREATE TABLE endereco_cep (
  cep    CHAR(8) PRIMARY KEY,
  cidade VARCHAR(60) NOT NULL,
  estado CHAR(2)     NOT NULL
);
CREATE TABLE cliente (
  id   INTEGER PRIMARY KEY,
  nome VARCHAR(80),
  cep  CHAR(8) REFERENCES endereco_cep(cep)
);`,
          linhas: [
            {
              trecho: "cidade e estado dentro de cliente",
              explicacao:
                "Dependem do CEP, que não é chave. Consequência: dois clientes com o mesmo CEP podem ter cidades diferentes cadastradas, e nada acusa.",
            },
            {
              trecho: "endereco_cep como tabela própria",
              explicacao:
                "O CEP passa a determinar cidade e estado num lugar só. Corrigir um CEP errado corrige para todos os clientes de uma vez.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a13-e1",
        nivel: "basico",
        enunciado:
          "Uma relação em 1FN com chave primária simples pode violar a 2FN? Justifique.",
        dica: "O que é preciso existir para haver dependência parcial?",
        resolucao:
          "Não pode. A 2FN proíbe dependência parcial, que é a dependência de parte da chave. Com chave simples, não existe \"parte da chave\" — ou o atributo depende da chave inteira, ou não depende dela. Portanto toda relação em 1FN com chave primária simples está automaticamente em 2FN. Isso torna a verificação da 2FN necessária apenas em relações com chave composta, o que é uma economia útil ao normalizar um esquema grande.",
        resposta:
          "Não. Sem chave composta não há \"parte da chave\", logo não há dependência parcial possível.",
      },
      {
        id: "bd-a13-e2",
        nivel: "intermediario",
        enunciado:
          "Normalize até a 3FN: funcionario(matricula, nome, cod_depto, nome_depto, cod_cargo, nome_cargo, salario_base), sabendo que salario_base depende do cargo.",
        dica: "Procure o que depende de coluna que não é chave.",
        resolucao:
          "As dependências são: matricula → nome, cod_depto, cod_cargo; cod_depto → nome_depto; cod_cargo → nome_cargo, salario_base. A chave é simples (matricula), então a 2FN já está satisfeita. As duas últimas dependências são transitivas e violam a 3FN. Decompondo:\n```sql\nfuncionario(matricula, nome, cod_depto, cod_cargo)\ndepartamento(cod_depto, nome_depto)\ncargo(cod_cargo, nome_cargo, salario_base)\n```\nO ganho é imediato: reajustar o salário-base de um cargo passa a ser uma linha alterada em cargo, e não uma alteração em todos os funcionários daquele cargo — com o risco de deixar um para trás.",
        resposta:
          "funcionario(matricula, nome, cod_depto, cod_cargo); departamento(cod_depto, nome_depto); cargo(cod_cargo, nome_cargo, salario_base).",
      },
      {
        id: "bd-a13-e3",
        nivel: "avancado",
        enunciado:
          "Um sistema de vendas guarda preco_unitario na tabela item_pedido, embora o preço dependa do produto. Isso viola a 2FN? Justifique.",
        dica: "O preço do item é o mesmo que o preço do produto?",
        resolucao:
          "Não viola, e a razão é que são dois atributos diferentes com nomes parecidos. O preço na tabela de produto é o preço atual de venda; o preço no item de pedido é o preço praticado naquela venda, naquele momento. Este último depende genuinamente do par (num_pedido, cod_produto): o mesmo produto vendido em dois pedidos diferentes pode ter preços diferentes, se houve reajuste ou desconto entre eles. Portanto a dependência é total, não parcial, e a 2FN está satisfeita. Este caso é importante porque mostra o limite da verificação puramente mecânica: olhando só os nomes das colunas, preco_unitario parece depender de cod_produto, e um normalizador desatento o extrairia — destruindo o histórico de preços e fazendo notas fiscais antigas mudarem de valor quando a tabela de produtos fosse atualizada. A dependência funcional é uma afirmação sobre o significado dos dados no domínio, não sobre os nomes das colunas, e só quem conhece o domínio consegue determiná-la. O sinal de que a modelagem está correta aqui é justamente o oposto do que a intuição sugere: a repetição do preço entre pedidos não é redundância, é registro histórico.",
        resposta:
          "Não viola: o preço praticado na venda depende do par (pedido, produto), não só do produto. É dependência total, e a repetição entre pedidos é registro histórico, não redundância.",
      },
      {
        id: "bd-a13-e4",
        nivel: "desafio",
        enunciado:
          "Aplicar cegamente a 3FN ao CEP separaria cidade e estado numa tabela própria. Em que situação manter os dados na tabela de cliente é a decisão certa?",
        dica: "Quem garante que a tabela de CEP está completa e correta?",
        resolucao:
          "A situação em que manter é correto tem a ver com a origem e a completude do dado. A dependência cep → cidade, estado só vale se o sistema tiver uma base de CEPs completa e mantida atualizada. Se ela não existe — e manter uma base de CEPs nacional exige atualização periódica junto aos Correios —, então extrair a tabela cria uma chave estrangeira que não consegue ser satisfeita: o cliente informa um CEP novo, que não está na base, e ou o cadastro é bloqueado por um dado que não é responsabilidade dele, ou a chave estrangeira precisa aceitar nulo, e aí a normalização não entregou a integridade que a justificava. Há um segundo argumento, de natureza histórica: o endereço registrado num cadastro pode precisar preservar o que foi informado na época, e faixas de CEP mudam. Nesse caso cidade e estado no cadastro não são derivados do CEP atual, e sim registro do que se declarou — o mesmo raciocínio do preço praticado na venda. Um terceiro argumento é operacional: se o sistema é local e atende uma cidade só, a tabela de CEP resolve um problema que não existe. A decisão madura costuma ser híbrida e vale a pena enunciá-la: manter cidade e estado na tabela de cliente como o que foi declarado, e usar a base de CEPs, quando houver, como serviço de preenchimento e validação na entrada, e não como chave estrangeira obrigatória. Assim se ganha a conveniência sem transformar a completude de uma base externa em pré-requisito para cadastrar cliente.",
        resposta:
          "Quando não há base de CEPs completa e mantida (a FK ficaria insatisfazível), quando o endereço precisa registrar o que foi declarado na época, ou quando o alcance é local. O caminho usual é manter os campos e usar a base de CEP como validação na entrada, não como FK.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "2FN: sem dependência parcial — só verificável em chave composta.",
        "3FN: sem dependência transitiva entre atributos não-chave.",
        "Decompor é extrair o determinante com o que ele determina, deixando-o como chave estrangeira.",
        "\"Da chave, da chave inteira e de nada além da chave.\"",
      ],
      checklist: [
        "Sei verificar 2FN e 3FN a partir das dependências funcionais.",
        "Sei decompor uma relação preservando as ligações.",
        "Sei distinguir redundância de registro histórico.",
        "Sei argumentar quando não normalizar.",
      ],
      palavrasChave: ["2FN", "3FN", "dependência parcial", "dependência transitiva", "decomposição"],
      pontosRevisao: [
        "Por que chave simples dispensa a verificação da 2FN.",
        "Por que o preço no item de pedido não viola a 2FN.",
      ],
    },
  },
]
