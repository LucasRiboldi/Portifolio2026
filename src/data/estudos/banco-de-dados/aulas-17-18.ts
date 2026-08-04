import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 17 e 18.
 *
 * Unidade "Linguagem de Consulta Estruturada — SQL": junções entre tabelas e
 * agrupamento com funções de agregação.
 */
export const AULAS_17_18: Aula[] = [
  {
    numero: 17,
    assunto: "SQL — junções entre tabelas",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "Como reunir dados espalhados por tabelas: junção interna, externas, autojunção e o efeito de esquecer a condição de junção.",
      explicacaoSimples:
        "A normalização separou o cliente do pedido e o produto do item. Consultar continua exigindo os dois juntos — e é isso que a junção faz: casa as linhas de duas tabelas pela coluna que elas têm em comum. A junção interna traz só o que casa dos dois lados; a externa traz também o que ficou sem par, que costuma ser justamente o que se quer descobrir.",
      explicacaoTecnica:
        "A junção interna (INNER JOIN) produz o conjunto de pares de tuplas que satisfazem a condição de junção, tipicamente a igualdade entre chave estrangeira e chave primária. As junções externas preservam as tuplas sem correspondência: LEFT OUTER JOIN mantém todas as da tabela à esquerda, preenchendo com NULL as colunas da direita quando não há par; RIGHT faz o simétrico; FULL mantém os dois lados. O produto cartesiano (CROSS JOIN) combina cada tupla de uma tabela com todas as da outra, e é o que se obtém acidentalmente ao listar duas tabelas no FROM sem condição de junção — com 1.000 e 5.000 linhas, o resultado tem cinco milhões. A autojunção é a junção de uma tabela com ela mesma, necessária em autorrelacionamentos, e exige apelidos distintos para diferenciar as duas ocorrências. A sintaxe explícita com JOIN ... ON é preferível à antiga, com tabelas separadas por vírgula e a condição no WHERE, porque separa a condição de junção da condição de filtro — distinção que se torna essencial em junções externas, onde pôr a condição no lugar errado transforma silenciosamente um LEFT JOIN em INNER JOIN.",
      aplicacoes: [
        "LEFT JOIN com IS NULL é o padrão para encontrar órfãos: clientes sem pedido, produtos nunca vendidos, alunos sem matrícula.",
        "Autojunção resolve a consulta de hierarquia: listar cada funcionário ao lado do nome do seu chefe.",
        "Reconhecer um produto cartesiano acidental pelo número absurdo de linhas devolvidas é diagnóstico de rotina.",
      ],
      curiosidades: [
        "A sintaxe com vírgula no FROM é herança do SQL-86; o JOIN explícito entrou no SQL-92 e levou mais de uma década para se tornar o estilo dominante.",
        "RIGHT JOIN é raro na prática: quase todo mundo prefere inverter a ordem das tabelas e usar LEFT, porque a leitura da esquerda para a direita fica mais natural.",
      ],
      conceitos: [
        {
          termo: "INNER JOIN",
          definicao:
            "Devolve apenas os pares de tuplas que satisfazem a condição de junção. É o padrão quando se escreve só JOIN.",
        },
        {
          termo: "LEFT OUTER JOIN",
          definicao:
            "Mantém todas as tuplas da tabela à esquerda; onde não há par, as colunas da direita vêm nulas.",
        },
        {
          termo: "Produto cartesiano",
          definicao:
            "Combinação de cada tupla de uma tabela com todas as da outra. Resultado de esquecer a condição de junção.",
        },
        {
          termo: "Autojunção",
          definicao:
            "Junção de uma tabela com ela mesma, com apelidos distintos. Necessária em autorrelacionamentos.",
        },
        {
          termo: "Apelido (alias)",
          definicao:
            "Nome curto dado a uma tabela na consulta. Obrigatório na autojunção e útil para legibilidade.",
        },
      ],
      exemplos: [
        {
          titulo: "Interna e externa: a diferença aparece nos sem par",
          descricao:
            "As mesmas duas tabelas, dois resultados. Repare em quem some na primeira consulta.",
          linguagem: "sql",
          codigo: `-- INTERNA: só clientes que TÊM pedido
SELECT c.nome, p.id, p.data
  FROM cliente c
  JOIN pedido  p ON p.cliente_id = c.id;

-- EXTERNA: todos os clientes, com ou sem pedido
SELECT c.nome, p.id, p.data
  FROM cliente c
  LEFT JOIN pedido p ON p.cliente_id = c.id;
-- clientes sem pedido aparecem com p.id e p.data nulos

-- O uso mais valioso da externa: achar os órfãos
SELECT c.nome
  FROM cliente c
  LEFT JOIN pedido p ON p.cliente_id = c.id
 WHERE p.id IS NULL;          -- clientes que NUNCA compraram

-- Três tabelas
SELECT c.nome, pr.descricao, i.quantidade
  FROM cliente     c
  JOIN pedido      p  ON p.cliente_id = c.id
  JOIN item_pedido i  ON i.pedido_id  = p.id
  JOIN produto     pr ON pr.id        = i.produto_id
 WHERE p.data >= '2026-01-01';`,
          linhas: [
            {
              trecho: "JOIN pedido p ON p.cliente_id = c.id",
              explicacao:
                "A condição de junção casa a chave estrangeira com a chave primária. É sempre essa a forma quando o modelo está normalizado.",
            },
            {
              trecho: "LEFT JOIN",
              explicacao:
                "Preserva a esquerda. O cliente sem pedido continua na saída, com as colunas de pedido nulas — a informação \"não tem\" passa a ser visível.",
            },
            {
              trecho: "WHERE p.id IS NULL",
              explicacao:
                "O truque do órfão: só ficam nulas as linhas que não acharam par. Filtrar por isso devolve exatamente quem não tem correspondência.",
            },
            {
              trecho: "c, p, i, pr",
              explicacao:
                "Apelidos curtos. Com quatro tabelas, qualificar cada coluna deixa de ser preciosismo e passa a ser o que torna a consulta legível.",
            },
          ],
        },
        {
          titulo: "Duas armadilhas: cartesiano acidental e filtro no lugar errado",
          descricao:
            "Ambas devolvem resultado sem erro. A segunda é a mais traiçoeira.",
          linguagem: "sql",
          codigo: `-- ARMADILHA 1: faltou a condição de junção
SELECT c.nome, p.id FROM cliente c, pedido p;
-- 1.000 clientes x 5.000 pedidos = 5.000.000 de linhas

-- ARMADILHA 2: filtro da tabela externa no WHERE
SELECT c.nome, p.id
  FROM cliente c
  LEFT JOIN pedido p ON p.cliente_id = c.id
 WHERE p.data >= '2026-01-01';     -- vira INNER JOIN!

-- Por quê: quem não tem pedido fica com p.data NULL,
-- e NULL >= '2026-01-01' é desconhecido -> linha descartada.

-- CERTO: condição da tabela externa vai no ON
SELECT c.nome, p.id
  FROM cliente c
  LEFT JOIN pedido p
    ON p.cliente_id = c.id
   AND p.data >= '2026-01-01';`,
          linhas: [
            {
              trecho: "FROM cliente c, pedido p",
              explicacao:
                "Sem condição, é produto cartesiano. A sintaxe com vírgula facilita esse esquecimento; com JOIN explícito, o ON cobrado pela sintaxe evita o acidente.",
            },
            {
              trecho: "WHERE p.data >= ...",
              explicacao:
                "O WHERE age depois da junção. Como as linhas sem par têm p.data nula, a condição as descarta — e o LEFT JOIN vira INNER JOIN sem que nada acuse.",
            },
            {
              trecho: "ON ... AND p.data >= ...",
              explicacao:
                "No ON, a condição participa do casamento. Clientes sem pedido em 2026 continuam aparecendo, com as colunas de pedido nulas, que é o que se queria.",
            },
          ],
        },
        {
          titulo: "Autojunção: cada funcionário e seu chefe",
          descricao:
            "A mesma tabela, duas vezes, com apelidos diferentes. Sem os apelidos, a consulta é ambígua.",
          linguagem: "sql",
          codigo: `-- funcionario(id, nome, chefe_id -> funcionario.id)

SELECT  f.nome  AS funcionario,
        c.nome  AS chefe
  FROM funcionario f
  LEFT JOIN funcionario c ON c.id = f.chefe_id
 ORDER BY c.nome, f.nome;`,
          linhas: [
            {
              trecho: "funcionario f ... funcionario c",
              explicacao:
                "A mesma tabela aparece duas vezes, com apelidos distintos. Para o SGBD são duas ocorrências independentes, e é isso que torna a comparação possível.",
            },
            {
              trecho: "LEFT JOIN, e não JOIN",
              explicacao:
                "O presidente não tem chefe: chefe_id nulo. Com junção interna ele desapareceria da lista — junto com o topo de qualquer hierarquia.",
            },
            {
              trecho: "AS funcionario / AS chefe",
              explicacao:
                "Apelidos de coluna. Sem eles, o resultado traria duas colunas chamadas nome e ninguém saberia qual é qual.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a17-e1",
        nivel: "basico",
        enunciado:
          "Escreva a consulta que lista a descrição do produto e o nome da sua categoria.",
        dica: "Uma junção interna pela chave estrangeira.",
        resolucao:
          "```sql\nSELECT p.descricao, c.nome AS categoria\n  FROM produto   p\n  JOIN categoria c ON c.id = p.categoria_id;\n```\nA junção casa a chave estrangeira categoria_id com a chave primária de categoria. Como se usou JOIN sem qualificador, a junção é interna: produtos sem categoria não apareceriam.",
        resposta:
          "SELECT p.descricao, c.nome FROM produto p JOIN categoria c ON c.id = p.categoria_id;",
      },
      {
        id: "bd-a17-e2",
        nivel: "intermediario",
        enunciado:
          "Escreva a consulta que lista os produtos que nunca foram vendidos.",
        dica: "LEFT JOIN mais IS NULL.",
        resolucao:
          "```sql\nSELECT p.codigo, p.descricao\n  FROM produto     p\n  LEFT JOIN item_pedido i ON i.produto_id = p.id\n WHERE i.produto_id IS NULL;\n```\nO LEFT JOIN preserva todos os produtos; os que nunca apareceram em item de pedido ficam com as colunas de item nulas, e o WHERE filtra exatamente esses. É o padrão de busca de órfãos, e funciona com qualquer par de tabelas ligadas por chave estrangeira.",
        resposta:
          "SELECT p.codigo, p.descricao FROM produto p LEFT JOIN item_pedido i ON i.produto_id = p.id WHERE i.produto_id IS NULL;",
      },
      {
        id: "bd-a17-e3",
        nivel: "avancado",
        enunciado:
          "Um LEFT JOIN entre cliente e pedido, com WHERE p.situacao = 'pago', deixou de trazer os clientes sem pedido. Explique e corrija.",
        dica: "Em que momento o WHERE é avaliado?",
        resolucao:
          "O WHERE é avaliado depois da junção, sobre o resultado dela. Os clientes sem pedido chegam a esse resultado, mas com todas as colunas de pedido nulas, inclusive situacao. A condição p.situacao = 'pago' avalia então NULL = 'pago', que é desconhecido, e o WHERE descarta a linha. O efeito prático é que o LEFT JOIN foi anulado: o resultado é idêntico ao de um INNER JOIN, sem que nenhum erro seja emitido. A correção é mover a condição para o ON:\n```sql\nSELECT c.nome, p.id\n  FROM cliente c\n  LEFT JOIN pedido p\n    ON p.cliente_id = c.id\n   AND p.situacao = 'pago';\n```\nNo ON, a condição faz parte do critério de casamento: clientes sem pedido pago simplesmente não encontram par e permanecem na saída com colunas nulas. A regra geral que vale memorizar: numa junção externa, condição sobre a tabela preservada vai no WHERE; condição sobre a tabela opcional vai no ON. Trocar isso de lugar muda o resultado sem mudar a aparência da consulta.",
        resposta:
          "O WHERE age após a junção, e as linhas sem par têm situacao NULL, que a comparação descarta — anulando o LEFT JOIN. Mova a condição para o ON.",
      },
      {
        id: "bd-a17-e4",
        nivel: "desafio",
        enunciado:
          "Uma consulta que soma o total vendido por cliente passou a devolver valores inflados depois que alguém acrescentou uma junção com a tabela de telefones. Explique.",
        dica: "Quantas linhas passa a ter cada pedido se o cliente tem três telefones?",
        resolucao:
          "O problema é a multiplicação de linhas provocada por junções com relacionamentos de cardinalidade N em ramos independentes. Antes, cada item de pedido gerava uma linha, e a soma dos valores estava correta. Ao acrescentar a junção com telefone, cada linha existente passou a ser combinada com cada telefone daquele cliente: um cliente com três telefones faz cada item aparecer três vezes, e a soma triplica. O ponto importante é que não há erro de sintaxe nem de condição de junção — a junção com telefone está correta, casando cliente_id com cliente_id. O que aconteceu é que a consulta passou a percorrer dois caminhos N a partir do mesmo cliente (itens de um lado, telefones do outro), e a junção produz o produto cartesiano entre eles dentro de cada cliente. É uma armadilha especialmente perigosa porque o valor errado é plausível: ninguém desconfia de um faturamento maior. Há três saídas. A mais simples é não juntar: se os telefones não são usados na agregação, tirá-los da consulta e buscá-los separadamente. Se forem necessários na mesma saída, a segunda opção é agregar antes de juntar, calculando o total por cliente numa subconsulta e só então juntar com telefone — assim o total já está pronto e a multiplicação não o atinge. A terceira, quando se quer apenas um telefone, é reduzir o ramo a no máximo uma linha, escolhendo o telefone principal com uma subconsulta correlacionada. O diagnóstico geral: sempre que uma agregação envolver mais de um caminho N a partir da mesma entidade, o resultado está inflado até prova em contrário.",
        resposta:
          "Dois ramos N a partir do mesmo cliente (itens e telefones) geram produto cartesiano entre si: cada item se repete uma vez por telefone e a soma multiplica. Corrija removendo a junção desnecessária ou agregando numa subconsulta antes de juntar.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "INNER JOIN traz só o que casa; LEFT JOIN preserva a tabela da esquerda.",
        "LEFT JOIN + IS NULL é o padrão para encontrar registros órfãos.",
        "Numa junção externa, condição sobre a tabela opcional vai no ON, não no WHERE.",
        "Junção sem condição gera produto cartesiano.",
      ],
      checklist: [
        "Sei escrever junções de duas e de várias tabelas.",
        "Sei encontrar órfãos com LEFT JOIN.",
        "Sei prever quando o WHERE anula um LEFT JOIN.",
        "Sei reconhecer inflação de agregação por múltiplos caminhos N.",
      ],
      palavrasChave: ["INNER JOIN", "LEFT JOIN", "ON", "produto cartesiano", "autojunção", "alias"],
      pontosRevisao: [
        "Por que condição no WHERE transforma LEFT em INNER.",
        "Por que duas junções N a partir da mesma entidade inflam somas.",
      ],
    },
  },

  {
    numero: 18,
    assunto: "SQL — agrupamento e funções de agregação",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "As funções de agregação, o GROUP BY, a diferença entre WHERE e HAVING e o comportamento das agregações diante de NULL.",
      explicacaoSimples:
        "Até agora as consultas devolviam linhas. Agregação devolve resumos: quantos, quanto somam, qual a média. O GROUP BY divide as linhas em grupos — um por cliente, um por categoria — e a função de agregação calcula um valor para cada grupo. E há duas cláusulas de filtro, não uma: o WHERE escolhe quais linhas entram nos grupos, e o HAVING escolhe quais grupos ficam no resultado.",
      explicacaoTecnica:
        "As funções de agregação são COUNT, SUM, AVG, MIN e MAX. Aplicadas sem GROUP BY, reduzem a relação inteira a uma única tupla; com GROUP BY, produzem uma tupla por grupo. A ordem lógica de execução explica tudo o mais: FROM e JOIN montam o conjunto, WHERE filtra tuplas individuais, GROUP BY forma os grupos, as agregações são calculadas, HAVING filtra grupos, o SELECT projeta e ORDER BY ordena. Daí decorre que WHERE não pode referenciar agregação — ela ainda não foi calculada — e que HAVING pode. Toda coluna do SELECT que não esteja dentro de uma função de agregação precisa constar do GROUP BY, pois de outro modo não haveria valor único a exibir para o grupo. Quanto a NULL, todas as agregações o ignoram, com uma exceção decisiva: COUNT(*) conta tuplas e inclui as que têm nulos, enquanto COUNT(coluna) conta apenas os valores não nulos daquela coluna. AVG divide pela quantidade de valores não nulos, não pelo total de linhas — diferença que muda o resultado sempre que houver ausências.",
      aplicacoes: [
        "COUNT(*) versus COUNT(coluna) é a distinção que faz um relatório de preenchimento de cadastro dizer a verdade.",
        "HAVING é o que responde a perguntas como \"quais clientes compraram mais de dez vezes\".",
        "AVG ignorando nulos explica por que a média de notas sobe quando alguém não fez a prova — e por que às vezes se quer COALESCE antes.",
      ],
      curiosidades: [
        "COUNT(*) e COUNT(1) têm exatamente o mesmo desempenho nos SGBDs modernos; a crença de que um é mais rápido sobreviveu a décadas de otimizadores que os tratam de forma idêntica.",
        "SUM de um conjunto vazio devolve NULL, não zero — o que costuma surpreender em relatórios de período sem movimento e se resolve com COALESCE(SUM(...), 0).",
      ],
      conceitos: [
        {
          termo: "Função de agregação",
          definicao:
            "Calcula um valor único a partir de um conjunto de tuplas: COUNT, SUM, AVG, MIN, MAX.",
        },
        {
          termo: "GROUP BY",
          definicao:
            "Divide as tuplas em grupos pelos valores das colunas indicadas; a agregação é calculada por grupo.",
        },
        {
          termo: "HAVING",
          definicao:
            "Filtra grupos após a agregação. É ao grupo o que o WHERE é à tupla.",
        },
        {
          termo: "COUNT(*) versus COUNT(coluna)",
          definicao:
            "O primeiro conta tuplas, inclusive com nulos; o segundo conta apenas valores não nulos daquela coluna.",
        },
        {
          termo: "Ordem lógica de execução",
          definicao:
            "FROM → WHERE → GROUP BY → agregação → HAVING → SELECT → ORDER BY.",
        },
      ],
      exemplos: [
        {
          titulo: "Agregação com e sem grupos, e os dois filtros",
          descricao:
            "A mesma pergunta em graus crescentes de refinamento. Note onde cada filtro entra.",
          linguagem: "sql",
          codigo: `-- Sem GROUP BY: a tabela inteira vira uma linha
SELECT COUNT(*) AS total,
       AVG(preco) AS preco_medio,
       MAX(preco) AS mais_caro
  FROM produto;

-- Com GROUP BY: uma linha por categoria
SELECT categoria_id,
       COUNT(*)   AS qtd,
       AVG(preco) AS medio
  FROM produto
 GROUP BY categoria_id;

-- WHERE filtra LINHAS (antes de agrupar)
-- HAVING filtra GRUPOS (depois de agregar)
SELECT c.nome,
       COUNT(p.id)   AS pedidos,
       SUM(p.total)  AS faturado
  FROM cliente c
  JOIN pedido  p ON p.cliente_id = c.id
 WHERE p.data >= '2026-01-01'      -- só pedidos de 2026 entram
 GROUP BY c.id, c.nome
HAVING COUNT(p.id) > 10            -- só clientes com mais de 10
 ORDER BY faturado DESC;`,
          linhas: [
            {
              trecho: "GROUP BY c.id, c.nome",
              explicacao:
                "Agrupa por id e inclui nome porque ele aparece no SELECT. Agrupar por id garante que homônimos não sejam somados juntos.",
            },
            {
              trecho: "WHERE p.data >= '2026-01-01'",
              explicacao:
                "Age antes do agrupamento: pedidos de 2025 nem chegam a ser contados. Trocar isto por HAVING daria resultado diferente e mais lento.",
            },
            {
              trecho: "HAVING COUNT(p.id) > 10",
              explicacao:
                "Age depois da agregação, sobre o valor calculado. Impossível no WHERE, porque ali a contagem ainda não existe.",
            },
          ],
        },
        {
          titulo: "NULL nas agregações: onde o número engana",
          descricao:
            "Uma tabela com ausências e as três contagens possíveis. Os números diferem, e cada um responde a uma pergunta.",
          linguagem: "sql",
          codigo: `-- cliente: 100 linhas, das quais 30 têm email NULL

SELECT COUNT(*)              AS linhas,        -- 100
       COUNT(email)          AS com_email,     --  70
       COUNT(DISTINCT cidade) AS cidades       -- distintas, nulos fora
  FROM cliente;

-- AVG divide pelos NÃO NULOS
-- notas: 10 alunos, 2 não fizeram a prova (nota NULL)
SELECT AVG(nota) FROM prova;              -- soma / 8
SELECT AVG(COALESCE(nota, 0)) FROM prova; -- soma / 10

-- SUM de conjunto vazio é NULL, não zero
SELECT SUM(total) FROM pedido WHERE data = '1900-01-01';   -- NULL
SELECT COALESCE(SUM(total), 0) FROM pedido
 WHERE data = '1900-01-01';                                -- 0`,
          linhas: [
            {
              trecho: "COUNT(*) = 100 e COUNT(email) = 70",
              explicacao:
                "A diferença entre os dois é exatamente o número de nulos. Usar um pelo outro num relatório de preenchimento inverte a conclusão.",
            },
            {
              trecho: "AVG(nota) divide por 8",
              explicacao:
                "Quem não fez a prova é ignorado, e a média da turma sobe. Se a regra é que falta vale zero, é preciso dizer isso com COALESCE.",
            },
            {
              trecho: "SUM devolvendo NULL",
              explicacao:
                "Sem linhas, não há o que somar, e o resultado é desconhecido — não zero. Em relatório mensal sem movimento, isso vira célula vazia em vez de R$ 0,00.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a18-e1",
        nivel: "basico",
        enunciado:
          "Escreva a consulta que devolve a quantidade de produtos e o preço médio por categoria.",
        dica: "Uma linha por categoria.",
        resolucao:
          "```sql\nSELECT categoria_id,\n       COUNT(*)   AS quantidade,\n       AVG(preco) AS preco_medio\n  FROM produto\n GROUP BY categoria_id;\n```\ncategoria_id aparece no SELECT fora de função de agregação, então precisa constar do GROUP BY — sem isso o SGBD recusa a consulta, porque não haveria valor único a exibir para o grupo.",
        resposta:
          "SELECT categoria_id, COUNT(*), AVG(preco) FROM produto GROUP BY categoria_id;",
      },
      {
        id: "bd-a18-e2",
        nivel: "intermediario",
        enunciado:
          "Explique a diferença entre WHERE e HAVING e dê um exemplo em que trocar um pelo outro muda o resultado.",
        dica: "Pense na ordem de execução.",
        resolucao:
          "WHERE filtra tuplas individuais antes do agrupamento; HAVING filtra grupos depois da agregação. A consulta que conta pedidos por cliente somente de 2026 ilustra a diferença. Com WHERE p.data >= '2026-01-01', apenas pedidos de 2026 entram nos grupos, e COUNT devolve quantos pedidos cada cliente fez em 2026 — clientes sem pedido em 2026 nem aparecem. Se a mesma condição fosse posta em HAVING, ela seria avaliada sobre grupos já formados com todos os pedidos de todos os anos, e p.data nem estaria disponível como valor único do grupo, resultando em erro ou em um filtro sobre um valor arbitrário. Além da diferença de resultado, há a de desempenho: o WHERE reduz o volume antes de agrupar, e o HAVING agrupa tudo para descartar depois.",
        resposta:
          "WHERE filtra linhas antes de agrupar; HAVING filtra grupos após agregar. Filtrar data no HAVING agruparia todos os anos antes de descartar — resultado diferente e mais lento.",
      },
      {
        id: "bd-a18-e3",
        nivel: "avancado",
        enunciado:
          "Uma tabela cliente tem 100 linhas, 30 com email nulo. Qual o valor de COUNT(*), COUNT(email) e COUNT(DISTINCT email), sabendo que entre os 70 preenchidos há 5 repetidos?",
        dica: "Cada forma conta uma coisa diferente.",
        resolucao:
          "COUNT(*) devolve 100: conta tuplas, sem olhar o conteúdo de coluna nenhuma, então os nulos entram. COUNT(email) devolve 70: conta apenas os valores não nulos da coluna, descartando os 30 nulos. COUNT(DISTINCT email) devolve 65: parte dos 70 não nulos e elimina as 5 repetições, contando cada valor uma única vez. A distinção importa muito em relatórios: perguntar \"quantos clientes temos\" pede COUNT(*), \"quantos informaram e-mail\" pede COUNT(email) e \"quantos e-mails diferentes temos para envio\" pede COUNT(DISTINCT email). Usar um pelo outro produz números plausíveis e errados.",
        resposta: "COUNT(*) = 100; COUNT(email) = 70; COUNT(DISTINCT email) = 65.",
      },
      {
        id: "bd-a18-e4",
        nivel: "desafio",
        enunciado:
          "Um relatório de \"faturamento por cliente\" usa JOIN e mostra apenas clientes que compraram. A diretoria quer todos, com zero para quem não comprou. Escreva a consulta e explique os dois cuidados necessários.",
        dica: "São dois problemas diferentes: quem aparece e o que aparece na coluna.",
        resolucao:
          "A consulta é:\n```sql\nSELECT c.nome,\n       COUNT(p.id)             AS pedidos,\n       COALESCE(SUM(p.total),0) AS faturado\n  FROM cliente c\n  LEFT JOIN pedido p ON p.cliente_id = c.id\n GROUP BY c.id, c.nome\n ORDER BY faturado DESC;\n```\nO primeiro cuidado é a junção externa. Com INNER JOIN, o cliente sem pedido não encontra par e desaparece antes mesmo do agrupamento; o LEFT JOIN o preserva, com as colunas de pedido nulas. O segundo cuidado é o tratamento do nulo resultante. Para esse cliente, o grupo contém uma única linha, com p.id e p.total nulos: COUNT(p.id) devolve 0 corretamente, porque conta valores não nulos — e é por isso que se usa COUNT(p.id) e não COUNT(*), que devolveria 1 e diria que o cliente fez um pedido. Já SUM(p.total) devolve NULL, não zero, porque não há valor algum a somar; COALESCE converte isso no zero que a diretoria pediu. Vale notar que os dois cuidados são independentes e ambos silenciosos: esquecer o LEFT JOIN omite clientes sem aviso, e usar COUNT(*) inventa um pedido que não existe. Um terceiro cuidado, se houver mais junções, é o da aula anterior: nenhum outro ramo N pode entrar na consulta, sob pena de multiplicar as somas.",
        resposta:
          "LEFT JOIN para preservar quem não comprou; COUNT(p.id) — nunca COUNT(*), que devolveria 1 — e COALESCE(SUM(p.total), 0), porque SUM de conjunto vazio é NULL.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "COUNT, SUM, AVG, MIN e MAX resumem conjuntos; GROUP BY define os grupos.",
        "Ordem lógica: FROM → WHERE → GROUP BY → agregação → HAVING → SELECT → ORDER BY.",
        "WHERE filtra linhas; HAVING filtra grupos.",
        "Agregações ignoram NULL; COUNT(*) é a exceção, e SUM de vazio é NULL.",
      ],
      checklist: [
        "Sei escrever agregações com e sem GROUP BY.",
        "Sei escolher entre WHERE e HAVING.",
        "Sei prever COUNT(*), COUNT(col) e COUNT(DISTINCT col).",
        "Sei montar um relatório que inclui quem não tem movimento.",
      ],
      palavrasChave: ["GROUP BY", "HAVING", "COUNT", "SUM", "AVG", "COALESCE"],
      pontosRevisao: [
        "Por que toda coluna não agregada do SELECT precisa estar no GROUP BY.",
        "Por que COUNT(*) devolveria 1 para um cliente sem pedidos num LEFT JOIN.",
      ],
    },
  },
]
