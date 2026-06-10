# Portfolio Pessoal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Tailwind/shadcn:** Antes de escrever classes Tailwind ou importar componentes shadcn, invoque o skill `anthropic-skills:tailwind-shadcn`. Antes de mexer em next.config.ts ou App Router, invoque `anthropic-skills:nextjs-stack`.

**Goal:** Implementar portfólio pessoal completo de Lucas Riboldi com homepage Bento Grid, galeria de portfólio, página de ferramentas e páginas de sobre/contato — tudo com tema Dark + Gradient Accent.

**Architecture:** Dados hardcoded em `src/data/`, componentes organizados por domínio (`home/`, `portfolio/`, `tools/`), CSS variables de gradiente adicionadas ao globals.css existente. Nenhum CMS ou banco de dados.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript · TailwindCSS v3 · shadcn/ui · Motion (Framer Motion v12) · React Hook Form · Zod · Resend (contato)

---

## Mapa de Arquivos

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Modify | `src/styles/globals.css` | Adicionar CSS vars do gradiente accent |
| Modify | `src/constants/site.ts` | Dados reais do site (nome, social links) |
| Create | `src/data/projects.ts` | Tipo `Project` + array com 5 projetos de exemplo |
| Create | `src/data/tools.ts` | Tipo `Tool` + array com 6 ferramentas de exemplo |
| Modify | `src/components/layout/navbar.tsx` | Logo LR., links corretos, theme toggle |
| Modify | `src/components/layout/footer.tsx` | Branding e links reais |
| Create | `src/components/home/bento-card.tsx` | Card individual do bento grid |
| Create | `src/components/home/bento-grid.tsx` | Grid completo da homepage |
| Modify | `src/app/(site)/page.tsx` | Homepage com BentoGrid |
| Modify | `src/components/cards/project-card.tsx` | Reescrever com overlay gradiente + categoria |
| Create | `src/components/portfolio/gallery-grid.tsx` | Layout Featured+Grid com filtros |
| Modify | `src/app/(site)/portfolio/page.tsx` | Página de portfólio completa |
| Modify | `src/components/cards/tool-card.tsx` | Reescrever com cor por tipo, stack tags, links |
| Create | `src/components/tools/tools-grid.tsx` | Grid com filtros por tipo |
| Modify | `src/app/(site)/tools/page.tsx` | Página de ferramentas completa |
| Modify | `src/app/(site)/about/page.tsx` | Layout duas colunas |
| Modify | `src/app/(site)/contact/page.tsx` | Formulário com estados |
| Create | `src/app/api/contact/route.ts` | API Route com Resend |

---

## Task 1: Design tokens — gradiente accent

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Adicionar CSS variables do gradiente no bloco `:root` e `.dark`**

Abra `src/styles/globals.css` e adicione dentro do bloco `.dark { }` (e também em `:root` para light mode) as novas variáveis — **depois** das variáveis existentes, antes do fechamento `}`:

```css
/* dentro de :root { } — adicionar antes do } */
--gradient-start: #f97316;
--gradient-mid: #ec4899;
--gradient-end: #8b5cf6;
--gradient-accent: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6);
--gradient-text: linear-gradient(90deg, #f97316, #ec4899);
--surface-card: rgba(255, 255, 255, 0.04);
--border-card: rgba(255, 255, 255, 0.08);

/* dentro de .dark { } — mesmos valores (gradiente é igual no dark) */
--gradient-start: #f97316;
--gradient-mid: #ec4899;
--gradient-end: #8b5cf6;
--gradient-accent: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6);
--gradient-text: linear-gradient(90deg, #f97316, #ec4899);
--surface-card: rgba(255, 255, 255, 0.04);
--border-card: rgba(255, 255, 255, 0.08);
```

- [ ] **Adicionar utilitários de gradiente no final do arquivo** (fora de qualquer `@layer`):

```css
/* Gradient utilities */
.gradient-accent-bar {
  height: 2px;
  background: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6);
}

.gradient-text {
  background: linear-gradient(90deg, #f97316, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-border {
  border-image: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6) 1;
}
```

- [ ] **Verificar que o build não quebrou**

