# Personal Portal Platform

## Objetivo

Criar uma plataforma pessoal moderna utilizando Next.js, TypeScript e Tailwind CSS.

O sistema deve funcionar como:

- Portfólio profissional
- Showcase de projetos Github
- Showcase de projetos pessoais
- Galeria de artes digitais
- Blog técnico
- Plataforma de ferramentas SaaS
- Dashboard administrativo
- Laboratório de IA

---

# Stack Tecnológica

## Frontend

- Next.js App Router
- React
- TypeScript Strict
- TailwindCSS
- shadcn/ui
- Motion
- Lucide Icons

## Backend

- Supabase

### Utilizado para

- Banco de dados
- Autenticação
- Storage
- Edge Functions

---

# Design System

Todo o sistema deve utilizar tokens CSS.

Arquivos:

src/styles/

- tokens.css
- globals.css
- utilities.css
- animations.css

Temas:

- dark.css
- light.css

Não utilizar cores hardcoded.

Sempre consumir:

var(--primary-500)
var(--background)
var(--surface)
var(--text-primary)

---

# Estrutura

src/

app/
components/
hooks/
services/
lib/
types/
data/
content/
styles/

---

# Seções do Site

## Home

Objetivo:

Apresentação geral.

Componentes:

- Navbar
- Hero
- Projetos Destaque
- Ferramentas Destaque
- Github
- Blog
- Footer

---

## Portfolio

Objetivo:

Mostrar projetos.

Cada projeto deve possuir:

- imagem
- descrição
- tecnologias
- github
- demo
- status

Componente:

ProjectCard

---

## Github

Objetivo:

Exibir projetos Github automaticamente.

Integrar:

Github REST API

Dados:

- stars
- forks
- linguagem
- descrição
- data atualização

Componente:

GithubCard

---

## Ferramentas

Objetivo:

Hospedar ferramentas SaaS próprias.

Exemplos:

- Gerador de Senhas
- Conversor JSON
- Conversor CSV
- Gerador Regex
- Calculadoras
- Ferramentas IA

Componente:

ToolCard

---

## Blog

Objetivo:

Publicar conteúdo técnico.

Formato:

MDX

Estrutura:

content/blog/

Recursos:

- tags
- categorias
- leitura estimada

---

## Galeria

Objetivo:

Mostrar artes digitais.

Categorias:

- personagens
- concept art
- IA
- ilustrações

Componente:

GalleryCard

---

## Sobre

Objetivo:

Apresentação profissional.

Conteúdo:

- biografia
- experiência
- tecnologias

---

## Contato

Objetivo:

Captura de leads.

Campos:

- nome
- email
- mensagem

Validação:

React Hook Form
Zod

---

# Dashboard Admin

Área protegida.

Funcionalidades:

- cadastrar projetos
- editar projetos
- cadastrar posts
- editar posts
- upload imagens
- gerenciar galeria

---

# Componentes Base

components/ui/

- Button
- Card
- Badge
- Input
- Textarea
- Select
- Modal
- Drawer
- Dropdown
- Tooltip
- Tabs
- Accordion
- Table
- Toast
- Skeleton

---

# Layout Components

components/layout/

- Navbar
- Footer
- Sidebar
- Container
- Section
- MobileMenu

---

# Cards

components/cards/

- ProjectCard
- GithubCard
- ToolCard
- BlogCard
- GalleryCard

---

# Providers

components/providers/

- ThemeProvider
- QueryProvider

---

# Hooks

hooks/

- useTheme
- useGithub
- useProjects
- useBlog
- useTools

---

# Performance

Objetivos:

Lighthouse:

- Performance 95+
- Accessibility 100
- Best Practices 100
- SEO 100

---

# SEO

Cada página deve possuir:

metadata

title
description
keywords

OpenGraph

Twitter Card

Schema.org

---

# Acessibilidade

Obrigatório:

- aria-label
- keyboard navigation
- focus visible
- contrast ratio AA

---

# Responsividade

Breakpoints:

mobile
tablet
desktop
ultrawide

Mobile First.

---

# Convenções

## Componentes

PascalCase

Exemplo:

ProjectCard.tsx

---

## Hooks

useNomeHook.ts

Exemplo:

useGithub.ts

---

## Tipos

Arquivo dedicado.

Exemplo:

types/project.ts

---

# Código

Regras:

- TypeScript strict
- Sem any
- Componentes pequenos
- Máximo 300 linhas por arquivo
- Funções puras quando possível

---

# Roadmap

Fase 1

- Fundação
- Design System
- Layout

Fase 2

- Home
- Portfolio
- Github

Fase 3

- Ferramentas

Fase 4

- Blog

Fase 5

- Galeria

Fase 6

- Dashboard Admin

Fase 7

- Integração IA

---

# Objetivo Final

Criar uma plataforma pessoal profissional escalável capaz de centralizar:

- projetos
- github
- blog
- artes
- ferramentas SaaS
- experimentos de IA

em uma única aplicação moderna.
