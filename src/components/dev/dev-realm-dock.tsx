"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FolderGit2,
  FlaskConical,
  Wrench,
  Code2,
  GraduationCap,
  Sparkles,
  Orbit,
  Coffee,
  Library,
  ScrollText,
  Binary,
  Cpu,
  Boxes,
  Database,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { BASE_ESTUDOS, DISCIPLINAS } from "@/data/estudos"

interface DockItem {
  href: string
  label: string
  Icon: LucideIcon
  exact?: boolean
  /** Marca os menus das disciplinas — só eles recebem o brilho verde. */
  estudo?: boolean
}

/**
 * Os destinos do realm.
 *
 * O dock é a única navegação do realm: destino que não está aqui é destino
 * que ninguém acha. Quando uma página do painel ganhar rota pública, ela
 * precisa entrar nesta lista.
 */
/**
 * Ícone de cada disciplina, por slug.
 *
 * Fica aqui e não no arquivo de dados porque é decisão de apresentação: o
 * arquivo de configuração da disciplina descreve o ensino, não o desenho do
 * menu. Slug sem entrada cai no ícone genérico — acrescentar disciplina não
 * pode quebrar o dock.
 */
const ICONES_ESTUDO: Record<string, LucideIcon> = {
  "estrutura-de-dados": Binary,
  "sistemas-operacionais": Cpu,
  "poo-i": Boxes,
  "banco-de-dados": Database,
  "engenharia-de-software-i": Workflow,
}

/** Os cinco menus das disciplinas, derivados do registro. */
const ITENS_ESTUDO: DockItem[] = DISCIPLINAS.map((d) => ({
  href: `${BASE_ESTUDOS}/${d.slug}`,
  label: d.nomeCurto,
  Icon: ICONES_ESTUDO[d.slug] ?? GraduationCap,
  estudo: true,
}))

const ITEMS: DockItem[] = [
  { href: "/desenvolvedor", label: "início", Icon: Home, exact: true },
  { href: "/desenvolvedor/projetos", label: "projetos", Icon: FolderGit2 },
  { href: "/desenvolvedor/laboratorio", label: "lab", Icon: FlaskConical },
  { href: "/desenvolvedor/ferramentas", label: "tools", Icon: Wrench },
  { href: "/desenvolvedor/codigo", label: "código", Icon: Code2 },
  { href: "/desenvolvedor/skills", label: "skills", Icon: Sparkles },
  { href: "/desenvolvedor/learn", label: "learn", Icon: GraduationCap },
  // Acervo de referência. Mesma regra do comentário acima: rota que não está
  // no dock é rota que só quem sabe o URL alcança.
  { href: "/desenvolvedor/java", label: "java", Icon: Coffee },
  { href: "/desenvolvedor/estante", label: "estante", Icon: Library },
  // Ganhou rota em 05/08/2026, quando saiu da home: sem entrada aqui, seria
  // conteúdo publicável que só quem sabe o URL alcança.
  { href: "/desenvolvedor/devlog", label: "devlog", Icon: ScrollText },
  // As disciplinas do 3º semestre, na ordem dos dias da semana.
  ...ITENS_ESTUDO,
  { href: "/portal", label: "portal", Icon: Orbit },
]

export function DevRealmDock() {
  const pathname = usePathname()
  return (
    <nav className="dv-dock" aria-label="Navegação dev">
      {ITEMS.map(({ href, label, Icon, exact, estudo }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          /* Sem `aria-label`: o rótulo já está visível dentro do link, e o
             atributo fazia o leitor de tela anunciar o mesmo texto duas vezes.
             O ícone é decorativo — quem informa é o texto. */
          <Link
            key={href}
            href={href}
            data-active={active}
            data-estudo={estudo || undefined}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-[18px]" strokeWidth={2} aria-hidden />
            <span className="dock-lbl">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
