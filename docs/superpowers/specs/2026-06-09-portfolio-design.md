# Design Spec — Portfólio Pessoal (Lucas Riboldi)

**Data:** 2026-06-09  
**Status:** Aprovado

---

## Visão Geral

Portfólio pessoal de Lucas Riboldi, Product Designer que coda. Objetivo: apresentação pessoal, galeria de trabalhos mistos (design, código, artes) e vitrine de ferramentas criadas. Público: comunidade, curiosos, contatos — sem foco formal em recrutamento.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Estilo | TailwindCSS v3 + shadcn/ui |
| Animações | Motion (Framer Motion v12) |
| Tema | next-themes (dark padrão, toggle light) |
| Ícones | Lucide React |
| Formulário | React Hook Form + Zod |
| Dados | Hardcoded em `src/data/` (sem CMS, sem banco) |

---

## Identidade Visual

- **Estilo:** Dark + Gradient Accent
- **Fundo:** `#09090b` (quase preto)
- **Gradiente de acento:** `#f97316` → `#ec4899` → `#8b5cf6` (laranja → rosa → roxo)
- **Assinatura visual:** linha `2px` com esse gradiente no topo de todas as páginas
- **Texto primário:** `#ffffff`
- **Texto secundário:** `rgba(255,255,255,0.4)`
- **Bordas:** `rgba(255,255,255,0.08)`
- **Cards:** `rgba(255,255,255,0.04)` com borda sutil
- **Logo:** `LR.` — o ponto em gradiente laranja→rosa

---

## Arquitetura de Arquivos

```
src/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx          ← Shell com Navbar + Footer
│   │   ├── page.tsx            ← Homepage (Bento Grid)
│   │   ├── portfolio/
│   │   │   └── page.tsx        ← Galeria mista
│   │   ├── tools/
│   │   │   └── page.tsx        ← Cards de ferramentas
│   │   ├── about/
│   │   │   └── page.tsx        ← Apresentação pessoal
│   │   └── contact/
│   │       └── page.tsx        ← Formulário de contato
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        ← API Route para envio de e-mail
│   ├── globals.css
│   └── layout.tsx              ← Root layout (ThemeProvider)
├── components/
│   ├── ui/                     ← shadcn/ui base (Button, Badge, Input…)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── BentoGrid.tsx
│   │   └── BentoCard.tsx
│   ├── portfolio/
│   │   ├── GalleryGrid.tsx
│   │   └── ProjectCard.tsx
│   └── tools/
│       ├── ToolsGrid.tsx
│       └── ToolCard.tsx
├── data/
│   ├── projects.ts             ← Array tipado de projetos
│   └── tools.ts                ← Array tipado de ferramentas
└── lib/
    └── utils.ts                ← cn(), helpers
```

---

## Páginas

### `/` — Homepage

**Layout:** Bento Grid responsivo (4 colunas desktop → 2 colunas tablet → 1 mobile)

**Cartões:**
| Cartão | Tamanho | Conteúdo |
|---|---|---|
| Hero | 2 colunas | Nome, título "Product Designer & Dev", tagline, CTAs "Ver portfólio" + "GitHub ↗" |
| Avatar | 1 coluna | Foto ou avatar com gradiente de fundo |
| Localização | 1 coluna | 📍 Brasil · Disponível remoto |
| Stack | 1 coluna | Badges: React, TypeScript, Figma, Next.js, Node.js, Firebase |
| Projetos | 1 coluna | Contador animado "12 projetos" em laranja |
| Ferramentas | 1 coluna | Contador "6 ferramentas" em roxo |
| Destaque | 1 coluna | Card com projeto em destaque (rosa) |
| Portfólio recente | 2 colunas | Miniaturas dos 3 últimos projetos + link "ver todos" |
| Links sociais | 2 colunas | GitHub, LinkedIn, e-mail |

**Animações:** Entrada staggered de cada cartão com `motion/react` fade-up (delay 0.1s por cartão).

---

### `/portfolio` — Portfólio

**Layout:** Featured + Grid

