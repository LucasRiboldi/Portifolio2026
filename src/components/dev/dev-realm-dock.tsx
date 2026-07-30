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
  BookOpen,
  PenLine,
  Lightbulb,
  Sparkles,
  Orbit,
  Coffee,
  Shapes,
  Library,
  Brain,
  type LucideIcon,
} from "lucide-react"

interface DockItem {
  href: string
  label: string
  Icon: LucideIcon
  exact?: boolean
}

/**
 * Os destinos do realm.
 *
 * Wiki, blog, ideias e skills tinham tabela e tela de painel, mas nenhuma
 * rota — o conteúdo era publicado e ficava inalcançável. Com as páginas
 * criadas, entram aqui: o dock é a única navegação do realm, e destino fora
 * dele é destino que ninguém acha.
 */
const ITEMS: DockItem[] = [
  { href: "/desenvolvedor", label: "início", Icon: Home, exact: true },
  { href: "/desenvolvedor/projetos", label: "projetos", Icon: FolderGit2 },
  { href: "/desenvolvedor/laboratorio", label: "lab", Icon: FlaskConical },
  { href: "/desenvolvedor/ferramentas", label: "tools", Icon: Wrench },
  { href: "/desenvolvedor/codigo", label: "código", Icon: Code2 },
  { href: "/desenvolvedor/wiki", label: "wiki", Icon: BookOpen },
  { href: "/desenvolvedor/blog", label: "blog", Icon: PenLine },
  { href: "/desenvolvedor/ideias", label: "ideias", Icon: Lightbulb },
  { href: "/desenvolvedor/skills", label: "skills", Icon: Sparkles },
  { href: "/desenvolvedor/learn", label: "learn", Icon: GraduationCap },
  // Acervo de referência. Mesma regra do comentário acima: rota que não está
  // no dock é rota que só quem sabe o URL alcança.
  { href: "/desenvolvedor/java", label: "java", Icon: Coffee },
  { href: "/desenvolvedor/padroes", label: "padrões", Icon: Shapes },
  { href: "/desenvolvedor/estante", label: "estante", Icon: Library },
  { href: "/desenvolvedor/conhecimento", label: "acervo", Icon: Brain },
  { href: "/portal", label: "portal", Icon: Orbit },
]

export function DevRealmDock() {
  const pathname = usePathname()
  return (
    <nav className="dv-dock" aria-label="Navegação dev">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          /* Sem `aria-label`: o rótulo já está visível dentro do link, e o
             atributo fazia o leitor de tela anunciar o mesmo texto duas vezes.
             O ícone é decorativo — quem informa é o texto. */
          <Link key={href} href={href} data-active={active} aria-current={active ? "page" : undefined}>
            <Icon className="size-[18px]" strokeWidth={2} aria-hidden />
            <span className="dock-lbl">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
