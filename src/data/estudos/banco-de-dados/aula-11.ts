import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aula 11.
 *
 * Unidade "Modelo Relacional": conceitos básicos, regras de integridade e a
 * transformação do diagrama E-R em tabelas.
 */
export const AULA_11: Aula[] = [
  {
    numero: 11,
    assunto: "Transformação de diagramas E-R para o modelo relacional",
    unidade: "Modelo Relacional",
    conteudo: {
      resumo:
        "As regras mecânicas que convertem entidades, relacionamentos, atributos multivalorados, entidades fracas e hierarquias em tabelas.",
      explicacaoSimples:
        "Esta é a etapa em que o desenho vira banco. E a boa notícia é que ela é quase toda mecânica: existe uma regra para cada construção do diagrama, e seguir as regras produz o esquema relacional. As decisões difíceis já foram tomadas na modelagem conceitual — aqui só se aplica o que ficou decidido.",
      explicacaoTecnica:
        "As regras de transformação, na ordem em que convém aplicá-las: toda entidade vira uma relação, com seu identificador como chave primária. Atributo composto é substituído por suas partes, ou mantido como um único atributo se o negócio nunca consultar as partes isoladamente. Atributo multivalorado vira uma relação própria, cuja chave é o par (chave da entidade, valor). Relacionamento 1:N gera uma chave estrangeira na relação do lado N, apontando para o lado 1; a cardinalidade mínima do lado N determina se essa coluna é NOT NULL. Relacionamento N:N gera obrigatoriamente uma relação própria, cuja chave primária é a combinação das chaves das duas entidades, e que hospeda os atributos do relacionamento. Relacionamento 1:1 admite três tratamentos: fundir as duas entidades numa relação quando a participação é total dos dois lados, ou colocar a chave estrangeira no lado de participação total — nunca no lado opcional, para não produzir coluna majoritariamente nula. Entidade fraca vira relação cuja chave primária combina a chave da proprietária com o identificador parcial. Hierarquia de generalização admite as três estratégias já vistas.",
      aplicacoes: [
        "A regra do 1:N é a mais usada de todas: praticamente todo sistema é feito de tabelas ligadas por chave estrangeira no lado N.",
        "Reconhecer que um N:N precisa de tabela associativa é o que evita a gambiarra de colunas produto1, produto2, produto3.",
        "A regra do 1:1 explica por que colocar a chave estrangeira no lado errado enche a tabela de nulos.",
      ],
      curiosidades: [
        "As regras são determinísticas o bastante para as ferramentas as aplicarem sozinhas — mas a escolha entre as três opções do 1:1 e as três da hierarquia continua sendo humana, e é aí que as ferramentas pedem confirmação.",
        "Um relacionamento ternário sempre vira tabela própria com três chaves estrangeiras, independentemente das cardinalidades — é a razão de ternários produzirem esquemas difíceis de consultar.",
      ],
      conceitos: [
        {
          termo: "Regra da entidade",
          definicao: "Toda entidade vira uma relação; seu identificador vira a chave primária.",
        },
        {
          termo: "Regra do 1:N",
          definicao:
            "Chave estrangeira no lado N, apontando para o lado 1. Nunca o contrário.",
        },
        {
          termo: "Regra do N:N",
          definicao:
            "Relação própria (associativa) com chave composta pelas chaves das duas entidades, hospedando os atributos do relacionamento.",
        },
        {
          termo: "Regra do multivalorado",
          definicao:
            "Vira relação própria com a chave da entidade mais o valor. É consequência direta da atomicidade.",
        },
        {
          termo: "Regra da entidade fraca",
          definicao:
            "Chave primária composta pela chave da proprietária mais o identificador parcial.",
        },
      ],
      exemplos: [
        {
          titulo: "Um modelo completo, convertido regra a regra",
          descricao:
            "Cinco construções diferentes num modelo só. Acompanhe qual regra produziu cada tabela.",
          linguagem: "text",
          codigo: `MODELO E-R
  Cliente (cpf, nome, {telefone})           <- multivalorado
  Pedido  (numero, data)
  Produto (codigo, descricao, preco)
  Cliente --(1,1)-- faz --(0,N)-- Pedido    <- 1:N
  Pedido  --contem[quantidade]-- Produto    <- N:N com atributo

ESQUEMA RELACIONAL RESULTANTE
  cliente(cpf, nome)
  telefone_cliente(cpf, numero)             <- regra do multivalorado
      PK (cpf, numero) / FK cpf -> cliente
  pedido(numero, data, cpf)                 <- regra do 1:N
      FK cpf -> cliente, NOT NULL
  produto(codigo, descricao, preco)
  item_pedido(numero, codigo, quantidade)   <- regra do N:N
      PK (numero, codigo)
      FK numero -> pedido / FK codigo -> produto`,
          linhas: [
            {
              trecho: "telefone_cliente(cpf, numero)",
              explicacao:
                "O multivalorado virou tabela. A chave é o par, porque o mesmo cliente não repete o mesmo número — e clientes diferentes podem ter números iguais.",
            },
            {
              trecho: "pedido(..., cpf) FK NOT NULL",
              explicacao:
                "A chave estrangeira foi para o lado N (pedido). O NOT NULL veio da cardinalidade mínima (1,1) do lado do cliente: todo pedido tem dono.",
            },
            {
              trecho: "item_pedido com quantidade",
              explicacao:
                "O N:N virou tabela, e o atributo do relacionamento encontrou seu lugar natural. Não havia onde colocar quantidade em pedido nem em produto.",
            },
          ],
        },
        {
          titulo: "O 1:1 e o lado certo da chave estrangeira",
          descricao:
            "A mesma regra, aplicada errado e certo. A diferença aparece no número de nulos.",
          linguagem: "sql",
          codigo: `-- Funcionario (0,1) -- gerencia -- (1,1) Departamento
-- Todo departamento tem gerente; nem todo funcionário gerencia.

-- ERRADO: FK no lado opcional
CREATE TABLE funcionario (
  id            INTEGER PRIMARY KEY,
  nome          VARCHAR(80),
  departamento_id INTEGER UNIQUE NULL   -- nulo em 95% das linhas
);

-- CERTO: FK no lado de participação total
CREATE TABLE departamento (
  id         INTEGER PRIMARY KEY,
  nome       VARCHAR(60),
  gerente_id INTEGER NOT NULL UNIQUE REFERENCES funcionario(id)
);`,
          linhas: [
            {
              trecho: "departamento_id ... NULL",
              explicacao:
                "Numa empresa com 500 funcionários e 20 departamentos, 480 linhas ficam nulas. A coluna existe para quase ninguém.",
            },
            {
              trecho: "gerente_id INTEGER NOT NULL UNIQUE",
              explicacao:
                "20 linhas, nenhuma nula. O NOT NULL implementa a participação total e o UNIQUE implementa a cardinalidade máxima 1 — os dois juntos é que fazem o 1:1.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a11-e1",
        nivel: "basico",
        enunciado:
          "Converta: Departamento (1,1) — possui — (0,N) Funcionario, com Departamento(codigo, nome) e Funcionario(matricula, nome).",
        dica: "É 1:N. De que lado vai a chave estrangeira?",
        resolucao:
          "É um relacionamento 1:N, com o lado N em Funcionario. Pela regra do 1:N, a chave estrangeira vai na relação do lado N. Resultado: departamento(codigo, nome) e funcionario(matricula, nome, codigo_departamento), com codigo_departamento sendo chave estrangeira para departamento(codigo). Como a cardinalidade mínima do lado do funcionário indica que todo funcionário pertence a um departamento, a coluna é NOT NULL.",
        resposta:
          "departamento(codigo, nome); funcionario(matricula, nome, codigo_departamento NOT NULL → departamento).",
      },
      {
        id: "bd-a11-e2",
        nivel: "intermediario",
        enunciado:
          "Converta um N:N entre Medico e Paciente com atributos data e diagnostico do relacionamento. Qual a chave primária da tabela gerada?",
        dica: "Cuidado: o par (medico, paciente) basta como chave?",
        resolucao:
          "O N:N gera uma relação própria: consulta(crm, cpf_paciente, data, diagnostico), com crm referenciando medico e cpf_paciente referenciando paciente. A chave primária, porém, não pode ser apenas (crm, cpf_paciente): isso impediria que o mesmo médico atendesse o mesmo paciente mais de uma vez, o que é irreal. A data precisa entrar na chave, resultando em (crm, cpf_paciente, data). Se houver mais de uma consulta no mesmo dia, nem isso basta, e o caminho é reconhecer que Consulta é uma entidade com identidade própria e dar-lhe uma chave artificial (id), mantendo as duas chaves estrangeiras como colunas comuns. Esse é o sinal, visto na aula 5, de que o relacionamento quer ser entidade.",
        resposta:
          "consulta(crm, cpf_paciente, data, diagnostico) com PK (crm, cpf_paciente, data) — e, se houver mais de uma no mesmo dia, promover Consulta a entidade com id próprio.",
      },
      {
        id: "bd-a11-e3",
        nivel: "avancado",
        enunciado:
          "Converta a entidade fraca Dependente (identificador parcial: nome) da proprietária Funcionario(matricula). Escreva o CREATE TABLE.",
        dica: "A chave da proprietária entra na chave da fraca.",
        resolucao:
          "A chave primária da entidade fraca combina a chave da proprietária com o identificador parcial: (matricula, nome). A chave estrangeira para funcionario deve ter ON DELETE CASCADE, porque a dependência é existencial — dependente sem funcionário não significa nada.\n```sql\nCREATE TABLE dependente (\n  matricula       INTEGER     NOT NULL,\n  nome            VARCHAR(80) NOT NULL,\n  data_nascimento DATE,\n  parentesco      VARCHAR(30),\n  PRIMARY KEY (matricula, nome),\n  FOREIGN KEY (matricula) REFERENCES funcionario(matricula)\n    ON DELETE CASCADE\n);\n```\nRepare que matricula desempenha dois papéis ao mesmo tempo: é parte da chave primária e é chave estrangeira. É exatamente isso que caracteriza a tradução de uma entidade fraca.",
        resposta:
          "PK composta (matricula, nome), com matricula sendo também FK para funcionario e ON DELETE CASCADE pela dependência existencial.",
      },
      {
        id: "bd-a11-e4",
        nivel: "desafio",
        enunciado:
          "Um relacionamento ternário liga Fornecedor, Produto e Projeto, registrando a quantidade fornecida. Converta e explique por que ele não pode ser decomposto em três binários.",
        dica: "Tente decompor e veja qual informação some.",
        resolucao:
          "A conversão é direta: um relacionamento ternário sempre vira uma relação própria com as chaves das três entidades. Resulta fornecimento(cnpj_fornecedor, codigo_produto, id_projeto, quantidade), com chave primária composta pelas três colunas e três chaves estrangeiras. Quanto à decomposição, a tentativa produziria três tabelas binárias: fornecedor_produto (quem fornece o quê), produto_projeto (o que vai para qual projeto) e fornecedor_projeto (quem atende qual projeto). O problema é que essas três tabelas juntas não conseguem reconstruir o fato original. Suponha que o fornecedor A forneça parafusos e porcas, que o projeto X use parafusos e porcas, e que A atenda X e Y. As três binárias ficam satisfeitas, mas não há como distinguir se A forneceu parafusos para X e porcas para Y, ou parafusos para Y e porcas para X, ou tudo para os dois. A informação que se perde é justamente a associação simultânea das três pontas, que é a única coisa que o ternário afirma. Há ainda um segundo problema: a quantidade é atributo da combinação dos três, e nas binárias não haveria onde colocá-la sem repeti-la ou perdê-la. A regra prática que fica: um ternário só é decomponível quando a associação das três pontas for consequência das associações duas a duas — o que é raro, e precisa ser verificado caso a caso, não presumido.",
        resposta:
          "fornecimento(cnpj_fornecedor, codigo_produto, id_projeto, quantidade) com PK tripla. Não decompõe porque as três binárias não distinguem qual produto foi de qual fornecedor para qual projeto, e não há onde alojar a quantidade.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "Entidade vira relação; identificador vira chave primária.",
        "1:N gera chave estrangeira no lado N; N:N gera tabela associativa obrigatoriamente.",
        "Atributo multivalorado e entidade fraca viram relações próprias.",
        "No 1:1, a chave estrangeira vai no lado de participação total.",
      ],
      checklist: [
        "Sei converter um modelo E-R completo em esquema relacional.",
        "Sei dizer de que lado fica a chave estrangeira num 1:N e num 1:1.",
        "Sei montar a chave primária de uma tabela associativa e de uma entidade fraca.",
        "Sei justificar por que um ternário normalmente não se decompõe.",
      ],
      palavrasChave: [
        "regras de transformação",
        "tabela associativa",
        "chave composta",
        "entidade fraca",
        "modelo lógico",
      ],
      pontosRevisao: [
        "Por que a chave estrangeira do 1:1 no lado errado enche a tabela de nulos.",
        "Que informação se perde ao decompor um ternário em binários.",
      ],
    },
  },
]
