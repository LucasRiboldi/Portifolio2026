# ROADMAP.md

# Personal Portal Platform Roadmap

Versão: 1.0

Status: Planejamento

---

# Visão Geral

O objetivo deste roadmap é orientar o desenvolvimento da plataforma Personal Portal de forma incremental, priorizando:

* Fundação sólida
* Reutilização de componentes
* Entregas funcionais rápidas
* Escalabilidade futura
* Integração com IA

---

# Objetivo Final

Construir uma plataforma unificada capaz de concentrar:

* Portfólio profissional
* Projetos Github
* Ferramentas SaaS
* Blog técnico
* Galeria de artes
* Dashboard administrativo
* Laboratório de IA

Tudo em uma única aplicação moderna.

---

# FASE 0 — Fundação

## Objetivo

Criar a infraestrutura base do projeto.

## Entregas

### Arquitetura

* [ ] Estrutura de pastas criada
* [ ] Next.js configurado
* [ ] TypeScript Strict
* [ ] ESLint
* [ ] Prettier

### Estilos

* [ ] tokens.css
* [ ] globals.css
* [ ] utilities.css
* [ ] animations.css

### Temas

* [ ] dark.css
* [ ] light.css
* [ ] ThemeProvider

### Configurações

* [ ] Tailwind configurado
* [ ] shadcn configurado
* [ ] aliases configurados

## Critério de Conclusão

Projeto compila sem erros.

---

# FASE 1 — Design System

## Objetivo

Criar todos os componentes reutilizáveis.

## UI Components

### Básicos

* [ ] Button
* [ ] Card
* [ ] Badge
* [ ] Avatar
* [ ] Input
* [ ] Textarea
* [ ] Select
* [ ] Checkbox
* [ ] Switch

### Navegação

* [ ] Navbar
* [ ] Footer
* [ ] Sidebar
* [ ] MobileMenu
* [ ] Breadcrumb

### Feedback

* [ ] Toast
* [ ] Tooltip
* [ ] Skeleton
* [ ] EmptyState
* [ ] LoadingSpinner

### Overlays

* [ ] Modal
* [ ] Drawer
* [ ] Popover
* [ ] Dropdown

### Estrutura

* [ ] Container
* [ ] Section
* [ ] PageHeader

## Critério de Conclusão

Todos os componentes documentados e responsivos.

---

# FASE 2 — Home Page

## Objetivo

Criar a landing page principal.

## Seções

### Hero

* [ ] Headline
* [ ] Subheadline
* [ ] CTA Principal
* [ ] CTA Secundário

### Projetos Destaque

* [ ] Grid responsivo
* [ ] ProjectCard

### Ferramentas Destaque

* [ ] ToolCard

### Github

* [ ] GithubCard

### Blog

* [ ] BlogCard

### Footer

* [ ] Links sociais
* [ ] Navegação

## Critério de Conclusão

Home totalmente funcional.

---

# FASE 3 — Portfólio

## Objetivo

Exibir projetos profissionais.

## Funcionalidades

* [ ] Lista de projetos
* [ ] Filtros
* [ ] Busca
* [ ] Tags
* [ ] Paginação

## Componentes

* [ ] ProjectCard
* [ ] ProjectDetails

## Critério de Conclusão

Usuário consegue navegar por todos os projetos.

---

# FASE 4 — Github Hub

## Objetivo

Exibir repositórios automaticamente.

## Integrações

* [ ] Github REST API

## Dados

* [ ] Stars
* [ ] Forks
* [ ] Linguagem
* [ ] Atualização

## Componentes

* [ ] GithubCard
* [ ] GithubGrid

## Critério de Conclusão

Projetos carregados diretamente do Github.

---

# FASE 5 — Ferramentas SaaS

## Objetivo

Disponibilizar ferramentas úteis.

## MVP

### Utilitários

* [ ] Gerador de Senhas
* [ ] Conversor JSON
* [ ] Conversor CSV
* [ ] Gerador Regex
* [ ] Gerador UUID

### Administrativos

