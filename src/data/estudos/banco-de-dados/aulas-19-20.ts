import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aulas 19 e 20.
 *
 * Fecham a disciplina: visões e linguagem de controle de dados, e a álgebra
 * relacional como base da otimização de consultas.
 */
export const AULAS_19_20: Aula[] = [
  {
    numero: 19,
    assunto: "Visões e DCL: CREATE VIEW, DROP VIEW, GRANT e REVOKE",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "Visões como consultas nomeadas e como mecanismo de segurança, e os comandos que concedem e revogam privilégios.",
      explicacaoSimples:
        "Uma visão é uma consulta com nome. Depois de criada, ela se usa como se fosse uma tabela — mas não guarda dado nenhum: toda vez que alguém a consulta, o SGBD executa a consulta original. Isso resolve dois problemas de uma vez: encapsula consultas complicadas e permite mostrar a alguém parte de uma tabela sem dar acesso ao resto dela.",
      explicacaoTecnica:
        "CREATE VIEW nome AS consulta define uma relação derivada, armazenada como definição e não como dado; DROP VIEW a remove. A visão corresponde exatamente ao nível externo da arquitetura ANSI/SPARC vista na aula 3: é o recorte que um grupo de usuários enxerga. Suas três finalidades usuais são simplificação (encapsular junções e cálculos recorrentes), segurança (expor colunas e linhas selecionadas, ocultando o restante) e independência lógica (preservar a interface das aplicações quando as tabelas por baixo mudam). Uma visão é atualizável apenas sob condições restritas — tipicamente uma única tabela base, sem agregação, sem DISTINCT, sem GROUP BY e incluindo as colunas obrigatórias —, porque de outro modo não há como mapear a alteração de volta às tuplas de origem. A DCL controla privilégios: GRANT concede, REVOKE retira, e os privilégios usuais são SELECT, INSERT, UPDATE, DELETE e REFERENCES, concedidos a usuários ou a papéis (roles). A cláusula WITH GRANT OPTION permite que quem recebeu repasse o privilégio, o que forma uma cadeia de concessões que o REVOKE precisa desfazer em cascata.",
      aplicacoes: [
        "Visão que expõe funcionário sem a coluna salário é o modo padrão de dar acesso à lista de ramais sem expor a folha.",
        "Encapsular numa visão a junção de quatro tabelas usada em dez relatórios evita que a mesma consulta seja reescrita — e divirja — dez vezes.",
        "Papéis (roles) evitam conceder privilégios usuário a usuário: concede-se ao papel, e o usuário entra no papel.",
      ],
      curiosidades: [
        "Visão materializada é outra coisa: ela armazena o resultado e precisa de política de atualização, trocando tempo de consulta por consistência — exatamente o dilema discutido no exercício da aula 3.",
        "REVOKE com CASCADE pode retirar privilégios de gente que você nem sabia que tinha acesso, se houve repasse por WITH GRANT OPTION. É o motivo prático para evitar essa cláusula.",
      ],
      conceitos: [
        {
          termo: "Visão (view)",
          definicao:
            "Relação derivada definida por uma consulta. Armazena a definição, não os dados.",
        },
        {
          termo: "Visão atualizável",
          definicao:
            "Aquela sobre a qual INSERT, UPDATE e DELETE são possíveis: exige tabela única, sem agregação nem DISTINCT.",
        },
        {
          termo: "DCL",
          definicao:
            "Data Control Language: a parte do SQL que controla acesso — GRANT e REVOKE.",
        },
        {
          termo: "Privilégio",
          definicao:
            "Autorização para uma operação sobre um objeto: SELECT, INSERT, UPDATE, DELETE, REFERENCES.",
        },
        {
          termo: "Papel (role)",
          definicao:
            "Conjunto nomeado de privilégios concedido a usuários. Evita administrar permissão pessoa a pessoa.",
        },
      ],
      exemplos: [
        {
          titulo: "Visões para simplificar e para proteger",
          descricao:
            "As duas finalidades principais, lado a lado. A segunda só funciona junto com a DCL.",
          linguagem: "sql",
          codigo: `-- SIMPLIFICAÇÃO: encapsula a junção usada em vários relatórios
CREATE VIEW vw_venda_detalhada AS
SELECT p.id            AS pedido,
       p.data,
       c.nome          AS cliente,
       pr.descricao    AS produto,
       i.quantidade,
       i.preco_unitario,
       i.quantidade * i.preco_unitario AS subtotal
  FROM pedido      p
  JOIN cliente     c  ON c.id  = p.cliente_id
  JOIN item_pedido i  ON i.pedido_id = p.id
  JOIN produto     pr ON pr.id = i.produto_id;

-- Agora os relatórios ficam triviais:
SELECT cliente, SUM(subtotal) FROM vw_venda_detalhada
 GROUP BY cliente;

-- SEGURANÇA: recorte sem a coluna sensível
CREATE VIEW vw_ramal AS
SELECT id, nome, setor, ramal FROM funcionario;

REVOKE ALL   ON funcionario FROM recepcao;
GRANT  SELECT ON vw_ramal    TO   recepcao;

DROP VIEW vw_ramal;`,
          linhas: [
            {
              trecho: "CREATE VIEW vw_venda_detalhada",
              explicacao:
                "A junção de quatro tabelas passa a ter um nome. Dez relatórios que a repetiam agora compartilham uma definição só — e corrigir um erro nela corrige nos dez.",
            },
            {
              trecho: "i.quantidade * i.preco_unitario AS subtotal",
              explicacao:
                "Coluna calculada. Não existe em tabela nenhuma: é computada a cada consulta, e por isso nunca fica desatualizada.",
            },
            {
              trecho: "REVOKE ALL ON funcionario",
              explicacao:
                "Passo indispensável. Criar a visão não protege nada se o usuário continuar podendo consultar a tabela base diretamente.",
            },
            {
              trecho: "GRANT SELECT ON vw_ramal TO recepcao",
              explicacao:
                "Só agora a proteção existe: a recepção enxerga quatro colunas e não tem caminho até o salário.",
            },
          ],
        },
        {
          titulo: "Quando a visão aceita alteração e quando não",
          descricao:
            "A regra decorre de haver ou não como mapear a alteração de volta para as tuplas de origem.",
          linguagem: "sql",
          codigo: `-- ATUALIZÁVEL: uma tabela, sem agregação
CREATE VIEW vw_produto_ativo AS
SELECT id, descricao, preco FROM produto WHERE ativo = true;

UPDATE vw_produto_ativo SET preco = 99.90 WHERE id = 5;   -- OK

-- NÃO ATUALIZÁVEL: agregação
CREATE VIEW vw_faturamento AS
SELECT cliente_id, SUM(total) AS faturado
  FROM pedido GROUP BY cliente_id;

UPDATE vw_faturamento SET faturado = 5000 WHERE cliente_id = 1;
-- ERRO: qual pedido deveria mudar? E em quanto?

-- NÃO ATUALIZÁVEL na prática: junção com colunas obrigatórias fora
CREATE VIEW vw_pedido_cliente AS
SELECT p.id, c.nome FROM pedido p JOIN cliente c ON c.id = p.cliente_id;
-- INSERT aqui não sabe em qual das duas tabelas inserir`,
          linhas: [
            {
              trecho: "WHERE ativo = true",
              explicacao:
                "Filtro não impede a atualização: cada linha da visão corresponde a exatamente uma linha da tabela, e o mapeamento é direto.",
            },
            {
              trecho: "SUM(total) AS faturado",
              explicacao:
                "Uma linha da visão resume muitas da origem. Alterar o resumo é ambíguo — não há regra que diga como distribuir a mudança pelos pedidos.",
            },
            {
              trecho: "JOIN em vw_pedido_cliente",
              explicacao:
                "Uma linha vem de duas tabelas. Um INSERT precisaria decidir sozinho se cria pedido, cliente ou ambos, e com quais valores para as colunas ausentes.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a19-e1",
        nivel: "basico",
        enunciado:
          "Crie uma visão chamada vw_produto_caro com código, descrição e preço dos produtos acima de 1.000.",
        dica: "CREATE VIEW ... AS SELECT.",
        resolucao:
          "```sql\nCREATE VIEW vw_produto_caro AS\nSELECT codigo, descricao, preco\n  FROM produto\n WHERE preco > 1000;\n```\nA visão não guarda linha nenhuma: guarda esta consulta. Um produto que sofra reajuste e ultrapasse 1.000 passa a aparecer nela automaticamente, sem que nada precise ser recalculado.",
        resposta:
          "CREATE VIEW vw_produto_caro AS SELECT codigo, descricao, preco FROM produto WHERE preco > 1000;",
      },
      {
        id: "bd-a19-e2",
        nivel: "intermediario",
        enunciado:
          "Um usuário precisa consultar nome e setor dos funcionários, mas não pode ver salários. Escreva os comandos completos.",
        dica: "Não basta criar a visão.",
        resolucao:
          "```sql\nCREATE VIEW vw_funcionario_publico AS\nSELECT id, nome, setor FROM funcionario;\n\nREVOKE ALL ON funcionario TO consulta;   -- ou: FROM consulta\nGRANT SELECT ON vw_funcionario_publico TO consulta;\n```\nO passo que costuma ser esquecido é o REVOKE. Criar a visão não restringe nada por si só: se o usuário mantiver privilégio de SELECT sobre a tabela funcionario, basta consultá-la diretamente para ver os salários, e a visão vira apenas uma conveniência. A proteção existe justamente na combinação — negar a tabela e conceder a visão.",
        resposta:
          "CREATE VIEW com as três colunas; REVOKE ALL ON funcionario do usuário; GRANT SELECT na visão. Sem o REVOKE, não há proteção alguma.",
      },
      {
        id: "bd-a19-e3",
        nivel: "avancado",
        enunciado:
          "Por que uma visão com GROUP BY não pode receber UPDATE? Explique com um exemplo concreto.",
        dica: "Quantas linhas de origem cada linha da visão representa?",
        resolucao:
          "Porque não existe mapeamento único de volta para as tuplas de origem. Tome vw_faturamento(cliente_id, faturado), definida como SUM(total) agrupado por cliente. Se o cliente 1 tem cinco pedidos somando 4.000 e alguém executa UPDATE ... SET faturado = 5000 WHERE cliente_id = 1, o SGBD precisaria decidir como distribuir os 1.000 de diferença entre os cinco pedidos: tudo no primeiro? no último? proporcionalmente? criando um sexto pedido? Todas as opções são defensáveis e nenhuma está na consulta — a informação necessária para desfazer a agregação simplesmente não existe. É por isso que o padrão SQL restringe a atualizabilidade a visões em que cada linha da visão corresponde a exatamente uma linha de uma única tabela base: só nesse caso a alteração tem destino inequívoco. Quando é preciso oferecer escrita através de uma visão complexa, o caminho é declarar explicitamente a regra de mapeamento por meio de um gatilho INSTEAD OF, que intercepta a operação e executa, em seu lugar, o comando que o programador determinou. Aí a ambiguidade deixa de existir porque alguém a resolveu à mão.",
        resposta:
          "Porque cada linha da visão resume várias da origem e não há como saber como distribuir a alteração entre elas. Só é resolvível declarando a regra num gatilho INSTEAD OF.",
      },
      {
        id: "bd-a19-e4",
        nivel: "desafio",
        enunciado:
          "Discuta o uso de visões como camada de segurança comparado ao controle de acesso feito na aplicação.",
        dica: "Quem mais fala com o banco além da aplicação?",
        resolucao:
          "O argumento a favor da visão é o mesmo da integridade declarada no banco, discutido na aula 10: a aplicação não é o único caminho até o dado. Ferramentas de BI, scripts de extração, o cliente SQL do analista e o sistema seguinte que ninguém previu falam com o banco diretamente, e um controle implementado apenas na aplicação não os alcança. Com visão mais GRANT/REVOKE, a restrição vale para toda conexão, qualquer que seja a ferramenta, porque é o SGBD que a aplica. Há um segundo ganho: a regra fica declarada num lugar inspecionável — é possível auditar quem tem acesso a quê consultando o catálogo, o que não se consegue lendo código de aplicação espalhado. As limitações também são reais. Visões controlam bem o acesso por coluna e por linha estática, mas ficam desconfortáveis quando a regra depende do usuário conectado de forma dinâmica — \"cada vendedor vê apenas seus clientes\" exige funções de sessão dentro da visão, e a solução moderna para isso é segurança em nível de linha, não visão. Além disso, uma camada espessa de visões sobre visões dificulta a otimização e a depuração, e o número de objetos a manter cresce rápido. Também não substituem controle de acesso funcional: quem pode aprovar um pedido, quem pode cancelar uma venda, isso é regra de aplicação e não se expressa como privilégio de tabela. A conclusão prática é que não são alternativas concorrentes, e sim camadas complementares: o banco garante o que é acesso a dado, a aplicação garante o que é permissão de ação, e a primeira é a que continua valendo quando alguém abre um cliente SQL.",
        resposta:
          "Visão + GRANT vale para toda conexão, inclusive BI, scripts e acesso manual, e é auditável no catálogo — a aplicação só protege o próprio caminho. Mas não cobre regra dinâmica por usuário (caso de row-level security) nem permissão de ação. São camadas complementares.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Visão é consulta nomeada; guarda definição, não dados. É o nível externo do ANSI/SPARC.",
        "Serve para simplificar, proteger e preservar independência lógica.",
        "Só é atualizável quando cada linha mapeia para uma linha de uma única tabela base.",
        "GRANT concede e REVOKE retira privilégios; papéis evitam administrar usuário a usuário.",
      ],
      checklist: [
        "Sei criar e remover uma visão.",
        "Sei montar a combinação REVOKE + GRANT que realmente protege uma coluna.",
        "Sei dizer se uma visão é atualizável e por quê.",
        "Sei comparar segurança por visão e por aplicação.",
      ],
      palavrasChave: ["CREATE VIEW", "visão atualizável", "DCL", "GRANT", "REVOKE", "papel"],
      pontosRevisao: [
        "Por que criar a visão sem revogar a tabela não protege nada.",
        "Por que agregação impede a atualização através da visão.",
      ],
    },
  },

  {
    numero: 20,
    assunto: "Álgebra relacional e otimização de consultas",
    unidade: "Otimização de Consultas com álgebra relacional",
    conteudo: {
      resumo:
        "Os operadores da álgebra relacional, sua correspondência com o SQL e como o otimizador reescreve consultas usando as equivalências entre expressões.",
      explicacaoSimples:
        "SQL diz o que você quer; a álgebra relacional descreve como obter. Entre um e outro está o otimizador, que traduz sua consulta numa expressão algébrica e depois a reescreve em formas equivalentes até achar a mais barata. Entender a álgebra é entender por que duas consultas que devolvem o mesmo resultado podem levar tempos completamente diferentes — e por que muitas vezes levam exatamente o mesmo.",
      explicacaoTecnica:
        "A álgebra relacional é uma linguagem procedimental cujos operandos e resultados são relações, o que permite compor expressões. Os operadores fundamentais são: seleção (σ), que escolhe tuplas por um predicado; projeção (π), que escolhe atributos e elimina duplicatas; produto cartesiano (×); união (∪); diferença (−); e renomeação (ρ). Derivados deles estão a interseção (∩) e a junção (⋈), que é a composição de produto cartesiano com seleção. União, interseção e diferença exigem compatibilidade de união: mesmo número de atributos e domínios correspondentes. A otimização baseia-se em equivalências algébricas — transformações que preservam o resultado. As duas mais importantes são a antecipação da seleção, empurrando σ para o mais perto possível das folhas da árvore de expressão, e a antecipação da projeção, descartando atributos desnecessários cedo; ambas reduzem o volume de tuplas antes das operações caras. A otimização baseada em custo, além disso, usa estatísticas do catálogo — cardinalidades, seletividade, distribuição de valores — para escolher entre planos algebricamente equivalentes, decidindo ordem de junção e método de acesso. O plano escolhido é inspecionável com EXPLAIN.",
      aplicacoes: [
        "EXPLAIN é a ferramenta de diagnóstico de consulta lenta: mostra o plano que o otimizador escolheu e onde está o custo.",
        "Estatísticas desatualizadas fazem o otimizador escolher mal — daí a manutenção periódica com ANALYZE.",
        "Saber que o otimizador antecipa seleções explica por que reescrever a consulta \"na ordem certa\" quase nunca ajuda.",
      ],
      curiosidades: [
        "Codd provou que a álgebra relacional e o cálculo relacional têm o mesmo poder de expressão; essa equivalência é a base teórica que permite ao SQL ser declarativo e ainda assim executável.",
        "A ordem de junção de N tabelas tem número de possibilidades que cresce fatorialmente; por isso os otimizadores usam programação dinâmica até certo número de tabelas e passam a heurísticas depois — em consultas com muitas junções, o plano escolhido pode não ser o ótimo.",
      ],
      conceitos: [
        {
          termo: "Seleção (σ)",
          definicao: "Escolhe tuplas que satisfazem um predicado. Corresponde ao WHERE.",
        },
        {
          termo: "Projeção (π)",
          definicao:
            "Escolhe atributos e elimina duplicatas. Corresponde ao SELECT com DISTINCT implícito.",
        },
        {
          termo: "Junção (⋈)",
          definicao:
            "Produto cartesiano seguido de seleção pela condição de junção. Operador derivado.",
        },
        {
          termo: "Compatibilidade de união",
          definicao:
            "Mesmo número de atributos e domínios correspondentes — exigida por ∪, ∩ e −.",
        },
        {
          termo: "Equivalência algébrica",
          definicao:
            "Transformação de uma expressão em outra que produz o mesmo resultado, base da otimização.",
        },
        {
          termo: "Otimização baseada em custo",
          definicao:
            "Escolha entre planos equivalentes usando estatísticas do catálogo sobre volume e distribuição dos dados.",
        },
      ],
      exemplos: [
        {
          titulo: "Os operadores e seus equivalentes em SQL",
          descricao:
            "Cada linha mostra a mesma operação nas duas linguagens. A projeção tem uma diferença sutil que vale notar.",
          linguagem: "text",
          codigo: `ÁLGEBRA                          SQL
-------------------------------  ----------------------------------
σ preco > 100 (produto)          SELECT * FROM produto
                                  WHERE preco > 100

π descricao, preco (produto)     SELECT DISTINCT descricao, preco
                                    FROM produto

produto × categoria              SELECT * FROM produto, categoria

produto ⋈ p.cat_id = c.id        SELECT * FROM produto p
        categoria                  JOIN categoria c ON c.id = p.cat_id

r ∪ s                            SELECT ... UNION SELECT ...
r ∩ s                            SELECT ... INTERSECT SELECT ...
r − s                            SELECT ... EXCEPT SELECT ...

ρ p (produto)                    FROM produto AS p`,
          linhas: [
            {
              trecho: "π corresponde a SELECT DISTINCT",
              explicacao:
                "A projeção da álgebra elimina duplicatas, porque relação é conjunto. O SELECT do SQL não elimina, porque tabela é multiconjunto — a correspondência exata exige o DISTINCT.",
            },
            {
              trecho: "⋈ é derivado",
              explicacao:
                "Junção é açúcar sintático sobre × seguido de σ. Saber disso explica por que esquecer a condição de junção devolve o produto cartesiano: você escreveu só a primeira metade.",
            },
            {
              trecho: "∪, ∩, −",
              explicacao:
                "Exigem compatibilidade de união. Em SQL, UNION elimina duplicatas e UNION ALL não — de novo a diferença entre conjunto e multiconjunto.",
            },
          ],
        },
        {
          titulo: "A equivalência que mais economiza: antecipar a seleção",
          descricao:
            "As duas expressões dão o mesmo resultado. A diferença está em quantas tuplas cada operação processa.",
          linguagem: "text",
          codigo: `Consulta: itens de pedidos feitos em 2026.
  pedido      = 1.000.000 de tuplas, das quais 50.000 são de 2026
  item_pedido = 5.000.000 de tuplas

PLANO RUIM  — junta tudo, filtra depois
  σ data >= '2026-01-01' ( pedido ⋈ item_pedido )
      junção processa 1.000.000 x  ->  ~5.000.000 de tuplas
      depois descarta 99% delas

PLANO BOM   — filtra antes, junta o que sobrou
  ( σ data >= '2026-01-01' (pedido) ) ⋈ item_pedido
      seleção reduz a 50.000 tuplas
      junção processa 20x menos dados

Em SQL as duas se escrevem IGUAL:
  SELECT * FROM pedido p JOIN item_pedido i ON i.pedido_id = p.id
   WHERE p.data >= '2026-01-01';

É o otimizador que escolhe — e é por isso que SQL é declarativo.`,
          linhas: [
            {
              trecho: "σ aplicada antes da ⋈",
              explicacao:
                "A regra de ouro: reduza o volume o quanto antes. Junção é cara e seu custo cresce com o tamanho das entradas; filtrar primeiro encolhe as entradas.",
            },
            {
              trecho: "\"em SQL as duas se escrevem igual\"",
              explicacao:
                "O ponto central da aula. Você declara o resultado desejado; a escolha do plano é do otimizador, que aplica esta equivalência sem que ninguém peça.",
            },
          ],
        },
        {
          titulo: "Lendo o plano com EXPLAIN",
          descricao:
            "Como confirmar o que o otimizador realmente fez, em vez de supor.",
          linguagem: "sql",
          codigo: `EXPLAIN ANALYZE
SELECT c.nome, SUM(i.quantidade * i.preco_unitario)
  FROM cliente     c
  JOIN pedido      p ON p.cliente_id = c.id
  JOIN item_pedido i ON i.pedido_id  = p.id
 WHERE p.data >= '2026-01-01'
 GROUP BY c.id, c.nome;

-- O que procurar na saída:
--   Seq Scan      -> varredura completa; suspeite se a tabela é grande
--   Index Scan    -> usou índice
--   Hash Join / Nested Loop -> método de junção escolhido
--   rows=         -> estimativa do otimizador
--   actual rows=  -> quantidade real (só com ANALYZE)`,
          linhas: [
            {
              trecho: "EXPLAIN ANALYZE",
              explicacao:
                "EXPLAIN mostra o plano estimado; com ANALYZE, executa de fato e mostra os números reais ao lado das estimativas.",
            },
            {
              trecho: "rows= contra actual rows=",
              explicacao:
                "A comparação mais útil da saída. Divergência grande entre estimado e real significa estatísticas desatualizadas — e um otimizador decidindo com informação errada.",
            },
            {
              trecho: "Seq Scan",
              explicacao:
                "Nem sempre é problema: varrer é mais rápido que usar índice quando a consulta devolve boa parte da tabela. Vira problema quando a tabela é grande e o filtro é seletivo.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a20-e1",
        nivel: "basico",
        enunciado:
          "Escreva em álgebra relacional: descrição e preço dos produtos com preço acima de 500.",
        dica: "Uma seleção dentro de uma projeção.",
        resolucao:
          "π descricao, preco ( σ preco > 500 (produto) ).\n\nLê-se de dentro para fora: primeiro a seleção escolhe as tuplas com preço acima de 500, depois a projeção escolhe os dois atributos. Escrever na ordem inversa — projetar antes e selecionar depois — seria inválido aqui, porque após projetar apenas descricao e preco o atributo preco ainda existiria, mas em geral projetar antes pode remover justamente o atributo de que a seleção precisa.",
        resposta: "π descricao, preco ( σ preco > 500 (produto) )",
      },
      {
        id: "bd-a20-e2",
        nivel: "intermediario",
        enunciado:
          "Por que a projeção da álgebra relacional elimina duplicatas e o SELECT do SQL não?",
        dica: "Relação é conjunto; tabela é o quê?",
        resolucao:
          "Porque operam sobre estruturas diferentes. Na álgebra, o resultado de qualquer operação é uma relação, e relação é conjunto no sentido matemático — não admite elemento repetido. Projetar apenas a coluna cidade de uma tabela de clientes devolve, portanto, cada cidade uma única vez. Em SQL, a tabela e o resultado de consulta são multiconjuntos, que admitem repetição, e o SELECT preserva todas as ocorrências. A razão da escolha do SQL é de desempenho: eliminar duplicatas exige ordenar o resultado ou construir uma tabela de dispersão, custo que seria cobrado de toda consulta, inclusive das que não se importam com repetição. Por isso a eliminação é opcional e explícita, com DISTINCT — e o mesmo raciocínio explica UNION eliminar duplicatas enquanto UNION ALL, mais rápido, as preserva.",
        resposta:
          "Porque a álgebra opera sobre conjuntos e o SQL sobre multiconjuntos. Eliminar duplicatas custa ordenação ou dispersão, e o SQL tornou esse custo opcional via DISTINCT.",
      },
      {
        id: "bd-a20-e3",
        nivel: "avancado",
        enunciado:
          "Explique por que aplicar a seleção antes da junção é quase sempre melhor, e cite um caso em que não faz diferença.",
        dica: "O custo da junção depende de quê?",
        resolucao:
          "O custo de uma junção cresce com o tamanho das relações de entrada — no pior caso, uma varredura aninhada processa o produto das cardinalidades. Aplicar a seleção antes reduz uma das entradas, e a redução se propaga: com um milhão de pedidos dos quais cinquenta mil são de 2026, filtrar primeiro faz a junção trabalhar com vinte vezes menos tuplas, e o ganho aparece também em memória, em leitura de disco e no volume intermediário que precisa ser mantido. Filtrar depois obriga a construir o resultado completo da junção para então descartar quase tudo — trabalho feito para ser jogado fora. Há situações em que não faz diferença. A primeira, e a mais comum na prática, é que o otimizador já aplica essa transformação sozinho: escrever a consulta \"na ordem certa\" não muda nada, porque o plano é o mesmo. A segunda é quando a seleção é pouco seletiva — se o filtro mantém 95% das tuplas, antecipá-lo economiza pouco e ainda custa uma passagem a mais. A terceira é quando a condição não pode ser antecipada por definição: um predicado que envolve colunas das duas tabelas, como p.data > c.data_cadastro, só é avaliável depois que as tuplas foram casadas. E há o caso já visto na aula 17, em que antecipar não é apenas inútil mas errado: numa junção externa, mover a condição da tabela opcional para antes da junção muda o resultado, transformando LEFT em INNER.",
        resposta:
          "Porque o custo da junção cresce com o tamanho das entradas, e filtrar antes encolhe o que será processado. Não faz diferença quando o otimizador já faz isso, quando o filtro é pouco seletivo, ou quando o predicado envolve colunas das duas tabelas e só é avaliável depois do casamento.",
      },
      {
        id: "bd-a20-e4",
        nivel: "desafio",
        enunciado:
          "Uma consulta que rodava em 200 ms passou a levar 40 segundos, sem que a consulta ou os índices mudassem. Liste hipóteses e como investigar cada uma.",
        dica: "O que muda num banco sem ninguém alterar código?",
        resolucao:
          "A primeira hipótese, e a mais provável, é a mudança de plano por estatísticas desatualizadas. O volume dos dados cresceu ou sua distribuição mudou, e o otimizador passou a decidir com informação velha — trocando, por exemplo, um Index Scan por um Seq Scan, ou invertendo a ordem de junção. Investiga-se com EXPLAIN ANALYZE, comparando as linhas estimadas com as reais: divergência grande confirma a hipótese, e a correção é atualizar as estatísticas com ANALYZE. A segunda é o crescimento puro do volume: a consulta sempre foi ineficiente, mas com poucos dados isso não aparecia. Compara-se a cardinalidade atual das tabelas com a de meses atrás e observa-se se o plano contém alguma operação cujo custo cresce mais que linearmente. A terceira é a degradação física: em bancos com controle de versão de linhas, atualizações e exclusões deixam versões mortas que continuam sendo lidas; o sintoma é uma tabela ocupando muito mais espaço do que o volume de dados justifica, e a correção é a manutenção de rotina (VACUUM ou equivalente) e a reconstrução de índices fragmentados. A quarta é contenção: a consulta não está lenta, está esperando — bloqueada por outra transação de longa duração. Investiga-se olhando as sessões ativas e os bloqueios no momento em que a lentidão ocorre, e o sinal característico é a lentidão ser intermitente em vez de constante. A quinta é ambiental: menos memória disponível para cache, disco mais lento, concorrência maior no servidor. Compara-se com métricas de sistema no período. O método para separar as hipóteses é começar sempre pelo EXPLAIN ANALYZE, porque ele distingue de imediato entre \"o plano mudou\" e \"o plano é o mesmo e ficou lento\" — e essa bifurcação elimina metade das hipóteses de uma vez.",
        resposta:
          "Hipóteses: estatísticas desatualizadas mudando o plano (a mais provável), crescimento de volume expondo ineficiência antiga, degradação física por versões mortas e índices fragmentados, contenção por bloqueio, e mudança ambiental. Comece por EXPLAIN ANALYZE: ele separa \"o plano mudou\" de \"o mesmo plano ficou lento\".",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Operadores fundamentais: σ, π, ×, ∪, − e ρ; ⋈ e ∩ são derivados.",
        "π elimina duplicatas porque relação é conjunto; SELECT não, porque tabela é multiconjunto.",
        "Antecipar seleções e projeções é a principal equivalência de otimização.",
        "O otimizador escolhe o plano com base em estatísticas; EXPLAIN mostra o que ele decidiu.",
      ],
      checklist: [
        "Sei escrever consultas simples em álgebra relacional.",
        "Sei traduzir entre álgebra e SQL.",
        "Sei justificar por que antecipar a seleção reduz custo.",
        "Sei investigar uma consulta que ficou lenta sem mudar.",
      ],
      palavrasChave: [
        "álgebra relacional",
        "seleção",
        "projeção",
        "junção",
        "equivalência",
        "otimizador",
        "EXPLAIN",
      ],
      pontosRevisao: [
        "Por que SQL é declarativo e a álgebra é procedimental.",
        "Os três casos em que antecipar a seleção não ajuda — e o caso em que é errado.",
      ],
    },
  },
]
