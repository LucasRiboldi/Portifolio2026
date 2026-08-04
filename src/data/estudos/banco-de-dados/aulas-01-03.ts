import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 1 a 3.
 *
 * Unidade coberta: "Introdução aos SGBDs", na ordem em que o Plano de Ensino
 * a lista.
 */
export const AULAS_01_03: Aula[] = [
  {
    numero: 1,
    assunto: "Gerência de dados antes do conceito de banco de dados",
    unidade: "Introdução aos SGBDs",
    conteudo: {
      resumo:
        "Como os sistemas guardavam dados quando cada programa tinha seus próprios arquivos, e quais problemas dessa época deram origem ao SGBD.",
      explicacaoSimples:
        "Imagine uma empresa onde o setor de vendas tem um caderno de clientes e o setor de cobrança tem outro. Alguém muda de endereço e avisa só a um dos setores. A partir daí existem duas verdades sobre o mesmo cliente, e ninguém sabe qual vale. Era assim que os sistemas funcionavam antes do banco de dados: cada programa com seu arquivo, cada arquivo com sua cópia dos mesmos dados.",
      explicacaoTecnica:
        "No processamento por arquivos, a estrutura física dos dados fica embutida no código do programa que os lê. Cada aplicação define seu próprio formato de registro, sua própria abertura de arquivo e seu próprio acesso. Isso produz quatro problemas clássicos: redundância descontrolada (o mesmo dado repetido em arquivos diferentes), inconsistência (as cópias divergem porque nada as sincroniza), dependência entre programa e dados (mudar o layout do arquivo obriga a recompilar todo programa que o usa) e dificuldade de acesso concorrente (dois programas gravando no mesmo arquivo corrompem-no, porque não há quem arbitre).",
      aplicacoes: [
        "Arquivos CSV trocados entre setores ainda reproduzem exatamente esse cenário — cada planilha vira uma cópia que envelhece sozinha.",
        "Sistemas legados em COBOL com arquivos indexados (ISAM/VSAM) são o retrato dessa fase e continuam em produção em bancos e órgãos públicos.",
        "Logs de aplicação são um uso legítimo de arquivo puro: são escritos uma vez e nunca atualizados, então nenhum dos quatro problemas se aplica.",
      ],
      curiosidades: [
        "O termo \"data base\" aparece pela primeira vez em documentos militares norte-americanos nos anos 1960, descrevendo bases de dados compartilhadas entre sistemas.",
        "O IDS (Integrated Data Store), de Charles Bachman, em 1964, é considerado o primeiro SGBD; Bachman ganhou o Turing Award por ele em 1973 — antes mesmo de o modelo relacional se popularizar.",
      ],
      conceitos: [
        {
          termo: "Redundância",
          definicao:
            "O mesmo dado armazenado em mais de um lugar. Nem toda redundância é erro — a controlada é decidida de propósito; o problema é a descontrolada, que ninguém sabe que existe.",
        },
        {
          termo: "Inconsistência",
          definicao:
            "Duas cópias do mesmo dado com valores diferentes. É consequência direta da redundância descontrolada: se nada obriga as cópias a andarem juntas, elas divergem.",
        },
        {
          termo: "Dependência programa-dados",
          definicao:
            "Situação em que a estrutura física do arquivo está escrita dentro do programa. Acrescentar um campo ao arquivo quebra todos os programas que o leem.",
        },
      ],
      exemplos: [
        {
          titulo: "O mesmo cliente em dois arquivos",
          descricao:
            "Dois setores, dois arquivos, dois formatos. Repare que o cliente 1023 tem endereços diferentes — e nada no sistema percebe isso.",
          linguagem: "text",
          codigo: `vendas/clientes.txt
1023;Maria Souza;Rua A, 100;maria@exemplo.com

cobranca/sacados.dat
1023|SOUZA, MARIA|RUA B, 250|(51)99999-0000`,
          linhas: [
            {
              trecho: "1023",
              explicacao:
                "O mesmo código de cliente nos dois arquivos. É a única coisa que os liga — e essa ligação só existe na cabeça de quem programou.",
            },
            {
              trecho: "Rua A, 100  /  RUA B, 250",
              explicacao:
                "A inconsistência. Um dos dois está errado, os dois programas continuam funcionando, e nenhum relatório acusa.",
            },
            {
              trecho: "; versus |",
              explicacao:
                "Separadores diferentes: cada programa fixou o seu. Trocar o separador de um arquivo exige alterar o código que o lê — é a dependência programa-dados.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a1-e1",
        nivel: "basico",
        enunciado:
          "Liste os quatro problemas do processamento por arquivos citados na aula e escreva, para cada um, uma frase explicando o que ele causa na prática.",
        dica: "Dois deles são consequência um do outro; comece por esse par.",
        resolucao:
          "Redundância descontrolada: o mesmo dado é gravado em vários arquivos, ocupando espaço e criando várias versões da verdade. Inconsistência: como nada sincroniza essas cópias, elas divergem — é consequência direta da redundância. Dependência programa-dados: o layout do arquivo está no código, então mudar o layout obriga a alterar e recompilar todos os programas. Dificuldade de acesso concorrente: sem um árbitro entre dois programas que gravam ao mesmo tempo, o arquivo corrompe.",
        resposta:
          "Redundância descontrolada, inconsistência, dependência programa-dados e dificuldade de acesso concorrente.",
      },
      {
        id: "bd-a1-e2",
        nivel: "intermediario",
        enunciado:
          "Uma escola tem um arquivo de alunos na secretaria e outro na biblioteca, cada um com nome e telefone do aluno. Descreva o que acontece quando um aluno troca de telefone e explique qual dos quatro problemas isso ilustra.",
        dica: "Pergunte-se: quem avisa o outro arquivo?",
        resolucao:
          "O aluno comunica a mudança ao setor com que tem contato — digamos, a secretaria. O arquivo da secretaria passa a ter o telefone novo; o da biblioteca continua com o antigo, porque não existe mecanismo que propague a alteração. A biblioteca liga para cobrar um livro atrasado e não encontra o aluno. O problema é a inconsistência, causada pela redundância descontrolada: o telefone está guardado duas vezes e nada obriga as duas cópias a andarem juntas.",
        resposta:
          "A biblioteca fica com o telefone desatualizado. É inconsistência, causada por redundância descontrolada.",
      },
      {
        id: "bd-a1-e3",
        nivel: "avancado",
        enunciado:
          "Explique por que um arquivo de log de aplicação não sofre dos problemas descritos na aula, mesmo sendo um arquivo puro sem SGBD nenhum.",
        dica: "Pense no que se faz com um log depois de escrito.",
        resolucao:
          "Os quatro problemas nascem da atualização de dados duplicados. Um log é append-only: cada linha é escrita uma vez e nunca alterada nem apagada. Sem atualização, não há como duas cópias divergirem — a inconsistência não tem como surgir. A redundância existe (o log repete dados que estão no banco), mas é redundância controlada e intencional, com finalidade de auditoria. A concorrência é resolvida pelo próprio sistema operacional, que garante atomicidade de escritas pequenas em modo append. E a dependência programa-dados é irrelevante porque o log não é lido por programas que dependem de seu layout, e sim por humanos e ferramentas tolerantes a formato.",
        resposta:
          "Porque o log é append-only: sem atualização de dado já gravado, não há divergência entre cópias — e é justamente a atualização que gera os quatro problemas.",
      },
      {
        id: "bd-a1-e4",
        nivel: "desafio",
        enunciado:
          "Um sistema de vendas guarda, em cada pedido, o nome e o endereço do cliente copiados do cadastro. Um colega diz que isso é redundância descontrolada e deve ser eliminado. Argumente a favor de manter essa cópia e diga em que condição ele teria razão.",
        dica:
          "O que deve constar numa nota fiscal emitida em 2024 se o cliente mudou de endereço em 2025?",
        resolucao:
          "A cópia no pedido não é redundância descontrolada: é um dado histórico. O endereço no pedido responde a \"para onde esta compra foi entregue\", que é uma pergunta diferente de \"onde o cliente mora hoje\" — respondida pelo cadastro. Se o pedido apenas apontasse para o cadastro, atualizar o endereço do cliente reescreveria o passado, e a nota fiscal de dois anos atrás passaria a mostrar um endereço que não existia na época. Isso é redundância controlada, decidida de propósito, e o nome técnico do padrão é snapshot de dados transacionais. O colega teria razão se o campo copiado fosse usado como se fosse o dado atual — por exemplo, se a tela de cadastro do cliente lesse o endereço a partir do último pedido, ou se um relatório de mala direta usasse os endereços dos pedidos em vez do cadastro. Aí passariam a existir duas fontes disputando a mesma pergunta, que é exatamente a definição do problema.",
        resposta:
          "É redundância controlada: o pedido guarda o endereço histórico da entrega, não o endereço atual do cliente. O colega só teria razão se essa cópia fosse usada para responder \"onde o cliente mora hoje\".",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Antes do SGBD, cada programa definia e mantinha seus próprios arquivos de dados.",
        "Os quatro problemas dessa abordagem: redundância descontrolada, inconsistência, dependência programa-dados e dificuldade de acesso concorrente.",
        "Redundância controlada é decisão de projeto; descontrolada é a que ninguém sabe que existe.",
      ],
      checklist: [
        "Sei explicar o que é processamento por arquivos.",
        "Sei nomear os quatro problemas e dar um exemplo de cada.",
        "Sei distinguir redundância controlada de descontrolada.",
      ],
      palavrasChave: ["redundância", "inconsistência", "dependência programa-dados", "concorrência"],
      pontosRevisao: [
        "Por que inconsistência é consequência da redundância, e não um problema independente.",
        "Em que situação um arquivo simples continua sendo a escolha certa.",
      ],
    },
  },

  {
    numero: 2,
    assunto: "Conceitos de BD e SGBD",
    unidade: "Introdução aos SGBDs",
    conteudo: {
      resumo:
        "A distinção entre o banco de dados (a coleção de dados) e o SGBD (o software que a gerencia), e as vantagens que essa separação trouxe.",
      explicacaoSimples:
        "Banco de dados é o acervo; SGBD é o bibliotecário. O acervo são os livros guardados de forma organizada. O bibliotecário é quem sabe onde cada coisa está, quem controla quem pode pegar o quê, quem impede duas pessoas de levarem o mesmo exemplar e quem repõe tudo se houver um incêndio. Trocar de bibliotecário não muda os livros — e é exatamente essa independência que o SGBD trouxe.",
      explicacaoTecnica:
        "Um banco de dados é uma coleção de dados inter-relacionados, com significado implícito, que representa algum aspecto do mundo real (o minimundo). Um SGBD é a camada de software que permite definir, construir, manipular e compartilhar esse banco. Ele oferece: linguagem de definição (DDL) para descrever o esquema; linguagem de manipulação (DML) para consultar e alterar; controle de concorrência para transações simultâneas; controle de acesso; e recuperação após falhas. A propriedade central que o SGBD entrega é a independência de dados — a capacidade de alterar o esquema em um nível sem alterar o nível acima. Na independência física, muda-se o armazenamento (criar um índice, trocar o disco) sem tocar no esquema lógico; na lógica, muda-se o esquema lógico (acrescentar uma coluna) sem alterar as aplicações que não usam a parte alterada.",
      aplicacoes: [
        "Criar um índice para acelerar uma consulta lenta não obriga a reescrever consulta nenhuma — é independência física em ação.",
        "Acrescentar uma coluna a uma tabela não quebra o sistema que já roda, desde que as consultas nomeiem colunas em vez de usar SELECT *.",
        "O controle de concorrência do SGBD é o que permite mil pessoas comprarem no mesmo site sem que dois pedidos levem o último item do estoque.",
      ],
      curiosidades: [
        "Edgar F. Codd, autor do modelo relacional, trabalhava na IBM e teve dificuldade para convencer a própria empresa a adotá-lo — a IBM já vendia o IMS, hierárquico, e demorou a lançar o System R.",
        "A sigla SGBD em inglês é DBMS (Database Management System); a distinção entre \"banco\" e \"sistema gerenciador\" é frequentemente ignorada na fala do dia a dia, quando se diz \"o banco caiu\" para dizer que o SGBD parou.",
      ],
      conceitos: [
        {
          termo: "Banco de dados",
          definicao:
            "Coleção de dados inter-relacionados que representa um recorte do mundo real. É o conteúdo, não o programa.",
        },
        {
          termo: "SGBD",
          definicao:
            "Sistema Gerenciador de Banco de Dados: o software que define, constrói, manipula e compartilha o banco, controlando acesso, concorrência e recuperação.",
        },
        {
          termo: "Esquema",
          definicao:
            "A descrição da estrutura do banco — as tabelas, seus campos e suas restrições. Muda raramente.",
        },
        {
          termo: "Instância",
          definicao:
            "Os dados efetivamente armazenados num dado momento. Muda a cada operação.",
        },
        {
          termo: "Independência de dados",
          definicao:
            "Capacidade de alterar um nível do esquema sem afetar o nível superior. Física quando muda o armazenamento; lógica quando muda a estrutura lógica.",
        },
      ],
      exemplos: [
        {
          titulo: "Esquema e instância — a mesma tabela em dois momentos",
          descricao:
            "O esquema é a linha do CREATE TABLE; a instância é o conteúdo. O esquema muda em dias de manutenção; a instância muda o tempo todo.",
          linguagem: "sql",
          codigo: `-- ESQUEMA: a estrutura. Definida uma vez, alterada raramente.
CREATE TABLE aluno (
  matricula  INTEGER      PRIMARY KEY,
  nome       VARCHAR(80)  NOT NULL,
  semestre   INTEGER
);

-- INSTÂNCIA: o conteúdo num instante. Muda a cada INSERT.
INSERT INTO aluno VALUES (2026001, 'Ana Lima',    3);
INSERT INTO aluno VALUES (2026002, 'Bruno Reis',  3);`,
          linhas: [
            {
              trecho: "CREATE TABLE aluno",
              explicacao:
                "Comando de DDL — linguagem de definição de dados. Descreve a estrutura, não guarda dado nenhum.",
            },
            {
              trecho: "matricula INTEGER PRIMARY KEY",
              explicacao:
                "Parte do esquema: declara o tipo e a restrição. O SGBD passa a recusar matrícula repetida ou nula, sem que nenhum programa precise verificar isso.",
            },
            {
              trecho: "INSERT INTO aluno VALUES (...)",
              explicacao:
                "Comando de DML — linguagem de manipulação. Altera a instância; o esquema continua o mesmo.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a2-e1",
        nivel: "basico",
        enunciado: "Explique com suas palavras a diferença entre banco de dados e SGBD.",
        dica: "Um é conteúdo, o outro é programa.",
        resolucao:
          "O banco de dados é a coleção de dados inter-relacionados que representa um recorte do mundo real — é conteúdo armazenado. O SGBD é o software que gerencia essa coleção: define a estrutura, executa as consultas, controla quem acessa, arbitra o acesso simultâneo e recupera o banco depois de uma falha. Um banco pode ser migrado de um SGBD para outro; são coisas separadas.",
        resposta:
          "Banco de dados é a coleção de dados; SGBD é o software que a gerencia.",
      },
      {
        id: "bd-a2-e2",
        nivel: "basico",
        enunciado:
          "Classifique cada item como esquema ou instância: (a) a definição da tabela produto; (b) as 4.000 linhas de produtos cadastrados; (c) a restrição de que preço não pode ser nulo.",
        dica: "Instância é o que muda quando alguém usa o sistema.",
        resolucao:
          "(a) Esquema — é a descrição da estrutura. (b) Instância — é o conteúdo num dado momento, e muda a cada cadastro. (c) Esquema — restrições fazem parte da descrição da estrutura, não do conteúdo.",
        resposta: "(a) esquema; (b) instância; (c) esquema.",
      },
      {
        id: "bd-a2-e3",
        nivel: "intermediario",
        enunciado:
          "O administrador cria um índice sobre a coluna nome da tabela cliente para acelerar as buscas. Nenhuma consulta do sistema precisou ser reescrita. Que tipo de independência de dados esse fato demonstra? Justifique.",
        dica: "Índice é decisão de armazenamento.",
        resolucao:
          "Demonstra independência física de dados. O índice é uma estrutura de armazenamento: altera como o SGBD encontra as linhas no disco, sem alterar quais linhas existem nem quais colunas a tabela tem. Como o esquema lógico permaneceu idêntico, as consultas — escritas contra o esquema lógico — continuam válidas. Quem decide usar ou não o índice é o otimizador do SGBD, em tempo de execução; o programador nem precisa saber que ele existe.",
        resposta:
          "Independência física: mudou o armazenamento, não o esquema lógico contra o qual as consultas foram escritas.",
      },
      {
        id: "bd-a2-e4",
        nivel: "avancado",
        enunciado:
          "Uma equipe acrescenta a coluna data_nascimento à tabela cliente. O relatório de vendas, que faz SELECT * FROM cliente e grava as colunas em posições fixas de um arquivo, passa a gerar saída errada. A independência lógica falhou? Explique.",
        dica: "Pergunte de quem é a dependência: do SGBD ou do programa?",
        resolucao:
          "A independência lógica não falhou — ela foi anulada pelo programa. A promessa da independência lógica é que uma aplicação continue funcionando quando o esquema muda em partes que ela não usa. Mas SELECT * não nomeia as colunas que usa: ele pede todas e assume uma ordem posicional que o esquema não garante. O relatório, portanto, depende da estrutura física do resultado, e não do conjunto de colunas de que precisa. Com SELECT nome, cpf, cidade FROM cliente, o acréscimo de data_nascimento seria invisível para ele. A conclusão prática é que independência de dados é uma capacidade oferecida pelo SGBD, não uma garantia automática: o programa precisa escrever consultas que a aproveitem.",
        resposta:
          "Não. A independência lógica existe, mas SELECT * a descarta ao depender da ordem posicional das colunas em vez de nomeá-las.",
      },
      {
        id: "bd-a2-e5",
        nivel: "desafio",
        enunciado:
          "Cite duas funções do SGBD que seriam extremamente caras de reimplementar dentro da aplicação e explique por que o custo é alto.",
        dica: "Pense no que acontece quando duas coisas ocorrem ao mesmo tempo, e no que acontece quando falta energia.",
        resolucao:
          "A primeira é o controle de concorrência. Reimplementá-lo exige tratar bloqueios, detectar e resolver impasses (deadlocks) e garantir níveis de isolamento entre transações — problemas que envolvem toda a combinação de operações simultâneas possíveis, e cujos erros aparecem só sob carga, de forma não determinística e quase impossível de reproduzir em teste. A segunda é a recuperação após falha. O SGBD mantém um log de transações que permite refazer o que estava confirmado e desfazer o que estava pela metade quando a energia caiu; garantir isso na aplicação significaria implementar escrita à frente do log, pontos de verificação e um protocolo de recuperação que funcione mesmo se a falha ocorrer durante a própria recuperação. Nos dois casos, o custo alto não está em escrever o caminho normal, e sim em cobrir corretamente todos os caminhos de exceção — e a consequência de errar é perda ou corrupção silenciosa de dados.",
        resposta:
          "Controle de concorrência e recuperação após falha. Ambas são caras porque o difícil não é o caso normal, e sim cobrir todos os casos de exceção — cujos erros são não determinísticos e corrompem dados em silêncio.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Banco de dados é a coleção de dados; SGBD é o software que a gerencia.",
        "Esquema é a estrutura (muda raramente); instância é o conteúdo (muda sempre).",
        "Independência física isola mudanças de armazenamento; independência lógica isola mudanças de estrutura.",
        "As vantagens do SGBD: controle de redundância, de acesso, de concorrência e recuperação após falha.",
      ],
      checklist: [
        "Sei diferenciar banco de dados de SGBD.",
        "Sei classificar um item como esquema ou instância.",
        "Sei dar um exemplo de independência física e um de independência lógica.",
        "Sei citar quatro funções que o SGBD executa e a aplicação não precisa reimplementar.",
      ],
      palavrasChave: ["SGBD", "esquema", "instância", "independência de dados", "DDL", "DML"],
      pontosRevisao: [
        "Por que SELECT * anula a independência lógica.",
        "Quais funções do SGBD são caras demais para reimplementar na aplicação.",
      ],
    },
  },

  {
    numero: 3,
    assunto: "Noções gerais de um sistema de banco de dados",
    unidade: "Introdução aos SGBDs",
    conteudo: {
      resumo:
        "A arquitetura em três esquemas (ANSI/SPARC), os papéis das pessoas envolvidas e o que acontece internamente entre a consulta e a resposta.",
      explicacaoSimples:
        "Um sistema de banco de dados é organizado em três camadas de descrição. Na de baixo está como os dados estão gravados no disco. No meio, quais tabelas existem e como se relacionam. Em cima, o recorte que cada usuário enxerga — o setor financeiro não precisa ver, nem deve ver, os mesmos campos que o RH. Separar essas três descrições é o que permite mexer numa sem derrubar as outras.",
      explicacaoTecnica:
        "A arquitetura ANSI/SPARC define três níveis. O nível interno descreve o armazenamento físico: organização dos arquivos, índices, caminhos de acesso. O nível conceitual descreve a estrutura lógica completa do banco — entidades, atributos, relacionamentos e restrições — sem detalhes de armazenamento. O nível externo é o conjunto de visões, cada uma expondo a parte do conceitual que interessa a um grupo de usuários. Entre os níveis existem mapeamentos: o conceitual/interno e o externo/conceitual. É a existência desses mapeamentos que materializa a independência de dados — alterado o nível interno, refaz-se apenas o mapeamento conceitual/interno, e nada acima percebe. Os papéis envolvidos são o administrador de dados (decide o que se armazena), o administrador do banco (DBA, responsável por desempenho, segurança e backup), o projetista, o programador de aplicação e o usuário final.",
      aplicacoes: [
        "Uma visão que expõe funcionário sem a coluna salário é nível externo funcionando como mecanismo de segurança.",
        "Particionar uma tabela de 500 milhões de linhas por ano é mudança de nível interno: as consultas continuam escritas contra a mesma tabela lógica.",
        "O DBA que analisa o plano de execução de uma consulta lenta está trabalhando no mapeamento conceitual/interno.",
      ],
      curiosidades: [
        "A proposta ANSI/SPARC é de 1975 e nunca virou norma formal, mas seu vocabulário de três níveis se tornou universal no ensino de bancos de dados.",
        "O processador de consultas de um SGBD relacional costuma reescrever a consulta antes de executá-la: a ordem em que as tabelas aparecem no FROM raramente é a ordem em que serão lidas.",
      ],
      conceitos: [
        {
          termo: "Nível interno",
          definicao:
            "Descreve como os dados estão fisicamente armazenados: arquivos, blocos, índices e caminhos de acesso.",
        },
        {
          termo: "Nível conceitual",
          definicao:
            "Descreve a estrutura lógica completa do banco — o que existe e como se relaciona — sem dizer como está gravado.",
        },
        {
          termo: "Nível externo",
          definicao:
            "Conjunto de visões; cada uma é o recorte do conceitual que um grupo de usuários enxerga.",
        },
        {
          termo: "DBA",
          definicao:
            "Administrador de banco de dados: responsável por desempenho, segurança, backup e recuperação do ambiente.",
        },
        {
          termo: "Catálogo (dicionário de dados)",
          definicao:
            "Onde o SGBD guarda a descrição do próprio banco — as tabelas, colunas, tipos e restrições. É um banco de dados sobre o banco de dados.",
        },
      ],
      exemplos: [
        {
          titulo: "Os três níveis sobre a mesma tabela",
          descricao:
            "A mesma informação descrita nos três níveis. Repare que só o nível externo muda de usuário para usuário.",
          linguagem: "sql",
          codigo: `-- CONCEITUAL: a estrutura lógica completa.
CREATE TABLE funcionario (
  id       INTEGER PRIMARY KEY,
  nome     VARCHAR(80) NOT NULL,
  setor    VARCHAR(40),
  salario  NUMERIC(10,2)
);

-- INTERNO: decisão de armazenamento. Não muda o que existe, muda como se acha.
CREATE INDEX idx_func_setor ON funcionario (setor);

-- EXTERNO: o recorte que a recepção enxerga. Sem salário.
CREATE VIEW ramal_interno AS
  SELECT id, nome, setor FROM funcionario;`,
          linhas: [
            {
              trecho: "CREATE TABLE funcionario",
              explicacao:
                "Nível conceitual: declara tudo o que existe sobre funcionário, para todo o sistema.",
            },
            {
              trecho: "CREATE INDEX idx_func_setor",
              explicacao:
                "Nível interno: cria um caminho de acesso alternativo. Nenhuma consulta precisa ser reescrita por causa dele.",
            },
            {
              trecho: "CREATE VIEW ramal_interno",
              explicacao:
                "Nível externo: uma janela sobre o conceitual. Quem só tem permissão nesta visão não tem como ler salários.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a3-e1",
        nivel: "basico",
        enunciado: "Nomeie os três níveis da arquitetura ANSI/SPARC e diga o que cada um descreve.",
        dica: "Vá do disco para o usuário.",
        resolucao:
          "Interno: como os dados estão fisicamente armazenados — arquivos, blocos, índices. Conceitual: a estrutura lógica completa do banco, com entidades, atributos, relacionamentos e restrições, sem detalhes de armazenamento. Externo: as visões, cada uma expondo a um grupo de usuários apenas o recorte do conceitual que lhe interessa.",
        resposta: "Interno (armazenamento), conceitual (estrutura lógica) e externo (visões).",
      },
      {
        id: "bd-a3-e2",
        nivel: "intermediario",
        enunciado:
          "Em que nível ocorre cada mudança? (a) criar um índice; (b) acrescentar a coluna cpf; (c) criar uma visão que oculta o salário.",
        dica: "Pergunte se a mudança altera o que existe ou só como se chega até ele.",
        resolucao:
          "(a) Nível interno: o índice é um caminho de acesso, não altera o que existe logicamente. (b) Nível conceitual: acrescentar coluna altera a estrutura lógica do banco. (c) Nível externo: a visão é um recorte para um grupo de usuários; a tabela por baixo continua com o salário.",
        resposta: "(a) interno; (b) conceitual; (c) externo.",
      },
      {
        id: "bd-a3-e3",
        nivel: "avancado",
        enunciado:
          "Explique por que o catálogo do SGBD ser, ele próprio, um conjunto de tabelas consultáveis por SQL é uma decisão de projeto útil — e não apenas uma curiosidade.",
        dica: "Como uma ferramenta de modelagem descobre quais tabelas existem no banco?",
        resolucao:
          "Se o catálogo é feito das mesmas estruturas que o resto do banco, então toda ferramenta que já sabe falar SQL sabe interrogá-lo, sem precisar de uma interface proprietária. É assim que ferramentas de modelagem fazem engenharia reversa de um banco existente, que geradores de código descobrem colunas e tipos, e que scripts de auditoria verificam se toda tabela tem chave primária. A alternativa — um formato binário fechado — obrigaria cada ferramenta a implementar um leitor específico por SGBD. Além disso, a uniformidade reduz o próprio SGBD: o mesmo processador de consultas serve para dados do usuário e para metadados, em vez de existirem dois mecanismos.",
        resposta:
          "Porque torna os metadados acessíveis pela mesma linguagem dos dados: qualquer ferramenta que fale SQL consegue inspecionar o banco, sem interface proprietária.",
      },
      {
        id: "bd-a3-e4",
        nivel: "desafio",
        enunciado:
          "Um sistema tem uma visão que junta três tabelas e é consultada milhares de vezes por minuto, sempre com desempenho ruim. O DBA propõe materializar a visão. Explique o que isso significa em termos dos três níveis e qual novo problema a decisão introduz.",
        dica: "Materializar é passar a guardar o resultado. O que passa a existir em dois lugares?",
        resolucao:
          "Uma visão comum é apenas uma consulta guardada: nada é armazenado, e a junção é refeita a cada acesso. Materializá-la significa passar a armazenar fisicamente o resultado. Em termos dos três níveis, a definição no nível externo permanece idêntica — as aplicações continuam consultando o mesmo nome, com as mesmas colunas — e a mudança acontece no nível interno, que agora guarda uma cópia pré-computada. É, portanto, um ganho obtido sem alterar nada acima, o que é exatamente a promessa da independência física. O novo problema é que o resultado passa a existir em dois lugares: nas tabelas de origem e na cópia materializada. Isso é redundância, e reintroduz o risco de inconsistência — se as tabelas base mudarem e a cópia não for atualizada, a visão devolve dado velho. A decisão a tomar passa a ser a política de atualização: sincronizar a cada alteração (correto, porém caro na escrita) ou periodicamente (barato, mas admitindo uma janela de dados desatualizados). Ou seja, troca-se tempo de consulta por consistência e custo de escrita.",
        resposta:
          "A definição externa não muda; o nível interno passa a guardar o resultado pré-computado. O problema novo é a redundância: a cópia pode divergir das tabelas base, e é preciso decidir a política de atualização.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "A arquitetura ANSI/SPARC separa nível interno, conceitual e externo.",
        "Os mapeamentos entre níveis são o que torna a independência de dados possível.",
        "O catálogo (dicionário de dados) descreve o próprio banco e é consultável como qualquer tabela.",
        "Papéis: administrador de dados, DBA, projetista, programador e usuário final.",
      ],
      checklist: [
        "Sei nomear e descrever os três níveis.",
        "Sei classificar uma mudança no nível correto.",
        "Sei explicar o papel do DBA.",
        "Sei dizer o que é o catálogo e para que serve.",
      ],
      palavrasChave: ["ANSI/SPARC", "nível interno", "nível conceitual", "nível externo", "DBA", "catálogo"],
      pontosRevisao: [
        "Por que os mapeamentos, e não os níveis em si, são o que garante a independência.",
        "Que problema uma visão materializada resolve e qual ela cria.",
      ],
    },
  },
]
