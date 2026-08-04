import type { Aula } from "../tipos"

/**
 * BANCO DE DADOS — aula 8.
 *
 * Fecha a unidade "Modelo Entidade-Relacionamento (E-R)": cardinalidade e
 * restrições, mecanismos de abstração e o uso de uma ferramenta de modelagem.
 */
export const AULA_08: Aula[] = [
  {
    numero: 8,
    assunto: "Uso de uma ferramenta de modelagem",
    unidade: "Modelo Entidade-Relacionamento (E-R)",
    conteudo: {
      resumo:
        "O que uma ferramenta de modelagem faz por você, o que ela não faz, e o fluxo de trabalho entre modelo conceitual, modelo lógico e script SQL.",
      explicacaoSimples:
        "A ferramenta de modelagem desenha o diagrama, verifica se ele é coerente e gera o script SQL que cria as tabelas. O que ela não faz — e isto é o mais importante — é dizer se o modelo está certo. Ela garante que o desenho é válido; se ele representa o negócio corretamente, só quem conhece o negócio sabe.",
      explicacaoTecnica:
        "Uma ferramenta de modelagem opera em pelo menos dois níveis: o modelo conceitual (entidades e relacionamentos) e o modelo lógico (tabelas, colunas, chaves), com uma função de conversão entre eles que aplica as regras de transformação. A partir do lógico, gera o DDL para o SGBD escolhido — e é aqui que o modelo deixa de ser independente de tecnologia. As ferramentas costumam oferecer também engenharia reversa: ler um banco existente e reconstruir o diagrama a partir do catálogo, o que é o caminho usual para documentar um sistema legado. Ferramentas comuns no ensino brasileiro incluem o brModelo, desenvolvido especificamente para a notação de Chen e para o método de Heuser, e o MySQL Workbench, que trabalha diretamente no nível lógico com notação pé de galinha. O ponto de atenção do fluxo é a sincronização: uma vez gerado o banco, alterações feitas direto no SGBD não voltam para o modelo, e o diagrama envelhece até virar ficção.",
      aplicacoes: [
        "Engenharia reversa é a primeira coisa a fazer ao herdar um sistema sem documentação — em minutos se tem o mapa que ninguém escreveu.",
        "Gerar o DDL a partir do modelo elimina erros de digitação em dezenas de CREATE TABLE e garante que toda chave estrangeira declarada no modelo exista no banco.",
        "Versionar o arquivo do modelo junto com o código é o que impede que o diagrama e o banco divirjam sem que ninguém perceba.",
      ],
      curiosidades: [
        "O brModelo foi criado como trabalho de conclusão de curso por Carlos Henrique Cândido, orientado por Ronaldo dos Santos Mello, e é usado até hoje em boa parte dos cursos de computação do Brasil.",
        "A maioria das ferramentas gera DDL diferente para cada SGBD a partir do mesmo modelo lógico — é a independência de tecnologia sendo exercida no último momento possível.",
      ],
      conceitos: [
        {
          termo: "Modelo conceitual (na ferramenta)",
          definicao:
            "O diagrama E-R propriamente dito: entidades, atributos, relacionamentos e cardinalidades, sem tabelas.",
        },
        {
          termo: "Modelo lógico",
          definicao:
            "O resultado da conversão: tabelas, colunas, chaves primárias e estrangeiras, já no vocabulário do modelo relacional.",
        },
        {
          termo: "Engenharia reversa",
          definicao:
            "Ler um banco existente e reconstruir o diagrama a partir do catálogo do SGBD.",
        },
        {
          termo: "Forward engineering",
          definicao: "O caminho normal: gerar o script DDL a partir do modelo.",
        },
        {
          termo: "Sincronização",
          definicao:
            "Comparar modelo e banco e reconciliar as diferenças. Sem ela, o diagrama vira documentação falsa.",
        },
      ],
      exemplos: [
        {
          titulo: "O fluxo completo, do desenho ao banco",
          descricao:
            "Cada seta é uma operação da ferramenta. Repare em qual delas o modelo perde a independência de SGBD.",
          linguagem: "text",
          codigo: `  [ Entrevista ]
        |
        v
  [ MODELO CONCEITUAL ]      entidades, relacionamentos, cardinalidades
        |                    independente de SGBD
        |  conversão (regras de transformação)
        v
  [ MODELO LÓGICO ]          tabelas, colunas, PK, FK
        |                    ainda independente de SGBD
        |  geração de DDL  <-- AQUI escolhe-se o SGBD
        v
  [ SCRIPT SQL ]             CREATE TABLE ... específico do produto
        |
        v
  [ BANCO DE DADOS ]
        |
        |  engenharia reversa (caminho de volta, para legado)
        v
  [ MODELO LÓGICO reconstruído ]`,
          linhas: [
            {
              trecho: "conversão",
              explicacao:
                "Aplica as regras de transformação: 1:N vira chave estrangeira, N:N vira tabela associativa, atributo multivalorado vira tabela. É mecânico — por isso a ferramenta consegue fazê-lo.",
            },
            {
              trecho: "geração de DDL",
              explicacao:
                "O único ponto em que o SGBD é escolhido. Até aqui, o mesmo modelo serve para PostgreSQL, MySQL ou Oracle.",
            },
            {
              trecho: "engenharia reversa",
              explicacao:
                "Volta do banco para o modelo lógico — nunca para o conceitual. Generalizações e agregações não sobrevivem à ida, então não voltam.",
            },
          ],
        },
        {
          titulo: "O que a ferramenta pega e o que ela não pega",
          descricao:
            "A validação automática cobre a sintaxe do modelo. A semântica continua sendo responsabilidade humana.",
          linguagem: "text",
          codigo: `A FERRAMENTA ACUSA:
  - entidade sem identificador
  - relacionamento com uma ponta só
  - nome de tabela ou coluna duplicado
  - chave estrangeira apontando para tabela inexistente
  - tipo incompatível entre FK e a PK referenciada

A FERRAMENTA NÃO ACUSA:
  - cardinalidade errada (1:N onde o negócio exige N:N)
  - entidade que faltou no modelo
  - atributo no lugar errado (nota dentro de Aluno)
  - participação mínima invertida
  - o modelo inteiro descrever o negócio errado`,
          linhas: [
            {
              trecho: "entidade sem identificador",
              explicacao:
                "Erro estrutural: é verificável só olhando o modelo, sem saber nada do negócio. Por isso a máquina pega.",
            },
            {
              trecho: "cardinalidade errada",
              explicacao:
                "Um modelo com 1:N onde deveria haver N:N é perfeitamente válido do ponto de vista da notação. Só quem conhece o domínio percebe — e é por isso que a revisão com o usuário não tem substituto.",
            },
          ],
        },
      ],
    },
    exercicios: [
      {
        id: "bd-a8-e1",
        nivel: "basico",
        enunciado:
          "Cite três coisas que uma ferramenta de modelagem faz automaticamente e uma que ela não consegue fazer.",
        dica: "A que não consegue depende de conhecer o negócio.",
        resolucao:
          "Faz automaticamente: converter o modelo conceitual em lógico aplicando as regras de transformação; gerar o script DDL para o SGBD escolhido; validar a estrutura do modelo, acusando entidade sem identificador ou chave estrangeira órfã; e fazer engenharia reversa de um banco existente. Não consegue: dizer se o modelo representa corretamente o negócio — uma cardinalidade errada ou uma entidade esquecida produzem um modelo perfeitamente válido e completamente errado.",
        resposta:
          "Faz: conversão conceitual→lógico, geração de DDL, validação estrutural, engenharia reversa. Não faz: verificar se o modelo corresponde ao negócio.",
      },
      {
        id: "bd-a8-e2",
        nivel: "intermediario",
        enunciado:
          "Em que ponto do fluxo o modelo deixa de ser independente de SGBD? Explique a consequência prática.",
        dica: "Siga o diagrama até a última seta descendente.",
        resolucao:
          "Na geração do DDL. Até o modelo lógico, tudo é vocabulário do modelo relacional — tabelas, colunas, chaves — que vale para qualquer SGBD relacional. É na geração do script que se escolhe o produto, e aí entram tipos específicos (SERIAL do PostgreSQL contra AUTO_INCREMENT do MySQL), sintaxe de restrição e detalhes de armazenamento. A consequência prática é boa: como a dependência aparece só no último passo, migrar de SGBD não exige remodelar nada — basta gerar o DDL de novo escolhendo outro destino. É a independência de tecnologia sendo preservada até o momento em que deixar de preservá-la se torna inevitável.",
        resposta:
          "Na geração do DDL. Como é o último passo, trocar de SGBD não exige remodelar: basta regerar o script para o novo destino.",
      },
      {
        id: "bd-a8-e3",
        nivel: "avancado",
        enunciado:
          "Por que a engenharia reversa reconstrói o modelo lógico, mas não o conceitual?",
        dica: "O que existe no conceitual que não tem representação no banco?",
        resolucao:
          "Porque a conversão do conceitual para o lógico perde informação, e o que se perde não pode ser recuperado do banco. Uma generalização, por exemplo, vira tabelas ligadas por chave — mas uma tabela ligada a outra por chave compartilhada é indistinguível, no catálogo, de um relacionamento 1:1 comum; nada no banco diz \"isto era uma hierarquia\". Um relacionamento N:N vira tabela associativa, e no catálogo essa tabela é apenas mais uma tabela com duas chaves estrangeiras — pode ser um N:N traduzido ou uma entidade legítima do domínio. Um atributo multivalorado vira tabela, e no banco fica idêntico a uma entidade fraca. A engenharia reversa consegue reconstruir com fidelidade o que está declarado no catálogo — tabelas, colunas, tipos, chaves — porque isso é exatamente o modelo lógico. O conceitual exigiria adivinhar a intenção que produziu aquela estrutura, e várias intenções diferentes produzem a mesma estrutura. Na prática, ferramentas oferecem uma reconstrução conceitual aproximada, que serve de ponto de partida e precisa ser corrigida à mão por quem entende do domínio.",
        resposta:
          "Porque a conversão conceitual→lógico perde informação: generalização, N:N e atributo multivalorado produzem no banco estruturas indistinguíveis de outras coisas. Várias intenções geram o mesmo DDL, e o catálogo não guarda a intenção.",
      },
      {
        id: "bd-a8-e4",
        nivel: "desafio",
        enunciado:
          "Uma equipe gerou o banco a partir do modelo há um ano. Desde então, todas as alterações foram feitas direto no SGBD. Descreva os problemas e proponha um processo.",
        dica: "Qual dos dois artefatos é a verdade hoje?",
        resolucao:
          "O primeiro problema é que o modelo virou documentação falsa, que é pior do que não ter documentação: quem consulta o diagrama toma decisões com base numa estrutura que não existe mais, e não tem como saber disso. O segundo é que a decisão de projeto se perdeu — as alterações feitas direto no banco não têm registro de por que foram feitas, e um ano depois ninguém sabe se aquela coluna nova é essencial ou resquício de um experimento. O terceiro é que regerar o banco a partir do modelo tornou-se impossível sem destruir dados, o que na prática significa que ambientes novos (teste, homologação) não podem mais ser criados a partir do artefato oficial. Quanto ao processo, a primeira coisa é decidir qual artefato é a fonte da verdade, e para um banco em produção há um ano a resposta honesta é o banco. Portanto: fazer engenharia reversa para reconstruir o modelo lógico a partir do estado atual, revisá-lo à mão para reintroduzir o que a reversa não recupera, e versioná-lo junto com o código. Daí em diante, adotar migrations — arquivos de alteração versionados, aplicados em ordem, cada um com sua justificativa na mensagem de commit — de modo que a estrutura do banco passe a ter histórico e a ser reproduzível em qualquer ambiente. O modelo gráfico deixa de ser a fonte da verdade e passa a ser documentação gerada, atualizada por engenharia reversa a cada release, o que elimina a possibilidade de ele divergir de novo.",
        resposta:
          "O modelo virou documentação falsa, as decisões se perderam e não se cria mais ambiente novo a partir dele. Processo: reversa para reconstruir o modelo, adotar migrations versionadas como fonte da verdade, e regenerar o diagrama a cada release.",
      },
    ],
    resumo: {
      conceitosImportantes: [
        "A ferramenta converte conceitual → lógico → DDL, e o SGBD só é escolhido no último passo.",
        "Ela valida a estrutura do modelo, não a correspondência com o negócio.",
        "Engenharia reversa reconstrói o lógico, nunca o conceitual — a conversão perde informação.",
        "Sem sincronização, o modelo vira documentação falsa.",
      ],
      checklist: [
        "Sei descrever o fluxo do conceitual até o banco.",
        "Sei dizer o que a ferramenta acusa e o que não acusa.",
        "Sei explicar por que a reversa não recupera o conceitual.",
        "Sei propor um processo para modelo e banco não divergirem.",
      ],
      palavrasChave: [
        "brModelo",
        "modelo lógico",
        "engenharia reversa",
        "geração de DDL",
        "sincronização",
        "migrations",
      ],
      pontosRevisao: [
        "Por que documentação falsa é pior que documentação ausente.",
        "Quais construções do E-R não sobrevivem à tradução para tabelas.",
      ],
    },
  },
]