```bash
npm run build
```
Esperado: build sem erros de CSS.

- [ ] **Commit**

```bash
git add src/styles/globals.css
git commit -m "style: add gradient accent CSS tokens"
```

---

## Task 2: siteConfig e dados hardcoded

**Files:**
- Modify: `src/constants/site.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/tools.ts`

- [ ] **Atualizar siteConfig** em `src/constants/site.ts`:

```ts
export const siteConfig = {
  name: "Lucas Riboldi",
  title: "Product Designer & Developer",
  description: "Criando interfaces, ferramentas e experimentos digitais.",
  github: "https://github.com/lucasriboldi",
  linkedin: "https://linkedin.com/in/lucasriboldi",
  email: "lucasriboldi.dev@gmail.com",
  location: "Brasil",
}
```

- [ ] **Criar `src/data/projects.ts`** com tipo e dados de exemplo:

```ts
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
    coverImage: '/projects/paleta-ai.png',
    href: 'https://paleta.ai',
    featured: true,
  },
  {
    id: '2',
    title: 'Design System — Componentes',
    description: 'Sistema de design completo com 40+ componentes, tokens e documentação interativa.',
    category: 'design',
    tags: ['Figma', 'Design Tokens', 'UI/UX'],
    coverImage: '/projects/design-system.png',
  },
  {
    id: '3',
    title: 'Identidade Visual — Marca X',
    description: 'Identidade visual completa: logo, tipografia, paleta e brandbook para startup de tecnologia.',
    category: 'art',
    tags: ['Branding', 'Illustrator', 'Figma'],
    coverImage: '/projects/identidade-visual.png',
  },
  {
    id: '4',
    title: 'Dashboard Analytics',
    description: 'Interface de analytics com gráficos em tempo real, dark mode e filtros avançados.',
    category: 'design',
    tags: ['Figma', 'UI/UX', 'Data Viz'],
    coverImage: '/projects/dashboard.png',
  },
  {
    id: '5',
    title: 'Fotografia Urbana 2026',
    description: 'Série fotográfica explorando contrastes entre arquitetura moderna e espaços abandonados.',
    category: 'image',
    tags: ['Fotografia', 'Lightroom'],
    coverImage: '/projects/fotografia.png',
  },
]
```

- [ ] **Criar `src/data/tools.ts`** com tipo e dados:

```ts
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
    demoUrl: 'https://paleta.ai',
    githubUrl: 'https://github.com/lucasriboldi/paleta-ai',
  },
  {
    id: '2',
    name: 'figma-export-cli',
    description: 'CLI que exporta componentes do Figma direto para o repo como SVG/PNG com nomes normalizados.',
    type: 'cli',
    stack: ['Node.js', 'Figma API', 'TypeScript'],
    emoji: '⌨️',
    githubUrl: 'https://github.com/lucasriboldi/figma-export-cli',
  },
  {
    id: '3',
    name: 'DesignSnap',
    description: 'Extensão Chrome que extrai propriedades CSS de qualquer elemento como tokens de design.',
    type: 'extension',
    stack: ['Chrome Extension', 'DOM API', 'TypeScript'],
    emoji: '🧩',
    githubUrl: 'https://github.com/lucasriboldi/design-snap',
  },
  {
    id: '4',
    name: 'ReviewBot',
    description: 'Bot do Telegram que resume diffs de PR do GitHub com badge de risco e análise em linguagem natural.',
    type: 'bot',
    stack: ['Telegram API', 'GitHub API', 'Claude API'],
    emoji: '🤖',
    githubUrl: 'https://github.com/lucasriboldi/review-bot',
  },
  {
    id: '5',
    name: 'notion-weekly',
    description: 'Script Python que lê tarefas do Notion e envia resumo semanal por e-mail via GitHub Actions.',
    type: 'script',
    stack: ['Python', 'Notion API', 'GitHub Actions'],
    emoji: '📜',
    githubUrl: 'https://github.com/lucasriboldi/notion-weekly',
  },
  {
    id: '6',
    name: 'SpacingAudit',
    description: 'Plugin Figma que detecta inconsistências de espaçamento fora do grid de 8px e exporta relatório JSON.',
    type: 'plugin',
    stack: ['Figma Plugin API', 'TypeScript'],
    emoji: '🔌',
    githubUrl: 'https://github.com/lucasriboldi/spacing-audit',
  },
]
```

