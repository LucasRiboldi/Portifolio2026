import { createClient } from "@supabase/supabase-js"
const s = createClient(
  "https://rsonhpnrdcwarlwluwav.supabase.co",
  "sb_secret_ABnt93Sxr-wEMw24SpGj3A_A7ZfL9C1",
  { auth: { persistSession: false } },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function seed(t, data) {
  for (let attempt = 1; attempt <= 15; attempt++) {
    const head = await s.from(t).select("*", { count: "exact", head: true })
    if (!head.error && (head.count ?? 0) > 0) return console.log(t.padEnd(20), "já tem dados")
    if (!head.error) {
      const ins = await s.from(t).insert(data)
      if (!ins.error) return console.log(t.padEnd(20), "✓ " + data.length)
      if (!/schema cache/.test(ins.error.message)) return console.log(t.padEnd(20), "ERRO " + ins.error.message)
    }
    await sleep(5000)
  }
  console.log(t.padEnd(20), "✗ desistiu (cache não convergiu)")
}

await seed("devlogs", [
  { slug: "bootstrap-multiverso", title: "Bootstrapping o portfólio multiverso", date: "2026-07-10", summary: "Como nasceu a arquitetura de 3 realms sobre uma única base de código.", body: "## Contexto\nUm site, três universos.", tags: ["arquitetura", "next.js"], sort: 0 },
  { slug: "conteudo-para-supabase", title: "Migrando conteúdo estático para o Supabase", date: "2026-07-12", summary: "Do arquivo .ts ao Postgres com fallback e ISR on-demand.", body: "## Por quê\nEditar sem deploy.", tags: ["supabase", "isr"], sort: 1 },
  { slug: "tema-dracula-no-dev", title: "Tema Dracula no realm Dev", date: "2026-07-14", summary: "Recriei a paleta oficial do Dracula, escopada em .dracula.", body: "## Paleta\n#282a36, #bd93f9, #50fa7b.", tags: ["css", "dracula"], sort: 2 },
])
await seed("ideas", [
  { title: "CLI de exportação de tokens", description: "Exporta design tokens para W3C DTCG e Figma Tokens Studio.", status: "mvp", tags: ["cli", "tokens"], sort: 0 },
  { title: "Bot de resumo de PRs", description: "Resume diffs de PR do GitHub com badge de risco.", status: "building", tags: ["github", "ia"], sort: 1 },
  { title: "Extensão de captura de CSS", description: "Extrai propriedades CSS de qualquer elemento como tokens.", status: "idea", tags: ["chrome", "dx"], sort: 2 },
  { title: "Dashboard de métricas pessoais", description: "Agrega commits, foco e leituras num painel único.", status: "idea", tags: ["dataviz"], sort: 3 },
])
await seed("snippets", [
  { title: "useDebounce", language: "ts", description: "Hook de debounce tipado.", code: "export function useDebounce<T>(value: T, delay = 300) {\n  const [v, setV] = useState(value)\n  useEffect(() => {\n    const t = setTimeout(() => setV(value), delay)\n    return () => clearTimeout(t)\n  }, [value, delay])\n  return v\n}", tags: ["react", "hook"], sort: 0 },
  { title: "Fetcher tipado com Zod", language: "ts", description: "fetch + validação em runtime.", code: "export async function getJSON<T>(url: string, schema: ZodSchema<T>) {\n  const res = await fetch(url)\n  return schema.parse(await res.json())\n}", tags: ["zod"], sort: 1 },
  { title: "Botão com CVA", language: "tsx", description: "Variantes de botão com CVA.", code: "const button = cva('btn', {\n  variants: { intent: { primary: 'btn-primary', ghost: 'btn-ghost' } },\n})", tags: ["cva", "ui"], sort: 2 },
])
await seed("wiki", [
  { slug: "git-dia-a-dia", title: "Git: comandos do dia a dia", category: "Git", body: "- `git switch -c feat/x`\n- `git restore --staged .`", sort: 0 },
  { slug: "ts-utility-types", title: "TypeScript: utility types", category: "TypeScript", body: "`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`.", sort: 1 },
  { slug: "next-app-router", title: "Next.js App Router — cheatsheet", category: "Next.js", body: "Server Components por padrão.", sort: 2 },
  { slug: "supabase-rls", title: "Supabase RLS básico", category: "Supabase", body: "Habilite RLS, crie policies. Use `auth.jwt()`.", sort: 3 },
])
await seed("lab_experiments", [
  { title: "Playground de shaders", description: "Editor ao vivo de fragment shaders.", status: "wip", stack: ["webgl", "glsl"], repo_url: "https://github.com/LucasRiboldi", sort: 0 },
  { title: "Editor markdown com preview", description: "Protótipo de editor MD lado a lado.", status: "playtest", stack: ["react", "remark"], sort: 1 },
  { title: "IA local com Ollama", description: "Modelos locais para tarefas de código.", status: "wip", stack: ["ollama", "node"], sort: 2 },
])
await seed("prophet_tutorials", [
  { slug: "do-zero-ao-prototipo", title: "Do zero ao protótipo em uma tarde", summary: "De uma ideia solta a um protótipo jogável com papel e componentes genéricos.", body: "## Comece pelo verbo\nDefina o que o jogador FAZ antes do tema.", difficulty: "iniciante", tags: ["prototipagem"], sort: 0 },
  { slug: "balanceando-por-planilha", title: "Balanceando um jogo por planilha", summary: "Modele economias de recursos e curvas de custo antes do playtest.", body: "## Modele os custos\nCada carta é uma linha: custo, efeito, frequência.", difficulty: "intermediario", tags: ["balanceamento"], sort: 1 },
  { slug: "escrevendo-regras-claras", title: "Escrevendo regras que ninguém lê errado", summary: "Estrutura, exemplos e diagramas para um manual que ensina.", body: "## Ensine, não liste\nObjetivo → fluxo → exceções.", difficulty: "intermediario", tags: ["regras"], sort: 2 },
  { slug: "sua-primeira-carta", title: "Anatomia da sua primeira carta", summary: "O que cada área de uma carta comunica.", body: "## Hierarquia\ncusto → efeito → resto.", difficulty: "iniciante", tags: ["cartas"], sort: 3 },
])
await seed("prophet_mechanics", [
  { slug: "worker-placement", title: "Worker Placement", summary: "Alocação de trabalhadores em espaços limitados.", body: "Espaços ocupados bloqueiam rivais. A tensão vem da escassez.", tags: ["euro"], sort: 0 },
  { slug: "deck-building", title: "Deck Building", summary: "Construção do próprio baralho durante a partida.", body: "Comece fraco e compre cartas melhores.", tags: ["cartas"], sort: 1 },
  { slug: "draft", title: "Draft", summary: "Seleção alternada de opções de um pool.", body: "Pegue uma carta, passe o resto.", tags: ["seleção"], sort: 2 },
  { slug: "cooperacao", title: "Cooperação", summary: "Todos contra o jogo.", body: "O sistema é o adversário. Evite o 'jogador alfa'.", tags: ["coop"], sort: 3 },
  { slug: "push-your-luck", title: "Push Your Luck", summary: "A tensão de arriscar mais um dado.", body: "Cada passo aumenta ganho e risco.", tags: ["dados"], sort: 4 },
])
await seed("prophet_prototypes", [
  { title: "Mercadores de Âmbar", description: "Euro de rotas comerciais com worker placement.", status: "playtest", players: "2–4", playtime: "60 min", tags: ["euro"], sort: 0 },
  { title: "Cripta Cooperativa", description: "Dungeon crawler cooperativo com deck de ameaças.", status: "prototipo", players: "1–4", playtime: "45 min", tags: ["coop"], sort: 1 },
  { title: "Corrida Estelar", description: "Push your luck com dados customizados.", status: "conceito", players: "3–6", playtime: "30 min", tags: ["dados"], sort: 2 },
])
await seed("prophet_resources", [
  { title: "Kit Print & Play — Cartas em branco", description: "Folha A4 com gabaritos de cartas.", type: "pnp", file_url: null, sort: 0 },
  { title: "Template de cartas (frente/verso)", description: "Arquivo editável para diagramar cartas.", type: "cartas", file_url: null, sort: 1 },
  { title: "Folha de referência de regras", description: "Player aid de uma página.", type: "regras", file_url: null, sort: 2 },
])
await seed("prophet_about", [
  { id: "default", author: "Lucas Riboldi", intro: "Designer de jogos que transforma regras em rituais jogáveis.", passion: "Uma paixão antiga por jogos de tabuleiro, card games e RPG — e pela mágica de ver estranhos virarem rivais e amigos ao redor de uma mesa.", proposal: "Este jornal reúne tutoriais, mecânicas comentadas, protótipos em teste e materiais para imprimir e jogar." },
])
