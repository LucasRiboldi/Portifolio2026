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
  slug?: string
  readme?: string
}

export const projects: Project[] = [
  {
    id: "7",
    title: 'Bolão da Copa 2026',
    description:
      'Bolão de palpites da Copa do Mundo FIFA 2026: 48 seleções, jogos do dia, ranking ao vivo por pontos e insígnias para quem acerta o mata-mata. Já roda com 49 participantes.',
    category: 'code',
    tags: ['React', 'Vite', 'Firebase', 'TypeScript', 'PWA'],
    coverImage: "/covers/projetos/7.svg",
    // O repositório é privado — o card aponta para o app no ar.
    href: 'https://bolao2026-a76c7.web.app/',
    featured: true,
  },
  {
    id: "1",
    title: 'Paleta.ai',
    description: 'Gerador de paletas de cores com IA. Descreva um mood e receba 5 paletas com HEX e export para Figma.',
    category: 'code',
    tags: ['Next.js', 'OpenAI', 'TypeScript'],
    coverImage: "/covers/projetos/1.svg",
    href: 'https://github.com/LucasRiboldi',
  },
  {
    id: "2",
    title: 'Design System — Componentes',
    description: 'Sistema de design completo com 40+ componentes, tokens e documentação interativa.',
    category: 'design',
    tags: ['Figma', 'Design Tokens', 'UI/UX'],
    coverImage: "/covers/projetos/2.svg",
  },
  {
    id: "3",
    title: 'Identidade Visual — Marca X',
    description: 'Identidade visual completa: logo, tipografia, paleta e brandbook para startup de tecnologia.',
    category: 'art',
    tags: ['Branding', 'Illustrator', 'Figma'],
    coverImage: "/covers/projetos/3.svg",
  },
  {
    id: "4",
    title: 'Dashboard Analytics',
    description: 'Interface de analytics com gráficos em tempo real, dark mode e filtros avançados.',
    category: 'design',
    tags: ['Figma', 'UI/UX', 'Data Viz'],
    coverImage: "/covers/projetos/4.svg",
  },
  {
    id: "5",
    title: 'Fotografia Urbana 2026',
    description: 'Série fotográfica explorando contrastes entre arquitetura moderna e espaços abandonados.',
    category: 'image',
    tags: ['Fotografia', 'Lightroom'],
    coverImage: "/covers/projetos/5.svg",
  },
  {
    id: "6",
    title: 'Sports Widget — réplica do Firefox',
    description: 'Réplica em React do widget de esportes da nova aba do Firefox: abas de resultados/próximos, lista agrupada por grupo, placares e bandeiras. Theme-aware, acessível e reconstruído por engenharia reversa do DOM real.',
    category: 'code',
    tags: ['Next.js', 'React', 'TypeScript', 'CSS Modules'],
    coverImage: "/covers/projetos/6.svg",
    href: '/sports-widget',
  },
]