- [ ] **Commit**

```bash
git add src/constants/site.ts src/data/projects.ts src/data/tools.ts
git commit -m "feat: add site config and hardcoded data layer"
```

---

## Task 3: Navbar

**Files:**
- Modify: `src/components/layout/navbar.tsx`

- [ ] **Instalar `@/components/ui/theme-toggle` já existe** — verificar que exporta `ThemeToggle`:

```bash
cat src/components/ui/theme-toggle.tsx
```
Se o arquivo existir e exportar `ThemeToggle`, prosseguir. Se não, criar:

```tsx
"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

- [ ] **Reescrever `src/components/layout/navbar.tsx`**:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const links = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="gradient-accent-bar" />
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center font-bold text-lg">
            LR<span className="gradient-text">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  )
}
```

- [ ] **Verificar que `cn` vem de `@/lib/utils`** — o arquivo `src/lib/utils.ts` já existe no projeto.

- [ ] **Atualizar `src/components/layout/mobile-menu.tsx`** — links corretos e fechar ao navegar:

```tsx
"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const links = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col p-8 gap-6">
          <button
            className="self-end text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xl font-semibold hover:gradient-text transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
```

- [ ] **Adicionar `MobileMenu` ao Navbar** — dentro do `div` de `flex items-center gap-2`:

```tsx
// Adicionar import no topo de navbar.tsx
import { MobileMenu } from "./mobile-menu"

// Dentro do div "flex items-center gap-2":
<div className="flex items-center gap-2">
  <ThemeToggle />
  <MobileMenu />
</div>
```

- [ ] **Commit**

```bash
git add src/components/layout/navbar.tsx src/components/layout/mobile-menu.tsx src/components/ui/theme-toggle.tsx
git commit -m "feat: update navbar with LR logo, correct links, theme toggle and mobile menu"
```

---

## Task 4: Footer

**Files:**
- Modify: `src/components/layout/footer.tsx`

- [ ] **Reescrever `src/components/layout/footer.tsx`**:

```tsx
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Container } from "./container"
import { siteConfig } from "@/constants/site"

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="gradient-accent-bar" />
      <Container>
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 {siteConfig.name}
          </p>
          <div className="flex gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/layout/footer.tsx
git commit -m "feat: update footer with real branding and social links"
```

---

## Task 5: BentoCard e BentoGrid

**Files:**
- Create: `src/components/home/bento-card.tsx`
- Create: `src/components/home/bento-grid.tsx`

- [ ] **Criar diretório e `src/components/home/bento-card.tsx`**:

```bash
mkdir -p src/components/home
```

```tsx
import { cn } from "@/lib/utils"

interface BentoCardProps {
  className?: string
  children: React.ReactNode
  accent?: 'orange' | 'purple' | 'pink' | 'cyan' | 'green' | 'amber'
}

const accentStyles: Record<NonNullable<BentoCardProps['accent']>, string> = {
  orange: 'bg-orange-500/8 border-orange-500/20',
  purple: 'bg-violet-500/8 border-violet-500/20',
  pink:   'bg-pink-500/8 border-pink-500/20',
  cyan:   'bg-cyan-500/8 border-cyan-500/20',
  green:  'bg-green-500/8 border-green-500/20',
  amber:  'bg-amber-500/8 border-amber-500/20',
}

export function BentoCard({ className, children, accent }: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all",
        accent && accentStyles[accent],
        className
      )}
    >
      {children}
    </div>
  )
}
```

- [ ] **Criar `src/components/home/bento-grid.tsx`**:

