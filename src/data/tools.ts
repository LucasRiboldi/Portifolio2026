export type ToolType = 'webapp' | 'cli' | 'extension' | 'bot' | 'script' | 'plugin'

export interface Tool {
  id: string
  name: string
  description: string
  type: ToolType
  stack: string[]
  emoji: string
  demoUrl?: string
  githubUrl?: string
}

export const TOOL_COLORS: Record<ToolType, string> = {
  webapp:    '#f97316',
  cli:       '#8b5cf6',
  extension: '#ec4899',
  bot:       '#06b6d4',
  script:    '#22c55e',
  plugin:    '#f59e0b',
}

export const TOOL_LABELS: Record<ToolType, string> = {
  webapp:    'Web App',
  cli:       'CLI',
  extension: 'Extensão',
  bot:       'Bot',
  script:    'Script',
  plugin:    'Plugin Figma',
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'Paleta.ai',
    description: 'Gerador de paletas de cores com IA. Descreva um mood e receba paletas prontas para Figma.',
    type: 'webapp',
    stack: ['Next.js', 'OpenAI', 'TypeScript'],
    emoji: '🎨',
    demoUrl: 'https://github.com/LucasRiboldi',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
  {
    id: '2',
    name: 'figma-export-cli',
    description: 'CLI que exporta componentes do Figma direto para o repo como SVG/PNG com nomes normalizados.',
    type: 'cli',
    stack: ['Node.js', 'Figma API', 'TypeScript'],
    emoji: '⌨️',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
  {
    id: '3',
    name: 'DesignSnap',
    description: 'Extensão Chrome que extrai propriedades CSS de qualquer elemento como tokens de design.',
    type: 'extension',
    stack: ['Chrome Extension', 'DOM API', 'TypeScript'],
    emoji: '🧩',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
  {
    id: '4',
    name: 'ReviewBot',
    description: 'Bot do Telegram que resume diffs de PR do GitHub com badge de risco em linguagem natural.',
    type: 'bot',
    stack: ['Telegram API', 'GitHub API', 'Claude API'],
    emoji: '🤖',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
  {
    id: '5',
    name: 'notion-weekly',
    description: 'Script Python que lê tarefas do Notion e envia resumo semanal por e-mail via GitHub Actions.',
    type: 'script',
    stack: ['Python', 'Notion API', 'GitHub Actions'],
    emoji: '📜',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
  {
    id: '6',
    name: 'SpacingAudit',
    description: 'Plugin Figma que detecta inconsistências de espaçamento fora do grid de 8px e exporta relatório JSON.',
    type: 'plugin',
    stack: ['Figma Plugin API', 'TypeScript'],
    emoji: '🔌',
    githubUrl: 'https://github.com/LucasRiboldi',
  },
]