- **Faixa superior:** filtros por categoria — `Todos` · `Design` · `Código` · `Arte` · `Imagem`
- **Destaque:** primeiro item da lista ocupa linha inteira (grid-column: 1/-1), altura maior, overlay com título e categoria no hover
- **Grid:** colunas de 2, itens seguintes em grid uniforme, hover revela overlay gradiente sutil
- **ProjectCard props:** `title`, `category`, `coverImage`, `description`, `tags`, `href`, `featured`

**Schema do dado (`src/data/projects.ts`):**
```ts
type Project = {
  id: string
  title: string
  description: string
  category: 'design' | 'code' | 'art' | 'image'
  tags: string[]
  coverImage: string
  href?: string
  featured?: boolean
}
```

---

### `/tools` — Ferramentas

**Layout:** Grid 3 colunas desktop, 2 tablet, 1 mobile

**Tipos suportados:** Web App · CLI · Extensão · Bot · Script · Plugin Figma

**Filtros:** por tipo no topo (mesmo padrão visual do portfólio)

**ToolCard:** emoji + nome em cor por categoria, descrição (2 linhas), badges de stack, links Demo e GitHub. Hover: borda acende com gradiente da cor da categoria.

**Schema do dado (`src/data/tools.ts`):**
```ts
type Tool = {
  id: string
  name: string
  description: string
  type: 'webapp' | 'cli' | 'extension' | 'bot' | 'script' | 'plugin'
  stack: string[]
  demoUrl?: string
  githubUrl?: string
  emoji: string
}
```

**Cores por tipo:**
| Tipo | Cor |
|---|---|
| webapp | `#f97316` (laranja) |
| cli | `#8b5cf6` (roxo) |
| extension | `#ec4899` (rosa) |
| bot | `#06b6d4` (ciano) |
| script | `#22c55e` (verde) |
| plugin | `#f59e0b` (âmbar) |

---

### `/about` — Sobre

**Layout:** Duas colunas (desktop) — uma coluna (mobile)

- **Esquerda:** foto quadrada com borda gradiente, nome, título, badges de stack, links sociais (GitHub, LinkedIn, e-mail)
- **Direita:** bio em texto corrido (2–3 parágrafos), timeline horizontal ou lista de experiências/formação com marcadores gradiente

Sem botão "download CV".

---

### `/contact` — Contato

**Layout:** Centralizado, max-width 480px

**Campos:** Nome, E-mail, Mensagem (textarea)

**Validação:** React Hook Form + Zod no client

**Envio:** `POST /api/contact` → API Route do Next.js → Resend (e-mail transacional). Se `RESEND_API_KEY` não estiver configurada no ambiente, a rota retorna erro 503 e o cliente exibe link `mailto:` como fallback.

**Estados:** idle → loading (spinner) → success (mensagem de confirmação) → error (mensagem de erro)

---

## Componentes Transversais

### Navbar
- Logo `LR.` (link para `/`)
- Links: Portfólio · Ferramentas · Sobre · Contato
- Toggle dark/light (ícone Lucide `Sun`/`Moon`)
- Posição: fixa no topo, `backdrop-blur` ao scrollar
- Mobile: menu hamburger com drawer

### Footer
- Mínimo: `© 2026 Lucas Riboldi` + ícones sociais
- Linha gradiente na borda superior

### Animações (Motion)
- Entrada de seções: `fadeUp` com stagger 0.1s por item
- Hover nos cards: `scale(1.02)` + borda acende
- Contadores na homepage: animação numérica de 0 até o valor final

### Gradiente top
- `height: 2px`, `background: linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)`
- Presente em todas as páginas como assinatura visual

---

## Responsividade

| Breakpoint | Grid |
|---|---|
| Mobile (`< 640px`) | 1 coluna |
| Tablet (`640–1024px`) | 2 colunas |
| Desktop (`> 1024px`) | 3–4 colunas conforme página |

---

## Páginas Stub (fora do escopo inicial)

As rotas `/blog`, `/gallery` e `/github` existem como arquivos vazios e serão implementadas em iterações futuras. Não aparecem na navbar nesta versão.

---

## Fora do Escopo

- Autenticação / área logada
- CMS / painel admin
- Blog com MDX (futuro)
- Integração com GitHub API para stats em tempo real (futuro)
- Internacionalização (i18n)
