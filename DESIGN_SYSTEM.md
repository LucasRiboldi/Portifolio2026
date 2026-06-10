# DESIGN_SYSTEM.md

# Personal Portal Design System

Versão: 1.0

---

# Objetivo

Este documento define o sistema de design oficial da plataforma Personal Portal.

Todos os componentes, páginas e funcionalidades devem seguir estas regras.

Objetivos:

* Consistência visual
* Escalabilidade
* Acessibilidade
* Reutilização
* Facilidade de manutenção
* Compatibilidade com IA Agents

---

# Princípios

## 1. Simplicidade

Interfaces devem ser limpas.

Evitar excesso de elementos.

Priorizar clareza.

---

## 2. Hierarquia Visual

O usuário deve identificar imediatamente:

* Título
* Conteúdo principal
* Ações disponíveis

---

## 3. Responsividade

Mobile First.

Todo componente deve funcionar em:

* Mobile
* Tablet
* Desktop
* Ultrawide

---

## 4. Performance

Evitar:

* CSS excessivo
* Renderizações desnecessárias
* Dependências pesadas

---

## 5. Acessibilidade

Todos os componentes devem possuir:

* aria-label
* focus states
* navegação por teclado
* contraste AA

---

# Temas

## Light

Uso:

* ambientes corporativos
* leitura prolongada

Classe:

```html
<html class="light">
```

---

## Dark

Tema padrão.

Classe:

```html
<html class="dark">
```

---

# Tokens

Fonte única da verdade:

```text
src/styles/tokens.css
```

Jamais utilizar:

```css
color: #3b82f6;
```

Utilizar:

```css
color: var(--primary-500);
```

---

# Cores

## Primary

Utilizada para:

* botões principais
* links
* destaque

```css
--primary-50
--primary-100
--primary-200
--primary-300
--primary-400
--primary-500
--primary-600
--primary-700
--primary-800
--primary-900
```

---

## Secondary

Uso complementar.

```css
--secondary-50
...
--secondary-900
```

---

## Success

```css
--success-500
```

Uso:

* sucesso
* concluído
* publicado

---

## Warning

```css
--warning-500
```

Uso:

* alerta
* atenção

---

## Danger

```css
--danger-500
```

Uso:

* exclusão
* erro

---

# Superfícies

## Background

```css
--background
```

Página principal.

---

## Background Secondary

```css
--background-secondary
```

Seções alternadas.

---

## Surface

```css
--surface
```

Cards.

---

## Surface Hover

```css
--surface-hover
```

Hover de cards.

---

# Tipografia

Fonte principal:

```css
--font-sans
```

Sugestão:

```text
Inter
```

---

Fonte monoespaçada:

```css
--font-mono
```

Sugestão:

```text
JetBrains Mono
```

---

# Escala Tipográfica

## Display

```css
--text-6xl
```

Hero.

---

## H1

```css
--text-5xl
```

---

## H2

```css
--text-4xl
```

---

## H3

```css
--text-3xl
```

---

## Body

```css
--text-md
```

---

## Small

```css
--text-sm
```

---

# Espaçamento

Utilizar exclusivamente:

```css
--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-8
--space-10
--space-12
--space-16
--space-20
--space-24
```

Proibido:

```css
padding: 13px;
```

---

# Radius

```css
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-2xl
--radius-full
```

---

# Sombras

```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-primary
```

---

# Gradientes

Disponíveis:

```css
--gradient-primary
--gradient-hero
--gradient-card
```

---

# Glassmorphism

Tokens:

```css
--glass-bg
--glass-border
--glass-blur
```

Classe:

```css
.glass
```

---

# Componentes

Todos os componentes devem ser:

* reutilizáveis
* desacoplados
* tipados

---

# Button

Arquivo:

```text
components/ui/button.tsx
```

Variantes:

```text
primary
secondary
ghost
outline
danger
success
```

Tamanhos:

```text
sm
md
lg
xl
```

---

# Card

Arquivo:

```text
components/ui/card.tsx
```

Subcomponentes:

```text
Card
CardHeader
CardContent
CardFooter
```

---

# Badge

Arquivo:

```text
components/ui/badge.tsx
```

Variantes:

```text
default
primary
success
warning
danger
```

---

# Input

Arquivo:

```text
components/ui/input.tsx
```

Suporte:

```text
error
success
disabled
loading
```

---

# Textarea

Arquivo:

```text
components/ui/textarea.tsx
```

---

# Modal

Arquivo:

```text
components/ui/modal.tsx
```

Recursos:

* ESC fecha
* click fora fecha
* trap focus

---

# Dropdown

Arquivo:

```text
components/ui/dropdown.tsx
```

---

# Tooltip

Arquivo:

```text
components/ui/tooltip.tsx
```

---

# Toast

Arquivo:

```text
components/ui/toast.tsx
```

Posições:

```text
top-right
top-left
bottom-right
bottom-left
```

---

# Navbar

Arquivo:

```text
components/layout/navbar.tsx
```

Elementos:

* Logo
* Navegação
* Theme Toggle
* Mobile Menu

---

# Sidebar

Arquivo:

```text
components/layout/sidebar.tsx
```

Utilizada:

* dashboard
* admin

---

# Cards Específicos

## ProjectCard

Exibe:

* imagem
* nome
* descrição
* tecnologias
* github
* demo

---

## GithubCard

Exibe:

* stars
* forks
* linguagem
* atualização

---

## ToolCard

Exibe:

* ícone
* descrição
* categoria

---

## BlogCard

Exibe:

* capa
* data
* categoria
* leitura estimada

---

## GalleryCard

Exibe:

* thumbnail
* categoria
* resolução

---

# Animações

Arquivo:

```text
styles/animations.css
```

Permitidas:

```text
fade-in
fade-up
fade-down
scale-in
slide-left
slide-right
```

Duração padrão:

```css
250ms
```

---

# Ícones

Biblioteca oficial:

```text
lucide-react
```

Não misturar bibliotecas.

---

# Layout

Container padrão:

```css
max-width: 1400px;
```

Classe:

```text
Container
```

---

# SEO

Toda página deve possuir:

```ts
metadata
```

Campos:

```text
title
description
keywords
openGraph
twitter
```

---

# Convenções

## Componentes

```text
PascalCase
```

Exemplo:

```text
ProjectCard.tsx
```

---

## Hooks

```text
useHook.ts
```

Exemplo:

```text
useGithub.ts
```

---

## Tipos

Um arquivo por entidade.

Exemplo:

```text
types/project.ts
```

---

# Lighthouse

Meta mínima:

```text
Performance 95+
Accessibility 100
Best Practices 100
SEO 100
```

---

# Regra Final

Qualquer novo componente deve:

1. Utilizar tokens CSS.
2. Suportar Dark e Light Theme.
3. Ser acessível.
4. Ser responsivo.
5. Ser reutilizável.
6. Possuir tipagem TypeScript strict.
7. Seguir a estrutura deste documento.
8. Ter um arquivo de teste unitário.
9. Ter um arquivo README.md com instruções
10. Ter uma documentação do componente no próprio arquivo
