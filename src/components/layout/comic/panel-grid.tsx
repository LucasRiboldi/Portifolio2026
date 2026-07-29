import { cn } from "@/lib/utils"

/**
 * A classe da grelha, para quem não pode usar o componente.
 *
 * As zonas animadas envolvem os quadros em `RevealGroup` (que já é o `<ul>` e
 * orquestra a entrada). Encaixar `PanelGrid` por fora acrescentaria um nível
 * de caixa entre a grelha e os quadros, e `display: contents` — o remendo
 * habitual — não recebe `transform`: a animação de entrada morreria.
 *
 * Então o que se centraliza é a DECISÃO, não o elemento. Quem tem elemento
 * próprio pede a classe; quem não tem usa o componente abaixo. Nos dois casos
 * a regra de goteiras e colunas mora num sítio só.
 */
export function panelGridClass(o?: { withRows?: boolean; dense?: boolean; className?: string }) {
  return cn("cp-grid", o?.withRows && "cp-grid--rows", o?.dense && "cp-grid--dense", o?.className)
}

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
 *
 * Esta peça existia e não era usada: as nove chamadas escreviam `cp-grid` à
 * mão, cada uma com o seu `gap-y-*` avulso, e a "decisão num sítio só" não
 * decidia nada. Uma abstração contornada é pior que abstração nenhuma —
 * carrega o custo de existir sem o benefício de centralizar. Agora as zonas
 * passam por aqui.
 */
export function PanelGrid({
  children,
  className,
  withRows = false,
  dense = false,
  as: Tag = "div",
}: PanelGridProps) {
  return (
    <Tag className={panelGridClass({ withRows, dense, className })}>
      {children}
    </Tag>
  )
}
