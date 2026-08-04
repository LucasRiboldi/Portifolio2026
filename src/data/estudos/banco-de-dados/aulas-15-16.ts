import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 15 e 16.
 *
 * Unidade "Linguagem de Consulta Estruturada — SQL": a linguagem de
 * manipulação de dados e a forma básica do SELECT.
 */
export const AULAS_15_16: Aula[] = [
  {
    numero: 15,
    assunto: "SQL — DML: INSERT, UPDATE e DELETE",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "Os três comandos que alteram dados, o papel do WHERE em cada um e a transação como unidade de trabalho.",
      explicacaoSimples:
        "Três comandos alteram o conteúdo do banco: INSERT acrescenta linhas, UPDATE altera linhas existentes e DELETE remove linhas. Os dois últimos têm uma característica que assusta com razão: sem WHERE, eles agem sobre a tabela inteira. Um UPDATE esquecido de cláusula altera todos os registros — e o banco obedece, porque o comando é sintaticamente perfeito.",
      explicacaoTecnica:
        "INSERT insere tuplas, com a forma INSERT INTO tabela (colunas) VALUES (valores). Nomear as colunas é obrigatório na prática: sem a lista, a ordem posicional passa a importar e acrescentar uma coluna à tabela quebra todos os INSERT existentes. UPDATE altera atributos das tuplas que satisfazem o WHERE, e DELETE remove as tuplas que o satisfazem; em ambos, a ausência de WHERE faz o comando valer para toda a relação. As alterações ocorrem dentro de uma transação, que é a unidade atômica de trabalho: ou todos os comandos dela se efetivam, com COMMIT, ou nenhum, com ROLLBACK. As propriedades ACID descrevem as garantias — Atomicidade (tudo ou nada), Consistência (o banco sai de um estado válido para outro), Isolamento (transações concorrentes não enxergam estados intermediários umas das outras) e Durabilidade (o que foi confirmado sobrevive a falha). Vale distinguir DELETE de TRUNCATE: o primeiro é DML, aceita WHERE, dispara gatilhos e é transacional; o segundo é DDL, esvazia a tabela inteira e costuma ser irreversível.",
      aplicacoes: [
        "INSERT com lista de colunas explícita é o que faz uma carga continuar funcionando depois de a tabela ganhar uma coluna nova.",
        "Rodar o SELECT com o mesmo WHERE antes do DELETE é a prática que evita o acidente mais comum da profissão.",
        "Transação é o que garante que debitar de uma conta e creditar em outra aconteçam juntos, ou não aconteçam.",
      ],
      curiosidades: [
        "A ordem das cláusulas no UPDATE — SET antes de WHERE — engana quem lê da esquerda para a direita: o WHERE é avaliado primeiro, e o SET aplica-se apenas às linhas que ele selecionou.",
        "Vários clientes SQL abrem transação automaticamente e exigem COMMIT explícito; outros trabalham em autocommit, em que cada comando se confirma sozinho. Não saber em qual modo se está é a origem de \"apaguei e não consigo desfazer\".",
      ],
      conceitos: [
        {
          termo: "DML",
          definicao:
            "Data Manipulation Language: a parte do SQL que manipula dados — INSERT, UPDATE, DELETE e SELECT.",
        },
        {
          termo: "Transação",
          definicao:
            "Sequência de operações tratada como unidade indivisível: confirma-se inteira com COMMIT ou desfaz-se inteira com ROLLBACK.",
        },
        {
          termo: "ACID",
          definicao:
            "Atomicidade, Consistência, Isolamento e Durabilidade — as quatro garantias que o SGBD dá às transações.",
        },
        {
          termo: "Autocommit",
          definicao:
            "Modo em que cada comando é confirmado automaticamente, sem transação explícita. Cômodo e perigoso.",
        },
        {
          termo: "TRUNCATE",
          definicao:
            "Comando DDL que esvazia a tabela inteira. Mais rápido que DELETE e normalmente não desfazível.",
        },
      ],
      exemplos: [
        {
          titulo: "Os três comandos, com e sem os cuidados",
          descricao:
            "A diferença entre a versão correta e a perigosa costuma ser uma linha — ou a falta dela.",
          linguagem: "sql",
          codigo: `-- INSERT: sempre com a lista de colunas
INSERT INTO produto (codigo, descricao, preco, categoria_id)
VALUES ('P100', 'Teclado mecânico', 289.90, 3);

-- Várias linhas de uma vez
INSERT INTO produto (codigo, descricao, preco, categoria_id) VALUES
  ('P101', 'Mouse óptico',  79.90, 3),
  ('P102', 'Monitor 24"', 899.00, 4);

-- UPDATE: o WHERE não é opcional na prática
UPDATE produto
   SET preco = preco * 1.10
 WHERE categoria_id = 3;          -- reajuste só da categoria 3

-- SEM o WHERE, reajusta o catálogo inteiro:
-- UPDATE produto SET preco = preco * 1.10;   <- não faça isso

-- DELETE: confira antes com SELECT
SELECT * FROM produto WHERE categoria_id = 9;   -- 1. veja o que vai sumir
DELETE  FROM produto WHERE categoria_id = 9;    -- 2. só então apague`,
          linhas: [
            {
              trecho: "INSERT INTO produto (codigo, descricao, ...)",
              explicacao:
                "A lista de colunas desacopla o comando da ordem física da tabela. Sem ela, acrescentar uma coluna quebra este INSERT em silêncio ou com erro de tipo.",
            },
            {
              trecho: "SET preco = preco * 1.10",
              explicacao:
                "O valor novo pode ser calculado a partir do antigo. O SGBD lê o valor corrente da linha e grava o resultado — não é preciso consultar antes.",
            },
            {
              trecho: "WHERE categoria_id = 3",
              explicacao:
                "Delimita as linhas atingidas. É a única coisa entre o reajuste pretendido e o reajuste de tudo.",
            },
            {
              trecho: "SELECT antes do DELETE",
              explicacao:
                "Mesmo WHERE, comando inofensivo. Se o SELECT trouxe 4.000 linhas quando você esperava 3, o DELETE não chega a ser digitado.",
            },
          ],
        },
        {
          titulo: "Transação: a transferência que não pode ficar pela metade",
          descricao:
            "O exemplo canônico de atomicidade. Sem transação, uma falha entre os dois comandos faz dinheiro desaparecer.",
          linguagem: "sql",
          codigo: `BEGIN;

  UPDATE conta SET saldo = saldo - 500 WHERE id = 1;
  UPDATE conta SET saldo = saldo + 500 WHERE id = 2;

  -- Se algo falhar aqui no meio, ROLLBACK desfaz os dois.
  -- Nenhum outro usuário chega a ver o estado intermediário.

COMMIT;

-- Desfazendo explicitamente:
BEGIN;
  DELETE FROM pedido WHERE data < '2020-01-01';
  -- olha o resultado, percebe que apagou demais
ROLLBACK;   -- nada foi perdido`,
          linhas: [
            {
              trecho: "BEGIN",
              explicacao:
                "Abre a transação. Daqui até o COMMIT, as alterações existem só para esta sessão.",
            },
            {
              trecho: "os dois UPDATE",
              explicacao:
                "Atomicidade: ou os dois valem, ou nenhum. Uma queda de energia entre eles não deixa os 500 reais em lugar nenhum.",
            },
            {
              trecho: "ROLLBACK",
              explicacao:
                "Desfaz tudo desde o BEGIN. É a rede que transforma um DELETE errado em susto em vez de incidente — desde que a transação esteja aberta.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a15-e1",
        nivel: "basico",
        enunciado:
          "Escreva o INSERT para cadastrar a categoria de id 7 e nome 'Periféricos'.",
        dica: "Nomeie as colunas.",
        resolucao:
          "```sql\nINSERT INTO categoria (id, nome) VALUES (7, 'Periféricos');\n```\nO texto vai entre aspas simples, que é o delimitador de literal do SQL padrão; aspas duplas identificam objetos, não valores. Se a coluna id fosse SERIAL, o correto seria omiti-la e deixar o banco gerar: INSERT INTO categoria (nome) VALUES ('Periféricos').",
        resposta: "INSERT INTO categoria (id, nome) VALUES (7, 'Periféricos');",
      },
      {
        id: "bd-a15-e2",
        nivel: "intermediario",
        enunciado:
          "Escreva o UPDATE que dá 5% de desconto em todos os produtos da categoria 2 com preço acima de 500.",
        dica: "São duas condições no WHERE.",
        resolucao:
          "```sql\nUPDATE produto\n   SET preco = preco * 0.95\n WHERE categoria_id = 2\n   AND preco > 500;\n```\nO cálculo usa o valor corrente da própria coluna, então não é preciso consultar antes. As duas condições ligadas por AND restringem a linhas que satisfaçam ambas. Convém rodar antes o SELECT com o mesmo WHERE para conferir quantas linhas serão afetadas.",
        resposta:
          "UPDATE produto SET preco = preco * 0.95 WHERE categoria_id = 2 AND preco > 500;",
      },
      {
        id: "bd-a15-e3",
        nivel: "avancado",
        enunciado:
          "Explique a diferença entre DELETE FROM pedido; e TRUNCATE TABLE pedido; quanto a efeito, desempenho e reversibilidade.",
        dica: "Um é DML, o outro é DDL.",
        resolucao:
          "Quanto ao efeito imediato, ambos deixam a tabela vazia, mas por caminhos diferentes. DELETE é DML: percorre as linhas, registra cada remoção no log de transações, dispara gatilhos de exclusão e respeita chaves estrangeiras, recusando a operação se houver linhas dependentes. TRUNCATE é DDL: descarta as páginas de dados de uma vez, sem percorrer linha a linha, sem disparar gatilhos e, em vários SGBDs, sem verificar dependências a menos que se peça CASCADE. Quanto ao desempenho, a diferença é grande em tabelas volumosas — DELETE de dez milhões de linhas gera dez milhões de entradas de log e pode levar minutos, enquanto TRUNCATE é praticamente instantâneo porque não registra linha nenhuma. Quanto à reversibilidade, DELETE é transacional em qualquer SGBD e um ROLLBACK o desfaz; TRUNCATE, por ser DDL, provoca commit implícito na maioria dos produtos e é irreversível — PostgreSQL é a exceção notável, onde TRUNCATE é transacional. Há ainda um detalhe frequentemente esquecido: TRUNCATE costuma reiniciar sequências de autoincremento, e DELETE não. Na prática, use DELETE quando houver WHERE, quando gatilhos precisarem disparar ou quando a operação precisar ser desfeita; use TRUNCATE para esvaziar tabelas de carga e de teste, onde o volume importa e a reversibilidade não.",
        resposta:
          "DELETE é DML: linha a linha, com log, gatilhos, respeito a FK e ROLLBACK possível. TRUNCATE é DDL: descarta tudo de uma vez, sem gatilhos, muito mais rápido, normalmente irreversível e reinicia sequências.",
      },
      {
        id: "bd-a15-e4",
        nivel: "desafio",
        enunciado:
          "Um sistema debita estoque com um SELECT para conferir a quantidade e depois um UPDATE para subtrair. Sob acesso simultâneo, o estoque fica negativo. Explique e corrija.",
        dica: "O que acontece entre o SELECT e o UPDATE?",
        resolucao:
          "O problema é uma condição de corrida clássica. Com uma unidade em estoque e duas transações simultâneas, ambas executam o SELECT e leem 1; ambas concluem que há estoque suficiente; ambas executam o UPDATE subtraindo 1; o estoque termina em -1. Nenhuma das duas fez nada errado isoladamente — o defeito está na janela entre a leitura e a escrita, durante a qual a informação lida deixou de ser verdadeira sem que a transação soubesse. Envolver os dois comandos numa transação não resolve sozinho: em nível de isolamento READ COMMITTED, que é o padrão da maioria dos SGBDs, a transação B ainda enxerga o valor confirmado antes de A escrever. Há três correções válidas. A primeira, e a mais robusta, é declarar a regra no esquema: CHECK (quantidade >= 0). Assim o segundo UPDATE falha com erro de restrição, e o estoque negativo torna-se impossível por construção, para qualquer caminho de escrita. A segunda é eliminar a janela fazendo a verificação dentro do próprio UPDATE: UPDATE estoque SET quantidade = quantidade - 1 WHERE produto_id = 10 AND quantidade >= 1 — a condição é avaliada no momento da escrita, com a linha bloqueada, e o comando afeta zero linhas quando não há estoque, o que a aplicação detecta pela contagem de linhas afetadas. A terceira é bloquear a linha na leitura com SELECT ... FOR UPDATE, forçando a segunda transação a esperar a primeira terminar; funciona, mas serializa o acesso e custa concorrência. A recomendação prática é combinar a primeira com a segunda: o CHECK como garantia final e o UPDATE condicional como caminho normal, verificando sempre quantas linhas foram afetadas antes de confirmar a venda.",
        resposta:
          "Condição de corrida: as duas transações leem 1 antes de qualquer escrita e ambas subtraem. Corrija com CHECK (quantidade >= 0) no esquema e UPDATE ... WHERE quantidade >= 1, conferindo as linhas afetadas — ou SELECT ... FOR UPDATE, ao custo de serializar.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "INSERT, UPDATE e DELETE alteram dados; sem WHERE, os dois últimos atingem a tabela inteira.",
        "Sempre nomeie as colunas no INSERT.",
        "Transação é a unidade atômica: COMMIT confirma tudo, ROLLBACK desfaz tudo.",
        "ACID: Atomicidade, Consistência, Isolamento, Durabilidade.",
      ],
      checklist: [
        "Sei escrever os três comandos com WHERE adequado.",
        "Sei usar BEGIN, COMMIT e ROLLBACK.",
        "Sei diferenciar DELETE de TRUNCATE.",
        "Sei reconhecer e corrigir uma condição de corrida entre leitura e escrita.",
      ],
      palavrasChave: ["DML", "INSERT", "UPDATE", "DELETE", "transação", "ACID", "ROLLBACK"],
      pontosRevisao: [
        "Por que o SELECT com o mesmo WHERE antes do DELETE é hábito de sobrevivência.",
        "Por que envolver em transação não elimina sozinho a condição de corrida.",
      ],
    },
  },

  {
    numero: 16,
    assunto: "SQL — SELECT: projeção, seleção e ordenação",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "A forma básica do SELECT, os operadores do WHERE, o tratamento de NULL e a ordenação dos resultados.",
      explicacaoSimples:
        "SELECT é o comando que responde perguntas. Ele tem três partes essenciais: quais colunas você quer (a projeção), de qual tabela (o FROM) e quais linhas interessam (a seleção, no WHERE). O resto — ordenar, limitar, remover repetidos — são refinamentos sobre essas três.",
      explicacaoTecnica:
        "A forma básica é SELECT colunas FROM tabela WHERE condição ORDER BY colunas. A projeção corresponde ao operador π da álgebra relacional e escolhe atributos; a seleção corresponde a σ e escolhe tuplas. O WHERE admite operadores de comparação, os lógicos AND, OR e NOT, e os especiais BETWEEN, IN, LIKE e IS NULL. O tratamento de NULL é a fonte de erro mais frequente: NULL significa desconhecido, e qualquer comparação com ele resulta em desconhecido, não em verdadeiro nem falso — por isso coluna = NULL nunca é verdadeiro e é preciso usar IS NULL. A lógica é ternária (verdadeiro, falso, desconhecido), e o WHERE só aceita a linha quando a condição é verdadeira; desconhecido é descartado como se fosse falso. LIKE compara padrões, com % para qualquer sequência e _ para um caractere. DISTINCT elimina tuplas duplicadas do resultado. ORDER BY define a ordenação, ASC por padrão e DESC quando pedido; sem ORDER BY, nenhuma ordem é garantida. LIMIT (ou FETCH FIRST, no padrão) restringe a quantidade de linhas devolvidas.",
      aplicacoes: [
        "IS NULL em vez de = NULL é a correção que faz relatórios pararem de perder as linhas justamente onde falta informação.",
        "DISTINCT resolve a lista de valores únicos para preencher um filtro de tela.",
        "ORDER BY com LIMIT é como se obtém \"os dez produtos mais caros\" sem trazer a tabela inteira para a aplicação.",
      ],
      curiosidades: [
        "A ordem em que se escreve o SELECT não é a ordem em que ele é executado: o FROM vem primeiro, depois WHERE, depois a projeção do SELECT e por último ORDER BY. É por isso que não se pode usar no WHERE um apelido definido no SELECT.",
        "NULL não é igual a NULL. Duas linhas com NULL na mesma coluna não são consideradas iguais pela comparação, embora UNIQUE e GROUP BY as tratem como iguais — inconsistência que está no padrão SQL, não nos produtos.",
      ],
      conceitos: [
        {
          termo: "Projeção",
          definicao: "Escolha de colunas — a lista após o SELECT. Corresponde a π na álgebra relacional.",
        },
        {
          termo: "Seleção",
          definicao: "Escolha de linhas — a condição do WHERE. Corresponde a σ na álgebra relacional.",
        },
        {
          termo: "NULL",
          definicao:
            "Ausência de valor conhecido. Não é zero nem texto vazio, e qualquer comparação com ele dá desconhecido.",
        },
        {
          termo: "Lógica ternária",
          definicao:
            "Verdadeiro, falso e desconhecido. O WHERE só aceita a linha quando a condição é verdadeira.",
        },
        {
          termo: "DISTINCT",
          definicao: "Remove tuplas duplicadas do resultado, dando-lhe comportamento de conjunto.",
        },
        {
          termo: "LIKE",
          definicao: "Comparação por padrão textual: % é qualquer sequência, _ é exatamente um caractere.",
        },
      ],
      exemplos: [
        {
          titulo: "A forma básica e os operadores do WHERE",
          descricao:
            "Cada consulta demonstra um operador. Repare no par BETWEEN/IN, que substitui condições longas.",
          linguagem: "sql",
          codigo: `-- Projeção e seleção
SELECT descricao, preco
  FROM produto
 WHERE categoria_id = 3;

-- Faixa: BETWEEN inclui os extremos
SELECT descricao, preco FROM produto
 WHERE preco BETWEEN 100 AND 500;

-- Conjunto: IN evita uma sequência de OR
SELECT descricao FROM produto
 WHERE categoria_id IN (1, 3, 7);

-- Padrão textual
SELECT descricao FROM produto WHERE descricao LIKE 'Teclado%';
SELECT descricao FROM produto WHERE descricao LIKE '%mecânico%';

-- Valores distintos, ordenados, limitados
SELECT DISTINCT categoria_id FROM produto ORDER BY categoria_id;

SELECT descricao, preco FROM produto
 ORDER BY preco DESC
 LIMIT 10;`,
          linhas: [
            {
              trecho: "BETWEEN 100 AND 500",
              explicacao:
                "Equivale a preco >= 100 AND preco <= 500. Os dois extremos entram — esquecer isso produz erro de um item em relatórios de faixa.",
            },
            {
              trecho: "IN (1, 3, 7)",
              explicacao:
                "Substitui categoria_id = 1 OR categoria_id = 3 OR categoria_id = 7. Mais legível e mais fácil de o otimizador tratar.",
            },
            {
              trecho: "LIKE 'Teclado%'",
              explicacao:
                "Prefixo fixo: pode usar índice. Já '%mecânico%', com curinga no início, obriga varredura completa da tabela.",
            },
            {
              trecho: "ORDER BY preco DESC LIMIT 10",
              explicacao:
                "Ordena e corta no servidor. Trazer tudo para a aplicação e ordenar lá transfere megabytes para descartar quase todos.",
            },
          ],
        },
        {
          titulo: "NULL: onde as consultas silenciosamente erram",
          descricao:
            "Três armadilhas. Todas devolvem resultado — só que o resultado errado.",
          linguagem: "sql",
          codigo: `-- 1. Comparação com NULL nunca é verdadeira
SELECT * FROM cliente WHERE telefone = NULL;    -- 0 linhas, SEMPRE
SELECT * FROM cliente WHERE telefone IS NULL;   -- correto

-- 2. Negação não recupera os nulos
--    Cliente com cidade NULL NÃO aparece em nenhuma das duas:
SELECT * FROM cliente WHERE cidade = 'Porto Alegre';
SELECT * FROM cliente WHERE cidade <> 'Porto Alegre';

--    Para incluí-los, é preciso dizer explicitamente:
SELECT * FROM cliente
 WHERE cidade <> 'Porto Alegre' OR cidade IS NULL;

-- 3. NULL em expressão contamina o resultado
SELECT preco + frete FROM pedido;      -- NULL se frete for NULL
SELECT preco + COALESCE(frete, 0) FROM pedido;   -- correto`,
          linhas: [
            {
              trecho: "telefone = NULL",
              explicacao:
                "Sintaticamente válido, semanticamente inútil: compara com desconhecido e o resultado é desconhecido, que o WHERE descarta. Devolve zero linhas mesmo havendo mil telefones nulos.",
            },
            {
              trecho: "cidade <> 'Porto Alegre'",
              explicacao:
                "A armadilha mais cara. Quem não é de Porto Alegre \"deveria\" incluir quem não tem cidade — mas desconhecido não é diferente de nada, e essas linhas somem do relatório sem aviso.",
            },
            {
              trecho: "COALESCE(frete, 0)",
              explicacao:
                "Devolve o primeiro argumento não nulo. É como se declara o que NULL significa naquele cálculo: aqui, frete desconhecido conta como zero.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a16-e1",
        nivel: "basico",
        enunciado:
          "Escreva a consulta que traz descrição e preço dos produtos com preço maior que 200, do mais caro para o mais barato.",
        dica: "Projeção, seleção e ordenação.",
        resolucao:
          "```sql\nSELECT descricao, preco\n  FROM produto\n WHERE preco > 200\n ORDER BY preco DESC;\n```\nA lista após o SELECT é a projeção, o WHERE é a seleção e DESC inverte a ordem padrão, que é crescente.",
        resposta: "SELECT descricao, preco FROM produto WHERE preco > 200 ORDER BY preco DESC;",
      },
      {
        id: "bd-a16-e2",
        nivel: "basico",
        enunciado:
          "Por que SELECT * FROM cliente WHERE email = NULL não devolve os clientes sem e-mail?",
        dica: "O que resulta de comparar algo com desconhecido?",
        resolucao:
          "Porque NULL representa valor desconhecido, e comparar qualquer coisa com desconhecido produz desconhecido — nem verdadeiro nem falso. O WHERE só aceita a linha quando a condição é verdadeira, então linhas com e-mail nulo são descartadas junto com todas as outras, e a consulta devolve zero linhas sempre. O correto é WHERE email IS NULL, operador criado exatamente para testar a ausência de valor sem recorrer a comparação.",
        resposta:
          "Porque comparação com NULL resulta em desconhecido, que o WHERE descarta. Use IS NULL.",
      },
      {
        id: "bd-a16-e3",
        nivel: "intermediario",
        enunciado:
          "Escreva a consulta que lista os produtos das categorias 2, 5 ou 8 com preço entre 50 e 300, em ordem alfabética de descrição.",
        dica: "IN e BETWEEN deixam isso curto.",
        resolucao:
          "```sql\nSELECT descricao, preco, categoria_id\n  FROM produto\n WHERE categoria_id IN (2, 5, 8)\n   AND preco BETWEEN 50 AND 300\n ORDER BY descricao;\n```\nIN substitui três condições ligadas por OR e BETWEEN substitui duas comparações, incluindo os extremos 50 e 300. ORDER BY sem qualificador é ascendente, que é a ordem alfabética pedida.",
        resposta:
          "SELECT descricao, preco, categoria_id FROM produto WHERE categoria_id IN (2,5,8) AND preco BETWEEN 50 AND 300 ORDER BY descricao;",
      },
      {
        id: "bd-a16-e4",
        nivel: "avancado",
        enunciado:
          "Um relatório de \"clientes que não são de Porto Alegre\" usa WHERE cidade <> 'Porto Alegre' e o total não bate com o cadastro. Explique e corrija.",
        dica: "Quantos clientes têm cidade em branco?",
        resolucao:
          "Os clientes com cidade nula desapareceram do relatório. A comparação cidade <> 'Porto Alegre' avalia, nessas linhas, desconhecido <> 'Porto Alegre', cujo resultado é desconhecido — e o WHERE descarta o que não é verdadeiro. O resultado é que o cliente sem cidade cadastrada não aparece nem entre os de Porto Alegre nem entre os que não são, e a soma dos dois relatórios fica menor que o total do cadastro. A correção depende do que o negócio quer dizer. Se cidade desconhecida deve contar como \"não é de Porto Alegre\", escreve-se WHERE cidade <> 'Porto Alegre' OR cidade IS NULL. Se deve ser tratada à parte, o relatório precisa de uma terceira categoria, explícita. O que não se pode é deixar como está, porque a omissão é silenciosa: ninguém recebe erro, e o problema só aparece quando alguém confere os totais. A lição geral é que toda condição de desigualdade sobre coluna que admite nulo precisa de uma decisão consciente sobre os nulos — e é bom motivo para declarar NOT NULL sempre que o domínio permitir.",
        resposta:
          "Linhas com cidade NULL somem, porque a desigualdade avalia desconhecido e o WHERE a descarta. Corrija com OR cidade IS NULL, ou trate os nulos como categoria própria.",
      },
      {
        id: "bd-a16-e5",
        nivel: "desafio",
        enunciado:
          "Explique por que LIKE '%teclado%' costuma ser lento e o que fazer quando a busca por trecho é requisito.",
        dica: "Como um índice ordenado encontra uma palavra que pode estar no meio?",
        resolucao:
          "Um índice B-tree armazena os valores ordenados, e essa ordenação só ajuda quando se conhece o início do texto procurado. Com LIKE 'Teclado%', o SGBD desce a árvore até o primeiro valor que começa com \"Teclado\" e percorre a partir dali — trabalho proporcional ao número de acertos. Com LIKE '%teclado%', o trecho pode estar em qualquer posição, o prefixo é desconhecido e não há por onde começar a descida; resta ler todas as linhas e testar uma a uma, o que é varredura completa e cresce linearmente com o tamanho da tabela. Quando a busca por trecho é requisito, há três caminhos. O primeiro, e o mais indicado quando se busca palavras, é usar busca textual de verdade: índice de texto completo, que tokeniza o conteúdo em palavras e indexa cada uma, permitindo encontrar \"teclado\" onde quer que esteja, com tratamento de radicais e acentos. O segundo, para busca por trecho arbitrário e não por palavra, é um índice de trigramas, que indexa todas as sequências de três caracteres e transforma a busca por substring em busca indexada. O terceiro, quando o volume é pequeno ou a busca é rara, é aceitar a varredura — otimizar o que não dói é desperdício. O que não funciona é criar um índice B-tree comum na coluna e esperar que ele ajude: ele será simplesmente ignorado pelo otimizador, que sabe que não serve.",
        resposta:
          "Porque o curinga inicial impede usar a ordenação do índice B-tree, forçando varredura completa. Soluções: índice de texto completo para busca por palavra, índice de trigramas para trecho arbitrário, ou aceitar a varredura se o volume for pequeno.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "SELECT projeta colunas, WHERE seleciona linhas, ORDER BY ordena.",
        "NULL é desconhecido: use IS NULL, nunca = NULL.",
        "Desigualdade sobre coluna que admite nulo descarta os nulos silenciosamente.",
        "LIKE com curinga no início impede o uso de índice.",
      ],
      checklist: [
        "Sei escrever SELECT com projeção, seleção e ordenação.",
        "Sei usar BETWEEN, IN, LIKE e IS NULL.",
        "Sei prever o efeito de NULL numa condição e num cálculo.",
        "Sei explicar por que a ordem de escrita não é a ordem de execução.",
      ],
      palavrasChave: ["SELECT", "projeção", "seleção", "NULL", "IS NULL", "DISTINCT", "ORDER BY"],
      pontosRevisao: [
        "A lógica ternária e por que desconhecido é descartado.",
        "Quando LIKE consegue usar índice e quando não consegue.",
      ],
    },
  },
]
