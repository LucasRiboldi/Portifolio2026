import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Container } from "@/components/layout/container"
import { GithubIcon } from "@/components/ui/social-icons"
import { SportsWidget } from "@/components/widgets/sports-widget"
import { getSiteConfig } from "@/lib/repos/site-config"

export const metadata = {
  title: "Sports Widget — réplica do Firefox",
  description:
    "Réplica em React do widget de esportes da nova aba do Firefox, reconstruída por engenharia reversa do DOM real — abas, lista agrupada, placares, bandeiras, theme-aware e acessível.",
}

const TAGS = ["Next.js 15", "React 19", "TypeScript", "CSS Modules", "Intl API", "a11y"]

const FEATURES = [
  "Abas Resultados / Seguintes com troca acessível (role=tablist).",
  "Lista de partidas agrupada por grupo e fase do torneio.",
  "Expandir/colapsar: destaque + “Ver tudo” ⇄ lista completa + “Mostrar menos”.",
  "Pílula de placar nos resultados e horário + data nos próximos jogos.",
  "Bandeiras via CDN, com estado “a definir” para confrontos de mata-mata.",
  "Menu de contexto (popover) com ações reais: trocar de aba e ocultar widget.",
  "Datas e horários localizados em pt-BR e determinísticos (seguros para SSR).",
  "Adaptação automática a tema claro/escuro do portfólio.",
]

const TECH: { label: string; body: string }[] = [
  {
    label: "Arquitetura em 3 camadas",
    body: "Dados (src/data/sports.ts), apresentação (componente client) e estilo (CSS Module) ficam separados, facilitando manutenção e a troca da fonte de dados.",
  },
  {
    label: "Estilo theme-aware",
    body: "CSS Module consumindo as CSS vars do tema (--card, --foreground, --border, --radius…), o que torna o widget independente de classes utilitárias e fiel ao visual do Firefox em light e dark.",
  },
  {
    label: "SSR sem hydration mismatch",
    body: "A formatação de data/hora usa Intl com fuso fixo (America/Sao_Paulo), garantindo que o HTML do servidor case com o do cliente e reproduza os horários originais.",
  },
  {
    label: "Acessibilidade",
    body: "role=tablist/tab, aria-selected, aria-label por partida, navegação por teclado e foco visível — espelhando os atributos do widget nativo.",
  },
  {
    label: "Engenharia reversa",
    body: "48 seleções e 83 partidas (grupos A–L + mata-mata) extraídas do DOM real capturado do Firefox, preservando códigos, bandeiras e timestamps epoch.",
  },
  {
    label: "Modelagem de dados",
    body: "Tipos Match/Team, fábricas para partidas agendadas e encerradas, e formatadores de data reutilizáveis — tudo tipado em TypeScript estrito.",
  },
]

export default async function SportsWidgetPage() {
  const siteConfig = await getSiteConfig()
  return (
    <Container className="py-12">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao portfólio
      </Link>

      {/* Cabeçalho do projeto */}
      <header className="mt-6">
        <span className="inline-block rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
          Código · Front-end
        </span>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Sports <span className="gradient-text">Widget</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Réplica em React do widget de esportes da nova aba do Firefox (recurso{" "}
          <em>New Tab Widgets</em>). Reconstruí o componente por engenharia reversa do
          DOM real — layout, interações e formatação de dados de um torneio de 48
          seleções — e o integrei ao design system do portfólio.
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {TAGS.map(tag => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`${siteConfig.github}/Portifolio2026`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            Código no GitHub
          </a>
        </div>
      </header>

      {/* Demonstração ao vivo */}
      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Demonstração ao vivo
        </h2>
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-border bg-card/40 p-6 sm:p-10">
          <SportsWidget />
          <p className="text-center text-xs text-muted-foreground">
            Interaja: troque entre <strong>Resultados</strong> e <strong>Seguintes</strong>,
            use <strong>Ver tudo</strong> para a lista completa e abra o menu (•••).
          </p>
        </div>
      </section>

      {/* Sobre o projeto */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold">Sobre o projeto</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            O Firefox 151 introduziu widgets na nova aba, entre eles um de esportes que
            acompanha um torneio de seleções. O objetivo aqui foi recriá-lo de forma fiel
            — visual e funcionalmente — como um componente React reutilizável, sem depender
            das APIs internas do navegador (os custom elements <code>moz-button</code> e{" "}
            <code>panel-list</code> viraram elementos HTML comuns).
          </p>
          <p>
            Capturei o DOM real do widget e transcrevi a estrutura, as classes e os dados
            das partidas. A partir daí, reconstruí a hierarquia de componentes, repliquei o
            sistema de abas e a lista agrupada, e recriei o estilo lendo as variáveis de
            tema do portfólio — de modo que o widget responde a light/dark automaticamente.
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="mt-12 max-w-2xl">
        <h2 className="text-xl font-bold">Funcionalidades</h2>
        <ul className="mt-3 space-y-2">
          {FEATURES.map(feature => (
            <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
              <span aria-hidden className="mt-1 text-[10px]" style={{ color: "#f97316" }}>
                ●
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Registros técnicos */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Registros técnicos</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TECH.map(item => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-orange-500/30"
            >
              <h3 className="text-sm font-semibold">{item.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}