```tsx
"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Github, Linkedin, Mail, MapPin } from "lucide-react"
import { BentoCard } from "./bento-card"
import { siteConfig } from "@/constants/site"
import { projects } from "@/data/projects"
import { tools } from "@/data/tools"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
  }),
}

export function BentoGrid() {
  const featuredProject = projects.find(p => p.featured)
  const recentProjects = projects.slice(0, 3)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

      {/* Hero card — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={0} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard className="relative overflow-hidden h-full min-h-[180px] flex flex-col justify-between">
          <div className="gradient-accent-bar absolute top-0 left-0 right-0" />
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/15 to-violet-500/15" />
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {siteConfig.title}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight">
              {siteConfig.name.split(' ')[0]}<br />
              <span className="gradient-text">{siteConfig.name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <Link
              href="/portfolio"
              className="px-4 py-2 rounded-md text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
            >
              Ver portfólio
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </BentoCard>
      </motion.div>

      {/* Avatar */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard className="flex items-center justify-center min-h-[180px]"
          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(139,92,246,0.1))' } as React.CSSProperties}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-2"
              style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}
            />
            <p className="text-xs text-muted-foreground">foto / avatar</p>
          </div>
        </BentoCard>
      </motion.div>

      {/* Localização */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard className="flex flex-col justify-center min-h-[180px]">
          <MapPin className="w-5 h-5 text-muted-foreground mb-2" />
          <p className="font-semibold">{siteConfig.location}</p>
          <p className="text-xs text-muted-foreground mt-1">Disponível remoto</p>
        </BentoCard>
      </motion.div>

      {/* Stack */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard>
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">Stack</p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Figma', 'Next.js', 'Node.js', 'Firebase'].map(tech => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-full text-xs border border-border text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* Projetos counter */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard accent="orange" className="flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold" style={{ color: '#f97316' }}>
            {projects.length}
          </span>
          <span className="text-xs text-muted-foreground mt-1">projetos</span>
        </BentoCard>
      </motion.div>

      {/* Ferramentas counter */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard accent="purple" className="flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold" style={{ color: '#8b5cf6' }}>
            {tools.length}
          </span>
          <span className="text-xs text-muted-foreground mt-1">ferramentas</span>
        </BentoCard>
      </motion.div>

      {/* Destaque */}
      {featuredProject && (
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
          <BentoCard accent="pink" className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">Em destaque</p>
            <p className="font-bold text-sm">{featuredProject.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{featuredProject.category}</p>
          </BentoCard>
        </motion.div>
      )}

      {/* Recentes — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={7} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard>
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">Portfólio recente</p>
          <div className="grid grid-cols-3 gap-2">
            {recentProjects.map(p => (
              <div
                key={p.id}
                className="h-16 rounded-lg border border-border bg-muted/30"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.15))' }}
              />
            ))}
          </div>
          <Link href="/portfolio" className="text-xs text-muted-foreground mt-3 inline-block hover:text-foreground transition-colors">
            → ver todos os projetos
          </Link>
        </BentoCard>
      </motion.div>

      {/* Links sociais — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={8} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard>
          <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-3">Links</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'GitHub', href: siteConfig.github, icon: Github },
              { label: 'LinkedIn', href: siteConfig.linkedin, icon: Linkedin },
              { label: 'E-mail', href: `mailto:${siteConfig.email}`, icon: Mail },
            ].map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </BentoCard>
      </motion.div>

    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/home/
git commit -m "feat: create BentoCard and BentoGrid components"
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/app/(site)/page.tsx`

- [ ] **Verificar que existe `src/app/(site)/layout.tsx`** — se não existir, criar:

```tsx
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Reescrever `src/app/(site)/page.tsx`**:

```tsx
import { Container } from "@/components/layout/container"
import { BentoGrid } from "@/components/home/bento-grid"

