import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aula 14.
 *
 * Fecha a unidade de normalização e abre a de SQL com a linguagem de definição
 * de dados.
 */
export const AULA_14: Aula[] = [
  {
    numero: 14,
    assunto: "SQL — DDL: CREATE TABLE, ALTER TABLE e DROP TABLE",
    unidade: "Linguagem de Consulta Estruturada — SQL",
    conteudo: {
      resumo:
        "A linguagem de definição de dados: criar tabelas com tipos e restrições, alterar estrutura existente e remover objetos.",
      explicacaoSimples:
        "Até aqui, o esquema existia no papel. A DDL é a parte do SQL que o transforma em banco de verdade: CREATE TABLE cria, ALTER TABLE altera e DROP TABLE apaga. É onde tudo o que foi decidido na modelagem — chaves, obrigatoriedade, tipos, relacionamentos — vira regra que o SGBD passa a fazer cumprir sozinho.",
      explicacaoTecnica:
        "CREATE TABLE declara nome da tabela, colunas com seus tipos e as restrições. As restrições de coluna incluem NOT NULL, UNIQUE, DEFAULT, CHECK, PRIMARY KEY e REFERENCES; as de tabela, declaradas separadamente, permitem chaves compostas e restrições que envolvem várias colunas. Nomear as restrições com CONSTRAINT nome é boa prática porque a mensagem de erro do SGBD passa a citar esse nome, e porque removê-las depois exige conhecê-lo. Os tipos mais frequentes são INTEGER, NUMERIC(p,s) para valores exatos, VARCHAR(n) e CHAR(n), DATE, TIMESTAMP e BOOLEAN; para dinheiro usa-se NUMERIC, nunca FLOAT, porque o ponto flutuante binário não representa exatamente frações decimais. ALTER TABLE permite acrescentar, alterar e remover colunas e restrições, e é o comando que atravessa a vida do sistema — acrescentar coluna NOT NULL a uma tabela com dados exige DEFAULT ou uma sequência de três passos. DROP TABLE remove a tabela e seus dados; com tabelas referenciadas, o SGBD recusa a operação por integridade referencial, a menos que se use CASCADE, que remove também as restrições dependentes.",
      aplicacoes: [
        "Declarar CHECK (quantidade > 0) no banco garante a regra mesmo para importações e acessos que não passam pela aplicação.",
        "NUMERIC em vez de FLOAT para dinheiro evita o clássico total de 0,30 virando 0,29999999999999993.",
        "ALTER TABLE em tabela grande pode bloquear a tabela durante a operação — motivo pelo qual migrations em produção se planejam, não se improvisam.",
      ],
      curiosidades: [
        "DROP TABLE é DDL e, em vários SGBDs, provoca commit implícito — o que significa que um ROLLBACK depois dele não desfaz nada. PostgreSQL é exceção: lá a DDL é transacional.",
        "VARCHAR(n) e TEXT têm desempenho praticamente idêntico no PostgreSQL; o limite em VARCHAR vale como restrição de domínio, não como otimização de armazenamento.",
      ],
      conceitos: [
        {
          termo: "DDL",
          definicao:
            "Data Definition Language: a parte do SQL que define estruturas — CREATE, ALTER, DROP.",
        },
        {
          termo: "Restrição de coluna",
          definicao:
            "Declarada junto à coluna e válida sobre ela: NOT NULL, UNIQUE, DEFAULT, CHECK, PRIMARY KEY, REFERENCES.",
        },
        {
          termo: "Restrição de tabela",
          definicao:
            "Declarada separadamente; necessária para chaves compostas e para regras que envolvem várias colunas.",
        },
        {
          termo: "CHECK",
          definicao:
            "Restrição que impõe uma condição booleana aos valores. É onde a regra de negócio entra no esquema.",
        },
        {
          termo: "DROP ... CASCADE",
          definicao:
            "Remove o objeto e tudo que depende dele. Poderoso e perigoso: apaga mais do que se digitou.",
        },
      ],
      exemplos: [
        {
          titulo: "Um CREATE TABLE com todas as restrições em uso",
          descricao:
            "Cada restrição aqui é uma regra de negócio que a aplicação não precisa lembrar de validar.",
          linguagem: "sql",
          codigo: `CREATE TABLE pedido (
  id          SERIAL       PRIMARY KEY,
  cliente_id  INTEGER      NOT NULL,
  data        DATE         NOT NULL DEFAULT CURRENT_DATE,
  situacao    VARCHAR(10)  NOT NULL DEFAULT 'aberto',
  desconto    NUMERIC(5,2) NOT NULL DEFAULT 0,

  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (cliente_id) REFERENCES cliente (id)
    ON DELETE RESTRICT,

  CONSTRAINT ck_pedido_situacao
    CHECK (situacao IN ('aberto', 'pago', 'enviado', 'cancelado')),

  CONSTRAINT ck_pedido_desconto
    CHECK (desconto >= 0 AND desconto <= 100)
);`,
          linhas: [
            {
              trecho: "SERIAL PRIMARY KEY",
              explicacao:
                "Chave artificial autoincrementada. Escolha usual quando não há identificador natural estável no domínio.",
            },
            {
              trecho: "DEFAULT CURRENT_DATE",
              explicacao:
                "O banco preenche a data quando o INSERT não a informa. Menos um campo para a aplicação errar, e vale para qualquer origem de escrita.",
            },
            {
              trecho: "CONSTRAINT fk_pedido_cliente",
              explicacao:
                "Restrição nomeada. Quando alguém tentar excluir um cliente com pedidos, o erro cita fk_pedido_cliente — e quem lê o log sabe imediatamente o que aconteceu.",
            },
            {
              trecho: "CHECK (situacao IN (...))",
              explicacao:
                "Impede grafias inventadas como 'ABERTO' ou 'pendente'. Sem isso, a coluna acumula variações e todo relatório precisa tratá-las.",
            },
            {
              trecho: "NUMERIC(5,2)",
              explicacao:
                "Cinco dígitos no total, dois decimais. Exato, ao contrário de FLOAT — obrigatório em qualquer coisa que vire dinheiro.",
            },
          ],
        },
        {
          titulo: "ALTER TABLE: acrescentar coluna obrigatória a uma tabela com dados",
          descricao:
            "A operação que mais dá errado em produção, feita nos três passos que a tornam segura.",
          linguagem: "sql",
          codigo: `-- ERRADO em tabela que já tem linhas: as existentes ficariam nulas
ALTER TABLE cliente ADD COLUMN email VARCHAR(120) NOT NULL;
-- ERRO: column "email" contains null values

-- CERTO, em três passos
-- 1. acrescenta permitindo nulo
ALTER TABLE cliente ADD COLUMN email VARCHAR(120);

-- 2. preenche as linhas existentes
UPDATE cliente SET email = 'sem-email@exemplo.local' WHERE email IS NULL;

-- 3. agora sim, impõe a obrigatoriedade
ALTER TABLE cliente ALTER COLUMN email SET NOT NULL;

-- Outras alterações comuns
ALTER TABLE cliente ADD CONSTRAINT uq_cliente_email UNIQUE (email);
ALTER TABLE cliente DROP CONSTRAINT uq_cliente_email;
ALTER TABLE cliente RENAME COLUMN email TO email_principal;`,
          linhas: [
            {
              trecho: "ADD COLUMN ... NOT NULL (sem DEFAULT)",
              explicacao:
                "Falha porque as linhas existentes não têm valor para a coluna nova, e NOT NULL proíbe nulo. O SGBD recusa a operação inteira — corretamente.",
            },
            {
              trecho: "UPDATE ... WHERE email IS NULL",
              explicacao:
                "O passo que decide qual valor as linhas antigas recebem. É decisão de negócio, e por isso não pode ser automatizada por um DEFAULT escolhido às pressas.",
            },
            {
              trecho: "ALTER COLUMN ... SET NOT NULL",
              explicacao:
                "Só agora a restrição entra, com a certeza de que nenhuma linha a viola. O SGBD varre a tabela para conferir antes de aceitar.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a14-e1",
        nivel: "basico",
        enunciado:
          "Escreva o CREATE TABLE de categoria(id, nome), com id como chave primária e nome obrigatório e único.",
        dica: "Três restrições ao todo.",
        resolucao:
          "```sql\nCREATE TABLE categoria (\n  id   SERIAL      PRIMARY KEY,\n  nome VARCHAR(60) NOT NULL UNIQUE\n);\n```\nPRIMARY KEY já implica NOT NULL e UNIQUE em id, então não é preciso declará-los. Em nome, NOT NULL e UNIQUE são independentes e ambos necessários: sem NOT NULL, seria possível gravar categoria sem nome; sem UNIQUE, duas categorias com o mesmo nome.",
        resposta:
          "CREATE TABLE categoria (id SERIAL PRIMARY KEY, nome VARCHAR(60) NOT NULL UNIQUE);",
      },
      {
        id: "bd-a14-e2",
        nivel: "intermediario",
        enunciado:
          "Por que usar NUMERIC(10,2) e não FLOAT para valores monetários?",
        dica: "Some 0,10 + 0,20 em ponto flutuante.",
        resolucao:
          "Porque FLOAT é ponto flutuante binário e não representa exatamente frações decimais. O valor 0,1 não tem representação finita em base 2, do mesmo modo que 1/3 não tem em base 10; o que se armazena é uma aproximação. Somando 0,10 + 0,20 obtém-se 0,30000000000000004, e o erro se acumula a cada operação. Em dinheiro isso é inaceitável: totais não fecham, comparações de igualdade falham e o balanço fica com centavos de diferença que ninguém consegue explicar. NUMERIC (ou DECIMAL) é aritmética decimal exata: armazena os dígitos e a posição da vírgula, e 0,10 + 0,20 dá exatamente 0,30. A regra é usar NUMERIC para qualquer valor que precise ser exato — dinheiro, quantidades contábeis — e reservar FLOAT para grandezas científicas, em que a aproximação já faz parte da medida.",
        resposta:
          "FLOAT é binário e aproxima frações decimais, acumulando erro (0,10+0,20 = 0,30000000000000004). NUMERIC é decimal exato — obrigatório para dinheiro.",
      },
      {
        id: "bd-a14-e3",
        nivel: "avancado",
        enunciado:
          "Escreva a sequência de comandos para acrescentar a coluna cpf, obrigatória e única, à tabela cliente que já tem 5.000 linhas.",
        dica: "Obrigatória e única exigem cuidados diferentes.",
        resolucao:
          "Não é possível acrescentar de uma vez, e o UNIQUE traz uma dificuldade que o NOT NULL não tem: não existe valor de preenchimento genérico, porque preencher todas as linhas com o mesmo texto violaria a unicidade. A sequência é:\n```sql\n-- 1. acrescenta permitindo nulo (UNIQUE aceita vários nulos)\nALTER TABLE cliente ADD COLUMN cpf CHAR(11);\n\n-- 2. já declara a unicidade: nulos não conflitam entre si\nALTER TABLE cliente ADD CONSTRAINT uq_cliente_cpf UNIQUE (cpf);\n\n-- 3. preenche as 5.000 linhas com os CPFs reais\n--    (carga a partir de outra fonte; não há valor genérico possível)\n\n-- 4. só depois de tudo preenchido\nALTER TABLE cliente ALTER COLUMN cpf SET NOT NULL;\n```\nO ponto que costuma ser esquecido é o passo 3: ele não é um comando, é um projeto. Enquanto ele não termina, o passo 4 falha, e o esquema fica num estado intermediário em que a aplicação precisa tolerar cpf nulo. Por isso essa alteração se planeja com a área de negócio antes de tocar no banco.",
        resposta:
          "ADD COLUMN cpf CHAR(11) nulo; ADD CONSTRAINT UNIQUE (nulos não conflitam); carregar os CPFs reais de uma fonte externa; e só então SET NOT NULL.",
      },
      {
        id: "bd-a14-e4",
        nivel: "desafio",
        enunciado:
          "Discuta: até que ponto regras de negócio devem ser declaradas como CHECK no banco, em vez de ficarem na aplicação?",
        dica: "Compare uma regra estável com uma que muda a cada trimestre.",
        resolucao:
          "O critério decisivo é a estabilidade da regra, e não sua natureza. Regras que decorrem do significado do dado — quantidade positiva, percentual entre 0 e 100, data de fim posterior à de início, situação dentro de um conjunto fechado — praticamente não mudam ao longo da vida do sistema, e declará-las como CHECK dá três ganhos: valem para todos os caminhos de escrita, inclusive importações e correções manuais; são verificadas dentro da transação, sem janela de concorrência; e documentam o domínio no próprio esquema, onde quem chega depois vai olhar. Regras voláteis são o caso oposto. Um CHECK que fixa o desconto máximo em 30% precisa de ALTER TABLE toda vez que a diretoria mudar a política, e ALTER TABLE em produção é evento planejado, não configuração — a regra estaria codificada no lugar mais caro de alterar. Pior: regras assim costumam ter exceções (desconto maior mediante aprovação), e um CHECK não sabe de aprovações. Essas pertencem à aplicação, ou a uma tabela de parâmetros. Há ainda um terceiro grupo que não cabe em CHECK por limitação técnica: regras que dependem de outras tabelas ou do estado anterior — \"o total do pedido não pode exceder o limite de crédito do cliente\" envolve consulta a outra tabela, algo que CHECK não faz de forma confiável em nenhum SGBD. Essas exigem gatilho ou lógica de aplicação dentro de transação. A síntese prática: declare no banco o que é invariante do dado, deixe na aplicação o que é política de negócio, e reconheça que regras entre tabelas são um terceiro caso, que nenhum dos dois resolve sozinho.",
        resposta:
          "Declare como CHECK o que é invariante do dado (quantidade positiva, percentual 0–100, domínio fechado): vale para todo caminho de escrita e documenta o esquema. Deixe na aplicação as políticas voláteis e as que admitem exceção. Regras que dependem de outras tabelas não cabem em CHECK e exigem gatilho ou transação.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "CREATE TABLE declara colunas, tipos e restrições; ALTER TABLE altera; DROP TABLE remove.",
        "Nomear restrições com CONSTRAINT faz a mensagem de erro do SGBD ser legível.",
        "NUMERIC para dinheiro; FLOAT nunca.",
        "Acrescentar coluna NOT NULL a tabela com dados exige três passos.",
      ],
      checklist: [
        "Sei escrever um CREATE TABLE com PK, FK, CHECK, DEFAULT e UNIQUE.",
        "Sei acrescentar coluna obrigatória a uma tabela populada.",
        "Sei justificar NUMERIC em vez de FLOAT.",
        "Sei decidir qual regra vai para CHECK e qual fica na aplicação.",
      ],
      palavrasChave: ["DDL", "CREATE TABLE", "ALTER TABLE", "CHECK", "NUMERIC", "CONSTRAINT"],
      pontosRevisao: [
        "Por que ADD COLUMN NOT NULL falha em tabela com linhas.",
        "O critério de estabilidade para decidir onde a regra de negócio mora.",
      ],
    },
  },
]
