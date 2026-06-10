# COMPONENT_GUIDE.md

# Personal Portal Platform

## Component Development Guide

Versão: 1.0

---

# Objetivo

Este documento define os padrões oficiais para criação, manutenção e evolução dos componentes da plataforma.

Todo componente deve seguir estas regras.

Objetivos:

* Consistência
* Reutilização
* Escalabilidade
* Acessibilidade
* Compatibilidade com IA Agents
* Facilidade de manutenção

---

# Estrutura de Componentes

Organização oficial:

```text
src/components/

ui/
layout/
cards/
forms/
sections/
providers/
features/
```

---

# Diretório UI

Componentes genéricos reutilizáveis.

```text
components/ui/

button.tsx
card.tsx
badge.tsx
avatar.tsx
input.tsx
textarea.tsx
select.tsx
checkbox.tsx
switch.tsx
tooltip.tsx
toast.tsx
modal.tsx
drawer.tsx
table.tsx
tabs.tsx
accordion.tsx
dropdown.tsx
```

Regra:

Não conter lógica de negócio.

---

# Diretório Layout

Responsável pela estrutura visual.

```text
components/layout/

navbar.tsx
footer.tsx
sidebar.tsx
container.tsx
section.tsx
page-header.tsx
mobile-menu.tsx
```

Regra:

Controla layout, nunca dados.

---

# Diretório Cards

Componentes especializados.

```text
components/cards/

project-card.tsx
github-card.tsx
tool-card.tsx
blog-card.tsx
gallery-card.tsx
```

Regra:

Recebem dados via props.

Nunca buscar dados diretamente.

---

# Diretório Forms

Campos compostos.

```text
components/forms/

contact-form.tsx
login-form.tsx
project-form.tsx
blog-form.tsx
```

---

# Diretório Sections

Seções completas de páginas.

```text
components/sections/

hero.tsx
featured-projects.tsx
tools-section.tsx
blog-preview.tsx
github-section.tsx
contact-section.tsx
```

---

# Diretório Providers

Providers globais.

```text
components/providers/

theme-provider.tsx
query-provider.tsx
auth-provider.tsx
```

---

# Diretório Features

Componentes com lógica específica.

```text
components/features/

github-stats.tsx
project-filter.tsx
search-bar.tsx
theme-toggle.tsx
```

---

# Convenções de Nome

## Componentes

Sempre:

```text
PascalCase
```

Exemplo:

```text
ProjectCard
GithubCard
ToolCard
```

Arquivo:

```text
project-card.tsx
github-card.tsx
tool-card.tsx
```

---

# Estrutura Padrão

Todo componente deve seguir:

```tsx
import { cn } from "@/lib/utils/cn";

interface ComponentProps {
  className?: string;
}

export function Component({
  className
}: ComponentProps) {
  return (
    <div className={cn("", className)}>
      Component
    </div>
  );
}
```

---

# Ordem Interna

Dentro do arquivo:

```text
1 Imports
2 Types
3 Constants
4 Component
5 Export
```

---

# Props

Sempre criar interface.

Correto:

```tsx
interface ButtonProps {
  children: React.ReactNode;
}
```

Incorreto:

```tsx
function Button(props: any)
```

---

# Tipagem

Obrigatório:

```text
TypeScript Strict
```

Proibido:

```ts
any
```

Exceto quando inevitável.

---

# ClassNames

Sempre utilizar:

```ts
cn()
```

Exemplo:

```tsx
className={cn(
  "rounded-lg",
  className
)}
```

Nunca:

```tsx
className={
  "rounded-lg " + className
}
```

---

# Tokens CSS

Todos os componentes devem consumir tokens.

Correto:

```css
var(--primary-500)
```

Errado:

```css
#3b82f6
```

---

# Dark Mode

Todo componente deve funcionar em:

```text
Light
Dark
```

Sem exceções.

---

# Responsividade

Abordagem:

```text
Mobile First
```

Exemplo:

```tsx
className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
"
```

---

# Acessibilidade

Obrigatório:

```text
aria-label
keyboard navigation
focus-visible
```

Exemplo:

```tsx
<button
 aria-label="Abrir menu"
>
```

---

# Botões

Arquivo:

```text
ui/button.tsx
```

Variantes:

```text
primary
secondary
outline
ghost
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
ui/card.tsx
```

Estrutura:

```tsx
<Card>
  <CardHeader />
  <CardContent />
  <CardFooter />
</Card>
```

---

# Inputs

Componentes:

```text
Input
Textarea
Select
Checkbox
Switch
```

Estados:

```text
default
focus
error
disabled
success
loading
```

---

# Navbar

Responsabilidades:

```text
logo
navigation
theme toggle
mobile menu
```

Não deve conter:

```text
requisições API
```

---

# Sidebar

Usada em:

```text
dashboard
admin
```

Suporte:

```text
collapse
mobile
nested items
```

---

# ProjectCard

Responsabilidade:

Exibir projeto.

Props:

```ts
title
description
image
technologies
githubUrl
demoUrl
featured
```

Não deve:

```text
buscar dados da API
```

---

# GithubCard

Props:

```ts
name
description
language
stars
forks
updatedAt
url
```

---

# ToolCard

Props:

```ts
title
description
icon
category
url
```

---

# BlogCard

Props:

```ts
title
slug
excerpt
coverImage
publishedAt
readingTime
tags
```

---

# GalleryCard

Props:

```ts
title
image
category
width
height
```

---

# Modal

Requisitos:

```text
ESC fecha
click fora fecha
focus trap
portal
```

---

# Toast

Tipos:

```text
success
warning
error
info
```

Duração padrão:

```text
3000ms
```

---

# Hooks

Separar lógica da UI.

Exemplo:

```text
useGithub.ts
```

Retorna:

```ts
data
loading
error
refetch
```

---

# Separação de Responsabilidades

UI:

```text
renderização
```

Hook:

```text
lógica
```

Service:

```text
requisição
```

---

# Estrutura Recomendada

```text
components/
hooks/
services/
```

Exemplo:

```text
GithubCard
↓
useGithub
↓
github.service
↓
Github API
```

---

# Performance

Evitar:

```text
renderizações desnecessárias
objetos inline
funções inline pesadas
```

Preferir:

```tsx
useMemo
useCallback
React.memo
```

Quando necessário.

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

Evitar animações excessivas.

---

# Testabilidade

Todo componente deve permitir:

```text
unit tests
integration tests
```

Adicionar:

```tsx
data-testid
```

Quando apropriado.

---

# Storybook (Futuro)

Preparação:

```text
stories/
```

Exemplo:

```text
button.stories.tsx
project-card.stories.tsx
```

---

# Critérios de Aceitação

Um componente é considerado pronto quando:

* Compila sem erros
* Possui tipagem strict
* É reutilizável
* É responsivo
* Funciona em dark mode
* Funciona em light mode
* Segue tokens CSS
* Possui acessibilidade básica
* Não contém lógica indevida
* Possui props documentadas
* Segue este guia

---

# Regra Final

Antes de criar um componente novo, verificar:

1. Já existe componente semelhante?
2. Pode ser reutilizado?
3. Segue Design System?
4. Usa tokens CSS?
5. Funciona em Dark/Light?
6. Está tipado?
7. Está acessível?
8. Está responsivo?

Se qualquer resposta for "não", o componente não está pronto para produção.