export default function HomePage() {
  return (
    <Container className="py-12">
      <BentoGrid />
    </Container>
  )
}
```

- [ ] **Rodar o dev server e verificar a homepage**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Esperado: Bento Grid com cards animados, logo LR., gradiente accent no topo da navbar.

- [ ] **Commit**

```bash
git add src/app/\(site\)/page.tsx src/app/\(site\)/layout.tsx
git commit -m "feat: implement homepage with BentoGrid"
```

---

## Task 7: ProjectCard e GalleryGrid

**Files:**
- Modify: `src/components/cards/project-card.tsx`
- Create: `src/components/portfolio/gallery-grid.tsx`

- [ ] **Reescrever `src/components/cards/project-card.tsx`**:

```tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/projects"

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const card = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-orange-500/30 hover:shadow-lg",
        featured && "col-span-full"
      )}
    >
      {/* Cover image placeholder */}
      <div className={cn(
        "relative w-full overflow-hidden bg-muted",
        featured ? "h-64 md:h-80" : "h-48"
      )}>
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="px-2 py-0.5 rounded text-xs font-medium text-white"
            style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
          >
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm">{project.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  if (project.href) {
    return <Link href={project.href} target="_blank" rel="noopener noreferrer">{card}</Link>
  }
  return card
}
```

- [ ] **Criar `src/components/portfolio/gallery-grid.tsx`**:

```bash
mkdir -p src/components/portfolio
```

```tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProjectCard } from "@/components/cards/project-card"
import type { Project, ProjectCategory } from "@/data/projects"

const FILTERS: { label: string; value: ProjectCategory | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Código', value: 'code' },
  { label: 'Arte', value: 'art' },
  { label: 'Imagem', value: 'image' },
]

interface GalleryGridProps {
  projects: Project[]
}

export function GalleryGrid({ projects }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  const featured = filtered.find(p => p.featured)
  const rest = filtered.filter(p => !p.featured || activeFilter !== 'all')

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-8">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm border transition-colors",
              activeFilter === f.value
                ? "border-transparent text-white"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            style={activeFilter === f.value
              ? { background: 'linear-gradient(90deg, #f97316, #ec4899)' }
              : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid: featured ocupa linha inteira + grid 2 colunas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeFilter === 'all' && featured && (
          <ProjectCard project={featured} featured />
        )}
        {(activeFilter === 'all' ? rest : filtered).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/cards/project-card.tsx src/components/portfolio/
git commit -m "feat: rewrite ProjectCard and create GalleryGrid with filters"
```

---

## Task 8: Página de Portfólio

**Files:**
- Modify: `src/app/(site)/portfolio/page.tsx`

- [ ] **Reescrever `src/app/(site)/portfolio/page.tsx`**:

```tsx
import { Container } from "@/components/layout/container"
import { GalleryGrid } from "@/components/portfolio/gallery-grid"
import { projects } from "@/data/projects"

export const metadata = {
  title: "Portfólio",
}

export default function PortfolioPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Portfólio <span className="gradient-text">criativo</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Design, código, arte e imagem — tudo em um lugar.
        </p>
      </div>
      <GalleryGrid projects={projects} />
    </Container>
  )
}
```

- [ ] **Verificar no browser** — `http://localhost:3000/portfolio`. Esperado: heading com gradient text, filtros funcionando, card featured ocupando linha inteira.

- [ ] **Commit**

```bash
git add src/app/\(site\)/portfolio/page.tsx
git commit -m "feat: implement portfolio page with GalleryGrid"
```

---

## Task 9: ToolCard e ToolsGrid

**Files:**
- Modify: `src/components/cards/tool-card.tsx`
- Create: `src/components/tools/tools-grid.tsx`

- [ ] **Reescrever `src/components/cards/tool-card.tsx`**:

```tsx
import { ExternalLink, Github } from "lucide-react"
import type { Tool } from "@/data/tools"
import { TOOL_COLORS, TOOL_LABELS } from "@/data/tools"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const color = TOOL_COLORS[tool.type]

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 flex flex-col gap-3 transition-all hover:shadow-lg"
      style={{ '--tool-color': color } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-2xl">{tool.emoji}</span>
          <div className="mt-2">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full border"
              style={{ color, borderColor: `${color}40`, background: `${color}12` }}
            >
              {TOOL_LABELS[tool.type]}
            </span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {tool.demoUrl && (
            <a href={tool.demoUrl} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {tool.githubUrl && (
            <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-sm" style={{ color }}>{tool.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
      </div>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {tool.stack.map(s => (
          <span key={s} className="px-2 py-0.5 rounded-full text-xs border border-border text-muted-foreground">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Criar `src/components/tools/tools-grid.tsx`**:

```bash
mkdir -p src/components/tools
```

```tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ToolCard } from "@/components/cards/tool-card"
import type { Tool, ToolType } from "@/data/tools"
import { TOOL_LABELS, TOOL_COLORS } from "@/data/tools"

