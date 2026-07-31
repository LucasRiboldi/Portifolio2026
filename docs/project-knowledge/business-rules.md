# Regras de negócio

---

## 1. Publicação de conteúdo

- **`published` controla a visibilidade pública.** O site lê apenas publicados;
  o painel enxerga tudo.
- **`sort` define a ordem manual.** Menor primeiro. Novos itens vindos do sync
  entram no **fim da fila** (`maiorSort + 1`), para não bagunçar a ordem
  arrumada no painel.
- **Um único projeto em destaque.** A home renderiza um só `featured`. Ao
  inserir um projeto destacado pelo sync, os demais são desmarcados
  automaticamente, e o entrante vai para o topo (`sort: -1`).

## 2. Seed e sincronização

Duas operações distintas, com garantias diferentes:

| | `db:seed` | `db:sync` |
|---|---|---|
| Quando age | só em coleção **vazia** | em coleção já povoada |
| O que faz | popula tudo | insere **só o que falta** |
| Atualiza existente? | não | **nunca** |
| Apaga? | não | nunca |

**A garantia que importa:** conteúdo editado no painel é intocável. O código em
`src/data/*` é a semente histórica, não a fonte de verdade corrente — depois do
primeiro seed, quem manda é o painel.

O sync isola falhas por coleção: **uma coleção quebrada não cala as outras
quinze.** Isso existe porque já aconteceu o contrário — uma tabela ausente
abortava a publicação inteira, e o que já tinha sido gravado ficava invisível
porque o cache só era revalidado no fim.

## 3. Os três realms

O visitante escolhe (ou é levado a) um dos três multiversos. O realm padrão e
quais estão habilitados vêm da coleção `realms`, editável no painel.

| Realm | Rota | Natureza |
|---|---|---|
| `creative` (padrão) | `/criativo` | acervo pessoal: arte, quadrinhos, filmes, música, vídeos, mural, tirinhas |
| `developer` | `/desenvolvedor` | devlogs, ideias, snippets, wiki, laboratório, acervo técnico |
| `arcane` | `/anfitriao` | jornal impresso (Daily Prophet) com matérias e notícias |

Desabilitar um realm o tira da navegação; a rota continua existindo.

## 4. O jornal (realm arcane)

- **Matérias** (`prophet_materias`) têm estrutura editorial rica: caderno,
  chapéu, manchete, olho, linha fina, assinatura, capitular, blocos, boxes com
  tabelas, remissões e colofão.
- **Página em branco não é estado vazio legítimo.** Se o banco falhar ou vier
  vazio, a folha cai no seed — jornal sem matéria é defeito, não conteúdo.
- **O cupom de contato** é o formulário público do jornal. Grava em
  `contact_messages`, a mesma caixa de entrada do `/admin/messages`, para não
  existirem dois lugares a conferir.
  - Validação inteira no servidor: o cliente é conselho, o servidor é lei.
  - Tetos de tamanho impedem que o campo de recado vire depósito.
  - Há uma armadilha anti-bot (`fecho`): preenchida, agradece e **não grava**.

## 5. Prophet Wire (agregador)

Pipeline diário que coleta notícias de board games, analisa com IA, deduplica e
publica.

- **Deduplicação por hash de conteúdo**, não por URL — a mesma notícia em
  fontes diferentes é uma só.
- **`status`**: `rascunho` (fila do painel) ou `publicado` (visível na landing).
  A landing **nunca** enxerga rascunho.
- **O gatilho falha fechada:** sem `CRON_SECRET` configurado, o endpoint recusa
  tudo. Nunca fica aberto por omissão.
- **Histórico de execuções** (`prophet_wire_runs`) guarda contadores e apenas as
  entradas de nível `error`/`warn`, para o painel não carregar o log inteiro.

## 6. Mídia

- Formatos aceitos verificados por **magic bytes**, não pela extensão nem pelo
  `Content-Type` declarado pelo browser.
- Teto de **5 MB**, checado antes de ler o corpo na memória.
- Nome de objeto gerado pelo servidor; nomes com caminho são recusados.
- Todo acesso passa por Server Action com `requireAdmin()`. Nenhum token de
  escrita chega ao browser.

## 7. Conteúdo estático que não é editável

Nem tudo vem do banco, e é proposital:

- **Acervo técnico do realm dev** (estante, Java, padrões) mora em
  `src/data/dev/*` — é material de referência versionado, revisado por commit.
- **A playlist** é lida do filesystem (`fs`), não do banco: a pasta é a
  interface de edição desejada.
- **O design system** é código.
