<div align="center">

# LR<span>.</span> — Portfólio 2026

**Portfólio pessoal de Lucas Riboldi — Product Designer & Developer**

Interfaces, ferramentas e experimentos digitais em um só lugar.

[![Deploy](https://img.shields.io/badge/▲_Vercel-Live-black?style=flat-square&logo=vercel)](https://portifolio2026-two.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[**🌐 Ver ao vivo**](https://portifolio2026-two.vercel.app) · [Portfólio](https://portifolio2026-two.vercel.app/portfolio) · [Ferramentas](https://portifolio2026-two.vercel.app/tools) · [Contato](https://portifolio2026-two.vercel.app/contact)

</div>

---

## ✨ Visão geral

Portfólio com tema **Dark + Gradient Accent** (laranja → rosa → roxo) e cinco páginas:

| Página | Descrição |
|---|---|
| **Home** | Bento Grid com hero, stack, contadores e links — animações de entrada com Motion |
| **Portfólio** | Galeria mista (design, código, arte, imagem) com layout Featured + Grid e filtros por categoria |
| **Ferramentas** | Vitrine de ferramentas criadas — Web Apps, CLIs, extensões, bots, scripts e plugins Figma, cada tipo com cor própria |
| **Sobre** | Apresentação pessoal com bio, timeline de experiências e links sociais |
| **Contato** | Formulário validado com envio de e-mail transacional |

## 🛠 Stack

- **[Next.js 15](https://nextjs.org)** — App Router, Server Components e API Routes
- **[React 19](https://react.dev)** + **[TypeScript 5](https://www.typescriptlang.org)**
- **[Tailwind CSS 3](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)** — design system com CSS variables
- **[Motion](https://motion.dev)** (Framer Motion 12) — animações staggered
- **[React Hook Form](https://react-hook-form.com)** + **[Zod](https://zod.dev)** — formulários com validação tipada
- **[Resend](https://resend.com)** — e-mail transacional no formulário de contato
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark mode (padrão) com toggle
- **[Lucide](https://lucide.dev)** — ícones

## 🚀 Rodando localmente

Pré-requisito: Node.js 20+

```bash
# Clone o repositório
git clone https://github.com/LucasRiboldi/Portifolio2026.git
cd Portifolio2026

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Variáveis de ambiente (opcional)

O formulário de contato usa o Resend. Sem a chave, ele degrada graciosamente para um link `mailto:`.

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servir o build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## 📁 Estrutura

```
src/
├── app/
│   ├── (site)/            # Páginas públicas (home, portfolio, tools, about, contact)
│   ├── api/contact/       # API Route de envio de e-mail
│   └── layout.tsx         # Root layout com ThemeProvider
├── components/
│   ├── home/              # BentoGrid e BentoCard
│   ├── portfolio/         # GalleryGrid com filtros
│   ├── tools/             # ToolsGrid com filtros
│   ├── cards/             # ProjectCard e ToolCard
│   ├── layout/            # Navbar, Footer, Container
│   └── ui/                # Componentes base (shadcn/ui)
├── data/
│   ├── projects.ts        # Projetos do portfólio (hardcoded, tipado)
│   └── tools.ts           # Ferramentas (hardcoded, tipado)
├── constants/site.ts      # Configuração do site (nome, links, bio)
└── styles/globals.css     # Tokens de design e utilitários de gradiente
```

## 🎨 Design

- **Identidade visual:** linha gradiente de 2px (`#f97316 → #ec4899 → #8b5cf6`) presente em todas as páginas
- **Conteúdo como código:** projetos e ferramentas vivem em arquivos `.ts` tipados — sem CMS, sem banco. Para adicionar um projeto, basta editar [`src/data/projects.ts`](src/data/projects.ts) e fazer commit
- Specs e plano de implementação documentados em [`docs/superpowers/`](docs/superpowers/)

## 📫 Contato

**Lucas Riboldi** — Product Designer & Developer

[![GitHub](https://img.shields.io/badge/GitHub-LucasRiboldi-181717?style=flat-square&logo=github)](https://github.com/LucasRiboldi)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lucasriboldi-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/lucasriboldi)
[![Email](https://img.shields.io/badge/Email-lucasriboldi.dev@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:lucasriboldi.dev@gmail.com)

---

<div align="center">
<sub>Feito com Next.js — © 2026 Lucas Riboldi</sub>
</div>