const ALL_TYPES: ToolType[] = ['webapp', 'cli', 'extension', 'bot', 'script', 'plugin']

interface ToolsGridProps {
  tools: Tool[]
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  const [activeFilter, setActiveFilter] = useState<ToolType | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? tools
    : tools.filter(t => t.type === activeFilter)

  return (
    <div>
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm border transition-colors",
            activeFilter === 'all'
              ? "border-transparent text-white"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
          style={activeFilter === 'all'
            ? { background: 'linear-gradient(90deg, #f97316, #ec4899)' }
            : undefined
          }
        >
          Todos
        </button>
        {ALL_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm border transition-colors",
              activeFilter === type ? "text-white" : "border-border text-muted-foreground hover:text-foreground"
            )}
            style={activeFilter === type
              ? { background: TOOL_COLORS[type], borderColor: 'transparent' }
              : undefined
            }
          >
            {TOOL_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Grid 3 colunas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/cards/tool-card.tsx src/components/tools/
git commit -m "feat: rewrite ToolCard and create ToolsGrid with filters"
```

---

## Task 10: Página de Ferramentas

**Files:**
- Modify: `src/app/(site)/tools/page.tsx`

- [ ] **Reescrever `src/app/(site)/tools/page.tsx`**:

```tsx
import { Container } from "@/components/layout/container"
import { ToolsGrid } from "@/components/tools/tools-grid"
import { tools } from "@/data/tools"

export const metadata = {
  title: "Ferramentas",
}

export default function ToolsPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Ferramentas <span className="gradient-text">criadas</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Web Apps, CLIs, extensões, bots, scripts e plugins que construí.
        </p>
      </div>
      <ToolsGrid tools={tools} />
    </Container>
  )
}
```

- [ ] **Verificar no browser** — `http://localhost:3000/tools`. Esperado: 6 cards com cores distintas por tipo, filtros no topo.

- [ ] **Commit**

```bash
git add src/app/\(site\)/tools/page.tsx
git commit -m "feat: implement tools page with ToolsGrid"
```

---

## Task 11: Página Sobre

**Files:**
- Modify: `src/app/(site)/about/page.tsx`

- [ ] **Reescrever `src/app/(site)/about/page.tsx`**:

```tsx
import { Github, Linkedin, Mail } from "lucide-react"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/constants/site"

const experience = [
  { year: '2024–hoje', role: 'Product Designer & Dev', company: 'Freelance' },
  { year: '2023–2024', role: 'UI/UX Designer', company: 'Startup X' },
  { year: '2022–2023', role: 'Designer Jr.', company: 'Agência Y' },
]

export const metadata = {
  title: "Sobre",
}

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

        {/* Coluna esquerda */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Avatar */}
          <div
            className="w-full aspect-square rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}
          />

          {/* Info */}
          <div>
            <h2 className="font-bold text-lg">{siteConfig.name}</h2>
            <p className="text-sm text-muted-foreground">{siteConfig.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{siteConfig.location}</p>
          </div>

          {/* Links sociais */}
          <div className="flex flex-col gap-3">
            {[
              { label: 'GitHub', href: siteConfig.github, icon: Github },
              { label: 'LinkedIn', href: siteConfig.linkedin, icon: Linkedin },
              { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
            ].map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Coluna direita */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-4">
              Olá, sou o <span className="gradient-text">Lucas</span>
            </h1>
            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
              <p>
                Product Designer com foco em interfaces funcionais e bem construídas.
                Trabalho na interseção entre design e código — do Figma ao deploy.
              </p>
              <p>
                Crio ferramentas, componentes e experimentos que resolvem problemas
                reais. Meu interesse principal é simplificar fluxos complexos em
                experiências diretas e eficientes.
              </p>
              <p>
                Quando não estou desenhando interfaces, estou construindo CLIs,
                plugins e automações que tornam o trabalho criativo mais rápido.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="font-semibold mb-4 text-sm tracking-[0.15em] uppercase text-muted-foreground">
              Experiência
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div
                    className="w-1 self-stretch rounded-full mt-1.5 shrink-0"
                    style={{ background: 'linear-gradient(180deg, #f97316, #8b5cf6)', minHeight: '40px' }}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.year}</p>
                    <p className="font-medium text-sm">{item.role}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Container>
  )
}
```