* [ ] Calculadora de Horas
* [ ] Gerador de Relatórios
* [ ] Organizador de Planilhas

## Componentes

* [ ] ToolCard
* [ ] ToolLayout

## Critério de Conclusão

Primeiras ferramentas publicadas.

---

# FASE 6 — Blog

## Objetivo

Publicar conteúdo técnico.

## Stack

* [ ] MDX

## Funcionalidades

* [ ] Categorias
* [ ] Tags
* [ ] Busca
* [ ] Leitura estimada
* [ ] SEO

## Componentes

* [ ] BlogCard
* [ ] BlogPost

## Critério de Conclusão

Primeiros artigos publicados.

---

# FASE 7 — Galeria

## Objetivo

Exibir artes digitais.

## Categorias

* [ ] Personagens
* [ ] IA
* [ ] Concept Art
* [ ] Ilustrações

## Recursos

* [ ] Lightbox
* [ ] Zoom
* [ ] Filtros

## Componentes

* [ ] GalleryCard

## Critério de Conclusão

Galeria navegável.

---

# FASE 8 — Contato

## Objetivo

Capturar leads.

## Formulário

* [ ] Nome
* [ ] Email
* [ ] Mensagem

## Validação

* [ ] Zod
* [ ] React Hook Form

## Integrações

* [ ] Supabase
* [ ] Email

## Critério de Conclusão

Mensagens armazenadas.

---

# FASE 9 — Dashboard Admin

## Objetivo

Gerenciar conteúdo.

## Autenticação

* [ ] Login
* [ ] Logout
* [ ] Controle de acesso

## Projetos

* [ ] CRUD

## Blog

* [ ] CRUD

## Galeria

* [ ] CRUD

## Ferramentas

* [ ] CRUD

## Critério de Conclusão

Conteúdo gerenciado sem editar código.

---

# FASE 10 — Banco de Dados

## Objetivo

Persistência de dados.

## Supabase

### Tabelas

* [ ] users
* [ ] projects
* [ ] tools
* [ ] blog_posts
* [ ] categories
* [ ] tags
* [ ] gallery_items
* [ ] contacts

## Critério de Conclusão

Sistema persistente.

---

# FASE 11 — Analytics

## Objetivo

Entender utilização.

## Métricas

* [ ] Visitas
* [ ] Projetos acessados
* [ ] Ferramentas utilizadas
* [ ] Artigos lidos

## Critério de Conclusão

Dashboard com métricas básicas.

---

# FASE 12 — Integração IA

## Objetivo

Adicionar recursos inteligentes.

## Possibilidades

* [ ] Chat IA
* [ ] Geração de conteúdo
* [ ] Busca semântica
* [ ] Classificação automática
* [ ] Recomendações

## Critério de Conclusão

Primeira funcionalidade IA publicada.

---

# FASE 13 — Performance

## Objetivo

Otimização.

## Lighthouse

* [ ] Performance ≥ 95
* [ ] Accessibility = 100
* [ ] Best Practices = 100
* [ ] SEO = 100

## Critério de Conclusão

Métricas atingidas.

---

# FASE 14 — Lançamento

## Objetivo

Publicação da plataforma.

## Deploy

* [ ] Produção
* [ ] Domínio
* [ ] SSL

## Verificações

* [ ] SEO
* [ ] Analytics
* [ ] Backup
* [ ] Monitoramento

## Critério de Conclusão

Portal público e funcional.

---

# Futuro

## Marketplace

* [ ] Plugins
* [ ] Templates

## Comunidade

* [ ] Comentários
* [ ] Fórum

## IA Avançada

* [ ] Agentes
* [ ] Automações
* [ ] Fluxos inteligentes

---

# Definição de Pronto

Uma funcionalidade é considerada concluída quando:

* [ ] Implementada
* [ ] Testada
* [ ] Responsiva
* [ ] Acessível
* [ ] Tipada
* [ ] Documentada
* [ ] Sem erros de lint
* [ ] Sem erros de build
* [ ] Compatível com Dark/Light Theme
* [ ] Seguindo o Design System
