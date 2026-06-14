export type ProjectCategory = 'design' | 'code' | 'art' | 'image'

export interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  coverImage: string
  href?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Paleta.ai',
    description: 'Gerador de paletas de cores com IA. Descreva um mood e receba 5 paletas com HEX e export para Figma.',
    category: 'code',
    tags: ['Next.js', 'OpenAI', 'TypeScript'],
    coverImage: '',
    href: 'https://github.com/LucasRiboldi',
    featured: true,
  },
  {
    id: '2',
    title: 'Design System — Componentes',
    description: 'Sistema de design completo com 40+ componentes, tokens e documentação interativa.',
    category: 'design',
    tags: ['Figma', 'Design Tokens', 'UI/UX'],
    coverImage: '',
  },
  {
    id: '3',
    title: 'Identidade Visual — Marca X',
    description: 'Identidade visual completa: logo, tipografia, paleta e brandbook para startup de tecnologia.',
    category: 'art',
    tags: ['Branding', 'Illustrator', 'Figma'],
    coverImage: '',
  },
  {
    id: '4',
    title: 'Dashboard Analytics',
    description: 'Interface de analytics com gráficos em tempo real, dark mode e filtros avançados.',
    category: 'design',
    tags: ['Figma', 'UI/UX', 'Data Viz'],
    coverImage: '',
  },
  {
    id: '5',
    title: 'Fotografia Urbana 2026',
    description: 'Série fotográfica explorando contrastes entre arquitetura moderna e espaços abandonados.',
    category: 'image',
    tags: ['Fotografia', 'Lightroom'],
    coverImage: '',
  },
  {
    id: '6',
    title: 'Sports Widget — réplica do Firefox',
    description: 'Réplica em React do widget de esportes da nova aba do Firefox: abas de resultados/próximos, lista agrupada por grupo, placares e bandeiras. Theme-aware, acessível e reconstruído por engenharia reversa do DOM real.',
    category: 'code',
    tags: ['Next.js', 'React', 'TypeScript', 'CSS Modules'],
    coverImage: '',
    href: '/sports-widget',
  },
]
