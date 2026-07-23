import { cn } from "@/lib/utils"

interface PanelGridProps {
  children: React.ReactNode
  className?: string
  /**
   * Ativa a pauta de linhas. Sem isto, `span.rows` não tem efeito: a grelha
   * dimensiona as linhas pelo conteúdo e o quadro "vertical" sai da mesma
   * altura dos vizinhos.
   */
  withRows?: boolean
  /**
   * Deixa a grelha preencher buracos com quadros menores que venham depois.
   * É o que evita o "degrau" branco quando um destaque largo não cabe na linha.
   */
  dense?: boolean
  as?: "div" | "ul" | "ol"
}

/**
 * A grelha de 12 colunas onde os requadros assentam.
 *
 * Um único sítio a decidir goteiras e colunas — cada quadro só declara quanto
 * ocupa (`span`), nunca onde começa. Posições absolutas partiriam no primeiro
 * item que o banco devolvesse a mais.
 */
export function PanelGrid({
  children,
  className,
  withRows = false,
  dense = false,
  as: Tag = "div",
}: PanelGridProps) {
  return (
    <Tag
      className={cn("cp-grid", withRows && "cp-grid--rows", dense && "cp-grid--dense", className)}
    >
      {children}
    </Tag>
  )
}
