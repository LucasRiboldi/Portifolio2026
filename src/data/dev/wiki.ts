/**
 * Wiki — a base de conhecimento do laboratório.
 *
 * O que entra aqui é o que eu precisaria reler daqui a seis meses: decisões de
 * arquitetura com a razão junto, armadilhas que já custaram tempo, e as
 * convenções que mantêm o sistema previsível. Documento que só descreve o
 * óbvio não entra — o código já descreve.
 *
 * `category` agrupa a listagem; `slug` é a URL.
 */

export interface WikiDoc {
  slug: string
  title: string
  category: string
  /** Markdown. */
  body: string
}

export const wikiDocs: WikiDoc[] = [
  {
    slug: "arquitetura-tres-realms",
    title: "Arquitetura: três realms, uma base",
    category: "Arquitetura",
    body: `O site hospeda três ambientes com identidades visuais incompatíveis entre si. A infraestrutura é compartilhada; a estética, nunca.

## A regra raiz

Cada realm escopa o próprio CSS numa classe única aplicada no layout do segmento:

| Realm | Escopo | Folha |
|---|---|---|
| Desenvolvedor | \`.dracula\` | \`dracula.css\` + \`dev-tokens\` + \`dev-hud\` |
| Anfitrião (jornal) | \`.dp\` | \`dp-original.css\` |
| Criativo (quadrinhos) | \`.sv\` | \`spiderverse.css\` |

Nada de estilo global além do reset. Um seletor sem escopo é um bug de vazamento esperando o próximo realm.

## Consequência prática

Um token só pode ser consumido dentro do escopo que o declara. Isso é chato de propósito: impede que a paleta do jornal apareça no laboratório porque alguém reaproveitou uma classe.

## Por que não três aplicações

Foi considerado. Três deploys resolveriam o isolamento de graça, mas triplicariam a infraestrutura para um problema que uma classe raiz resolve. O acoplamento real entre os realms é o banco e a autenticação, e esses valem compartilhar.`,
  },
  {
    slug: "publicar-conteudo",
    title: "Como o conteúdo chega em produção",
    category: "Operação",
    body: `Editar \`src/data/*\` **não publica nada**. Este é o mal-entendido que mais custou tempo no projeto, então está documentado antes de qualquer outra coisa.

## O desenho

\`src/data/*\` é a fonte de verdade **histórica e versionada**. O Supabase é a fonte de **leitura em produção**. As duas só conversam quando você manda.

## Os dois botões do /admin

**Seed** — popula tabelas vazias. Idempotente e inofensivo, mas inútil depois da primeira vez: \`seedIfEmpty\` verifica a contagem e desiste se houver qualquer linha.

**Publicar conteúdo novo do código** — o sync incremental. Compara por chave natural (título, nome ou slug), insere só o que falta e **nunca atualiza nem apaga**. É o que você usa no dia a dia.

## A armadilha

Corrigir um texto em \`src/data/\` e clicar em publicar **não muda o texto em produção** — a chave natural já existe, então o registro é considerado presente e é pulado. Correção de conteúdo existente se faz pelo painel, no registro.

## Ordem de operação

1. Acrescente o registro em \`src/data/\`
2. Commit (o histórico importa: é a versão auditável)
3. \`/admin\` → Publicar conteúdo novo do código
4. Confira o relatório: ele lista, por tabela, o que entrou`,
  },
  {
    slug: "convencoes-css",
    title: "Convenções de CSS e tokens",
    category: "Convenções",
    body: `## Camadas

Cada realm tem até três folhas, nesta ordem de importação:

1. **Paleta e catálogo** — as cores cruas e as classes de componente. É o que o guia de design system documenta pelo nome, então **classe aqui não se renomeia nem se remove**.
2. **Tokens semânticos** — o que cada cor significa (\`--dev-surface-1\`, \`--dev-danger\`), mais escalas de espaço, tipo, raio e movimento.
3. **Camada de aplicação** — arranjos compostos e acessibilidade.

## A regra que tem teste

Nenhum token semântico inventa cor. Todos derivam da paleta com \`var(--d-*)\`. Há teste que lê o arquivo e falha se aparecer um literal cromático.

## Nomenclatura

- \`--dev-*\` — semântico, consumível
- \`--d-*\` — paleta crua, só para derivar
- \`.dv-*\` — componente do realm dev
- \`data-*\` para estado visual (\`data-active\`, \`data-on\`), **sempre** com o atributo ARIA correspondente ao lado

Esse último ponto virou regra depois que todos os filtros do realm passaram meses expondo estado só por cor.

## Espaçamento

Sete degraus, base 4px, de \`--dev-space-1\` a \`--dev-space-7\`. Valor solto em \`style={{}}\` não passa em revisão — foi assim que o ritmo vertical divergiu entre páginas da primeira vez.`,
  },
  {
    slug: "erros-conhecidos",
    title: "Erros conhecidos e como reconhecê-los",
    category: "Troubleshooting",
    body: `Catálogo de falhas que já aconteceram neste projeto, com o sintoma primeiro — porque é pelo sintoma que você chega aqui.

## "Carregando..." que nunca termina

**Sintoma:** páginas SSR grandes presas no fallback, só em produção.
**Causa:** \`app/loading.tsx\` na raiz criando limite de Suspense no topo da árvore, empurrando a renderização para o cliente.
**Correção:** declare loading por rota, não na raiz.

## Editei o conteúdo e o site não mudou

**Sintoma:** texto corrigido em \`src/data/\`, publicado, e o site mostra o antigo.
**Causa:** o sync só **insere o que falta**; a chave já existe.
**Correção:** edite pelo /admin. Ver [publicar-conteudo].

## O foil da carta sumiu

**Sintoma:** carta perde o brilho holográfico sem erro no console.
**Causa:** o efeito é derivado do nome do arquivo da face. Trocar a extensão desliga em silêncio.
**Correção:** rode \`optimize-cards.mjs\` e os testes antes de commitar carta nova.

## O último quadro da tira estica

**Sintoma:** tira com número ímpar de painéis quebra a ordem de leitura.
**Causa:** gabarito fixo assumindo contagem par.
**Correção:** corrigido em \`comic-layout.ts\`; se voltar, o teste de diagramação é o primeiro lugar a olhar.

## CLS alto só numa página

**Sintoma:** Core Web Vitals reprova uma rota específica.
**Causa provável:** elemento cuja altura só é conhecida depois da hidratação.
**Correção:** reserve a altura no CSS. Já aconteceu com a face-título do jornal e com as capas de projeto.`,
  },
  {
    slug: "checklist-de-revisao",
    title: "Checklist de revisão antes do commit",
    category: "Convenções",
    body: `Roteiro curto. Se algum item falhar, o commit espera.

## Sempre

- [ ] \`npm run test:unit\` passa
- [ ] \`npx tsc --noEmit\` limpo
- [ ] \`npm run lint\` sem erro novo
- [ ] \`npm run build\` conclui

## Se mexeu em CSS

- [ ] Nenhuma classe do catálogo foi renomeada ou removida (o guia documenta pelo nome)
- [ ] Nenhum valor de espaçamento solto — veio da escala
- [ ] Testado em 320px e em uma tela larga: sem transbordo horizontal
- [ ] Elemento interativo novo tem foco visível

## Se mexeu em componente interativo

- [ ] Botão tem \`type\`
- [ ] Estado visual tem o ARIA correspondente
- [ ] Contagem que muda por interação tem \`aria-live\`
- [ ] Ícone decorativo tem \`aria-hidden\`; ícone informativo tem nome acessível

## Se acrescentou conteúdo

- [ ] Entrou em \`src/data/\`, não direto no banco
- [ ] Nenhum título repetido (a chave do sync é natural — título duplicado é registro perdido)

## Se mexeu em imagem

- [ ] Dimensão ou \`aspect-ratio\` declarado
- [ ] \`loading="lazy"\` fora da dobra`,
  },
  {
    slug: "adr-001-conteudo-no-banco",
    title: "ADR 001 — Conteúdo no banco, não no repositório",
    category: "Decisões",
    body: `**Status:** aceito · **Data:** 2026-02-11 · **Substitui:** publicação por deploy

## Contexto

Todo o conteúdo vivia em arrays TypeScript. Publicar um projeto exigia editar, commitar, esperar o build e torcer. Conteúdo estava acoplado a release, o que é errado: são ciclos diferentes, com riscos diferentes.

## Decisão

Supabase como fonte de leitura em produção. \`src/data/*\` permanece como fonte histórica versionada, e um sync incremental leva o que falta de um para o outro.

## Alternativas descartadas

**CMS headless de terceiro** — resolveria mais rápido, mas acrescenta um serviço externo, um contrato de API e um custo mensal a um site que já tem banco.

**Markdown no repositório** — mantém o versionamento, mas não resolve o acoplamento com o deploy, que era o problema real.

## Consequências

Positivas: publicar deixou de exigir build; o painel permite corrigir texto na hora.

Negativas — e a principal foi subestimada: passaram a existir **duas** fontes de verdade, e a regra de precedência não é óbvia para quem chega. Mitigado por [publicar-conteudo] e por um aviso no painel.`,
  },
  {
    slug: "adr-002-camada-aditiva",
    title: "ADR 002 — Refatorar por camada aditiva",
    category: "Decisões",
    body: `**Status:** aceito · **Data:** 2026-07-29

## Contexto

A folha do realm dev precisava de arquitetura: 786 linhas misturando paleta, layout, componentes e feature. Mas o guia de design system **documenta as classes e os tokens pelo nome** — renomear qualquer um quebraria o guia sem erro de compilação.

## Decisão

Refatoração estritamente aditiva. Camadas novas por cima; nenhuma classe existente renomeada, removida ou alterada visualmente.

## Alternativas descartadas

**Renomear e atualizar o guia junto** — mais limpo no fim, mas o guia tem componentes de demonstração que reproduzem a marcação real. O acoplamento é largo e a chance de quebra silenciosa, alta.

**Deixar como está** — a folha era mantível, só cara. Custo crescente, não bloqueante. Descartado porque o custo já estava aparecendo em cada mudança de ritmo vertical.

## Consequências

Convivem uma camada crua e uma semântica, o que é redundância aparente. Aceitável: a crua é a identidade documentada, a semântica é o contrato de uso. O teste que exige derivação impede que divirjam.`,
  },
  {
    slug: "roadmap",
    title: "Roadmap",
    category: "Planejamento",
    body: `Ordenado por desbloqueio, não por vontade. Item que destrava outros vem primeiro.

## Em andamento

**Prophet Wire — persistência (Parte 10)**
O agregador funciona, mas o histórico de execuções vive em memória e morre a cada deploy. Destrava seis pendências de uma vez: deduplicação entre execuções, retomada após falha, painel com janela real, métricas, alerta de fonte morta e agendamento.

## Próximo

**Realm arcane — Game Design**
O terceiro universo existe como rota e identidade, não como conteúdo. É o maior buraco do ecossistema.

**Páginas internas do jornal**
As matérias do Anfitrião abrem só na folha. Falta a leitura longa com a diagramação de página interna.

## Depois

**Molduras SVG paramétricas** — arquivado no laboratório à espera de uma simplificação do traçado; o custo de path inviabilizou a primeira tentativa.

**Busca no acervo técnico** — só faz sentido depois que a wiki tiver massa suficiente para ser difícil de navegar.

## Não vai acontecer

**Comentários** — moderação é trabalho contínuo que não quero.
**Newsletter** — o Wire já cobre a distribuição, e não quero gerir lista de e-mails.`,
  },
]
