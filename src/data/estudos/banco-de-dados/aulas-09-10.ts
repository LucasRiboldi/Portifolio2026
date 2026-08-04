import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 9 e 10.
 *
 * Unidade "Modelo Relacional": conceitos básicos, regras de integridade e a
 * transformação do diagrama E-R em tabelas.
 */
export const AULAS_09_10: Aula[] = [
  {
    numero: 9,
    assunto: "Modelo relacional: conceitos básicos",
    unidade: "Modelo Relacional",
    conteudo: {
      resumo:
        "A relação como conjunto de tuplas, o vocabulário formal (relação, tupla, atributo, domínio, grau, cardinalidade) e o que distingue uma tabela de uma relação.",
      explicacaoSimples:
        "O modelo relacional guarda tudo em tabelas, e só em tabelas. Não há ponteiro de uma tabela para outra, não há lista dentro de uma célula, não há estrutura escondida. Cada linha é um fato, cada coluna é uma propriedade desse fato, e a ligação entre tabelas se faz repetindo um valor — nunca por um endereço de memória. Essa simplicidade radical é o que permitiu criar uma linguagem única para consultar qualquer banco.",
      explicacaoTecnica:
        "Uma relação é um conjunto de tuplas definidas sobre um esquema de relação R(A1:D1, …, An:Dn), em que cada atributo Ai tem um domínio Di. O grau da relação é o número de atributos; a cardinalidade é o número de tuplas. Por ser um conjunto no sentido matemático, uma relação tem três propriedades que a distinguem de uma tabela qualquer: não há tuplas duplicadas, não há ordem entre as tuplas e não há ordem entre os atributos — a identificação é por nome, não por posição. Há ainda a primeira forma normal embutida na própria definição: todo valor de atributo é atômico, isto é, indivisível do ponto de vista do modelo; não existe atributo multivalorado nem composto. Na prática, um SGBD relaxa parte disso: uma tabela sem chave primária admite linhas duplicadas, e o resultado de um SELECT sem ORDER BY tem ordem indefinida, mas não arbitrária. Chamar tabela de relação é, portanto, uma aproximação — útil, desde que se saiba onde ela deixa de valer.",
      aplicacoes: [
        "A ausência de ordem entre tuplas é por que SELECT sem ORDER BY pode devolver resultados em ordens diferentes a cada execução — e por que confiar nessa ordem é um bug esperando o dia em que o plano de execução mudar.",
        "A atomicidade dos valores é a regra que proíbe guardar \"telefone1;telefone2;telefone3\" numa coluna só — e é a razão de atributo multivalorado sempre virar tabela.",
        "A identificação por nome, e não por posição, é o que torna SELECT com colunas nomeadas resistente a alterações de esquema.",
      ],
      curiosidades: [
        "Codd publicou \"A Relational Model of Data for Large Shared Data Banks\" em 1970, e o artigo tem 11 páginas; a IBM levou quase uma década para lançar um produto baseado nele.",
        "Codd escreveu depois 12 regras (na verdade 13, numeradas de 0 a 12) para definir o que é um SGBD genuinamente relacional. Nenhum produto comercial da época as cumpria integralmente — e praticamente nenhum de hoje cumpre também.",
      ],
      conceitos: [
        {
          termo: "Relação",
          definicao:
            "Conjunto de tuplas sobre um mesmo esquema. Corresponde, com ressalvas, à tabela.",
        },
        {
          termo: "Tupla",
          definicao: "Uma linha: um conjunto de valores, um para cada atributo do esquema.",
        },
        {
          termo: "Domínio",
          definicao:
            "Conjunto de valores permitidos para um atributo. É o antepassado conceitual do tipo de dado.",
        },
        {
          termo: "Grau",
          definicao: "Número de atributos da relação — quantas colunas ela tem.",
        },
        {
          termo: "Cardinalidade da relação",
          definicao:
            "Número de tuplas. Não confundir com a cardinalidade do relacionamento no E-R.",
        },
        {
          termo: "Atomicidade do valor",
          definicao:
            "Todo valor é indivisível para o modelo. É o que proíbe atributo composto e multivalorado numa relação.",
        },
      ],
      exemplos: [
        {
          titulo: "O vocabulário aplicado a uma tabela concreta",
          descricao:
            "A mesma tabela descrita nos dois vocabulários. Vale a pena saber os dois: a prova usa um, o dia a dia usa o outro.",
          linguagem: "text",
          codigo: `RELAÇÃO aluno (grau 3, cardinalidade 4)

  matricula | nome        | semestre     <- atributos / colunas
  ----------+-------------+----------
   2026001  | Ana Lima    | 3            <- tupla / linha
   2026002  | Bruno Reis  | 3
   2026003  | Carla Dias  | 4
   2026004  | Diego Alves | 3

  domínio de "semestre" = inteiros de 1 a 8

FORMAL          | PRÁTICO
----------------+-------------
relação         | tabela
tupla           | linha / registro
atributo        | coluna / campo
domínio         | tipo de dado
grau            | número de colunas
cardinalidade   | número de linhas`,
          linhas: [
            {
              trecho: "grau 3, cardinalidade 4",
              explicacao:
                "Grau conta colunas e quase nunca muda; cardinalidade conta linhas e muda a cada operação. É o par esquema/instância outra vez, agora com nome formal.",
            },
            {
              trecho: "domínio de \"semestre\"",
              explicacao:
                "O domínio é mais estreito que o tipo: INTEGER admite -5, o domínio não. A diferença se implementa com CHECK.",
            },
          ],
        },
        {
          titulo: "O que a definição de relação proíbe",
          descricao:
            "Três violações comuns. Todas produzem tabelas que o SGBD aceita e que o modelo relacional rejeita.",
          linguagem: "sql",
          codigo: `-- ERRADO: valor não atômico (viola a 1FN)
   cliente(id, nome, telefones)
   (1, 'Ana', '9999-0000; 8888-1111; 7777-2222')

-- CERTO: o multivalorado vira relação própria
   cliente(id, nome)
   telefone(cliente_id, numero)

-- ERRADO: confiar na ordem das tuplas
   SELECT nome FROM aluno;          -- ordem INDEFINIDA

-- CERTO: pedir a ordem que se quer
   SELECT nome FROM aluno ORDER BY nome;`,
          linhas: [
            {
              trecho: "'9999-0000; 8888-1111'",
              explicacao:
                "Três valores numa célula. Consultar \"quem tem o telefone 8888-1111\" vira busca por trecho de texto, e nenhum índice ajuda.",
            },
            {
              trecho: "telefone(cliente_id, numero)",
              explicacao:
                "Cada telefone vira uma tupla. Agora existe chave, existe índice possível, e acrescentar um quarto telefone não altera estrutura nenhuma.",
            },
            {
              trecho: "SELECT sem ORDER BY",
              explicacao:
                "Costuma sair na ordem de inserção — até o dia em que um índice novo muda o plano de execução e a ordem muda junto, sem aviso.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a9-e1",
        nivel: "basico",
        enunciado:
          "Dada a relação produto(codigo, descricao, preco, categoria) com 250 linhas, informe o grau e a cardinalidade.",
        dica: "Um conta colunas, o outro conta linhas.",
        resolucao:
          "O grau é 4, porque a relação tem quatro atributos: codigo, descricao, preco e categoria. A cardinalidade é 250, porque há 250 tuplas. O grau faz parte do esquema e muda só quando a estrutura é alterada; a cardinalidade faz parte da instância e muda a cada INSERT ou DELETE.",
        resposta: "Grau 4, cardinalidade 250.",
      },
      {
        id: "bd-a9-e2",
        nivel: "intermediario",
        enunciado:
          "Explique por que a relação não ter ordem entre as tuplas é uma propriedade, e não uma limitação.",
        dica: "Quem decide a ordem, e quando?",
        resolucao:
          "Não impor ordem no armazenamento libera o SGBD para escolher, em cada consulta, a estratégia de acesso mais rápida — ler pela ordem física, por um índice, ou em paralelo por várias partições. Se a relação tivesse ordem intrínseca, toda leitura teria de respeitá-la e essas otimizações seriam impossíveis. A ordem passa a ser uma decisão de consulta, expressa por ORDER BY, e cada consulta pede a sua: o mesmo dado sai ordenado por nome num relatório e por data em outro, sem que nada seja reorganizado no disco. É separar o que o dado é do modo como ele é apresentado — e é limitação apenas para quem escreve consulta contando com uma ordem que nunca foi prometida.",
        resposta:
          "Porque libera o SGBD a escolher a melhor estratégia de acesso e transfere a ordenação para a consulta, onde cada uma pede a ordem que precisa.",
      },
      {
        id: "bd-a9-e3",
        nivel: "avancado",
        enunciado:
          "Uma tabela sem chave primária admite duas linhas idênticas. Isso contradiz a definição de relação? Como o SGBD lida com isso?",
        dica: "Relação é conjunto; tabela é o que o produto implementa.",
        resolucao:
          "Contradiz, sim, e é uma das aproximações em que tabela deixa de ser relação. Por ser conjunto, uma relação não admite elemento repetido — duas tuplas idênticas são a mesma tupla. A tabela SQL, porém, é formalmente um multiconjunto (bag): admite duplicatas, e o padrão SQL assumiu isso deliberadamente, porque eliminar duplicatas exige ordenar ou construir tabela de dispersão a cada operação, e cobrar esse custo de toda consulta seria inaceitável. Daí a linguagem oferecer o controle explícito: SELECT devolve duplicatas por padrão e SELECT DISTINCT as remove quando se quer o comportamento de conjunto; UNION elimina duplicatas e UNION ALL as preserva, sendo o segundo mais rápido justamente por não precisar verificar. A consequência prática é que duas linhas idênticas são indistinguíveis e, portanto, impossíveis de atualizar ou excluir separadamente — não há como escrever um WHERE que atinja uma e não a outra. É exatamente por isso que declarar chave primária não é formalidade: é o que devolve à tabela a propriedade que faz dela uma relação.",
        resposta:
          "Contradiz: a tabela SQL é multiconjunto, não conjunto, por decisão de desempenho. O efeito prático é que linhas idênticas não podem ser atualizadas nem excluídas separadamente — motivo pelo qual a chave primária é indispensável.",
      },
      {
        id: "bd-a9-e4",
        nivel: "desafio",
        enunciado:
          "SGBDs modernos oferecem colunas do tipo JSON e ARRAY, que guardam vários valores numa célula. Isso invalida o modelo relacional? Quando usar?",
        dica: "O que se ganha e o que se perde ao guardar estrutura dentro de uma célula?",
        resolucao:
          "Formalmente, uma coluna JSON ou ARRAY viola a atomicidade e, portanto, a primeira forma normal — o valor deixa de ser indivisível para o modelo. Na prática, isso não invalida o modelo relacional; mostra que os produtos foram além dele em pontos específicos, e cada um desses pontos tem um custo que é preciso conhecer. O que se perde é considerável: o SGBD não valida a estrutura interna do documento, então nada impede que uma linha guarde um campo com um nome e a linha seguinte com outro; não há chave estrangeira apontando para dentro do JSON, então a integridade referencial não alcança o conteúdo; consultar por um valor interno exige sintaxe específica do produto, o que reintroduz dependência de tecnologia; e a atualização parcial normalmente reescreve o documento inteiro. O que se ganha é a capacidade de armazenar estrutura genuinamente variável sem modelá-la. O critério de uso decorre disso. Use JSON quando a estrutura for realmente heterogênea e desconhecida em tempo de projeto — atributos que variam por fabricante num catálogo, corpo de webhook recebido de terceiros, respostas de formulário dinâmico — e quando o conteúdo for lido como um bloco, sem necessidade de consulta ou integridade sobre suas partes. Não use como atalho para não criar uma tabela: se você consulta o conteúdo, filtra por ele, ordena por ele ou precisa que ele referencie outra tabela, o dado é relacional e está no lugar errado. A regra prática mais útil é a pergunta: preciso de índice, chave estrangeira ou restrição sobre isso? Se sim, é tabela.",
        resposta:
          "Viola a 1FN, mas não invalida o modelo — é extensão com custo: sem validação de estrutura, sem integridade referencial interna e com sintaxe proprietária. Use para estrutura genuinamente variável lida em bloco; se precisa de índice, FK ou restrição sobre o conteúdo, é tabela.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Relação é conjunto de tuplas: sem duplicatas, sem ordem de linhas, sem ordem de colunas.",
        "Grau = número de atributos; cardinalidade = número de tuplas.",
        "Todo valor é atômico — daí não existir atributo multivalorado nem composto.",
        "A tabela SQL é multiconjunto, e por isso a chave primária é o que a aproxima de uma relação.",
      ],
      checklist: [
        "Sei traduzir entre o vocabulário formal e o prático.",
        "Sei informar grau e cardinalidade de uma relação.",
        "Sei explicar por que SELECT sem ORDER BY não garante ordem.",
        "Sei justificar quando JSON é aceitável e quando é dado no lugar errado.",
      ],
      palavrasChave: ["relação", "tupla", "domínio", "grau", "atomicidade", "multiconjunto"],
      pontosRevisao: [
        "As três propriedades que distinguem relação de tabela.",
        "Por que linhas duplicadas não podem ser atualizadas separadamente.",
      ],
    },
  },

  {
    numero: 10,
    assunto: "Regras de integridade do modelo relacional",
    unidade: "Modelo Relacional",
    conteudo: {
      resumo:
        "Chaves candidata, primária e estrangeira; integridade de entidade e referencial; e as ações de propagação ON DELETE e ON UPDATE.",
      explicacaoSimples:
        "Duas regras sustentam o modelo relacional. A primeira: toda linha tem de ser identificável, então a chave primária não pode ser nula nem repetida. A segunda: se uma linha aponta para outra, a apontada tem de existir — não se admite pedido de um cliente que não está cadastrado. Parecem óbvias, e é justamente por serem óbvias que costumam ser deixadas a cargo da aplicação, onde uma delas sempre acaba falhando.",
      explicacaoTecnica:
        "Superchave é qualquer conjunto de atributos que identifique univocamente uma tupla. Chave candidata é uma superchave mínima — nenhum subconjunto próprio dela é superchave. Escolhida uma candidata como chave primária, as demais tornam-se chaves alternativas, declaráveis com UNIQUE. A integridade de entidade determina que nenhum atributo da chave primária pode ser nulo, o que decorre da própria definição: um valor nulo significa desconhecido, e não se pode identificar por algo desconhecido. A integridade referencial determina que o valor de uma chave estrangeira deve corresponder a alguma tupla existente na relação referenciada, ou ser inteiramente nulo. As ações referenciais definem o que ocorre quando a tupla referenciada é removida ou tem sua chave alterada: NO ACTION e RESTRICT impedem a operação, CASCADE a propaga, SET NULL e SET DEFAULT substituem o valor na tupla que referencia. A escolha entre elas é decisão de negócio, não técnica.",
      aplicacoes: [
        "ON DELETE CASCADE em itens de pedido é correto — item sem pedido não existe; o mesmo CASCADE entre pedido e cliente apagaria o histórico de vendas ao remover um cadastro.",
        "Chave alternativa com UNIQUE é o que impede dois usuários com o mesmo e-mail, sem que o e-mail precise virar chave primária.",
        "Integridade declarada no banco continua valendo para o script de importação, para o acesso manual do DBA e para o sistema novo que ninguém avisou das regras.",
      ],
      curiosidades: [
        "Uma chave estrangeira composta é tudo-ou-nada quanto a nulos: pelo padrão SQL, ou todas as colunas são nulas ou todas devem casar. A regra parcial (MATCH PARTIAL) existe no padrão e quase nenhum produto implementa.",
        "Chave primária natural (CPF, ISBN) contra artificial (id sequencial) é uma das discussões mais antigas da área; o argumento decisivo contra a natural costuma ser que dados do mundo real mudam — inclusive CPF, por decisão judicial.",
      ],
      conceitos: [
        {
          termo: "Superchave",
          definicao:
            "Conjunto de atributos que identifica univocamente uma tupla, mesmo que contenha atributos supérfluos.",
        },
        {
          termo: "Chave candidata",
          definicao:
            "Superchave mínima: retirar qualquer atributo dela faz perder a unicidade.",
        },
        {
          termo: "Chave primária",
          definicao:
            "A candidata escolhida para identificar a relação. Não admite nulo nem repetição.",
        },
        {
          termo: "Chave alternativa",
          definicao: "Candidata não escolhida como primária; declara-se com UNIQUE.",
        },
        {
          termo: "Chave estrangeira",
          definicao:
            "Atributo que referencia a chave primária de outra relação (ou da própria).",
        },
        {
          termo: "Integridade de entidade",
          definicao: "Nenhum atributo da chave primária pode ser nulo.",
        },
        {
          termo: "Integridade referencial",
          definicao:
            "Toda chave estrangeira deve apontar para uma tupla existente, ou ser nula.",
        },
      ],
      exemplos: [
        {
          titulo: "Identificando as chaves de uma relação",
          descricao:
            "Encontrar as candidatas é o passo que antecede a escolha da primária — e é o que quase ninguém faz explicitamente.",
          linguagem: "text",
          codigo: `RELAÇÃO: aluno(matricula, cpf, email, nome, semestre)

Superchaves (identificam, mas podem ter atributo supérfluo):
  {matricula}
  {matricula, nome}          <- nome é supérfluo aqui
  {cpf, semestre}            <- semestre é supérfluo
  {matricula, cpf, email, nome, semestre}

Chaves candidatas (superchaves MÍNIMAS):
  {matricula}
  {cpf}
  {email}

Escolha:
  PRIMÁRIA     -> matricula   (estável, curta, do domínio da escola)
  ALTERNATIVAS -> cpf, email  (UNIQUE)`,
          linhas: [
            {
              trecho: "{matricula, nome}",
              explicacao:
                "É superchave porque identifica, mas não é candidata: tirando nome, matricula ainda identifica sozinha. Falta a minimalidade.",
            },
            {
              trecho: "{email} como candidata",
              explicacao:
                "Identifica univocamente, então é candidata. Mas e-mail muda com frequência — motivo suficiente para não ser a primária.",
            },
          ],
        },
        {
          titulo: "As ações referenciais e suas consequências",
          descricao:
            "Cada linha é uma decisão de negócio. Escolher por hábito é como o histórico de vendas some ao excluir um cliente.",
          linguagem: "sql",
          codigo: `-- Item de pedido: não existe sem o pedido. CASCADE é correto.
CREATE TABLE item_pedido (
  pedido_id  INTEGER NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  PRIMARY KEY (pedido_id, produto_id)
);

-- Pedido: o histórico NÃO pode sumir com o cliente.
CREATE TABLE pedido (
  id         INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES cliente(id) ON DELETE RESTRICT,
  data       DATE NOT NULL
);

-- Departamento sem gerente é situação real: SET NULL.
CREATE TABLE departamento (
  id         INTEGER PRIMARY KEY,
  gerente_id INTEGER REFERENCES funcionario(id) ON DELETE SET NULL
);`,
          linhas: [
            {
              trecho: "ON DELETE CASCADE em pedido_id",
              explicacao:
                "Apagar o pedido apaga seus itens. Correto porque item de pedido é entidade fraca: sem o pedido, não significa nada.",
            },
            {
              trecho: "ON DELETE RESTRICT em produto_id",
              explicacao:
                "Impede excluir produto que já foi vendido. Sem isso, o CASCADE apagaria itens de pedidos antigos e o faturamento histórico mudaria sozinho.",
            },
            {
              trecho: "ON DELETE RESTRICT em cliente_id",
              explicacao:
                "A diferença entre esta linha e um CASCADE é a diferença entre manter e perder o histórico de vendas. É decisão de negócio, não de banco.",
            },
            {
              trecho: "ON DELETE SET NULL em gerente_id",
              explicacao:
                "O gerente sai da empresa, o departamento continua existindo sem gerente. Só funciona porque a coluna admite nulo — com NOT NULL, o SGBD recusaria a declaração.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a10-e1",
        nivel: "basico",
        enunciado:
          "Em livro(isbn, titulo, autor, editora, ano), quais são as chaves candidatas? Qual seria a primária?",
        dica: "Qual atributo não repete nunca?",
        resolucao:
          "A única chave candidata é {isbn}, porque o ISBN identifica univocamente uma edição de um livro. Título pode repetir entre livros diferentes, autor publica vários livros, editora publica muitos e ano é compartilhado por milhares. Combinações como {titulo, autor, ano} podem parecer únicas, mas não há garantia — o mesmo autor pode lançar duas edições no mesmo ano. A chave primária é, portanto, isbn.",
        resposta: "Candidata única: {isbn}, que é também a chave primária.",
      },
      {
        id: "bd-a10-e2",
        nivel: "intermediario",
        enunciado:
          "Explique a diferença entre chave candidata e superchave, com um exemplo em que uma superchave não é candidata.",
        dica: "A palavra que diferencia é mínima.",
        resolucao:
          "Superchave é qualquer conjunto de atributos que identifique univocamente uma tupla, independentemente de conter atributos desnecessários. Chave candidata é uma superchave mínima: retirar qualquer atributo dela faz perder a unicidade. Em aluno(matricula, cpf, nome, semestre), o conjunto {matricula, nome} é superchave, porque conhecidos matrícula e nome identifica-se exatamente uma tupla. Não é candidata, porém, porque {matricula} sozinha já identifica — nome é supérfluo. Toda chave candidata é superchave; a recíproca é falsa.",
        resposta:
          "Superchave identifica; candidata identifica e é mínima. {matricula, nome} é superchave mas não candidata, pois {matricula} basta.",
      },
      {
        id: "bd-a10-e3",
        nivel: "avancado",
        enunciado:
          "Um sistema usa ON DELETE CASCADE entre cliente e pedido. Explique o problema e proponha a alternativa.",
        dica: "O que acontece com o faturamento de 2024 quando alguém apaga um cadastro?",
        resolucao:
          "O problema é a perda irreversível de dado histórico e financeiro. Excluir um cliente apaga automaticamente todos os seus pedidos, e com eles — se o cascade continuar propagando — os itens desses pedidos. O faturamento de exercícios passados muda retroativamente, relatórios já emitidos deixam de ser reproduzíveis e obrigações fiscais de guarda de documentos são violadas. Pior: a operação parece bem-sucedida, ninguém recebe erro e a perda só é notada quando alguém compara um relatório novo com um antigo. A alternativa correta tem duas partes. A primeira é trocar por ON DELETE RESTRICT, de modo que o banco recuse excluir cliente com pedidos — o erro aparece na hora, para quem tentou, e não meses depois. A segunda é reconhecer que o negócio raramente quer mesmo excluir um cliente: quer pará-lo de aparecer nas telas. Isso é exclusão lógica, uma coluna ativo ou excluido_em que a aplicação filtra, preservando o dado e todo o histórico. As duas juntas resolvem: o CASCADE some, o RESTRICT protege contra o acidente, e a exclusão lógica atende à necessidade real que motivava a exclusão física.",
        resposta:
          "CASCADE apaga o histórico de vendas junto com o cadastro, retroativamente e sem erro. Alternativa: ON DELETE RESTRICT para proteger, mais exclusão lógica (coluna ativo) para atender à necessidade real de \"sumir da tela\".",
      },
      {
        id: "bd-a10-e4",
        nivel: "desafio",
        enunciado:
          "Um colega afirma que validar integridade na aplicação é suficiente e que chaves estrangeiras \"só deixam o banco lento\". Responda.",
        dica: "Quem mais escreve nesse banco, além da aplicação?",
        resolucao:
          "O argumento falha no pressuposto de que a aplicação é o único caminho até o dado, e ela nunca é. Escrevem no banco também os scripts de importação e carga inicial, o DBA em manutenção emergencial, ferramentas de BI e ETL, jobs agendados, o sistema legado que ainda não foi desligado e a próxima aplicação que alguém escreverá sem ler o código desta. Cada um desses caminhos teria de reimplementar as mesmas validações, e basta um esquecer para o dado inconsistente entrar — e uma vez dentro, ele fica, porque nada o remove. Há também a concorrência: validar na aplicação significa consultar se o cliente existe e depois inserir o pedido, e entre as duas operações outra transação pode excluir o cliente. Só uma restrição verificada pelo SGBD dentro da transação fecha essa janela; código de aplicação, por mais correto que seja, não consegue. Quanto ao desempenho, o custo existe e é conhecido: a verificação de chave estrangeira exige uma busca na tabela referenciada, barata quando há índice na chave primária — que sempre há — e é por isso que o problema real costuma ser a falta de índice na coluna da chave estrangeira, não a restrição em si. Além disso, a comparação honesta não é entre validar no banco e não validar: é entre validar no banco e validar na aplicação, e a segunda faz a mesma consulta, só que sem a garantia transacional e com uma ida e volta de rede a mais. O ganho de tirar a restrição é, portanto, menor do que parece, e o preço é abrir mão da única garantia que vale para todos os caminhos. A conclusão prática: valide nos dois lugares — na aplicação para dar mensagem de erro decente ao usuário, no banco porque é lá que a garantia é real.",
        resposta:
          "A aplicação nunca é o único caminho até o dado (importações, DBA, ETL, jobs, sistemas futuros), e só a restrição no SGBD fecha a janela de concorrência entre verificar e inserir. O custo é uma busca por índice que já existe. Valide nos dois: na aplicação pela mensagem, no banco pela garantia.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Superchave identifica; candidata é superchave mínima; primária é a candidata escolhida.",
        "Integridade de entidade: chave primária não admite nulo.",
        "Integridade referencial: chave estrangeira aponta para tupla existente, ou é nula.",
        "As ações referenciais (CASCADE, RESTRICT, SET NULL) são decisão de negócio.",
      ],
      checklist: [
        "Sei listar superchaves e candidatas de uma relação.",
        "Sei justificar a escolha da chave primária.",
        "Sei escolher a ação referencial adequada a cada relacionamento.",
        "Sei argumentar por que a integridade pertence ao banco.",
      ],
      palavrasChave: [
        "chave candidata",
        "chave primária",
        "chave estrangeira",
        "integridade referencial",
        "CASCADE",
        "RESTRICT",
      ],
      pontosRevisao: [
        "Por que CASCADE entre cliente e pedido destrói histórico.",
        "A janela de concorrência que só a restrição no SGBD fecha.",
      ],
    },
  },
]
