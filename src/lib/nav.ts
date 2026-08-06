/**
 * Navegação do site global (realm Creative) — fonte única de verdade.
 * Consumido pelo ComicNav (header + overlay em tela cheia), para o menu de
 * desktop e o de mobile não divergirem.
 */
export interface NavLink {
  label: string
  href: string
  /** Linha de apoio mostrada no overlay do menu (o menu em tela cheia). */
  description?: string
}

/**
 * "Style Guide" saiu do menu: virou conteúdo do Design System, um por perfil
 * (/design-system → escolhe o perfil). Dois itens apontando para dentro do
 * mesmo lugar só dividiam a atenção.
 */
export const SITE_LINKS: NavLink[] = [
  { label: "Portfólio", href: "/portfolio", description: "Casos completos, do problema ao que foi para o ar" },
  { label: "Cards", href: "/cards", description: "Galeria holográfica — os efeitos de foil em CSS puro" },
  /* Fascículo #2 do Criativo (06/08/2026). Entra no menu porque a rádio, a
     videoteca e as tirinhas saíram da capa: sem item aqui, as três zonas só
     seriam alcançáveis por quem soubesse o URL. */
  { label: "A sala", href: "/criativo/sala", description: "A rádio, a videoteca e as tirinhas — o que se consome sentado" },
  { label: "Dimensões", href: "/dimensoes", description: "20 universos visuais trocáveis em tempo real" },
  { label: "Design System", href: "/design-system", description: "Tokens, componentes e a documentação viva" },
]

/** Regra de "ativo" partilhada por todos os menus: exata na home, prefixo no resto. */
export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