- [ ] **Commit**

```bash
git add src/app/\(site\)/about/page.tsx
git commit -m "feat: implement about page with two-column layout and timeline"
```

---

## Task 12: Contato — formulário + API Route

**Files:**
- Modify: `src/app/(site)/contact/page.tsx`
- Create: `src/app/api/contact/route.ts`

- [ ] **Instalar Resend**

```bash
npm install resend
```

- [ ] **Criar `src/app/api/contact/route.ts`**:

```ts
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { siteConfig } from "@/constants/site"

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 }
    )
  }

  const body = await req.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { name, email, message } = parsed.data
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: "Portfólio <onboarding@resend.dev>",
    to: siteConfig.email,
    subject: `Nova mensagem de ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Reescrever `src/app/(site)/contact/page.tsx`**:

```tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/constants/site"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
})

type FormData = z.infer<typeof schema>
type Status = 'idle' | 'loading' | 'success' | 'error' | 'unavailable'

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 503) {
        setStatus('unavailable')
        return
      }
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Container className="py-12 max-w-lg">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Entrar em <span className="gradient-text">contato</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mande uma mensagem — respondo em até 48h.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="font-semibold text-green-400">Mensagem enviada!</p>
          <p className="text-sm text-muted-foreground mt-1">Obrigado pelo contato.</p>
        </div>
      ) : status === 'unavailable' ? (
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="font-semibold">Serviço de e-mail indisponível</p>
          <p className="text-sm text-muted-foreground mt-2">
            Entre em contato diretamente:{" "}
            <a href={`mailto:${siteConfig.email}`} className="gradient-text underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium block mb-1.5">Nome</label>
            <input
              {...register('name')}
              placeholder="Seu nome"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">E-mail</label>
            <input
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 transition-colors"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Mensagem</label>
            <textarea
              {...register('message')}
              rows={5}
              placeholder="Sua mensagem..."
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
          </div>

          {status === 'error' && (
            <p className="text-xs text-red-400">Erro ao enviar. Tente novamente.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
            style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
          >
            {status === 'loading' ? 'Enviando…' : 'Enviar mensagem'}
          </button>
        </form>
      )}
    </Container>
  )
}
```

- [ ] **Criar arquivo `.env.local`** (não commitar):

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
```

Verificar que `.env.local` está no `.gitignore`.

- [ ] **Verificar no browser** — `http://localhost:3000/contact`. Esperado: formulário com validação inline, botão com gradiente.

- [ ] **Commit** (sem o .env.local)

```bash
git add src/app/\(site\)/contact/page.tsx src/app/api/contact/route.ts
git commit -m "feat: implement contact page with form validation and Resend API route"
```

---

## Task 13: Verificação final

- [ ] **Rodar o build de produção**

```bash
npm run build
```
Esperado: zero erros de TypeScript ou de build.

- [ ] **Verificar todas as páginas no browser**

```bash
npm run dev
```

Checklist:
- [ ] `/` — BentoGrid com animações de entrada, logo LR., gradiente no topo
- [ ] `/portfolio` — filtros funcionando, card featured em largura total
- [ ] `/tools` — 6 cards com cores distintas, filtros por tipo
- [ ] `/about` — layout duas colunas, avatar, bio, timeline
- [ ] `/contact` — formulário com validação, estados de loading/success/error/unavailable
- [ ] Navbar: links corretos, theme toggle funcionando
- [ ] Footer: links sociais com ícones Lucide

- [ ] **Verificar dark/light mode** em todas as páginas.

- [ ] **Commit final**

```bash
git add -A
git commit -m "feat: complete portfolio implementation"
```
