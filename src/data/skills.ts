export type SkillCategory =
  | 'frontend'
  | 'design'
  | 'performance'
  | 'quality'
  | 'system'
  | 'git'
  | 'orchestration'

export interface Skill {
  /** slug da pasta em ~/.claude/skills */
  name: string
  /** como invocar no Claude Code */
  command: string
  /** o que ela faz, em uma linha */
  description: string
  category: SkillCategory
}

export const SKILL_CATEGORY_META: Record<
  SkillCategory,
  { label: string; color: string; emoji: string }
> = {
  frontend:      { label: 'React / Next / TS', color: '#38bdf8', emoji: '⚛️' },
  design:        { label: 'Design & UI',        color: '#ec4899', emoji: '🎨' },
  performance:   { label: 'Performance',        color: '#f97316', emoji: '⚡' },
  quality:       { label: 'Qualidade & Testes', color: '#22c55e', emoji: '🧪' },
  system:        { label: 'C & Shell',          color: '#a78bfa', emoji: '🖥️' },
  git:           { label: 'Git & Deploy',       color: '#f59e0b', emoji: '🚀' },
  orchestration: { label: 'Orquestração',       color: '#06b6d4', emoji: '🧠' },
}

export const skills: Skill[] = [
  { name: 'frontend-dev-guidelines', command: '/frontend-dev-guidelines', category: 'frontend', description: 'Diretrizes de front-end React/TS: Suspense, lazy, organização por features.' },
  { name: 'nextjs-app-router-patterns', command: '/nextjs-app-router-patterns', category: 'frontend', description: 'Padrões do App Router do Next.js 14+: Server Components e full-stack React moderno.' },
  { name: 'nextjs-best-practices', command: '/nextjs-best-practices', category: 'frontend', description: 'Princípios do App Router: Server Components, data fetching e roteamento.' },
  { name: 'react-best-practices', command: '/react-best-practices', category: 'frontend', description: 'Otimização de performance em React/Next (guidelines da Vercel).' },
  { name: 'react-component-performance', command: '/react-component-performance', category: 'frontend', description: 'Diagnostica componentes React lentos e sugere correções pontuais.' },
  { name: 'react-patterns', command: '/react-patterns', category: 'frontend', description: 'Padrões modernos de React: hooks, composição, performance e TypeScript.' },
  { name: 'react-state-management', command: '/react-state-management', category: 'frontend', description: 'Estado moderno: Redux Toolkit, Zustand, Jotai e React Query.' },
  { name: 'react-ui-patterns', command: '/react-ui-patterns', category: 'frontend', description: 'Estados de loading, erro e data fetching em componentes React.' },
  { name: 'react-useeffect', command: '/react-useeffect', category: 'frontend', description: 'Boas práticas de useEffect — e quando NÃO usar Effect.' },
  { name: 'tanstack-query-expert', command: '/tanstack-query-expert', category: 'frontend', description: 'TanStack Query: fetching, mutations, optimistic updates e SSR.' },
  { name: 'typescript-expert', command: '/typescript-expert', category: 'frontend', description: 'Type-level programming, performance de build e migração.' },
  { name: 'typescript-pro', command: '/typescript-pro', category: 'frontend', description: 'TypeScript avançado: tipos, generics e type-safety estrita.' },
  { name: 'vercel-react-best-practices', command: '/vercel-react-best-practices', category: 'frontend', description: 'Guidelines de performance React/Next da engenharia da Vercel.' },
  { name: 'zod-validation-expert', command: '/zod-validation-expert', category: 'frontend', description: 'Validação de schema com Zod, integrado a RHF, Next.js e tRPC.' },
  { name: 'zustand-store-ts', command: '/zustand-store-ts', category: 'frontend', description: 'Cria stores Zustand com tipos e middleware corretos.' },
  { name: 'building-blog', command: '/building-blog', category: 'design', description: 'Adiciona um blog Next.js + Sanity CMS otimizado para SEO.' },
  { name: 'frontend-design', command: '/frontend-design', category: 'design', description: 'Interfaces de alta qualidade, fugindo do visual genérico de IA.' },
  { name: 'interactive-portfolio', command: '/interactive-portfolio', category: 'design', description: 'Portfólios que convertem visitantes em oportunidades.' },
  { name: 'premium-web-design', command: '/premium-web-design', category: 'design', description: 'Design nível Awwwards em React (.jsx) — cara de agência premium.' },
  { name: 'shadcn-ui', command: '/shadcn-ui', category: 'design', description: 'Componentes shadcn/ui, Radix e Tailwind em apps Next.js.' },
  { name: 'tailwind-design-system', command: '/tailwind-design-system', category: 'design', description: 'Design systems com Tailwind: tokens, variantes e acessibilidade.' },
  { name: 'tailwind-patterns', command: '/tailwind-patterns', category: 'design', description: 'Tailwind CSS v4: config CSS-first, container queries e tokens.' },
  { name: 'ui-design-system', command: '/ui-design-system', category: 'design', description: 'Design tokens, documentação de componentes e handoff dev.' },
  { name: 'ui-ux-pro-max', command: '/ui-ux-pro-max', category: 'design', description: 'Inteligência de UI/UX: 50+ estilos, 161 paletas, 57 pares de fontes.' },
  { name: 'web-design-guidelines', command: '/web-design-guidelines', category: 'design', description: 'Revisa UI contra guidelines de interface e acessibilidade.' },
  { name: 'core-web-vitals', command: '/core-web-vitals', category: 'performance', description: 'Otimiza LCP, INP e CLS para experiência e ranqueamento.' },
  { name: 'web-performance-optimization', command: '/web-performance-optimization', category: 'performance', description: 'Loading, bundle size, caching e performance de runtime.' },
  { name: 'clean-code', command: '/clean-code', category: 'quality', description: 'Padrões pragmáticos: direto, sem over-engineering nem comentário inútil.' },
  { name: 'code-review-excellence', command: '/code-review-excellence', category: 'quality', description: 'Transforma review em troca de conhecimento, não em gatekeeping.' },
  { name: 'code-reviewer', command: '/code-reviewer', category: 'quality', description: 'Code review completo (TS/JS/Python/Go…) com checklist e scan de segurança.' },
  { name: 'code-simplifier', command: '/code-simplifier', category: 'quality', description: 'Simplifica e refina código preservando o comportamento.' },
  { name: 'crafting-effective-readmes', command: '/crafting-effective-readmes', category: 'quality', description: 'Templates de README conforme público e tipo de projeto.' },
  { name: 'debugging-strategies', command: '/debugging-strategies', category: 'quality', description: 'Debugging sistemático em vez de tentativa e erro.' },
  { name: 'naming-analyzer', command: '/naming-analyzer', category: 'quality', description: 'Sugere nomes melhores para variáveis, funções e classes.' },
  { name: 'testing-patterns', command: '/testing-patterns', category: 'quality', description: 'Padrões de teste Jest, factories, mocking e ciclo TDD.' },
  { name: 'verification-quality', command: '/verification-quality', category: 'quality', description: 'Truth scoring e verificação de qualidade com rollback automático.' },
  { name: 'webapp-testing', command: '/webapp-testing', category: 'quality', description: 'Testa web apps locais com Playwright: screenshots e logs.' },
  { name: 'bash-pro', command: '/bash-pro', category: 'system', description: 'Bash defensivo para automação de produção e CI/CD.' },
  { name: 'c-pro', command: '/c-pro', category: 'system', description: 'Código C eficiente com gestão de memória e ponteiros corretos.' },
  { name: 'linux-shell-scripting', command: '/linux-shell-scripting', category: 'system', description: 'Templates de shell script para administração de sistemas Linux.' },
  { name: 'commit-smart', command: '/commit-smart', category: 'git', description: 'Commits convencionais que explicam o PORQUÊ, detectando tipo/escopo do diff.' },
  { name: 'github-code-review', command: '/github-code-review', category: 'git', description: 'Code review no GitHub com coordenação de swarm de IA.' },
  { name: 'github-multi-repo', command: '/github-multi-repo', category: 'git', description: 'Coordenação e sincronização de múltiplos repositórios.' },
  { name: 'github-project-management', command: '/github-project-management', category: 'git', description: 'Gestão de projeto no GitHub: issues, boards e sprints.' },
  { name: 'github-release-management', command: '/github-release-management', category: 'git', description: 'Orquestra releases: versionamento, testes, deploy e rollback.' },
  { name: 'github-workflow-automation', command: '/github-workflow-automation', category: 'git', description: 'Automação de GitHub Actions e pipelines CI/CD.' },
  { name: 'hooks-automation', command: '/hooks-automation', category: 'git', description: 'Hooks do Claude Code para formatação, memória e coordenação.' },
  { name: 'vercel-deploy', command: '/vercel-deploy', category: 'git', description: 'Faz deploy de apps e sites na Vercel (produção ou preview).' },
  { name: 'browser', command: '/browser', category: 'orchestration', description: 'Automação de navegador com snapshots otimizados para agentes.' },
  { name: 'pair-programming', command: '/pair-programming', category: 'orchestration', description: 'Pair programming com IA: modos driver/navigator e verificação contínua.' },
  { name: 'skill-builder', command: '/skill-builder', category: 'orchestration', description: 'Cria novas skills do Claude Code com frontmatter e estrutura corretos.' },
  { name: 'sparc-methodology', command: '/sparc-methodology', category: 'orchestration', description: 'Metodologia SPARC (Spec, Pseudocode, Architecture, Refine, Complete).' },
  { name: 'swarm-advanced', command: '/swarm-advanced', category: 'orchestration', description: 'Padrões avançados de swarm para pesquisa, dev e testes.' },
  { name: 'swarm-orchestration', command: '/swarm-orchestration', category: 'orchestration', description: 'Orquestra swarms multi-agente para execução paralela de tarefas.' },
]
